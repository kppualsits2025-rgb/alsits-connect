import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '').replace(/^0/, '62').replace(/^8/, '628');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { identifier } = await req.json();

    if (!identifier || identifier.trim().length < 5) {
      return Response.json({ error: 'Masukkan email atau nomor HP yang valid.' }, { status: 400 });
    }

    const id = identifier.trim().toLowerCase();
    const isPhone = /^\+?[\d\s\-()]{8,}$/.test(identifier.trim());

    // Cari alumni yang cocok by email atau telepon
    const allAlumni = await base44.asServiceRole.entities.Alumni.list('-created_date', 2000);

    let matched = null;
    for (const a of allAlumni) {
      if (!matched && a.email && a.email.toLowerCase().trim() === id) matched = a;
      if (!matched && a.email2 && a.email2.toLowerCase().trim() === id) matched = a;
      if (!matched && isPhone) {
        const normInput = normalizePhone(identifier.trim());
        if (a.telepon && normalizePhone(a.telepon) === normInput) matched = a;
        if (a.telepon2 && normalizePhone(a.telepon2) === normInput) matched = a;
      }
    }

    if (!matched) {
      return Response.json({ error: 'Email atau nomor HP tidak ditemukan di database alumni ALSITS. Pastikan data sudah terdaftar.' }, { status: 404 });
    }

    // Cek apakah sudah ada klaim verified sebelumnya
    const existingClaims = await base44.asServiceRole.entities.AlumniClaim.filter({ alumni_id: matched.id });
    const alreadyVerified = existingClaims.some(c => c.verified === true);
    if (alreadyVerified) {
      return Response.json({
        error: `Profil ini sudah diklaim dan terverifikasi sebelumnya. Jika Anda adalah pemilik profil, silakan login langsung ke portal ALSITS. Jika ada masalah, hubungi admin ALSITS.`,
        already_claimed: true,
      }, { status: 409 });
    }

    // Harus punya email untuk pengiriman OTP
    const targetEmail = matched.email || matched.email2;
    if (!targetEmail) {
      return Response.json({ error: 'Alumni ditemukan namun tidak memiliki email terdaftar. Hubungi admin ALSITS.' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Hapus claim lama (unverified) untuk alumni ini (cleanup)
    for (const old of existingClaims) {
      await base44.asServiceRole.entities.AlumniClaim.delete(old.id);
    }

    // Simpan OTP baru
    await base44.asServiceRole.entities.AlumniClaim.create({
      alumni_id: matched.id,
      identifier: id,
      otp_code: otp,
      otp_expires_at: expiresAt,
      verified: false,
    });

    // Kirim OTP via email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: targetEmail,
      subject: 'Kode OTP Verifikasi Profil Alumni ALSITS',
      body: `Halo ${matched.full_name},\n\nKode OTP verifikasi profil alumni Anda di ALSITS adalah:\n\n🔐 ${otp}\n\nKode ini berlaku selama 10 menit.\n\nJika Anda tidak meminta kode ini, abaikan email ini.\n\n—\nPortal Alumni Teknik Sipil ITS\nalsits.id`,
    });

    // Sensor email untuk tampilan: sembunyikan sebagian
    const maskedEmail = targetEmail.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.max(2, b.length)) + c);

    return Response.json({
      success: true,
      alumni_id: matched.id,
      alumni_name: matched.full_name,
      angkatan: matched.angkatan,
      masked_email: maskedEmail,
    });

  } catch (error) {
    console.error('claimAlumni error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});