import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

async function sendViaResend({ to, subject, html }) {
  const { error } = await resend.emails.send({
    from: 'Keluarga Besar Alumni Teknik Sipil ITS <admin@alsits.id>',
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);

    // Mode: 'trial' kirim ke 1 email, 'scheduled' kirim ke semua birthday hari ini
    const mode = body.mode || 'scheduled';
    const trialEmail = body.trial_email || null;

    if (mode === 'trial') {
      // Kirim contoh ke email trial dengan nama dummy
      const sampleName = body.sample_name || 'Hazril Firdhanni';
      const sampleGender = body.sample_gender || 'L'; // L atau P
      const sapaan = sampleGender === 'P' ? 'Ning' : 'Cak';

      const emailHtml = buildBirthdayEmail(sampleName, sapaan);
      await sendViaResend({
        to: trialEmail,
        subject: `[ALSITS] Selamat Ulang Tahun, ${sapaan} ${sampleName}! 🎉`,
        html: emailHtml,
      });
      return Response.json({ success: true, message: `Trial email terkirim ke ${trialEmail}`, name: sampleName, sapaan });
    }

    // Mode scheduled: cari alumni yang ulang tahun hari ini
    if (mode === 'scheduled') {
      const user = await base44.auth.me().catch(() => null);
      // Allow scheduled calls without auth
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayMMDD = `${mm}-${dd}`;

      const allAlumni = await base44.asServiceRole.entities.Alumni.list('-created_date', 2000);
      const birthdayAlumni = allAlumni.filter(a => {
        if (!a.email || !a.tanggal_lahir) return false;
        if (a.status === 'Almarhum' || a.status === 'Almarhumah') return false;
        const tgl = a.tanggal_lahir; // format YYYY-MM-DD
        return tgl.slice(5) === todayMMDD; // cek MM-DD
      });

      console.log(`Birthday hari ini (${todayMMDD}): ${birthdayAlumni.length} alumni`);

      let sent = 0;
      let failed = 0;
      for (const alumni of birthdayAlumni) {
        try {
          const gender = (alumni.jenis_kelamin || '').toUpperCase();
          // Deteksi gender dari nama jika field kosong
          const sapaan = detectSapaan(alumni.full_name, gender);
          const emailHtml = buildBirthdayEmail(toTitleCase(alumni.full_name), sapaan);
          await sendViaResend({
            to: alumni.email,
            subject: `[ALSITS] Selamat Ulang Tahun, ${sapaan} ${toTitleCase(alumni.full_name)}! 🎉`,
            html: emailHtml,
          });
          sent++;
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.error(`Gagal kirim ke ${alumni.email}: ${e.message}`);
          failed++;
        }
      }

      return Response.json({ success: true, date: todayMMDD, total_birthday: birthdayAlumni.length, sent, failed });
    }

    return Response.json({ error: 'Mode tidak valid. Gunakan mode: trial atau scheduled.' }, { status: 400 });

  } catch (error) {
    console.error('sendBirthdayEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Deteksi sapaan Cak/Ning dari nama (heuristik sederhana)
function detectSapaan(fullName, genderField) {
  if (genderField === 'P' || genderField === 'PEREMPUAN' || genderField === 'FEMALE') return 'Ning';
  if (genderField === 'L' || genderField === 'LAKI' || genderField === 'MALE') return 'Cak';
  // Heuristik dari nama depan umum perempuan Indonesia
  const name = (fullName || '').toLowerCase();
  const femalePatterns = ['siti', 'nur', 'noor', 'dewi', 'sri', 'rina', 'rini', 'yuni', 'yuli', 'wati',
    'indah', 'fitri', 'putri', 'ayu', 'retno', 'wahyu', 'dian', 'lestari', 'suci', 'rahayu',
    'endah', 'dyah', 'nita', 'lisa', 'lia', 'dina', 'maya', 'hana', 'ninuk', 'nikmatus',
    'ratna', 'asri', 'erna', 'esti', 'wulan', 'anisa', 'annisa', 'nanik', 'titik', 'sari',
    'novita', 'novida', 'farida', 'faridah', 'khusnul', 'laila', 'layla', 'fatimah', 'zulfa'];
  for (const pattern of femalePatterns) {
    if (name.startsWith(pattern) || name.includes(' ' + pattern)) return 'Ning';
  }
  return 'Cak'; // default
}

function buildBirthdayEmail(namaAlumni, sapaan) {
  const bannerUrl = 'https://media.base44.com/images/public/69fb35c6f6284d7276918adb/3092a413e_generated_image.png';

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#07091a;font-family:'Open Sans',Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#0a0f22;border-radius:16px;overflow:hidden;box-shadow:0 0 60px rgba(99,102,241,0.2);">

    <!-- Banner -->
    <div style="position:relative;width:100%;">
      <img src="${bannerUrl}" alt="Selamat Ulang Tahun" style="width:100%;display:block;"/>
    </div>

    <!-- Gold divider -->
    <div style="height:3px;background:linear-gradient(90deg,transparent,#D4A017,transparent);"></div>

    <!-- Body -->
    <div style="padding:36px 32px;">

      <!-- Greeting -->
      <div style="text-align:center;margin-bottom:28px;">
        <span style="display:inline-block;background:rgba(212,160,23,0.12);border:1px solid rgba(212,160,23,0.4);color:#D4A017;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:20px;">🎂 Selamat Ulang Tahun</span>
      </div>

      <h1 style="text-align:center;margin:0 0 8px;font-size:26px;font-weight:900;color:#fff;letter-spacing:0.5px;">
        ${sapaan} <span style="color:#D4A017;text-shadow:0 0 20px rgba(212,160,23,0.5);">${namaAlumni}</span>
      </h1>
      <p style="text-align:center;color:#6366f1;font-size:13px;margin:0 0 28px;letter-spacing:1px;">Alumni Teknik Sipil ITS</p>

      <!-- Divider -->
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent);margin-bottom:28px;"></div>

      <!-- Message 1 -->
      <p style="color:#cbd5e1;font-size:15px;line-height:1.9;margin:0 0 20px;text-align:justify;">
        Selamat Hari Ulang Tahun <strong style="color:#D4A017;">${sapaan} ${namaAlumni}</strong>.
        Semoga momentum pertambahan usia ini membawa pembaruan semangat untuk terus berinovasi dan berkolaborasi.
        Mari bersama-sama melangkah maju, menciptakan dampak positif, dan membawa ekosistem ALSITS menuju masa depan
        yang penuh dengan pencapaian gemilang. Setiap tahun yang berlalu adalah babak baru untuk mengukir prestasi
        dan menginspirasi sesama. Semoga tahun ini menjadi jembatan menuju peluang-peluang baru yang lebih besar,
        keberkahan yang melimpah, dan kesuksesan profesional yang mengangkasa.
      </p>

      <!-- Message 2 -->
      <div style="background:rgba(99,102,241,0.08);border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
        <p style="color:#e2e8f0;font-size:15px;line-height:1.9;margin:0;font-style:italic;">
          "Semoga senantiasa dianugerahi kesehatan, kebahagiaan, serta kesuksesan yang berkelanjutan
          dalam setiap karya dan pengabdian Anda."
        </p>
      </div>

      <!-- Signature -->
      <div style="text-align:center;margin-top:8px;">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 4px;">Salam hangat,</p>
        <p style="color:#fff;font-size:15px;font-weight:700;margin:0;">Keluarga Besar</p>
        <p style="color:#D4A017;font-size:16px;font-weight:800;margin:4px 0 0;letter-spacing:1px;">Alumni Teknik Sipil ITS Surabaya</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="height:3px;background:linear-gradient(90deg,transparent,#6366f1,transparent);"></div>
    <div style="padding:20px 24px;text-align:center;background:rgba(0,0,0,0.3);">
      <p style="margin:0;font-size:11px;color:#475569;">
        Email ini dikirim otomatis oleh sistem ALSITS &nbsp;·&nbsp;
        <a href="https://alsits.id" style="color:#6366f1;text-decoration:none;">alsits.id</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}