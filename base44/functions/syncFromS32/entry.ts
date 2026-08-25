import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

// Parse kota dari home_address S32 (format: "Jl. X, Kelurahan, Kota ZIP")
function parseCityFromHomeAddress(address) {
  if (!address) return null;
  const lower = address.toLowerCase();

  // Alias khusus
  const ALIAS = {
    'jakarta selatan': 'Jakarta Selatan', 'jakarta pusat': 'Jakarta Pusat',
    'jakarta barat': 'Jakarta Barat', 'jakarta timur': 'Jakarta Timur',
    'jakarta utara': 'Jakarta Utara', 'jakarta': 'DKI Jakarta',
    'bekasi': 'Bekasi', 'depok': 'Depok', 'bogor': 'Bogor',
    'tangerang selatan': 'Tangerang Selatan', 'tangerang': 'Tangerang',
    'surabaya': 'Surabaya', 'bandung': 'Bandung', 'medan': 'Medan',
    'semarang': 'Semarang', 'yogyakarta': 'Yogyakarta', 'malang': 'Malang',
    'makassar': 'Makassar', 'palembang': 'Palembang', 'balikpapan': 'Balikpapan',
    'samarinda': 'Samarinda', 'pekanbaru': 'Pekanbaru', 'batam': 'Batam',
    'padang': 'Padang', 'denpasar': 'Denpasar', 'pontianak': 'Pontianak',
    'banjarmasin': 'Banjarmasin', 'manado': 'Manado', 'cimahi': 'Cimahi',
    'sidoarjo': 'Sidoarjo', 'gresik': 'Gresik', 'mojokerto': 'Mojokerto',
    'pasuruan': 'Pasuruan', 'jember': 'Jember', 'kediri': 'Kediri',
    'madiun': 'Madiun', 'blitar': 'Blitar', 'batu': 'Batu',
    'surakarta': 'Surakarta', 'solo': 'Surakarta', 'cikarang': 'Bekasi',
    'serpong': 'Tangerang Selatan', 'bsd': 'Tangerang Selatan',
    'cibubur': 'Jakarta Timur', 'cibinong': 'Bogor', 'karawang': 'Karawang',
    'purwokerto': 'Purwokerto', 'cilacap': 'Cilacap', 'tegal': 'Tegal',
    'pekalongan': 'Pekalongan', 'kudus': 'Kudus', 'jepara': 'Jepara',
    'bali': 'Denpasar', 'lombok': 'Mataram', 'mataram': 'Mataram',
    'kupang': 'Kupang', 'jayapura': 'Jayapura', 'ambon': 'Ambon',
    'ternate': 'Ternate', 'sorong': 'Sorong', 'manokwari': 'Manokwari',
    'palu': 'Palu', 'kendari': 'Kendari', 'gorontalo': 'Gorontalo',
    'banda aceh': 'Banda Aceh', 'lhokseumawe': 'Lhokseumawe',
    'palangkaraya': 'Palangkaraya', 'banjarbaru': 'Banjarbaru',
    'tarakan': 'Tarakan', 'samarinda': 'Samarinda',
  };

  for (const [key, val] of Object.entries(ALIAS)) {
    if (lower.includes(key)) return val;
  }

  // Coba ambil token setelah tanda ";" atau bagian terakhir setelah koma yang berupa nama kota
  const parts = address.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i].replace(/\d{4,}/g, '').trim(); // buang kode pos
    if (part.length >= 3 && part.length <= 40 && !/^\d/.test(part)) {
      // Bersihkan noise
      const noise = /^(jl|jalan|blok|no|rt|rw|kel|kec|desa|kav|lt|lantai|gedung|graha|perumahan|komplek|ruko|rukan)\.?\s/i;
      if (!noise.test(part)) return part;
    }
  }
  return null;
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
      console.log('Manual sync by:', user.email);
    } else {
      console.log(forceAll ? 'Force full sync started' : 'Scheduled incremental sync started');
    }

    const s32Client = createClient({
      appId: Deno.env.get('S32_APP_ID'),
      headers: { 'api_key': Deno.env.get('S32_API_KEY') }
    });

    // Fetch semua BusinessProfile (sedikit, hanya 2 saat ini)
    let businessData = [];
    try {
      businessData = await s32Client.entities.BusinessProfile.list('-updated_date', 500);
      console.log(`Fetched ${businessData.length} BusinessProfile records`);
    } catch (e) {
      console.log('BusinessProfile fetch error:', e.message);
    }

    // Build business map by member_id
    const businessMap = {};
    businessData.forEach(b => {
      if (b.member_id) {
        if (!businessMap[b.member_id]) businessMap[b.member_id] = [];
        businessMap[b.member_id].push(b);
      }
    });

    // Untuk scheduled: hanya ambil member yang updated dalam 35 menit terakhir
    // Untuk force_all/manual: ambil semua
    let memberData = [];
    try {
      memberData = await s32Client.entities.Member.list('-updated_date', 500);
      console.log(`Fetched ${memberData.length} total Member records`);

      if (isScheduled && !forceAll) {
        const cutoff = new Date(Date.now() - 6 * 60 * 1000).toISOString();
        const recentMembers = memberData.filter(m => m.updated_date && m.updated_date > cutoff);
        console.log(`Incremental: ${recentMembers.length} members updated recently`);
        
        // Jika tidak ada yang update, tetap sync member yang punya bisnis baru
        const recentBizMemberIds = new Set(
          businessData.filter(b => b.updated_date && b.updated_date > cutoff).map(b => b.member_id)
        );
        
        memberData = memberData.filter(m => 
          (m.updated_date && m.updated_date > cutoff) || recentBizMemberIds.has(m.id)
        );
        console.log(`After filter: ${memberData.length} members to sync`);
      }
    } catch (e) {
      console.log('Member fetch error:', e.message);
    }

    if (memberData.length === 0) {
      return Response.json({ success: true, message: 'Tidak ada perubahan baru', stats: { synced: 0 } });
    }

    // Get existing alumni by s32_member_id dan nrp dan nama
    const existingAlumni = await base44.asServiceRole.entities.Alumni.filter({ source_web: 's32its.id' }, '-created_date', 1000);
    const existingByNrp = {};
    const existingByName = {};
    const existingByS32Id = {};
    existingAlumni.forEach(a => {
      if (a.nrm_nrp) existingByNrp[a.nrm_nrp] = a;
      if (a.full_name) existingByName[a.full_name.toLowerCase().trim()] = a;
      if (a.s32_member_id) existingByS32Id[a.s32_member_id] = a;
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let almarhum_skipped = 0;

    for (const member of memberData) {
      const fullName = member.name || member.member_name || member.nama || member.full_name || '';
      if (!fullName) { skipped++; continue; }

      const status = member.status || 'Aktif';
      if (status === 'Almarhum' || status === 'Almarhumah') {
        almarhum_skipped++;
        continue;
      }

      const nrp = member.nrp || member.nrm_nrp || member.nim || '';
      const memberBusiness = businessMap[member.id] || [];

      // Simpan semua field bisnis lengkap dari s32its.id persis
      const kegiatanUsaha = memberBusiness.map(b => ({
        id: b.id,
        company_name: b.company_name || '',
        position: b.position || '',
        business_segment: b.business_segment || '',
        description: b.description || '',
        address: b.address || '',
        phone: b.phone || '',
        email: b.email || '',
        website: b.website || '',
        cover_image_url: b.cover_image_url || '',
        gallery_images: b.gallery_images || [],
        documents: (b.documents || []).map(d => ({
          name: d.name || '',
          url: d.url || '',
          doc_type: d.doc_type || 'Lainnya',
        })),
        is_primary: b.is_primary || false,
        member_name: b.member_name || fullName,
        updated_date: b.updated_date || '',
      }));

      const primaryBiz = kegiatanUsaha.find(b => b.is_primary) || kegiatanUsaha[0];

      const alumniData = {
        full_name: fullName,
        angkatan: member.angkatan_code || member.angkatan || 'S32',
        source_web: 's32its.id',
        is_verified: true,
        status: status,
        s32_member_id: member.id,
      };

      if (nrp) alumniData.nrm_nrp = nrp;
      if (member.specialization) alumniData.bidang_keahlian = member.specialization;
      if (member.business_segment) alumniData.bidang_industri = member.business_segment;
      if (member.email1) alumniData.email = member.email1;
      if (member.email2) alumniData.email2 = member.email2;
      if (member.mobile1) alumniData.telepon = member.mobile1;
      if (member.mobile2) alumniData.telepon2 = member.mobile2;
      if (member.company_phone) alumniData.telepon_kantor = member.company_phone;
      if (member.photo_url) alumniData.photo_url = member.photo_url;
      // birthday S32 format: "Kota, DD MMM YYYY" — ambil bagian tanggal saja
      if (member.birthday) {
        const bdayStr = member.birthday;
        // Coba parse "DD MMM YYYY" dari akhir string (setelah koma jika ada)
        const bdayPart = bdayStr.includes(',') ? bdayStr.split(',').slice(1).join(',').trim() : bdayStr.trim();
        const MONTHS = { Jan:1,Feb:2,Mar:3,Apr:4,Mei:5,May:5,Jun:6,Jul:7,Agu:8,Aug:8,Sep:9,Okt:10,Oct:10,Nov:11,Des:12,Dec:12 };
        const m = bdayPart.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
        if (m) {
          const dd = m[1].padStart(2, '0');
          const mm = String(MONTHS[m[2]] || MONTHS[m[2].slice(0,3)] || 0).padStart(2, '0');
          const yyyy = m[3];
          if (mm !== '00') alumniData.tanggal_lahir = `${yyyy}-${mm}-${dd}`;
        }
      }
      if (member.company_address) alumniData.alamat_perusahaan = member.company_address;
      if (member.company) alumniData.perusahaan = member.company;

      // Kota domisili dari home_city (field kota S32, sudah bersih)
      if (member.home_city) alumniData.domisili_kota = member.home_city;
      if (member.home_country) alumniData.domisili_negara = member.home_country;

      // Perusahaan & jabatan dari primary bisnis (data paling fresh)
      if (primaryBiz?.company_name) alumniData.perusahaan = primaryBiz.company_name;
      else if (member.company) alumniData.perusahaan = member.company;
      if (primaryBiz?.position) alumniData.jabatan = primaryBiz.position;

      // Kota perusahaan dari company_city (field kota S32, sudah bersih)
      if (member.company_city) alumniData.company_city = member.company_city;
      else if (primaryBiz?.city) alumniData.company_city = primaryBiz.city;

      // Alamat kantor dari primary bisnis (lebih up-to-date dari member.company_address)
      if (primaryBiz?.address) alumniData.alamat_perusahaan = primaryBiz.address;
      else if (member.company_address) alumniData.alamat_perusahaan = member.company_address;

      if (kegiatanUsaha.length > 0) alumniData.kegiatan_usaha = JSON.stringify(kegiatanUsaha);

      // Cek existing: prioritas s32_member_id > nrp > nama
      const existing = existingByS32Id[member.id] || (nrp ? existingByNrp[nrp] : null) || existingByName[fullName.toLowerCase().trim()];

      if (existing) {
        // Jangan overwrite field yang sudah diisi user sendiri di alsits (hasil klaim/edit)
        // Field source-of-truth dari S32 (NRP, email, telepon, bisnis) tetap di-overwrite
        // Field yang sudah ada di alsits dan bukan dari sync: photo_url, bio, linkedin
        const updateData = { ...alumniData };

        if (existing.photo_url && !member.photo_url) delete updateData.photo_url;
        if (existing.bio) delete updateData.bio;
        if (existing.linkedin) delete updateData.linkedin;

        // Jika sudah punya data bisnis dari klaim sendiri (kegiatan_usaha ada tapi source bukan S32),
        // tetap overwrite karena S32 adalah sumber data bisnis utama
        // is_verified: jangan di-reset
        if (existing.is_verified) delete updateData.is_verified;

        await base44.asServiceRole.entities.Alumni.update(existing.id, updateData);
        updated++;
        console.log(`Updated (safe): ${fullName}`);
      } else {
        const created_record = await base44.asServiceRole.entities.Alumni.create(alumniData);
        existingByName[fullName.toLowerCase().trim()] = created_record;
        if (nrp) existingByNrp[nrp] = created_record;
        existingByS32Id[member.id] = created_record;
        created++;
        console.log(`Created: ${fullName}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    return Response.json({
      success: true,
      message: `Sync selesai dari s32its.id`,
      stats: { member_fetched: memberData.length, business_fetched: businessData.length, created, updated, skipped, almarhum_skipped }
    });

  } catch (error) {
    console.error('Sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});