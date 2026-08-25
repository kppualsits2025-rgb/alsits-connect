import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

// Map web angkatan → konfigurasi
const ANGKATAN_CONFIG = [
  {
    angkatan: 'S32',
    source_web: 's32its.id',
    appId: () => Deno.env.get('S32_APP_ID'),
    apiKey: () => Deno.env.get('S32_API_KEY'),
    userEntity: 'User',
    roleField: 'role',
    // Tampilkan user dengan role 'cs' atau 'admin' yang sekaligus 'cs'
    // Role 'cs' = Customer Service / Petugas yang muncul di panel kontak
    eligibleRoles: ['cs', 'admin_cs'],
    nameField: 'full_name',
    phoneField: 'phone',
    emailField: 'email',
  },
  {
    angkatan: 'S51',
    source_web: 's51its.id',
    appId: () => Deno.env.get('S51_APP_ID'),
    apiKey: () => Deno.env.get('S51_API_KEY'),
    userEntity: 'User',
    roleField: 'role',
    eligibleRoles: ['cs', 'admin_cs'],
    nameField: 'full_name',
    phoneField: 'phone',
    emailField: 'email',
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.clone().json().catch(() => ({}));
    const isScheduled = body.scheduled === true;

    if (!isScheduled) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    let totalCreated = 0;
    let totalUpdated = 0;
    const results = [];

    for (const config of ANGKATAN_CONFIG) {
      try {
        const client = createClient({
          appId: config.appId(),
          headers: { 'api_key': config.apiKey() },
        });

        // Fetch semua user lalu filter yang role-nya 'cs' atau 'admin_cs'
        let adminUsers = [];
        try {
          const allUsers = await client.entities[config.userEntity].list('-created_date', 500);
          adminUsers = allUsers.filter(u => {
            const role = (u[config.roleField] || '').toLowerCase();
            return config.eligibleRoles.includes(role);
          });
          console.log(`${config.angkatan}: Found ${adminUsers.length} CS/petugas users`);
        } catch (e) {
          console.log(`${config.angkatan}: Failed to fetch users - ${e.message}`);
          results.push({ angkatan: config.angkatan, error: e.message });
          continue;
        }

        // Fetch Member data untuk ambil nomor telepon berdasarkan email
        let memberPhoneMap = {}; // email → phone
        try {
          const members = await client.entities.Member.list('-created_date', 500);
          members.forEach(m => {
            const email = m.email1 || m.email || '';
            const phone = m.mobile1 || m.phone || m.telepon || m.no_hp || '';
            if (email && phone) memberPhoneMap[email.toLowerCase()] = phone;
          });
          console.log(`${config.angkatan}: Loaded ${Object.keys(memberPhoneMap).length} member phone entries`);
        } catch (e) {
          console.log(`${config.angkatan}: Member fetch skipped - ${e.message}`);
        }

        // Ambil existing contacts untuk angkatan ini
        const existing = await base44.asServiceRole.entities.AngkatanContact.filter({
          angkatan: config.angkatan,
          source_web: config.source_web,
        });
        const existingByExtId = {};
        existing.forEach(c => {
          if (c.external_user_id) existingByExtId[c.external_user_id] = c;
        });

        let created = 0;
        let updated = 0;

        for (const u of adminUsers) {
          const extId = String(u.id || '');
          const name = u[config.nameField] || u.name || u.nama || '';
          if (!name) continue;

          const email = u[config.emailField] || u.email || '';
          // Ambil telepon dari Member (lebih lengkap) atau User
          const rawPhone = memberPhoneMap[email.toLowerCase()] || u[config.phoneField] || u.phone || u.no_hp || u.telepon || '';
          const phone = rawPhone.replace(/\D/g, '');
          const wa = phone.startsWith('62') ? phone : phone.startsWith('0') ? `62${phone.slice(1)}` : phone ? `62${phone}` : '';

          const role = (u[config.roleField] || '').toLowerCase();
          const roleLabel = role === 'admin_cs'
            ? `Admin & CS ${config.angkatan}`
            : `Petugas CS ${config.angkatan}`;

          const contactData = {
            angkatan: config.angkatan,
            source_web: config.source_web,
            full_name: name,
            role_label: roleLabel,
            telepon: wa,
            email: email,
            is_active: true,
            external_user_id: extId,
          };

          if (existingByExtId[extId]) {
            await base44.asServiceRole.entities.AngkatanContact.update(existingByExtId[extId].id, contactData);
            updated++;
          } else {
            await base44.asServiceRole.entities.AngkatanContact.create(contactData);
            created++;
          }
        }

        // Nonaktifkan kontak yang tidak lagi CS (external_user_id ada tapi tidak di daftar CS)
        const adminExtIds = new Set(adminUsers.map(u => String(u.id || '')).filter(Boolean));
        for (const c of existing) {
          if (c.external_user_id && !adminExtIds.has(c.external_user_id) && c.is_active) {
            await base44.asServiceRole.entities.AngkatanContact.update(c.id, { is_active: false });
            console.log(`Deactivated: ${c.full_name} (no longer admin on ${config.source_web})`);
          }
        }

        totalCreated += created;
        totalUpdated += updated;
        results.push({ angkatan: config.angkatan, created, updated, total_admins: adminUsers.length });

      } catch (err) {
        console.error(`Error syncing ${config.angkatan}:`, err.message);
        results.push({ angkatan: config.angkatan, error: err.message });
      }
    }

    return Response.json({
      success: true,
      message: 'Sync admin contacts selesai',
      stats: { totalCreated, totalUpdated, results },
    });

  } catch (error) {
    console.error('syncAngkatanAdmins error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});