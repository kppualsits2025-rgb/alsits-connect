import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event_id, nrp, email } = await req.json();

    if (!event_id || !nrp || !email) {
      return Response.json({ error: 'event_id, nrp, dan email wajib diisi' }, { status: 400 });
    }

    // Paralel fetch event + voter untuk kurangi latency
    const [events, voters] = await Promise.all([
      base44.asServiceRole.entities.VotingEvent.filter({ id: event_id }),
      base44.asServiceRole.entities.VoterRegistry.filter({ event_id, nrp }),
    ]);

    const event = events[0];
    if (!event || event.status !== 'active') {
      return Response.json({ error: 'Event voting tidak aktif atau tidak ditemukan' }, { status: 400 });
    }

    const voter = voters.find(v => v.email.toLowerCase() === email.toLowerCase());

    if (!voter) {
      return Response.json({ error: 'NRP atau Email tidak terdaftar sebagai pemilih di event ini' }, { status: 404 });
    }

    if (voter.sudah_memilih) {
      return Response.json({ error: 'Anda sudah menggunakan hak suara Anda' }, { status: 400 });
    }

    // RATE LIMIT: Cek apakah OTP sebelumnya masih valid (anti-spam, cooldown 60 detik)
    if (voter.otp_expires_at && voter.otp_code) {
      const prevExpiry = new Date(voter.otp_expires_at);
      const cooldownUntil = new Date(prevExpiry.getTime() - 9 * 60 * 1000); // 1 menit setelah request sebelumnya
      if (new Date() < cooldownUntil) {
        const secondsLeft = Math.ceil((cooldownUntil - new Date()) / 1000);
        return Response.json({ error: `Tunggu ${secondsLeft} detik sebelum meminta OTP baru` }, { status: 429 });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Kirim email DULU via Resend — simpan OTP ke DB hanya jika email berhasil dikirim
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ALSITS OMOV <admin@alsits.id>',
        to: [voter.email],
        subject: `[OMOV] Kode OTP Voting — ${event.title}`,
        html: buildOtpEmail({ name: voter.full_name || nrp, otp, eventTitle: event.title }),
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend error:', errBody);
      return Response.json({ error: 'Gagal mengirim email OTP. Coba lagi.' }, { status: 500 });
    }

    // Email berhasil dikirim — baru simpan OTP ke database
    await base44.asServiceRole.entities.VoterRegistry.update(voter.id, {
      otp_code: otp,
      otp_expires_at: expires,
      otp_verified: false,
    });

    const maskedEmail = email.replace(/(.{2})[^@]*(@.*)/, '$1***$2');
    return Response.json({ success: true, message: `OTP telah dikirim ke ${maskedEmail}` });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildOtpEmail({ name, otp, eventTitle }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f2044,#0a1628);border:1px solid #D4A01740;border-radius:16px;overflow:hidden;max-width:520px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0b1f4a,#1d4ed8);padding:28px 32px;text-align:center;border-bottom:3px solid #D4A017;">
            <p style="margin:0;font-size:11px;color:#D4A017;letter-spacing:3px;font-weight:700;text-transform:uppercase;">ONE MAN ONE VOTE</p>
            <h1 style="margin:8px 0 0;font-size:26px;font-weight:900;color:#ffffff;">ALSITS</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#93c5fd;">Alumni Teknik Sipil ITS</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="font-size:15px;color:#e2e8f0;margin:0 0 8px;">Halo, <strong style="color:#D4A017;">${name}</strong>!</p>
            <p style="font-size:13px;color:#94a3b8;margin:0 0 24px;">Berikut adalah kode OTP Anda untuk berpartisipasi dalam pemilihan:</p>
            <p style="font-size:13px;color:#93c5fd;font-weight:700;text-align:center;margin:0 0 16px;">${eventTitle}</p>
            <!-- OTP Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:linear-gradient(135deg,#0b1f4a,#1e3a8a);border:2px solid #D4A017;border-radius:12px;padding:24px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:11px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">KODE OTP ANDA</p>
                  <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:14px;color:#D4A017;font-family:'Courier New',monospace;">${otp}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:8px;padding:12px 16px;">
                  <p style="margin:0;font-size:12.5px;color:#fca5a5;">⏰ Kode ini <strong>hanya berlaku selama 10 menit</strong> sejak email ini diterima.</p>
                </td>
              </tr>
            </table>
            <p style="font-size:12px;color:#475569;margin:0;line-height:1.7;">🔒 Jangan bagikan kode ini kepada siapapun. Tim ALSITS tidak akan pernah meminta kode OTP Anda via telepon atau chat.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:rgba(0,0,0,0.3);padding:18px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:11px;color:#334155;">Email otomatis dari sistem OMOV · alsits.id · Jangan balas email ini</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}