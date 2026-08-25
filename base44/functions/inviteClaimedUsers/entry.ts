import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s32Client = createClient({ appId: Deno.env.get('S32_APP_ID'), headers: { 'api_key': Deno.env.get('S32_API_KEY') } });
    const s51Client = createClient({ appId: Deno.env.get('S51_APP_ID'), headers: { 'api_key': Deno.env.get('S51_API_KEY') } });

    const results = { invited: [], already_exists: [], errors: [], alumni_linked: 0 };

    // ── S32: ambil member yang punya claimed_by (user_id) ──────────────────────
    const s32Members = await s32Client.entities.Member.list('-updated_date', 500);

    // S32: claimed_by berisi email langsung
    const claimedS32 = s32Members.filter(m => m.claimed_by);
    console.log(`S32 claimed members: ${claimedS32.length}`);

    for (const member of claimedS32) {
      const email = member.claimed_by; // langsung email
      if (!email || !email.includes('@')) {
        results.errors.push({ source: 'S32', member_name: member.name, reason: 'claimed_by bukan email valid: ' + email });
        continue;
      }
      await processClaimedMember(base44, email, member.name || member.full_name, member.id, 's32its.id', member.name || member.full_name, results);
      await new Promise(r => setTimeout(r, 200));
    }

    // ── S51: ambil member yang punya claimed_by_email ──────────────────────────
    const s51Members = await s51Client.entities.Member.list('-updated_date', 500);
    const claimedS51 = s51Members.filter(m => m.claimed_by_email);
    console.log(`S51 claimed members: ${claimedS51.length}`);

    await new Promise(r => setTimeout(r, 1000)); // jeda setelah S32 agar tidak rate limit

    for (const member of claimedS51) {
      const email = member.claimed_by_email;
      const fullName = member.nama || member.full_name || member.name || '';
      await processClaimedMember(base44, email, fullName, member.id, 's51its.id', fullName, results);
      await new Promise(r => setTimeout(r, 600));
    }

    return Response.json({
      success: true,
      summary: {
        total_claimed_s32: claimedS32.length,
        total_claimed_s51: claimedS51.length,
        invited_new: results.invited.length,
        already_exists: results.already_exists.length,
        alumni_linked: results.alumni_linked,
        errors: results.errors.length,
      },
      details: results,
    });

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function processClaimedMember(base44, email, displayName, sourceId, sourceWeb, memberName, results) {
  try {
    // 1. Cari alumni record yang cocok di ALSITS
    const bySourceId = sourceWeb === 's32its.id'
      ? await base44.asServiceRole.entities.Alumni.filter({ s32_member_id: sourceId }).catch(() => [])
      : await base44.asServiceRole.entities.Alumni.filter({ source_web: sourceWeb }).catch(() => []).then(arr =>
          arr.filter(a => (a.full_name || '').toLowerCase().trim() === memberName.toLowerCase().trim())
        );
    const byEmail = await base44.asServiceRole.entities.Alumni.filter({ email: email }).catch(() => []);

    const alumniRecord = bySourceId[0] || byEmail[0];

    // 2. Update alumni record dengan email claimer (agar bisa self-edit via RLS)
    if (alumniRecord && !alumniRecord.email) {
      await base44.asServiceRole.entities.Alumni.update(alumniRecord.id, { email: email });
      results.alumni_linked++;
      console.log(`Linked email ${email} to alumni ${alumniRecord.full_name}`);
    }

    // 3. Invite user ke ALSITS (jika belum ada)
    try {
      await base44.users.inviteUser(email, 'user');
      results.invited.push({ email, name: displayName || memberName, source: sourceWeb });
      console.log(`Invited: ${email} (${memberName})`);
    } catch (inviteErr) {
      const msg = inviteErr?.message || '';
      if (msg.toLowerCase().includes('already') || msg.includes('exists') || inviteErr?.status === 409) {
        results.already_exists.push({ email, name: displayName || memberName, source: sourceWeb });
        console.log(`Already exists: ${email}`);
      } else {
        results.errors.push({ source: sourceWeb, email, member_name: memberName, reason: msg });
        console.log(`Invite error for ${email}: ${msg}`);
      }
    }
  } catch (err) {
    results.errors.push({ source: sourceWeb, email, member_name: memberName, reason: err.message });
  }
}