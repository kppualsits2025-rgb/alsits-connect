import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Field aman untuk publik — TANPA nomor HP & email pribadi (mencegah penyalahgunaan data)
const PUBLIC_FIELDS = [
  'id', 'full_name', 'angkatan', 'tahun_masuk', 'tahun_lulus', 'gelar',
  'bidang_keahlian', 'bidang_industri', 'business_tags',
  'domisili_kota', 'domisili_negara', 'company_city',
  'perusahaan', 'jabatan', 'alamat_perusahaan',
  'linkedin', 'photo_url', 'bio',
  'kegiatan_usaha', 'status', 'source_web', 'is_verified',
];

// Field sensitif — hanya untuk member login & terverifikasi (via private endpoint / RLS)
// telepon, telepon2, email, email2 — TIDAK pernah dikirim ke public endpoint

Deno.serve(async (req) => {
  // CORS untuk app publik di subdomain berbeda
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const base44 = createClientFromRequest(req);

    // Ambil semua alumni (service role karena ini public endpoint)
    // Paginate untuk memastikan semua data terambil
    let all = [];
    let page = 0;
    const pageSize = 500;
    while (true) {
      const batch = await base44.asServiceRole.entities.Alumni.list('-angkatan', pageSize, page * pageSize);
      if (!batch || batch.length === 0) break;
      all = all.concat(batch);
      if (batch.length < pageSize) break;
      page++;
    }

    // Filter: exclude almarhum/almarhumah
    const filtered = all.filter(a =>
      a.status !== 'Almarhum' && a.status !== 'Almarhumah'
    );

    // Hanya expose field yang aman
    const safe = filtered.map(a => {
      const obj = {};
      PUBLIC_FIELDS.forEach(f => { if (a[f] !== undefined) obj[f] = a[f]; });
      return obj;
    });

    return Response.json(
      { data: safe, total: safe.length },
      { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' } }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
});