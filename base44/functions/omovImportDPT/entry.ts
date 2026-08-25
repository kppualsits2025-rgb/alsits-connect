import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event_id, angkatan_filter } = await req.json();
    if (!event_id) return Response.json({ error: 'event_id wajib diisi' }, { status: 400 });

    // Ambil semua alumni dengan pagination
    let allAlumni = [];
    let page = 0;
    const pageSize = 200;
    while (true) {
      const batch = await base44.asServiceRole.entities.Alumni.list('-created_date', pageSize, page * pageSize);
      if (!batch || batch.length === 0) break;
      allAlumni = allAlumni.concat(batch);
      if (batch.length < pageSize) break;
      page++;
      if (page > 50) break; // safety limit 10.000 records
    }

    // Filter: aktif saja (tidak almarhum), harus punya email
    let eligible = allAlumni.filter(a =>
      a.email &&
      a.status !== 'Almarhum' &&
      a.status !== 'Almarhumah'
    );

    // Filter angkatan jika dipilih
    if (angkatan_filter && angkatan_filter.length > 0) {
      eligible = eligible.filter(a => angkatan_filter.includes(a.angkatan));
    }

    // Ambil DPT yang sudah ada di event ini
    let existingVoters = [];
    let vPage = 0;
    while (true) {
      const batch = await base44.asServiceRole.entities.VoterRegistry.list('-created_date', pageSize, vPage * pageSize);
      if (!batch || batch.length === 0) break;
      // filter by event_id in memory
      const filtered = batch.filter(v => v.event_id === event_id);
      existingVoters = existingVoters.concat(filtered);
      if (batch.length < pageSize) break;
      vPage++;
      if (vPage > 50) break;
    }

    const existingEmails = new Set(existingVoters.map(v => v.email.toLowerCase()));
    const existingNrps = new Set(existingVoters.map(v => v.nrp));

    // Import yang belum ada
    let imported = 0;
    let skipped = 0;

    for (const alumni of eligible) {
      const emailLower = alumni.email.toLowerCase();
      const nrp = alumni.nrm_nrp || alumni.id;

      if (existingEmails.has(emailLower) || existingNrps.has(nrp)) {
        skipped++;
        continue;
      }

      await base44.asServiceRole.entities.VoterRegistry.create({
        event_id,
        nrp: nrp,
        email: emailLower,
        full_name: alumni.full_name || '',
        sudah_memilih: false,
        otp_verified: false,
      });

      existingEmails.add(emailLower);
      existingNrps.add(nrp);
      imported++;
    }

    return Response.json({
      success: true,
      imported,
      skipped,
      total_eligible: eligible.length,
      message: `${imported} pemilih berhasil diimport, ${skipped} dilewati (sudah terdaftar)`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});