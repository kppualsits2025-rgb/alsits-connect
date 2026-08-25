import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s32Client = createClient({
      appId: Deno.env.get('S32_APP_ID'),
      headers: { 'api_key': Deno.env.get('S32_API_KEY') }
    });

    const { name } = await req.json().catch(() => ({}));

    // Fetch members dan cari Hazril
    const members = await s32Client.entities.Member.list('-created_date', 500);
    const target = members.find(m => {
      const n = m.member_name || m.nama || m.full_name || m.name || '';
      return n.toLowerCase().includes((name || 'hazril').toLowerCase());
    });

    // Fetch semua business profiles
    const businesses = await s32Client.entities.BusinessProfile.list('-created_date', 500);
    const targetBiz = businesses.filter(b => target && b.member_id === target.id);

    // Return fields dari bisnis pertama dan ke-2 hazril
    const bizFields = targetBiz[0] ? Object.keys(targetBiz[0]) : [];
    const biz0keys = targetBiz[0] ? Object.fromEntries(Object.entries(targetBiz[0]).map(([k,v]) => [k, typeof v === 'string' ? v.substring(0,100) : v])) : null;
    const biz1keys = targetBiz[1] ? Object.fromEntries(Object.entries(targetBiz[1]).map(([k,v]) => [k, typeof v === 'string' ? v.substring(0,100) : v])) : null;

    // Return semua field member target
    const memberFields = target ? Object.keys(target) : [];
    const memberSample = target ? Object.fromEntries(
      Object.entries(target).map(([k, v]) => [k, typeof v === 'string' ? v.substring(0, 150) : v])
    ) : null;

    return Response.json({
      member_fields: memberFields,
      member_sample: memberSample,
      biz_fields: bizFields,
      biz_0: biz0keys,
      total: { members: members.length, businesses: businesses.length },
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});