import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { alumni_id, otp_code } = await req.json();

    if (!alumni_id || !otp_code) {
      return Response.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    // Cari claim aktif untuk alumni ini
    const claims = await base44.asServiceRole.entities.AlumniClaim.filter({ alumni_id });
    const claim = claims.find(c => !c.verified);

    if (!claim) {
      return Response.json({ error: 'Tidak ada permintaan OTP aktif. Silakan mulai ulang proses verifikasi.' }, { status: 404 });
    }

    // Cek expiry
    if (new Date(claim.otp_expires_at) < new Date()) {
      return Response.json({ error: 'Kode OTP sudah kadaluarsa. Silakan minta kode baru.' }, { status: 400 });
    }

    // Cek OTP
    if (claim.otp_code !== otp_code.trim()) {
      return Response.json({ error: 'Kode OTP salah. Periksa kembali email Anda.' }, { status: 400 });
    }

    // Mark verified
    await base44.asServiceRole.entities.AlumniClaim.update(claim.id, {
      verified: true,
      verified_at: new Date().toISOString(),
    });

    // Ambil data alumni lengkap
    const alumni = await base44.asServiceRole.entities.Alumni.filter({ id: alumni_id });
    const alumniData = alumni[0] || null;

    return Response.json({
      success: true,
      alumni: alumniData,
    });

  } catch (error) {
    console.error('claimVerifyOtp error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});