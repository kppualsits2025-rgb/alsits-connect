import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.clone().json().catch(() => ({}));
    const isScheduled = body.scheduled === true;
    const forceAll = body.force_all === true;

    if (!isScheduled && !forceAll) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      if (user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      console.log('Manual sync S51 by:', user.email);
    } else {
      console.log(forceAll ? 'Force full S51 sync started' : 'Scheduled incremental S51 sync started');
    }

    const s51Client = createClient({
      appId: Deno.env.get('S51_APP_ID'),
      headers: { 'api_key': Deno.env.get('S51_API_KEY') }
    });

    // Fetch semua member dari S51
    let memberData = [];
    try {
      memberData = await s51Client.entities.Member.list('-updated_date', 1000);
      console.log(`Fetched ${memberData.length} total Member records from S51`);

      if (isScheduled && !forceAll) {
        const cutoff = new Date(Date.now() - 6 * 60 * 1000).toISOString();
        memberData = memberData.filter(m => m.updated_date && m.updated_date > cutoff);
        console.log(`Incremental: ${memberData.length} members to sync`);
      }
    } catch (e) {
      console.log('S51 Member fetch error:', e.message);
      return Response.json({ error: 'Gagal fetch dari s51its.id: ' + e.message }, { status: 500 });
    }

    if (memberData.length === 0) {
      return Response.json({ success: true, message: 'Tidak ada perubahan baru', stats: { synced: 0 } });
    }

    // Support offset untuk sync bertahap (hindari rate limit)
    const offset = body.offset || 0;
    const batchSize = body.batch_size || 50;
    const batch = memberData.slice(offset, offset + batchSize);
    console.log(`Processing batch: offset=${offset}, size=${batch.length} of ${memberData.length}`);

    // Get existing alumni dari S51
    const existingAlumni = await base44.asServiceRole.entities.Alumni.filter({ source_web: 's51its.id' }, '-created_date', 1000);
    const existingByNrp = {};
    const existingByName = {};
    existingAlumni.forEach(a => {
      if (a.nrm_nrp) existingByNrp[a.nrm_nrp] = a;
      if (a.full_name) existingByName[a.full_name.toLowerCase().trim()] = a;
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let almarhum_skipped = 0;

    for (const member of batch) {
      const fullName = (member.nama || '').trim();
      if (!fullName) { skipped++; continue; }

      // Skip almarhum
      const keterangan = (member.keterangan || '').toLowerCase();
      if (keterangan.includes('almarhum') || keterangan.includes('almarhumah')) {
        almarhum_skipped++;
        continue;
      }

      const nrp = member.nrp || '';

      const alumniData = {
        full_name: fullName,
        angkatan: 'S51',
        source_web: 's51its.id',
        is_verified: true,
        status: 'Aktif',
      };

      if (nrp) alumniData.nrm_nrp = nrp;
      if (member.email) alumniData.email = member.email;
      if (member.email2) alumniData.email2 = member.email2;
      if (member.no_hp) alumniData.telepon = member.no_hp;
      if (member.no_hp2) alumniData.telepon2 = member.no_hp2;
      if (member.telepon_kantor) alumniData.telepon_kantor = member.telepon_kantor;
      if (member.tahun_masuk) alumniData.tahun_masuk = member.tahun_masuk;
      if (member.strata) {
        const strataMap = { 'S1': 'S1', 'S2': 'S2', 'S3': 'S3' };
        alumniData.gelar = strataMap[member.strata] || 'S1';
      }
      if (member.tgl_lahir) alumniData.tanggal_lahir = member.tgl_lahir.split(' ')[0]; // simpan YYYY-MM-DD saja

      // Domisili: ar_kota = kota alamat rumah (normalize title case, S51 pakai HURUF KAPITAL)
      if (member.ar_kota) alumniData.domisili_kota = toTitleCase(member.ar_kota);
      if (member.ar_negara) alumniData.domisili_negara = member.ar_negara;

      // Perusahaan & kota perusahaan: ap_kota = kota bersih dari S51
      if (member.perusahaan) alumniData.perusahaan = member.perusahaan;
      if (member.ap_kota) {
        alumniData.company_city = toTitleCase(member.ap_kota);
        alumniData.alamat_perusahaan = toTitleCase(member.ap_kota);
      } else if (member.alamat_perusahaan) {
        alumniData.alamat_perusahaan = member.alamat_perusahaan;
      }

      // Photo
      if (member.photo_url) alumniData.photo_url = member.photo_url;

      // Cek existing: prioritas nrp > nama
      const existing = (nrp ? existingByNrp[nrp] : null) || existingByName[fullName.toLowerCase().trim()];

      if (existing) {
        const updateData = { ...alumniData };

        // Lindungi field yang diisi user di alsits HANYA jika klaim masih aktif di S51.
        // Jika claimed_by_user_id di S51 kosong (klaim dilepas), sync penuh dari S51.
        const isClaimedInS51 = !!(member.claimed_by_user_id);
        if (isClaimedInS51) {
          // Klaim masih aktif di S51 — jangan overwrite field yang mungkin diupdate alumni sendiri
          if (existing.perusahaan) delete updateData.perusahaan;
          if (existing.jabatan) delete updateData.jabatan;
          if (existing.photo_url) delete updateData.photo_url;
          if (existing.bio) delete updateData.bio;
          if (existing.alamat_perusahaan) delete updateData.alamat_perusahaan;
          if (existing.domisili_kota) delete updateData.domisili_kota;
          if (existing.company_city) delete updateData.company_city;
          if (existing.linkedin) delete updateData.linkedin;
        }
        // is_verified: jangan di-reset oleh sync
        if (existing.is_verified) delete updateData.is_verified;

        await base44.asServiceRole.entities.Alumni.update(existing.id, updateData);
        updated++;
        console.log(`Updated (${isClaimedInS51 ? 'safe-claimed' : 'full'}): ${fullName}`);
      } else {
        const createdRecord = await base44.asServiceRole.entities.Alumni.create(alumniData);
        existingByName[fullName.toLowerCase().trim()] = createdRecord;
        if (nrp) existingByNrp[nrp] = createdRecord;
        created++;
        console.log(`Created: ${fullName}`);
      }

      await new Promise(r => setTimeout(r, 300));
    }

    const nextOffset = offset + batchSize;
    const hasMore = nextOffset < memberData.length;

    return Response.json({
      success: true,
      message: `Sync selesai dari s51its.id (batch ${offset}-${offset + batch.length})`,
      stats: { member_fetched: memberData.length, batch_processed: batch.length, created, updated, skipped, almarhum_skipped },
      has_more: hasMore,
      next_offset: hasMore ? nextOffset : null,
    });

  } catch (error) {
    console.error('S51 Sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});