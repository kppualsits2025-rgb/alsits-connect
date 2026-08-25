import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    // Optional: filter by angkatan, e.g. { angkatan: "S32" } or {} for all
    const filterAngkatan = body.angkatan || null;

    const results = { invited: [], already_exists: [], skipped_no_email: [], errors: [] };

    // Ambil semua alumni dari DB ALSITS (paginasi)
    let allAlumni = [];
    let page = 0;
    while (true) {
      const batch = await base44.asServiceRole.entities.Alumni.list('-angkatan', 500, page * 500);
      if (!batch || batch.length === 0) break;
      allAlumni = allAlumni.concat(batch);
      if (batch.length < 500) break;
      page++;
    }

    // Filter: aktif, punya email valid, sesuai angkatan jika ada filter
    const toInvite = allAlumni.filter(a => {
      if (a.status === 'Almarhum' || a.status === 'Almarhumah') return false;
      if (filterAngkatan && a.angkatan !== filterAngkatan) return false;
      const email = (a.email || '').trim().toLowerCase();
      // Skip email tidak valid / placeholder
      if (!email || !email.includes('@') || email === 'no email' || email === 'null' || email === 'belum ada') return false;
      // Skip email ITS akademik (lericta@ce.its.ac.id → mungkin sudah tidak aktif, tapi tetap coba)
      return true;
    });

    console.log(`Total alumni: ${allAlumni.length}, to invite: ${toInvite.length}, filter: ${filterAngkatan || 'all'}`);

    // Optional: skip alumni yang sudah pernah diundang (offset dari body)
    const offset = body.offset || 0;
    const batchSize = 8; // max 8 invite per run agar tidak rate-limit
    const batch = toInvite.slice(offset, offset + batchSize);

    console.log(`Processing batch offset=${offset}, size=${batch.length} of ${toInvite.length} total`);

    for (const alumni of batch) {
      const email = alumni.email.trim().toLowerCase();
      try {
        await base44.users.inviteUser(email, 'user');
        results.invited.push({ email, name: alumni.full_name, angkatan: alumni.angkatan });
        console.log(`Invited: ${email} (${alumni.full_name})`);
      } catch (err) {
        const msg = (err?.message || '').toLowerCase();
        if (msg.includes('already') || msg.includes('exists') || err?.status === 409) {
          results.already_exists.push({ email, name: alumni.full_name, angkatan: alumni.angkatan });
        } else if (msg.includes('rate limit') || err?.status === 429) {
          // Rate limit: hentikan batch ini, laporkan sisanya sebagai pending
          results.errors.push({ email, name: alumni.full_name, angkatan: alumni.angkatan, reason: 'Rate limit — coba lagi nanti' });
          console.log(`Rate limit hit at ${email}, stopping batch`);
          break;
        } else {
          results.errors.push({ email, name: alumni.full_name, angkatan: alumni.angkatan, reason: err?.message || 'unknown' });
          console.log(`Error inviting ${email}: ${err?.message}`);
        }
      }
      await new Promise(r => setTimeout(r, 1200)); // 1.2s delay antar invite
    }

    const nextOffset = offset + batchSize;
    const hasMore = nextOffset < toInvite.length;

    return Response.json({
      success: true,
      filter: filterAngkatan || 'all',
      has_more: hasMore,
      next_offset: hasMore ? nextOffset : null,
      summary: {
        total_alumni_in_db: allAlumni.length,
        total_with_email: toInvite.length,
        current_batch: batch.length,
        invited_new: results.invited.length,
        already_exists: results.already_exists.length,
        skipped_no_email: allAlumni.length - toInvite.length,
        errors: results.errors.length,
        remaining: hasMore ? toInvite.length - nextOffset : 0,
      },
      details: results,
    });

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});