import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

// Function untuk set role user di web angkatan (S32 atau S51)
// Payload: { source: 's32' | 's51', user_id: '...', role: 'cs' | 'admin_cs' | 'admin' | 'user' }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { source, user_id, role } = body;

    if (!source || !user_id || !role) {
      return Response.json({ error: 'source, user_id, and role are required' }, { status: 400 });
    }

    const allowedRoles = ['user', 'admin', 'cs', 'admin_cs'];
    if (!allowedRoles.includes(role)) {
      return Response.json({ error: `role must be one of: ${allowedRoles.join(', ')}` }, { status: 400 });
    }

    const client = createClient({
      appId: source === 's32' ? Deno.env.get('S32_APP_ID') : Deno.env.get('S51_APP_ID'),
      headers: { 'api_key': source === 's32' ? Deno.env.get('S32_API_KEY') : Deno.env.get('S51_API_KEY') },
    });

    const updated = await client.entities.User.update(user_id, { role });

    return Response.json({ success: true, updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});