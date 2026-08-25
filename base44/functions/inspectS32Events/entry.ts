import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s32Client = createClient({
      appId: Deno.env.get('S32_APP_ID'),
      headers: { 'api_key': Deno.env.get('S32_API_KEY') }
    });

    // Coba berbagai nama entity yang mungkin ada untuk kegiatan/event
    const entityNames = ['Event', 'Kegiatan', 'Activity', 'AlsitsEvent', 'KegiatanAngkatan', 'News', 'Berita', 'Post', 'Article'];
    const results = {};

    for (const name of entityNames) {
      try {
        const data = await s32Client.entities[name].list('-updated_date', 3);
        results[name] = {
          found: true,
          count: data.length,
          fields: data.length > 0 ? Object.keys(data[0]) : [],
          sample: data.length > 0 ? data[0] : null,
        };
      } catch (e) {
        results[name] = { found: false, error: e.message };
      }
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});