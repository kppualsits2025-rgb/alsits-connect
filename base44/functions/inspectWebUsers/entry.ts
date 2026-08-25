import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s32 = createClient({ appId: Deno.env.get('S32_APP_ID'), headers: { 'api_key': Deno.env.get('S32_API_KEY') } });
    const s51 = createClient({ appId: Deno.env.get('S51_APP_ID'), headers: { 'api_key': Deno.env.get('S51_API_KEY') } });

    const [s32Users, s51Users] = await Promise.all([
      s32.entities.User.list('-created_date', 50).catch(e => ({ error: e.message })),
      s51.entities.User.list('-created_date', 50).catch(e => ({ error: e.message })),
    ]);

    const s32Keys = Array.isArray(s32Users) && s32Users[0] ? Object.keys(s32Users[0]) : [];
    const s51Keys = Array.isArray(s51Users) && s51Users[0] ? Object.keys(s51Users[0]) : [];

    // Fetch claimed members S32 untuk debug
    const s32Members = await s32.entities.Member.list('-updated_date', 500).catch(e => ({ error: e.message }));
    const claimedMembers = Array.isArray(s32Members) ? s32Members.filter(m => m.claimed_by) : [];
    const s32UserMap = {};
    if (Array.isArray(s32Users)) s32Users.forEach(u => { s32UserMap[u.id] = { email: u.email, full_name: u.full_name }; });

    return Response.json({
      s32: {
        user_count: Array.isArray(s32Users) ? s32Users.length : 0,
        claimed_member_count: claimedMembers.length,
        claimed_members: claimedMembers.map(m => ({
          name: m.name || m.full_name,
          claimed_by_raw: m.claimed_by,
          user_found: !!s32UserMap[m.claimed_by],
          user_email: s32UserMap[m.claimed_by]?.email || null,
        })),
        user_id_sample: Array.isArray(s32Users) ? s32Users.slice(0, 5).map(u => ({ id: u.id, email: u.email })) : [],
      },
      s51: {
        count: Array.isArray(s51Users) ? s51Users.length : 0,
        keys: s51Keys,
        samples: Array.isArray(s51Users) ? s51Users.slice(0, 5).map(u => ({ id: u.id, full_name: u.full_name, email: u.email, role: u.role })) : s51Users,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});