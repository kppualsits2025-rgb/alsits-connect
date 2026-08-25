import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { linkedin_url, existing_data } = body;
    if (!linkedin_url) return Response.json({ error: 'linkedin_url diperlukan' }, { status: 400 });

    const prompt = `Cari dan baca halaman LinkedIn publik berikut, lalu ekstrak data profil profesionalnya:
URL: ${linkedin_url}

Ekstrak field berikut. Jika tidak tersedia, gunakan string kosong "":
- jabatan: posisi/jabatan terkini (contoh: "Senior Civil Engineer")
- perusahaan: nama perusahaan/instansi terkini (contoh: "PT Waskita Karya")
- domisili_kota: kota tempat tinggal/bekerja saat ini, kota saja tanpa negara (contoh: "Jakarta", "Surabaya")
- bidang_industri: pilih satu yang paling sesuai dari: Konstruksi, Konsultan, BUMN, Pemerintahan, Akademisi, Wiraswasta, Perbankan, Energi, Teknologi, Lainnya
- bio: summary/about LinkedIn dalam bahasa Indonesia (maks 280 karakter)
- business_tags: 3-5 keyword keahlian/produk/layanan, dipisah koma (contoh: "Manajemen Proyek, Struktur Beton, K3 Konstruksi")

Jawab HANYA dengan JSON valid.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          jabatan: { type: 'string' },
          perusahaan: { type: 'string' },
          domisili_kota: { type: 'string' },
          bidang_industri: { type: 'string' },
          bio: { type: 'string' },
          business_tags: { type: 'string' },
        }
      }
    });

    // Merge: hanya isi field yang kosong di existing_data
    const merged = {};
    const fields = ['jabatan', 'perusahaan', 'domisili_kota', 'bidang_industri', 'bio', 'business_tags'];
    for (const field of fields) {
      const liVal = (result[field] || '').trim();
      const exVal = (existing_data?.[field] || '').trim();
      if (liVal && !exVal) {
        merged[field] = liVal;
      }
    }

    return Response.json({ success: true, raw: result, merged });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});