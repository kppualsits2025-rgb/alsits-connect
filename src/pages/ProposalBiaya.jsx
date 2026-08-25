import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const P = ({ children, style = {} }) => (
  <p style={{ fontSize: 13.5, lineHeight: 1.85, color: '#374151', marginBottom: 10, ...style }}>{children}</p>
);

const Li = ({ children }) => (
  <li style={{ fontSize: 13.5, lineHeight: 1.8, color: '#374151', marginBottom: 4 }}>{children}</li>
);

const SectionTitle = ({ number, title, color = '#1d4ed8' }) => (
  <div className="section-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, marginTop: 36 }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14,
      flexShrink: 0,
    }}>{number}</div>
    <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h2>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px',
    marginBottom: 16, background: '#fff',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    pageBreakInside: 'avoid',
    ...style,
  }}>
    {children}
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
    {label && <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
  </div>
);

// ─── BIAYA DATA ──────────────────────────────────────────────────────────────

const PHASES = [
  {
    phase: 'Phase 1',
    label: 'Foundation',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    items: [
      { item: 'UX Research & User Interview (5–10 alumni)', dur: '2 minggu' },
      { item: 'Competitive Analysis & Benchmark', dur: '1 minggu' },
      { item: 'Wireframe & UX Flow (10+ halaman)', dur: '1 minggu' },
      { item: 'UI Design High-Fidelity + Design System', dur: '2 minggu' },
      { item: 'Interactive Prototype (Figma) + User Testing', dur: '1 minggu' },
    ],
    note: 'Deliverable: Laporan UX Research, Figma Design System, Prototype',
    biaya: 'Rp 3.000.000',
    biaya_note: 'Fase ini dibayarkan di muka sebelum pengerjaan',
  },
  {
    phase: 'Phase 2',
    label: 'Core Development',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    items: [
      { item: 'Implementasi design system baru ke seluruh halaman', dur: '1 minggu' },
      { item: 'Redesign navigasi: flat IA, mega-menu, breadcrumb', dur: '1 minggu' },
      { item: 'Mobile-first responsive redesign semua halaman', dur: '2 minggu' },
      { item: 'Global Search bar (alumni, berita, lowongan, forum)', dur: '1 minggu' },
      { item: 'Halaman Profil Mandiri alumni (self-service update)', dur: '1 minggu' },
      { item: 'Sistem notifikasi in-app + Activity feed', dur: '2 minggu' },
      { item: 'Onboarding flow anggota baru (3-langkah)', dur: '1 minggu' },
    ],
    note: 'Deliverable: Platform baru live di staging, siap review',
    biaya: 'Rp 4.000.000',
    biaya_note: 'Dibayarkan 50% saat kick-off, 50% setelah review staging',
  },
  {
    phase: 'Phase 3',
    label: 'Intelligence & Launch',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    items: [
      { item: 'Dashboard analitik dinamis dengan filter waktu & segmen', dur: '2 minggu' },
      { item: 'Progressive Web App (PWA) — install di homescreen', dur: '1 minggu' },
      { item: 'AI-powered rekomendasi konten & job matching', dur: '2 minggu' },
      { item: 'Performance optimization & SEO on-page', dur: '1 minggu' },
      { item: 'Testing menyeluruh: functional, responsive, cross-browser', dur: '1 minggu' },
      { item: 'Deployment production + monitoring setup', dur: '0.5 minggu' },
      { item: 'Training admin ALSITS (2 sesi) + Dokumentasi', dur: '0.5 minggu' },
    ],
    note: 'Deliverable: Platform live di production, training selesai, semua dokumentasi diserahkan',
    biaya: 'Rp 3.000.000',
    biaya_note: 'Dibayarkan setelah deployment production & training admin',
  },
];

const TOTAL = 'Rp 10.000.000';

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ProposalBiaya() {
  const [showMotivasi, setShowMotivasi] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Open Sans, sans-serif' }}>

      {/* Print Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap');

        @media print {
          .no-print { display: none !important; }

          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html, body {
            background: white !important;
          }

          /* Wrapper utama */
          #proposal-content {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Cover: satu halaman penuh */
          #proposal-cover {
            page-break-after: always;
            break-after: page;
            border-radius: 0 !important;
            padding: 24mm 16mm !important;
            min-height: auto !important;
            margin-bottom: 0 !important;
          }

          /* Surat pengantar: jangan terpotong */
          #surat-pengantar {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Semua card dan item: jangan terpotong */
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Phase blocks: jangan terpotong di tengah */
          .phase-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 10pt !important;
          }

          /* Tabel: jangan terpotong */
          table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Penutup: jangan terpotong */
          #penutup {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border-radius: 0 !important;
          }

          /* Grid 2 kolom: paksa 2 kolom tetap tapi dengan gap kecil */
          .grid-2col {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8pt !important;
          }

          /* Grid 3 kolom: tetap 3 kolom tapi kompak */
          .grid-3col {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 8pt !important;
          }

          /* Semua item dalam grid: jangan terpotong */
          .grid-2col > *, .grid-3col > * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Font size lebih kecil agar muat */
          p, li, td, th, span, div {
            font-size: 9.5pt !important;
            line-height: 1.55 !important;
          }

          h1 { font-size: 18pt !important; }
          h2 { font-size: 13pt !important; }

          /* Kurangi padding semua card */
          .grid-2col > div, .grid-3col > div {
            padding: 8pt 10pt !important;
          }

          /* Section title margin lebih kecil */
          .section-title-wrap {
            margin-top: 14pt !important;
            margin-bottom: 8pt !important;
          }

          /* Total box */
          .total-box {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Steps */
          .step-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 6pt !important;
          }

          /* Motivasi panel: jangan tampil saat print */
          #motivasi-panel { display: none !important; }

          /* Kurangi margin section title */
          .section-title-wrap {
            margin-top: 12pt !important;
            margin-bottom: 8pt !important;
          }
        }
      `}</style>

      {/* ─── TOP BAR ──────────────────────────────────────────────────────── */}
      <div className="no-print" style={{
        background: 'linear-gradient(135deg, #0b1f4a, #060d1f)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '3px solid #D4A017',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 36 }} />
          <div>
            <div style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15 }}>Proposal Biaya Final</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Redesign & Improvement Portal ALSITS · alsits.id · 2026</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowMotivasi(v => !v)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
            }}>
            {showMotivasi ? 'Sembunyikan' : '🤍 Motivasi Pengabdian'}
          </button>
          <Link to="/draft-kontrak"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(59,130,246,0.2)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.4)', textDecoration: 'none',
            }}>
            📄 Draft Kontrak
          </Link>
          <button onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(245,158,11,0.2)', color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.4)', cursor: 'pointer',
            }}>
            🖨️ Cetak / Export PDF
          </button>
        </div>
      </div>

      {/* ─── MOTIVASI PANEL (toggle) ──────────────────────────────────────── */}
      {showMotivasi && (
      <div id="motivasi-panel" style={{
          background: 'linear-gradient(135deg, #fefce8, #fff7ed)',
          borderBottom: '2px solid #fde68a',
          padding: '24px 32px',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>🌿</div>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#92400e', marginBottom: 10 }}>
                  Catatan Pribadi dari Perancang
                </p>
                <P style={{ color: '#78350f' }}>
                  Portal ALSITS ini dirancang dan dibangun bukan semata sebagai proyek komersial, melainkan sebagai bentuk <strong>pengamalan ilmu</strong> yang telah Allah karuniakan — karena ilmu yang tidak diamalkan adalah amanah yang belum tuntas ditunaikan.
                </P>
                <P style={{ color: '#78350f' }}>
                  Ini juga adalah <strong>wujud pengabdian</strong> kepada almamater, Institut Teknologi Sepuluh Nopember Surabaya — khususnya kepada Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS) — yang telah membentuk karakter, ilmu, dan jaringan yang menjadi bekal hidup hingga hari ini.
                </P>
                <P style={{ color: '#92400e', fontStyle: 'italic' }}>
                  "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya." — HR. Ahmad
                </P>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="proposal-content" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>

        {/* ─── COVER PROPOSAL ──────────────────────────────────────────────── */}
        <div id="proposal-cover" style={{
          background: 'linear-gradient(135deg, #0b1f4a 0%, #1e3a8a 60%, #0b1f4a 100%)',
          borderRadius: 16, padding: '40px 40px 36px',
          marginBottom: 36, pageBreakInside: 'avoid',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(11,31,74,0.18)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'center' }}>
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 52 }} />
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS ITS" style={{ height: 46 }} />
          </div>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Montserrat, sans-serif' }}>Proposal Biaya Final · 2026</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>
            Redesign & Improvement<br /><span style={{ color: '#f59e0b' }}>Portal ALSITS</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 28px', fontFamily: 'Open Sans, sans-serif', lineHeight: 1.6 }}>
            Alumni Teknik Sipil — Institut Teknologi Sepuluh Nopember Surabaya
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: '📋', label: '3 Fase Pengembangan' },
              { icon: '⏱️', label: '±17 Minggu Total' },
              { icon: '🎯', label: 'Mobile-First & PWA' },
              { icon: '🤝', label: 'Garansi Revisi' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
        </div>

        {/* ─── SURAT PENGANTAR / KATA PEMBUKA ─────────────────────────────── */}
        <Card id="surat-pengantar" style={{ borderLeft: '4px solid #D4A017', background: 'linear-gradient(135deg, #fffbeb, #fff)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>🕌</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#92400e', margin: '0 0 4px' }}>
                Bismillahirrahmanirrahim
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13.5, color: '#78350f', fontStyle: 'italic', margin: '0 0 14px' }}>
                Assalamu'alaikum wa rahmatullahi wa barakatuh
              </p>
              <P style={{ color: '#44403c', textAlign: 'justify' }}>
                Kepada Yth. Pengurus Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS),<br />
                Dengan hormat,
              </P>
              <P style={{ color: '#44403c', textAlign: 'justify' }}>
                Perkenankanlah saya menyampaikan proposal biaya ini sebagai kelanjutan dari presentasi teknis yang telah dipaparkan kepada Ketua Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS), Cak <strong><em>Harum Akhmad Zuhdi</em></strong> beberapa waktu lalu. Platform <strong>alsits.id</strong> yang ada saat ini telah saya rancang dan bangun dengan sepenuh hati — bukan semata sebagai pekerjaan, melainkan sebagai <strong>amal ilmu</strong> dan <strong>wujud pengabdian</strong> kepada almamater, ITS, yang telah mendidik dan membentuk saya.
              </P>
              <P style={{ color: '#44403c', textAlign: 'justify' }}>
                Proposal biaya ini disusun dengan <em>harga keadilan</em> — cukup untuk menutup biaya operasional pengerjaan, namun jauh lebih rendah dari nilai komersial standar — karena motivasi utama saya adalah agar platform ini <strong>sungguh-sungguh dapat diterima, digunakan, dan bermanfaat</strong> bagi seluruh keluarga besar alumni Teknik Sipil ITS.
              </P>
              <P style={{ color: '#44403c', fontStyle: 'italic', marginBottom: 0, textAlign: 'justify' }}>
                "Apabila manusia meninggal dunia, terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau doa anak yang sholeh." — HR. Muslim
              </P>
            </div>
          </div>
        </Card>

        {/* ─── SEKSI 1: MENGAPA MEMILIH PROPOSAL INI ──────────────────────── */}
        <SectionTitle number="1" title="Mengapa Memilih Proposal Ini?" color="#1d4ed8" />

        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            {
              icon: '💡', title: 'Sudah Terbukti Berjalan',
              desc: 'Bukan sekadar konsep. Platform alsits.id sudah dibangun, berjalan live, dan mencakup 10+ modul fungsional yang dapat Anda evaluasi langsung.',
            },
            {
              icon: '🧭', title: 'Pemahaman Ekosistem ALSITS',
              desc: 'Perancang adalah bagian dari ekosistem alumni ITS. Memahami alur web angkatan, kebutuhan komunitas, dan kultur organisasi dari dalam — bukan dari luar.',
            },
            {
              icon: '🏗️', title: 'Arsitektur Siap Berkembang',
              desc: 'Dibangun dengan teknologi modern (React, cloud-native, real-time API) yang mudah dikembangkan, dipelihara, dan di-scale seiring pertumbuhan anggota ALSITS.',
            },
            {
              icon: '🤲', title: 'Motivasi Pengabdian',
              desc: 'Proyek ini didorong oleh niat pengabdian kepada almamater, bukan semata profit. Hal ini tercermin dalam harga yang jauh di bawah nilai pasar dan komitmen jangka panjang.',
            },
            {
              icon: '🔄', title: 'Revisi & Support Inklusif',
              desc: 'Setiap fase mencakup revisi yang tidak dibatasi secara kaku. Support teknis pasca-launch diberikan selama 3 bulan tanpa biaya tambahan.',
            },
            {
              icon: '📖', title: 'Transfer Knowledge',
              desc: 'Admin ALSITS akan dilatih secara menyeluruh. Dokumentasi teknis & user guide diserahkan lengkap agar organisasi tidak bergantung sepenuhnya pada developer.',
            },
          ].map(b => (
            <div key={b.title} className="avoid-break" style={{ display: 'flex', gap: 12, padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 5px' }}>{b.title}</p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SEKSI 2: BREAKDOWN BIAYA PER FASE ──────────────────────────── */}
        <SectionTitle number="2" title="Breakdown Biaya per Fase" color="#1d4ed8" />

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 18px', marginBottom: 22 }}>
          <p style={{ fontSize: 13, color: '#1e40af', margin: 0, lineHeight: 1.7 }}>
            <strong>Prinsip Penetapan Harga:</strong> Biaya ditetapkan berdasarkan <em>harga pengabdian</em> — menutup biaya operasional riil pengerjaan, jauh di bawah tarif pasar developer profesional (Rp 15–50 juta untuk proyek setara). Ini adalah kontribusi nyata perancang kepada keluarga besar alumni ITS.
          </p>
        </div>

        {PHASES.map((p, idx) => (
          <div key={p.phase} className="phase-block" style={{ marginBottom: 20, pageBreakInside: 'avoid' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
              background: p.bg, border: `1px solid ${p.border}`,
              borderRadius: '10px 10px 0 0', borderBottom: 'none',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>{idx + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14, color: p.color }}>{p.phase}: {p.label}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 18, color: p.color }}>{p.biaya}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{p.biaya_note}</div>
              </div>
            </div>
            <div style={{ border: `1px solid ${p.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <tbody>
                  {p.items.map((item, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : p.bg, borderTop: i > 0 ? `1px solid ${p.border}` : 'none' }}>
                      <td style={{ padding: '8px 16px', color: '#334155' }}>
                        <span style={{ color: p.color, marginRight: 8 }}>✓</span>{item.item}
                      </td>
                      <td style={{ padding: '8px 16px', textAlign: 'right', color: '#64748b', whiteSpace: 'nowrap' }}>{item.dur}</td>
                    </tr>
                  ))}
                  <tr style={{ background: p.bg, borderTop: `1px solid ${p.border}` }}>
                    <td colSpan={2} style={{ padding: '8px 16px', fontSize: 11.5, color: p.color, fontStyle: 'italic', fontWeight: 600 }}>
                      📦 {p.note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderRadius: 12,
          background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
          color: '#fff', marginBottom: 10, pageBreakInside: 'avoid', breakInside: 'avoid',
          boxShadow: '0 4px 16px rgba(30,58,138,0.25)',
        }}>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 16, margin: 0 }}>Total Investasi (3 Fase)</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '4px 0 0' }}>Termasuk UX Research, Design, Development, QA, Deployment & Training</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: '#fbbf24' }}>{TOTAL}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>*Belum termasuk biaya server/hosting tahunan</div>
          </div>
        </div>

        {/* Catatan harga */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 18px', marginBottom: 8 }}>
          <p style={{ fontSize: 12.5, color: '#15803d', margin: 0, lineHeight: 1.7 }}>
            💚 <strong>Nilai pasar developer profesional</strong> untuk proyek setara (full UX research, UI design, development 10+ modul, PWA, AI features) adalah sekitar <strong>Rp 25.000.000 – Rp 60.000.000</strong>. Harga yang ditawarkan adalah <strong>bentuk nyata pengabdian</strong> kepada komunitas alumni ALSITS.
          </p>
        </div>
        <p style={{ fontSize: 11.5, color: '#94a3b8', textAlign: 'center', marginBottom: 30 }}>* Apabila pengerjaan dilakukan per-fase secara terpisah, harga masing-masing fase dapat dinegosiasikan sesuai prioritas & anggaran ALSITS.</p>

        {/* ─── SEKSI 3: SKEMA PEMBAYARAN ───────────────────────────────────── */}
        <SectionTitle number="3" title="Skema Pembayaran" color="#1d4ed8" />

        <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[
            { step: '30%', label: 'Down Payment', timing: 'Saat penandatanganan kontrak', color: '#2563eb', desc: 'Rp 3.000.000 — mencakup biaya awal Phase 1 (UX Research & Design)' },
            { step: '40%', label: 'Termin 2', timing: 'Setelah staging Phase 2 disetujui', color: '#059669', desc: 'Rp 4.000.000 — setelah platform staging siap direview klien' },
            { step: '30%', label: 'Pelunasan', timing: 'Setelah go-live & training', color: '#d97706', desc: 'Rp 3.000.000 — setelah platform live di production dan training selesai' },
          ].map(s => (
            <div key={s.step} className="avoid-break" style={{ padding: '16px 18px', border: `1px solid ${s.color}33`, borderRadius: 10, background: '#fff', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: s.color }}>{s.step}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>{s.timing}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ─── SEKSI 4: APA YANG TERMASUK ─────────────────────────────────── */}
        <SectionTitle number="4" title="Yang Termasuk dalam Paket" color="#1d4ed8" />

        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📄', title: 'Laporan UX Research', desc: 'Hasil riset user, benchmark kompetitor, temuan & rekomendasi tertulis' },
            { icon: '🎨', title: 'Figma Design System', desc: 'Semua komponen, warna, tipografi — terdokumentasi & menjadi milik ALSITS' },
            { icon: '📱', title: 'Prototype Interaktif', desc: 'Demo klik-able yang bisa dipresentasikan ke stakeholder sebelum development' },
            { icon: '💻', title: 'Source Code Lengkap', desc: 'Kode sumber bersih, terdokumentasi, menjadi hak milik penuh ALSITS' },
            { icon: '📚', title: 'Dokumentasi Teknis', desc: 'User guide admin, panduan maintenance, API docs, deployment guide' },
            { icon: '🎓', title: 'Training Admin (2 sesi)', desc: 'Training pengelolaan konten, manajemen alumni, dan pemeliharaan rutin' },
            { icon: '🔧', title: 'Support Pasca-Launch', desc: '3 bulan support teknis gratis untuk bug fixing dan pertanyaan penggunaan' },
            { icon: '♾️', title: 'Revisi Tidak Terbatas', desc: 'Revisi desain selama fase design, revisi minor gratis selama development' },
          ].map(d => (
            <div key={d.title} className="avoid-break" style={{ display: 'flex', gap: 12, padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{d.icon}</span>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 4px' }}>{d.title}</p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.55 }}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SEKSI 5: PERBANDINGAN NILAI ─────────────────────────────────── */}
        <div style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: 4 }}>
        <SectionTitle number="5" title="Perbandingan Nilai — Pengabdian vs Harga Pasar" color="#7c3aed" />

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: 'white' }}>
                <th style={{ padding: '11px 16px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Komponen</th>
                <th style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Harga Pasar</th>
                <th style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#fbbf24' }}>Proposal Ini</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['UX Research & User Testing', 'Rp 5.000.000+', '✓ Termasuk'],
                ['UI Design + Design System (Figma)', 'Rp 8.000.000+', '✓ Termasuk'],
                ['Development 10+ Halaman (Full-Stack)', 'Rp 20.000.000+', '✓ Termasuk'],
                ['PWA & AI Features', 'Rp 8.000.000+', '✓ Termasuk'],
                ['QA, Testing & Deployment', 'Rp 3.000.000+', '✓ Termasuk'],
                ['Training & Dokumentasi', 'Rp 2.000.000+', '✓ Termasuk'],
                ['Support 3 Bulan Pasca-Launch', 'Rp 3.000.000+', '✓ Termasuk'],
              ].map(([comp, market, ours], i) => (
                <tr key={comp} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 16px', color: '#334155', fontWeight: 500 }}>{comp}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: '#94a3b8', textDecoration: 'line-through' }}>{market}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>{ours}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#fef3c7', borderTop: '2px solid #fbbf24' }}>
                <td style={{ padding: '11px 16px', fontWeight: 800, color: '#92400e', fontFamily: 'Montserrat, sans-serif' }}>Total Nilai</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700 }}>Rp 49.000.000+</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#d97706', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', fontSize: 15 }}>Rp 10.000.000</td>
              </tr>
            </tfoot>
          </table>
        </div>

        </div>{/* end seksi 5 wrapper */}

        {/* ─── SEKSI 6: LANGKAH SELANJUTNYA ────────────────────────────────── */}
        <SectionTitle number="6" title="Langkah Selanjutnya" color="#1d4ed8" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {[
            { step: '01', title: 'Review & Diskusi Proposal', desc: 'Sampaikan pertanyaan, masukan, atau negosiasi lingkup kepada tim perancang. Kami terbuka untuk menyesuaikan fase & prioritas sesuai kebutuhan dan anggaran ALSITS.', color: '#2563eb' },
            { step: '02', title: 'Kesepakatan & Kontrak', desc: 'Setelah lingkup dan biaya disepakati, penandatanganan kontrak kerja sederhana sebagai dasar kepercayaan dan perlindungan kedua belah pihak.', color: '#059669' },
            { step: '03', title: 'DP & Kick-off Meeting', desc: 'Down payment 30% diterima, kick-off meeting dilaksanakan, dan Phase 1 (UX Research & Design) dimulai. Target waktu: dalam 7 hari setelah kontrak ditandatangani.', color: '#d97706' },
            { step: '04', title: 'Pengerjaan Bertahap & Transparan', desc: 'Setiap akhir fase, klien menerima laporan progress, demo hasil, dan persetujuan sebelum fase berikutnya dimulai. Tidak ada kejutan — semua terbuka dan terdokumentasi.', color: '#7c3aed' },
          ].map(s => (
            <div key={s.step} className="step-item avoid-break" style={{ display: 'flex', gap: 18, padding: '16px 20px', border: `1px solid ${s.color}22`, borderRadius: 10, background: '#fff', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 30, color: s.color, lineHeight: 1, minWidth: 44, opacity: 0.3 }}>{s.step}</div>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '0 0 5px' }}>{s.title}</p>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── PENUTUP ─────────────────────────────────────────────────────── */}
        <div id="penutup" style={{
          background: 'linear-gradient(135deg, #0b1f4a 0%, #1e3a8a 100%)',
          borderRadius: 14, padding: '32px 36px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(11,31,74,0.2)',
          marginBottom: 8,
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
          <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center' }}>
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 40 }} />
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS" style={{ height: 36 }} />
          </div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: '0 0 14px' }}>
            Penutup — Komitmen Pengabdian
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.85, margin: '0 0 14px' }}>
            Saya meyakini bahwa platform digital yang baik adalah <em>aset jangka panjang</em> — bukan sekadar website. Investasi yang ALSITS lakukan hari ini akan berdampak pada ribuan alumni yang terhubung, puluhan generasi yang terdata, dan satu ekosistem alumni teknik sipil yang menjadi kebanggaan ITS di masa depan.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
            "Dan bahwa seorang manusia tidak memperoleh selain apa yang telah diusahakannya, dan bahwa usahanya itu kelak akan diperlihatkan kepadanya." — QS. An-Najm: 39–40
          </p>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>Hormat saya,</p>
            <img
              src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c96643dd1_ttd_birutipis-removebg-preview.png"
              alt="Tanda Tangan"
              style={{ height: 72, marginTop: 4, marginBottom: 2, filter: 'brightness(0) invert(1)', opacity: 0.85 }}
            />
            <p style={{ color: '#f59e0b', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, margin: 0 }}>
              Hazril{' '}
              <em style={{ color: '#fb923c', fontStyle: 'italic', fontWeight: 600 }}>"abu_thariq"</em>{' '}
              Firdhanni
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
              Perancang Portal ALSITS · alsits.id · 2026
            </p>
            <div style={{ marginTop: 12, width: '100%', height: 1, background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#cbd5e1', marginTop: 16 }}>
          Dokumen ini bersifat konfidensial dan ditujukan khusus untuk Pengurus ALSITS · Alumni Teknik Sipil ITS
        </p>

      </div>
    </div>
  );
}