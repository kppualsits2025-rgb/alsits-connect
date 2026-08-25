import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { event_id } = await req.json();
    if (!event_id) return Response.json({ error: 'event_id wajib diisi' }, { status: 400 });

    const events = await base44.asServiceRole.entities.VotingEvent.filter({ id: event_id });
    const event = events[0];
    if (!event) return Response.json({ error: 'Event tidak ditemukan' }, { status: 404 });

    // Ambil voter spesifik event ini langsung via filter
    const eventVoters = (await base44.asServiceRole.entities.VoterRegistry.filter({ event_id })).filter(v => v.email);

    if (eventVoters.length === 0) {
      return Response.json({ error: 'Tidak ada pemilih terdaftar di event ini' }, { status: 400 });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    let sent = 0, failed = 0;

    for (const voter of eventVoters) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ALSITS OMOV <admin@alsits.id>',
            to: [voter.email],
            subject: `[Undangan Voting] ${event.title} — ALSITS`,
            html: buildInviteEmail({ voter, event }),
          }),
        });
        if (res.ok) {
          sent++;
        } else {
          failed++;
          const errBody = await res.json().catch(() => ({}));
          console.error('Failed:', voter.email, JSON.stringify(errBody));
          // Jika quota habis, hentikan loop dan kembalikan error spesifik
          if (errBody.name === 'daily_quota_exceeded') {
            return Response.json({ success: false, sent, failed, error: 'Kuota email Resend hari ini sudah habis. Coba lagi besok atau upgrade plan Resend.' }, { status: 429 });
          }
        }
        // Delay 300ms antar email untuk hindari rate limit Resend
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        failed++;
        console.error('Error sending to', voter.email, e.message);
      }
    }

    return Response.json({ success: true, sent, failed, total: eventVoters.length });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildInviteEmail({ voter, event }) {
  const name = voter.full_name || voter.nrp;
  const votingUrl = 'https://alsits.id/voting';
  const eventDate = event.start_time
    ? new Date(event.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    : 'Segera';

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
            <p style="font-size:15px;color:#e2e8f0;margin:0 0 8px;">Kepada <strong style="color:#D4A017;">${name}</strong>,</p>
            <p style="font-size:13px;color:#94a3b8;margin:0 0 20px;line-height:1.7;">
              Anda telah terdaftar sebagai pemilih dalam pemungutan suara berikut:
            </p>

            <!-- Event Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:linear-gradient(135deg,#0b1f4a,#1e3a8a);border:1px solid #D4A01760;border-radius:12px;padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:11px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">PEMILIHAN</p>
                  <p style="margin:0 0 10px;font-size:18px;font-weight:800;color:#ffffff;">${event.title}</p>
                  ${event.description ? `<p style="margin:0 0 10px;font-size:12px;color:#94a3b8;">${event.description}</p>` : ''}
                  <p style="margin:0;font-size:12px;color:#D4A017;">🗓️ Waktu: ${eventDate} WIB</p>
                </td>
              </tr>
            </table>

            <p style="font-size:13px;color:#94a3b8;margin:0 0 16px;line-height:1.7;">
              Untuk memberikan suara Anda, kunjungi portal ALSITS dan masukkan <strong style="color:#ffffff;">NRP</strong> serta <strong style="color:#ffffff;">email</strong> Anda untuk mendapatkan kode OTP verifikasi.
            </p>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td align="center">
                  <a href="${votingUrl}" style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.5px;">
                    🗳️ Ikut Pemungutan Suara
                  </a>
                </td>
              </tr>
            </table>

            <!-- NRP Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.25);border-radius:8px;padding:12px 16px;">
                  <p style="margin:0;font-size:12.5px;color:#fde68a;">📋 NRP Anda: <strong>${voter.nrp}</strong> · Email: <strong>${voter.email}</strong></p>
                </td>
              </tr>
            </table>

            <p style="font-size:12px;color:#475569;margin:0;line-height:1.7;">🔒 Email ini dikirim khusus kepada Anda sebagai pemilih terdaftar. Jangan bagikan informasi ini kepada pihak lain.</p>
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