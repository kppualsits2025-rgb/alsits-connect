import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

// Function ini untuk update entity schema User di web angkatan S32 & S51
// agar role 'cs' tersedia sebagai opsi
// Ini hanya perlu dijalankan sekali

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s32 = createClient({ appId: Deno.env.get('S32_APP_ID'), headers: { 'api_key': Deno.env.get('S32_API_KEY') } });
    const s51 = createClient({ appId: Deno.env.get('S51_APP_ID'), headers: { 'api_key': Deno.env.get('S51_API_KEY') } });

    // Cek schema User di S32
    let s32Schema = null;
    let s51Schema = null;
    try {
      s32Schema = await s32.entities.User.schema();
    } catch(e) {
      s32Schema = { error: e.message };
    }
    try {
      s51Schema = await s51.entities.User.schema();
    } catch(e) {
      s51Schema = { error: e.message };
    }

    return Response.json({ s32Schema, s51Schema, message: 'Schema fetched. Use the web angkatan admin panel to add cs role, or update via API.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});