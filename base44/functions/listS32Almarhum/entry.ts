import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const s32Client = createClient({
      appId: Deno.env.get('S32_APP_ID'),
      headers: { 'api_key': Deno.env.get('S32_API_KEY') }
    });

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'summary';

    const members = await s32Client.entities.Member.list('-updated_date', 500);
    const dbAlumni = await base44.asServiceRole.entities.Alumni.filter({ angkatan: 'S32' }, '-created_date', 500);

    const almarhumS32 = members.filter(m => (m.status || '').toLowerCase().includes('almarhum'));
    const aktifS32 = members.filter(m => !(m.status || '').toLowerCase().includes('almarhum'));
    const dbAktif = dbAlumni.filter(a => !['almarhum','almarhumah'].includes((a.status||'').toLowerCase()));
    const dbMemberIds = new Set(dbAlumni.map(a => a.s32_member_id).filter(Boolean));
    const missingFromDB = aktifS32.filter(m => !dbMemberIds.has(m.id));

    if (mode === 'detail_missing') {
      const detail = missingFromDB.map(m => ({
        id: m.id, name: m.name, status: m.status,
        email1: m.email1, mobile1: m.mobile1,
        company: m.company, nrp: m.nrp,
        is_public: m.is_public,
      }));
      return Response.json({ missing_count: missingFromDB.length, detail });
    }

    return Response.json({
      s32_total: members.length,
      s32_aktif: aktifS32.length,
      s32_almarhum: almarhumS32.length,
      db_total_s32: dbAlumni.length,
      db_aktif: dbAktif.length,
      missing_from_db: missingFromDB.map(m => ({ id: m.id, name: m.name, status: m.status })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});