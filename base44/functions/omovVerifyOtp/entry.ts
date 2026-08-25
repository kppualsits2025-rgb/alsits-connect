import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Endpoint khusus untuk validasi OTP SEBELUM masuk bilik suara
// Ini memisahkan langkah auth dari langkah submit, sehingga:
// 1. Pemilih tahu OTP-nya valid sebelum memilih
// 2. Backend bisa tandai otp_verified = true
// 3. omovSubmitVote bisa cross-check otp_verified sebagai layer tambahan

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event_id, nrp, email, otp_code } = await req.json();

    if (!event_id || !nrp || !email || !otp_code) {
      return Response.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Check event is active
    const events = await base44.asServiceRole.entities.VotingEvent.filter({ id: event_id });
    const event = events[0];
    if (!event || event.status !== 'active') {
      return Response.json({ error: 'Event voting tidak aktif' }, { status: 400 });
    }

    // Find voter
    const voters = await base44.asServiceRole.entities.VoterRegistry.filter({ event_id, nrp });
    const voter = voters.find(v => v.email.toLowerCase() === email.toLowerCase());

    if (!voter) {
      return Response.json({ error: 'Data pemilih tidak ditemukan' }, { status: 404 });
    }

    if (voter.sudah_memilih) {
      return Response.json({ error: 'Anda sudah menggunakan hak suara Anda' }, { status: 400 });
    }

    if (!voter.otp_code || voter.otp_code !== otp_code) {
      return Response.json({ error: 'Kode OTP tidak valid' }, { status: 400 });
    }

    const now = new Date();
    const otpExpiry = new Date(voter.otp_expires_at);
    if (now > otpExpiry) {
      return Response.json({ error: 'Kode OTP sudah kadaluarsa. Minta OTP baru.' }, { status: 400 });
    }

    // Tandai OTP sebagai verified (tapi belum memilih)
    await base44.asServiceRole.entities.VoterRegistry.update(voter.id, {
      otp_verified: true,
    });

    return Response.json({
      success: true,
      voter_name: voter.full_name || nrp,
      message: 'OTP valid. Silakan lanjutkan ke bilik suara.',
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});