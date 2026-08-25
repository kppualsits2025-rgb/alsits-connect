import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s51Client = createClient({
      appId: Deno.env.get('S51_APP_ID'),
      headers: { 'api_key': Deno.env.get('S51_API_KEY') }
    });

    // Coba fetch Member
    let members = [];
    let memberError = null;
    try {
      members = await s51Client.entities.Member.list('-updated_date', 3);
    } catch (e) { memberError = e.message; }

    // Coba fetch BusinessProfile
    let businesses = [];
    let bizError = null;
    try {
      businesses = await s51Client.entities.BusinessProfile.list('-updated_date', 3);
    } catch (e) { bizError = e.message; }

    // Inspect keys dari record pertama
    const memberKeys = members[0] ? Object.keys(members[0]) : [];
    const bizKeys = businesses[0] ? Object.keys(businesses[0]) : [];

    return Response.json({
      member: {
        count: members.length,
        error: memberError,
        keys: memberKeys,
        sample: members[0] ? Object.fromEntries(
          Object.entries(members[0]).map(([k, v]) => [k, typeof v === 'string' && v.length > 80 ? v.substring(0, 80) + '...' : v])
        ) : null
      },
      business: {
        count: businesses.length,
        error: bizError,
        keys: bizKeys,
        sample: businesses[0] ? Object.fromEntries(
          Object.entries(businesses[0]).map(([k, v]) => [k, typeof v === 'string' && v.length > 80 ? v.substring(0, 80) + '...' : v])
        ) : null
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});