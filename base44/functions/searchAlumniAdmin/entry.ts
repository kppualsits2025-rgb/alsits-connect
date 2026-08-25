import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { q } = await req.json();
    if (!q || q.length < 2) return Response.json({ data: [] });

    const keyword = q.toLowerCase();

    // Fetch ALL alumni in pages, filter by name/nrp
    let all = [];
    let page = 0;
    const pageSize = 500;
    while (true) {
      const batch = await base44.asServiceRole.entities.Alumni.list('-angkatan', pageSize, page * pageSize);
      if (!batch || batch.length === 0) break;
      all = all.concat(batch);
      if (batch.length < pageSize) break;
      page++;
      if (all.length > 5000) break; // safety cap
    }

    const filtered = all
      .filter(a =>
        a.full_name?.toLowerCase().includes(keyword) ||
        a.nrm_nrp?.toLowerCase().includes(keyword)
      )
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        full_name: a.full_name,
        angkatan: a.angkatan,
        photo_url: a.photo_url || '',
        nrm_nrp: a.nrm_nrp || '',
      }));

    return Response.json({ data: filtered });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});