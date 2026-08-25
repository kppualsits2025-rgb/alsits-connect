import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const { event, data } = body;

    // Mode trial: kirim hanya ke 1 email untuk preview
    const mode = body.mode || 'auto';
    const trialEmail = body.trial_email || null;

    if (mode === 'trial' && trialEmail) {
      const eventTitle = data?.title || 'Contoh Acara ALSITS';
      const eventCategory = data?.category || 'ALSITS';
      const eventDate = data?.event_date ? new Date(data.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '15 Agustus 2026';
      const eventLocation = data?.location || 'Graha Sepuluh Nopember, ITS Surabaya';
      const eventDescription = ((data?.description || 'Kami mengundang seluruh Alumni Teknik Sipil ITS untuk hadir dalam acara istimewa ini.')).replace(/<[^>]*>/g, '').slice(0, 300);
      const subject = `[ALSITS] ${eventCategory}: ${eventTitle}`;
      const body_html = buildEmailHtml(eventTitle, eventCategory, eventDate, eventLocation, eventDescription, data?.description);
      const { error: resendError } = await resend.emails.send({
        from: 'ALSITS - Alumni Sipil ITS <admin@alsits.id>',
        to: trialEmail,
        subject,
        html: body_html,
      });
      if (resendError) throw new Error(resendError.message);
      return Response.json({ success: true, message: `Trial email terkirim ke ${trialEmail}`, event_title: eventTitle });
    }

    // Hanya proses event create
    if (event?.type !== 'create') {
      return Response.json({ success: true, message: 'Bukan event create, dilewati.' });
    }

    // Hanya kirim notifikasi jika event dipublikasikan
    if (!data?.is_published) {
      return Response.json({ success: true, message: 'Event belum dipublikasikan, notifikasi tidak dikirim.' });
    }

    const base44 = createClientFromRequest(req);

    // Ambil semua alumni yang punya email
    const allAlumni = await base44.asServiceRole.entities.Alumni.list('-created_date', 2000);
    const recipients = allAlumni.filter(a => a.email && a.status !== 'Almarhum' && a.status !== 'Almarhumah');

    const eventTitle = data.title || 'Acara Baru';
    const eventCategory = data.category || 'ALSITS';
    const eventDate = data.event_date ? new Date(data.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const eventLocation = data.location || '';
    const eventDescription = (data.description || '').replace(/<[^>]*>/g, '').slice(0, 300);
    const subject = `[ALSITS] ${eventCategory}: ${eventTitle}`;
    const body_html = buildEmailHtml(eventTitle, eventCategory, eventDate, eventLocation, eventDescription, data.description);

    let sent = 0;
    let failed = 0;

    // Kirim email dalam batch kecil untuk hindari rate limit
    for (const alumni of recipients) {
      try {
        const { error: resendError } = await resend.emails.send({
          from: 'ALSITS - Alumni Sipil ITS <admin@alsits.id>',
          to: alumni.email,
          subject,
          html: body_html,
        });
        if (resendError) throw new Error(resendError.message);
        sent++;
        // Jeda 600ms antar email agar tidak kena rate limit Resend (max 2 req/detik)
        await new Promise(r => setTimeout(r, 600));
      } catch (e) {
        console.error(`Gagal kirim ke ${alumni.email}: ${e.message}`);
        failed++;
      }
    }

    console.log(`Notifikasi event "${eventTitle}" terkirim: ${sent} berhasil, ${failed} gagal`);
    return Response.json({ success: true, event_title: eventTitle, sent, failed, total_recipients: recipients.length });

  } catch (error) {
    console.error('notifyNewEvent error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildEmailHtml(eventTitle, eventCategory, eventDate, eventLocation, eventDescription, rawDescription) {
  return `
    <div style="font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f22; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #3730a3); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 1px;">ALSITS</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #93c5fd;">Alumni Sipil ITS</p>
      </div>
      <div style="padding: 32px 24px;">
        <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 8px; padding: 6px 14px; display: inline-block; margin-bottom: 16px;">
          <span style="color: #818cf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${eventCategory}</span>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #fff;">${eventTitle}</h2>
        ${eventDate ? `<p style="margin: 0 0 6px; color: #94a3b8; font-size: 14px;">📅 <strong style="color:#e2e8f0;">${eventDate}</strong></p>` : ''}
        ${eventLocation ? `<p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px;">📍 <strong style="color:#e2e8f0;">${eventLocation}</strong></p>` : ''}
        ${eventDescription ? `<p style="margin: 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.7;">${eventDescription}${rawDescription && rawDescription.length > 300 ? '...' : ''}</p>` : ''}
        <div style="margin-top: 28px; text-align: center;">
          <a href="https://alsits.id/events" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Lihat Detail Acara →</a>
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #475569;">Email ini dikirim otomatis oleh sistem ALSITS.<br/>Alumni Sipil ITS · <a href="https://alsits.id" style="color: #818cf8;">alsits.id</a></p>
      </div>
    </div>
  `;
}