import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event_id, nrp, email, otp_code, candidate_id } = await req.json();

    if (!event_id || !nrp || !email || !otp_code || !candidate_id) {
      return Response.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // 1. Check event is active
    const events = await base44.asServiceRole.entities.VotingEvent.filter({ id: event_id });
    const event = events[0];
    if (!event || event.status !== 'active') {
      return Response.json({ error: 'Event voting tidak aktif' }, { status: 400 });
    }

    // 2. Find voter
    const voters = await base44.asServiceRole.entities.VoterRegistry.filter({ event_id, nrp });
    const voter = voters.find(v => v.email.toLowerCase() === email.toLowerCase());

    if (!voter) {
      return Response.json({ error: 'Data pemilih tidak ditemukan' }, { status: 404 });
    }

    // 3. Idempotency guard — cek sudah memilih SEBELUM validasi OTP
    if (voter.sudah_memilih) {
      return Response.json({ error: 'Anda sudah menggunakan hak suara Anda sebelumnya' }, { status: 400 });
    }

    // 4. Validate OTP — SEKARANG divalidasi di sini (bukan hanya di booth)
    if (!voter.otp_code || voter.otp_code !== otp_code) {
      return Response.json({ error: 'Kode OTP tidak valid' }, { status: 400 });
    }

    const now = new Date();
    const otpExpiry = new Date(voter.otp_expires_at);
    if (now > otpExpiry) {
      return Response.json({ error: 'Kode OTP sudah kadaluarsa. Minta OTP baru.' }, { status: 400 });
    }

    // 5. Validate candidate belongs to this event
    const candidates = await base44.asServiceRole.entities.VotingCandidate.filter({ event_id });
    const candidate = candidates.find(c => c.id === candidate_id);
    if (!candidate) {
      return Response.json({ error: 'Kandidat tidak valid untuk event ini' }, { status: 400 });
    }

    // 6. ANTI DOUBLE-VOTE: Cek VoteRecord apakah voter_hash sudah ada
    // Gunakan hash deterministik dari nrp+event_id (TANPA timestamp) agar idempoten
    const deterministicHash = await sha256(`${nrp}:${event_id}`);
    const existingVotes = await base44.asServiceRole.entities.VoteRecord.filter({
      event_id,
      voter_hash: deterministicHash,
    });
    if (existingVotes.length > 0) {
      // Pastikan flag sudah_memilih juga di-set (repair state)
      if (!voter.sudah_memilih) {
        await base44.asServiceRole.entities.VoterRegistry.update(voter.id, { sudah_memilih: true });
      }
      return Response.json({ error: 'Suara Anda sudah tercatat sebelumnya' }, { status: 400 });
    }

    // 7. ATOMIC WRITE SEQUENCE:
    // Step 7a — Mark voter DULU sebelum tulis suara (prevent race condition window)
    await base44.asServiceRole.entities.VoterRegistry.update(voter.id, {
      sudah_memilih: true,
      voted_at: now.toISOString(),
      otp_code: null,       // invalidate OTP setelah dipakai
      otp_verified: true,
    });

    // Step 7b — Buat VoteRecord (audit trail anonim, hash deterministik)
    await base44.asServiceRole.entities.VoteRecord.create({
      event_id,
      voter_hash: deterministicHash,
      candidate_id,
      voted_at: now.toISOString(),
    });

    // Step 7c — Hitung vote_count dari VoteRecord (lebih akurat vs increment rawan race)
    // Ambil semua votes untuk kandidat ini dari VoteRecord sebagai sumber kebenaran
    const allVotesForCandidate = await base44.asServiceRole.entities.VoteRecord.filter({
      event_id,
      candidate_id,
    });
    await base44.asServiceRole.entities.VotingCandidate.update(candidate_id, {
      vote_count: allVotesForCandidate.length,
    });

    return Response.json({
      success: true,
      message: 'Suara Anda berhasil tercatat. Terima kasih telah berpartisipasi!',
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});