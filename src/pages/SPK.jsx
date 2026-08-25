import React from 'react';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  coverPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px', pageBreakAfter: 'always', borderBottom: '4px solid #0b2d6b' },
  section: { padding: '60px 80px', pageBreakInside: 'avoid' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 28, color: '#0b2d6b', marginBottom: 6 },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 14, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  h3: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#1a1a1a', marginBottom: 8, marginTop: 16 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdLabel: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11 },
  warn: { background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5, color: '#92400e' },
  note: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5, color: '#1e3a8a' },
  signBox: { border: '1px solid #ddd', borderRadius: 8, padding: '16px 20px', minHeight: 120, display: 'inline-block', minWidth: 220, textAlign: 'center', fontSize: 11.5 },
  badge: { display: 'inline-block', background: '#0b2d6b', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 10, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: 1 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '16px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const Row = ({ label, value, colWidths = ['30%', '3%', '67%'] }) => (
  <tr>
    <td style={{ ...S.tdLabel, width: colWidths[0] }}>{label}</td>
    <td style={{ ...S.td, width: colWidths[1], textAlign: 'center', background: '#f5f7fb' }}>:</td>
    <td style={{ ...S.td }}>{value}</td>
  </tr>
);

export default function SPK() {
  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
        @media print {
          @page { size: A4; margin: 12mm 14mm 12mm 14mm; }
          html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
          .sign-block { page-break-inside: avoid; }
        }
      `}</style>

      {/* Print Button */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, display: 'flex', gap: 8 }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          🖨️ Cetak / Simpan PDF
        </button>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          ← Kembali
        </button>
      </div>

      {/* ===== HALAMAN COVER ===== */}
      <div style={{ ...S.coverPage }} className="page-break">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, borderBottom: '3px solid #D4A017', paddingBottom: 20 }}>
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 56 }} />
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="ITS" style={{ height: 48 }} />
            <div style={{ marginLeft: 8 }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 16, color: '#0b2d6b' }}>KOMISARIAT JURUSAN ALUMNI TEKNIK SIPIL ITS</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#555' }}>ALSITS — Alumni Teknik Sipil Institut Teknologi Sepuluh Nopember</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, letterSpacing: 4, color: '#888', marginBottom: 12, textTransform: 'uppercase' }}>Dokumen Resmi</div>
            <h1 style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 36, fontWeight: 900, color: '#0b2d6b', margin: '0 0 8px', letterSpacing: 2 }}>SURAT PERINTAH KERJA</h1>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 700, color: '#D4A017', marginBottom: 32 }}>SPK / ALSITS / DIGITAL / 001 / 2026</div>
            <div style={{ width: 80, height: 4, background: '#D4A017', margin: '0 auto 32px' }} />
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, fontWeight: 700, color: '#0b2d6b' }}>
              REDESIGN &amp; IMPROVEMENT PORTAL ALSITS
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#555', marginTop: 8 }}>alsits.id — Portal Digital Alumni Teknik Sipil ITS</div>
          </div>
        </div>

        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 28px', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontFamily: 'Arial, sans-serif', fontSize: 11.5 }}>
              <div><span style={{ color: '#888' }}>Nomor SPK</span><br /><strong style={{ color: '#0b2d6b' }}>SPK/ALSITS/DIGITAL/001/2026</strong></div>
              <div><span style={{ color: '#888' }}>Tanggal</span><br /><strong>17 Mei 2026, Jakarta</strong></div>
              <div><span style={{ color: '#888' }}>Nilai Total Kontrak</span><br /><strong style={{ color: '#D4A017' }}>Rp 10.000.000,- (Sepuluh Juta Rupiah)</strong></div>
              <div><span style={{ color: '#888' }}>Durasi Pengerjaan</span><br /><strong>±17 Minggu (3 Fase)</strong></div>
            </div>
          </div>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 10.5, color: '#888', textAlign: 'center', fontStyle: 'italic' }}>
            Dokumen ini bersifat konfidensial — ditujukan khusus untuk PARA PIHAK yang disebutkan di dalamnya
          </p>
        </div>
      </div>

      {/* ===== ISI SPK ===== */}
      <div style={S.section}>

        {/* Header identitas */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Nomor: SPK/ALSITS/DIGITAL/001/2026</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#555' }}>Tanggal: Jakarta, 17 Mei 2026</p>
          <p style={{ ...S.p, marginTop: 16, marginBottom: 0 }}>
            Pada hari ini, <strong>Sabtu</strong>, tanggal <strong>17 (tujuh belas)</strong> bulan <strong>Mei</strong> tahun <strong>2026</strong>, yang bertanda tangan di bawah ini:
          </p>
        </div>

        {/* PASAL 1 — PARA PIHAK */}
        <h2 style={S.h2}>Pasal 1 — Para Pihak</h2>

        <h3 style={S.h3}>Pihak Pertama / Pemberi Kerja</h3>
        <table style={S.table}>
          <tbody>
            <Row label="Nama Organisasi" value="Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS)" />
            <Row label="Alamat" value="[Alamat lengkap ALSITS]" />
            <Row label="NPWP/NIK" value="[NPWP/NIK, apabila ada]" />
            <Row label="Diwakili oleh" value="[Nama Ketua / Perwakilan Pengurus]" />
            <Row label="Jabatan" value="[Jabatan dalam organisasi ALSITS]" />
          </tbody>
        </table>
        <p style={{ ...S.p, fontSize: 11, fontStyle: 'italic', marginBottom: 16 }}>Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.</p>

        <h3 style={S.h3}>Pihak Kedua / Penerima Kerja (Developer)</h3>
        <table style={S.table}>
          <tbody>
            <Row label="Nama" value='Hazril "abu_thariq" Firdhanni' />
            <Row label="Alamat" value="[Alamat lengkap Pihak Kedua]" />
            <Row label="NIK" value="[NIK Pihak Kedua]" />
            <Row label="NPWP" value="[NPWP Pihak Kedua, apabila ada]" />
            <Row label="Jabatan/Kapasitas" value="Perancang & Developer Portal ALSITS" />
            <Row label="Email" value="[email@domain.com]" />
          </tbody>
        </table>
        <p style={{ ...S.p, fontSize: 11, fontStyle: 'italic', marginBottom: 16 }}>Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.</p>

        <p style={S.p}>PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama selanjutnya disebut sebagai <strong>PARA PIHAK</strong>.</p>

        {/* PASAL 2 — DASAR PEKERJAAN */}
        <h2 style={S.h2}>Pasal 2 — Dasar Pekerjaan</h2>
        <p style={S.p}>
          Surat Perintah Kerja ini dibuat berdasarkan:
        </p>
        <ol style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={{ marginBottom: 6 }}>Proposal Biaya Final bertanggal Mei 2026 yang telah disepakati PARA PIHAK, dengan nilai total <strong>Rp 10.000.000,- (Sepuluh Juta Rupiah)</strong>;</li>
          <li style={{ marginBottom: 6 }}>Dokumen Paket Deliverable (Dokumen Serah Terima) yang telah disampaikan oleh PIHAK KEDUA kepada PIHAK PERTAMA;</li>
          <li style={{ marginBottom: 6 }}>Kesepakatan lisan dan tertulis antara PARA PIHAK mengenai lingkup pekerjaan Redesign &amp; Improvement Portal ALSITS;</li>
          <li style={{ marginBottom: 6 }}>Fakta bahwa pengerjaan secara nyata telah dimulai dan sebagian besar telah diselesaikan oleh PIHAK KEDUA sebelum penandatanganan SPK ini, sebagai bentuk itikad baik dan pengabdian kepada almamater.</li>
        </ol>

        {/* PASAL 3 — LINGKUP PEKERJAAN */}
        <h2 style={S.h2}>Pasal 3 — Lingkup & Deskripsi Pekerjaan</h2>
        <p style={S.p}>
          PIHAK PERTAMA dengan ini menugaskan PIHAK KEDUA untuk melaksanakan pekerjaan <strong>Redesign &amp; Improvement Portal Digital ALSITS</strong> (selanjutnya disebut "Pekerjaan") dengan lingkup sebagai berikut:
        </p>

        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '8%' }}>Fase</th>
              <th style={{ ...S.th, width: '22%' }}>Nama Fase</th>
              <th style={{ ...S.th, width: '50%' }}>Lingkup Pekerjaan</th>
              <th style={{ ...S.th, width: '10%' }}>Durasi</th>
              <th style={{ ...S.th, width: '10%' }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}><strong>1</strong></td>
              <td style={S.td}><strong>Foundation</strong></td>
              <td style={S.td}>UX Research & User Interview (5–10 alumni), Competitive Analysis & Benchmark, Wireframe & UX Flow (10+ halaman), UI Design High-Fidelity + Design System (Figma), Interactive Prototype + User Testing</td>
              <td style={S.td}>±7 minggu</td>
              <td style={S.td}><strong>Rp 3.000.000</strong></td>
            </tr>
            <tr>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>2</strong></td>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>Core Development</strong></td>
              <td style={{ ...S.td, background: '#f8fafc' }}>Implementasi design system ke seluruh halaman, redesign navigasi flat IA, mobile-first responsive semua halaman, global search bar, halaman profil mandiri alumni (self-service), sistem notifikasi in-app, onboarding flow anggota baru, integrasi data web angkatan (S32, S51) via API</td>
              <td style={{ ...S.td, background: '#f8fafc' }}>±9 minggu</td>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>Rp 4.000.000</strong></td>
            </tr>
            <tr>
              <td style={S.td}><strong>3</strong></td>
              <td style={S.td}><strong>Intelligence & Launch</strong></td>
              <td style={S.td}>Dashboard analitik dinamis, Progressive Web App (PWA), fitur Business Hub, Voting System OMOV, performance optimization & SEO, testing menyeluruh (functional, responsive, cross-browser), deployment production, monitoring setup, training admin ALSITS (2 sesi), dokumentasi teknis & user guide lengkap</td>
              <td style={S.td}>±6 minggu</td>
              <td style={S.td}><strong>Rp 3.000.000</strong></td>
            </tr>
            <tr style={{ background: '#0b2d6b' }}>
              <td style={{ ...S.td, background: '#0b2d6b', color: '#fff', fontWeight: 700, textAlign: 'center' }} colSpan={4}><strong>TOTAL NILAI PEKERJAAN</strong></td>
              <td style={{ ...S.td, background: '#D4A017', color: '#fff', fontWeight: 900, fontSize: 13 }}><strong>Rp 10.000.000</strong></td>
            </tr>
          </tbody>
        </table>

        <div style={S.note}>
          <strong>Catatan Penting:</strong> Nilai di atas belum termasuk biaya langganan platform/hosting (Base44), domain (alsits.id), dan layanan pihak ketiga lainnya yang dibayarkan oleh PIHAK KEDUA atas nama proyek. Biaya-biaya tersebut akan ditagihkan secara terpisah sebagaimana diatur dalam Pasal 7.
        </div>

        {/* PASAL 4 — NILAI & TERMIN PEMBAYARAN */}
        <h2 style={S.h2}>Pasal 4 — Nilai Kontrak & Skema Pembayaran</h2>
        <p style={S.p}>
          Nilai total Pekerjaan adalah sebesar <strong>Rp 10.000.000,- (Sepuluh Juta Rupiah)</strong>, dibayarkan dalam 3 (tiga) termin sebagai berikut:
        </p>

        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '8%' }}>Termin</th>
              <th style={{ ...S.th, width: '18%' }}>Nama</th>
              <th style={{ ...S.th, width: '35%' }}>Syarat Pembayaran</th>
              <th style={{ ...S.th, width: '15%' }}>Persentase</th>
              <th style={{ ...S.th, width: '15%' }}>Jumlah</th>
              <th style={{ ...S.th, width: '9%' }}>Batas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}><strong>1</strong></td>
              <td style={S.td}><strong>Down Payment</strong></td>
              <td style={S.td}>Dibayarkan paling lambat 7 (tujuh) hari kalender setelah penandatanganan SPK ini. Merupakan syarat dimulainya pengerjaan formal (kick-off meeting).</td>
              <td style={S.td}>30%</td>
              <td style={S.td}><strong>Rp 3.000.000</strong></td>
              <td style={S.td}>7 hari setelah TTD</td>
            </tr>
            <tr>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>2</strong></td>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>Termin II</strong></td>
              <td style={{ ...S.td, background: '#f8fafc' }}>Dibayarkan setelah Phase 2 selesai: platform staging tersedia, didemonstrasikan kepada PIHAK PERTAMA, dan PIHAK PERTAMA menyatakan persetujuan secara tertulis (BAST 1 ditandatangani).</td>
              <td style={{ ...S.td, background: '#f8fafc' }}>40%</td>
              <td style={{ ...S.td, background: '#f8fafc' }}><strong>Rp 4.000.000</strong></td>
              <td style={{ ...S.td, background: '#f8fafc' }}>7 hari setelah BAST 1</td>
            </tr>
            <tr>
              <td style={S.td}><strong>3</strong></td>
              <td style={S.td}><strong>Pelunasan</strong></td>
              <td style={S.td}>Dibayarkan setelah Phase 3 selesai: platform live di production, training admin selesai, seluruh dokumentasi dan aset diserahkan, dan BAST Akhir ditandatangani PARA PIHAK.</td>
              <td style={S.td}>30%</td>
              <td style={S.td}><strong>Rp 3.000.000</strong></td>
              <td style={S.td}>7 hari setelah BAST Akhir</td>
            </tr>
          </tbody>
        </table>

        <div style={S.warn}>
          <strong>⚠️ Keterlambatan Pembayaran:</strong> Apabila PIHAK PERTAMA terlambat melakukan pembayaran melebihi batas waktu yang disepakati tanpa pemberitahuan tertulis, PIHAK KEDUA berhak menghentikan sementara pengerjaan hingga pembayaran diterima, tanpa dianggap wanprestasi.
        </div>

        {/* PASAL 5 — DELIVERABLES */}
        <h2 style={S.h2}>Pasal 5 — Dokumen & Aset yang Diserahterimakan</h2>
        <p style={S.p}>PIHAK KEDUA berkewajiban menyerahkan seluruh hasil pekerjaan kepada PIHAK PERTAMA, yang terdiri dari:</p>

        <h3 style={S.h3}>A. Deliverable Phase 1 (diserahkan bersama BAST 1):</h3>
        <ul style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Laporan UX Research (metodologi, temuan, persona pengguna, rekomendasi)</li>
          <li style={{ marginBottom: 4 }}>Figma Design System (color tokens, typography, component library, spacing guide)</li>
          <li style={{ marginBottom: 4 }}>Interactive Prototype (link Figma / export)</li>
          <li style={{ marginBottom: 4 }}>Notulen Kick-off Meeting dan Rencana Kerja (project timeline)</li>
          <li style={{ marginBottom: 4 }}>Platform staging yang siap direview oleh PIHAK PERTAMA</li>
        </ul>

        <h3 style={S.h3}>B. Deliverable Phase 3 / BAST Akhir:</h3>
        <ul style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Source code lengkap (ZIP seluruh file proyek / akses GitHub repository)</li>
          <li style={{ marginBottom: 4 }}>Dokumentasi teknis (stack teknologi, API docs, panduan deployment, struktur database)</li>
          <li style={{ marginBottom: 4 }}>User guide untuk admin dan admin_cs (PDF)</li>
          <li style={{ marginBottom: 4 }}>Panduan maintenance dan troubleshooting</li>
          <li style={{ marginBottom: 4 }}>Seluruh dokumen akses, kredensial, password, dan konfigurasi deployment</li>
          <li style={{ marginBottom: 4 }}>Backup data alumni (JSON/CSV export)</li>
          <li style={{ marginBottom: 4 }}>Akses dashboard Base44 (transfer ownership kepada PIHAK PERTAMA)</li>
          <li style={{ marginBottom: 4 }}>Aset desain (file Figma, gambar, logo, ikon yang digunakan)</li>
          <li style={{ marginBottom: 4 }}>Laporan training admin (2 sesi) beserta materi pelatihan</li>
        </ul>

        <div style={S.note}>
          <strong>Catatan Kepemilikan:</strong> Seluruh deliverable di atas menjadi <strong>hak milik penuh PIHAK PERTAMA</strong> setelah pelunasan Termin 3 diterima oleh PIHAK KEDUA. Sebelum pelunasan, PIHAK KEDUA mempertahankan hak kepemilikan intelektual atas semua hasil pekerjaan.
        </div>

        {/* PASAL 6 — JANGKA WAKTU */}
        <h2 style={S.h2}>Pasal 6 — Jangka Waktu Pelaksanaan</h2>
        <p style={S.p}>
          Pekerjaan dilaksanakan dalam jangka waktu <strong>±17 (tujuh belas) minggu</strong> terhitung sejak tanggal Down Payment diterima, dengan rincian:
        </p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Fase</th>
              <th style={S.th}>Durasi</th>
              <th style={S.th}>Milestone / Output</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={S.td}>Phase 1: Foundation</td><td style={S.td}>Minggu 1–7</td><td style={S.td}>Laporan UX Research, Design System Figma, Prototype</td></tr>
            <tr><td style={{ ...S.td, background: '#f8fafc' }}>Phase 2: Core Development</td><td style={{ ...S.td, background: '#f8fafc' }}>Minggu 7–16</td><td style={{ ...S.td, background: '#f8fafc' }}>Platform staging live, BAST 1 ditandatangani</td></tr>
            <tr><td style={S.td}>Phase 3: Intelligence & Launch</td><td style={S.td}>Minggu 14–17</td><td style={S.td}>Platform production live, training selesai, BAST Akhir</td></tr>
          </tbody>
        </table>
        <p style={{ ...S.p, fontSize: 11, fontStyle: 'italic' }}>
          Mempertimbangkan bahwa pengerjaan telah dimulai sejak awal 2026, penandatanganan SPK ini bersifat retroaktif dan melegalisasi seluruh pekerjaan yang telah dan sedang berlangsung.
        </p>

        {/* PASAL 7 — BIAYA TAMBAHAN */}
        <h2 style={S.h2}>Pasal 7 — Biaya Operasional & Pengeluaran Pihak Kedua</h2>
        <p style={S.p}>
          Selain nilai kontrak sebagaimana dimaksud dalam Pasal 4, PIHAK PERTAMA bertanggung jawab atas penggantian biaya-biaya operasional yang telah dan/atau akan dikeluarkan oleh PIHAK KEDUA dalam rangka pelaksanaan pekerjaan, yang meliputi:
        </p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '5%' }}>No.</th>
              <th style={{ ...S.th, width: '40%' }}>Jenis Biaya</th>
              <th style={{ ...S.th, width: '35%' }}>Keterangan</th>
              <th style={{ ...S.th, width: '20%' }}>Mekanisme</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', 'Biaya Langganan Platform (Base44)', 'Biaya langganan bulanan/tahunan platform hosting Base44 yang digunakan sebagai infrastruktur portal alsits.id', 'Tagihan bulanan disertai bukti pembayaran'],
              ['2', 'Biaya Domain (alsits.id)', 'Biaya registrasi dan/atau perpanjangan domain alsits.id per tahun', 'Tagihan tahunan disertai bukti'],
              ['3', 'Biaya Layanan Pihak Ketiga', 'Biaya API, storage tambahan, atau layanan lain yang diperlukan untuk operasional portal', 'Tagihan per kejadian disertai bukti'],
              ['4', 'Biaya Transportasi & Operasional', 'Biaya yang timbul dalam rangka koordinasi, rapat, atau training yang disepakati PARA PIHAK', 'Berdasarkan kesepakatan sebelumnya'],
            ].map(([no, jenis, ket, mek]) => (
              <tr key={no}>
                <td style={{ ...S.td, textAlign: 'center' }}>{no}</td>
                <td style={S.td}><strong>{jenis}</strong></td>
                <td style={S.td}>{ket}</td>
                <td style={S.td}>{mek}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={S.p}>
          Penagihan biaya-biaya di atas dilakukan oleh PIHAK KEDUA dengan menyertakan <strong>bukti pembayaran (receipt/invoice) yang sah</strong>. PIHAK PERTAMA wajib melakukan penggantian dalam waktu <strong>14 (empat belas) hari kalender</strong> setelah menerima tagihan beserta buktinya.
        </p>

        {/* PASAL 8 — PERUBAHAN LINGKUP */}
        <h2 style={S.h2}>Pasal 8 — Perubahan Lingkup Pekerjaan (Change Request)</h2>
        <p style={S.p}>
          Apabila PIHAK PERTAMA menginginkan penambahan fitur baru atau perubahan besar yang berada di luar lingkup pekerjaan yang telah disepakati dalam SPK ini, maka berlaku ketentuan berikut:
        </p>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>PIHAK PERTAMA menyampaikan permintaan perubahan (<em>change request</em>) secara tertulis kepada PIHAK KEDUA;</li>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA akan memberikan estimasi biaya dan waktu tambahan dalam waktu 5 (lima) hari kerja;</li>
          <li style={{ marginBottom: 6 }}>Perubahan lingkup baru dilaksanakan <strong>hanya setelah</strong> PARA PIHAK menyepakati penambahan biaya dan waktu secara tertulis (Addendum SPK);</li>
          <li style={{ marginBottom: 6 }}>Perubahan minor (penyesuaian desain, teks, warna) tidak dianggap sebagai perubahan lingkup dan termasuk dalam revisi yang sudah ditanggung dalam kontrak ini;</li>
          <li style={{ marginBottom: 6 }}>Estimasi biaya tambahan untuk fitur baru: <strong>Rp 200.000 – Rp 2.000.000 per fitur</strong>, tergantung kompleksitas, disepakati per kasus.</li>
        </ol>

        {/* PASAL 9 — HAK & KEWAJIBAN */}
        <h2 style={S.h2}>Pasal 9 — Hak dan Kewajiban Para Pihak</h2>

        <h3 style={S.h3}>Kewajiban PIHAK KEDUA:</h3>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Melaksanakan pekerjaan sesuai dengan lingkup, standar kualitas, dan jadwal yang disepakati;</li>
          <li style={{ marginBottom: 4 }}>Melaporkan perkembangan pekerjaan secara berkala kepada PIHAK PERTAMA;</li>
          <li style={{ marginBottom: 4 }}>Memberikan support teknis selama <strong>3 (tiga) bulan</strong> setelah go-live tanpa biaya tambahan, meliputi perbaikan bug dan pertanyaan penggunaan;</li>
          <li style={{ marginBottom: 4 }}>Menjaga kerahasiaan data alumni dan informasi internal ALSITS;</li>
          <li style={{ marginBottom: 4 }}>Menyerahkan seluruh aset dan akses kepada PIHAK PERTAMA setelah pelunasan.</li>
        </ol>

        <h3 style={S.h3}>Hak PIHAK KEDUA:</h3>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Menerima pembayaran sesuai termin dan jadwal yang disepakati;</li>
          <li style={{ marginBottom: 4 }}>Menerima penggantian biaya operasional (platform, domain, layanan pihak ketiga) yang dikeluarkan atas nama proyek;</li>
          <li style={{ marginBottom: 4 }}>Menghentikan sementara pengerjaan apabila terjadi keterlambatan pembayaran tanpa pemberitahuan;</li>
          <li style={{ marginBottom: 4 }}>Mendapatkan surat rekomendasi/keterangan dari PIHAK PERTAMA atas pekerjaan yang telah diselesaikan;</li>
          <li style={{ marginBottom: 4 }}>Mencantumkan pekerjaan ini sebagai portofolio dengan seizin PIHAK PERTAMA.</li>
        </ol>

        <h3 style={S.h3}>Kewajiban PIHAK PERTAMA:</h3>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Melakukan pembayaran sesuai termin dan jadwal yang disepakati;</li>
          <li style={{ marginBottom: 4 }}>Mengganti biaya operasional yang dikeluarkan PIHAK KEDUA dengan bukti valid;</li>
          <li style={{ marginBottom: 4 }}>Memberikan feedback/persetujuan dalam waktu <strong>7 (tujuh) hari kerja</strong> setiap kali PIHAK KEDUA menyerahkan hasil pekerjaan untuk direview;</li>
          <li style={{ marginBottom: 4 }}>Menyediakan informasi, data, dan materi yang diperlukan PIHAK KEDUA untuk pelaksanaan pekerjaan;</li>
          <li style={{ marginBottom: 4 }}>Menunjuk penanggungjawab/koordinator proyek dari pihak ALSITS.</li>
        </ol>

        {/* PASAL 10 — KEPEMILIKAN INTELEKTUAL */}
        <h2 style={S.h2}>Pasal 10 — Hak Kekayaan Intelektual</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>Seluruh hasil pekerjaan menjadi <strong>hak milik penuh PIHAK PERTAMA</strong> setelah pelunasan Termin 3 diterima;</li>
          <li style={{ marginBottom: 6 }}>PIHAK PERTAMA bebas memodifikasi, mengembangkan, atau memindahkan platform ke infrastruktur lain tanpa persetujuan tambahan dari PIHAK KEDUA;</li>
          <li style={{ marginBottom: 6 }}>Komponen open-source yang digunakan (React, Tailwind CSS, shadcn/ui, dll.) tunduk pada lisensi masing-masing (MIT/ISC/BSD);</li>
          <li style={{ marginBottom: 6 }}>Sebelum pelunasan, PIHAK KEDUA mempertahankan hak kepemilikan atas seluruh kode dan desain yang dibuat, dan PIHAK PERTAMA tidak berhak mengalihkan atau menyebarkan hasil pekerjaan kepada pihak lain;</li>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA berhak menyebut proyek ini sebagai bagian dari portofolio profesionalnya dengan cara yang tidak merugikan PIHAK PERTAMA.</li>
        </ol>

        {/* PASAL 11 — KERAHASIAAN */}
        <h2 style={S.h2}>Pasal 11 — Kerahasiaan Data</h2>
        <p style={S.p}>
          PIHAK KEDUA berkewajiban menjaga kerahasiaan seluruh data alumni, informasi keuangan, data organisasi, dan informasi internal lainnya yang diperoleh selama pelaksanaan pekerjaan. Kewajiban kerahasiaan ini berlaku selama masa kontrak dan tetap berlaku setelah berakhirnya SPK ini. PIHAK KEDUA tidak diperkenankan menggunakan data tersebut untuk kepentingan di luar pelaksanaan pekerjaan ini.
        </p>

        {/* PASAL 12 — FORCE MAJEURE */}
        <h2 style={S.h2}>Pasal 12 — Keadaan Kahar (Force Majeure)</h2>
        <p style={S.p}>
          Keterlambatan pelaksanaan pekerjaan yang disebabkan oleh keadaan kahar (<em>force majeure</em>) — seperti bencana alam, gangguan layanan platform pihak ketiga di luar kendali PIHAK KEDUA, atau kondisi darurat nasional — tidak dianggap sebagai wanprestasi. PARA PIHAK akan berunding dalam waktu 7 (tujuh) hari untuk menetapkan penyesuaian jadwal yang wajar.
        </p>

        {/* PASAL 13 — PENYELESAIAN PERSELISIHAN */}
        <h2 style={S.h2}>Pasal 13 — Penyelesaian Perselisihan</h2>
        <p style={S.p}>
          Apabila terjadi perselisihan dalam pelaksanaan SPK ini, PARA PIHAK sepakat untuk menyelesaikannya secara musyawarah mufakat terlebih dahulu. Apabila tidak tercapai kesepakatan dalam waktu 30 (tiga puluh) hari, maka perselisihan diselesaikan sesuai hukum yang berlaku di Republik Indonesia.
        </p>

        {/* PASAL 14 — GARANSI & PEMELIHARAAN */}
        <h2 style={S.h2}>Pasal 14 — Jaminan Kualitas & Garansi Pemeliharaan</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA memberikan jaminan bahwa platform yang diserahkan bebas dari bug kritis pada saat serah terima (BAST Akhir);</li>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA memberikan garansi pemeliharaan gratis selama <strong>3 (tiga) bulan</strong> terhitung sejak tanggal BAST Akhir ditandatangani, yang mencakup: perbaikan bug, error, dan gangguan teknis yang bukan disebabkan oleh perubahan yang dilakukan PIHAK PERTAMA secara mandiri;</li>
          <li style={{ marginBottom: 6 }}>Permintaan pemeliharaan disampaikan melalui saluran komunikasi yang disepakati (WhatsApp/email), dan PIHAK KEDUA merespons dalam waktu <strong>2 × 24 jam</strong> pada hari kerja;</li>
          <li style={{ marginBottom: 6 }}>Setelah masa garansi berakhir, layanan pemeliharaan dapat dilanjutkan berdasarkan kesepakatan terpisah.</li>
        </ol>

        {/* PASAL 15 — KOMUNIKASI */}
        <h2 style={S.h2}>Pasal 15 — Saluran Komunikasi Resmi</h2>
        <p style={S.p}>
          Seluruh komunikasi, pemberitahuan, dan persetujuan dalam rangka pelaksanaan SPK ini dilakukan melalui saluran berikut:
        </p>
        <table style={S.table}>
          <tbody>
            <Row label="Komunikasi Harian" value="WhatsApp (grup proyek atau DM resmi yang disepakati)" />
            <Row label="Dokumen Resmi" value="Email resmi PARA PIHAK (pemberitahuan penting, serah terima, perubahan lingkup)" />
            <Row label="Laporan Progres" value="Minimal 1 (satu) kali per minggu, disampaikan melalui WhatsApp atau email" />
            <Row label="Review & Approval" value="Dilakukan paling lambat 7 (tujuh) hari kerja setelah deliverable dikirimkan" />
          </tbody>
        </table>

        {/* PASAL 16 — SURAT KETERANGAN */}
        <h2 style={S.h2}>Pasal 16 — Surat Keterangan & Portofolio</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>PIHAK PERTAMA bersedia menerbitkan <strong>Surat Keterangan / Surat Rekomendasi</strong> kepada PIHAK KEDUA atas pekerjaan yang telah diselesaikan, paling lambat 14 (empat belas) hari kalender setelah BAST Akhir ditandatangani;</li>
          <li style={{ marginBottom: 6 }}>Surat Keterangan tersebut mencantumkan lingkup pekerjaan, periode pengerjaan, dan pernyataan kepuasan PIHAK PERTAMA atas hasil kerja PIHAK KEDUA;</li>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA diperkenankan mencantumkan proyek ini sebagai bagian dari portofolio profesional, dengan ketentuan tidak mengungkapkan informasi konfidensial seperti data alumni atau rincian keuangan.</li>
        </ol>

        {/* PASAL 17 — KETENTUAN UMUM */}
        <h2 style={S.h2}>Pasal 17 — Ketentuan Umum</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>SPK ini merupakan keseluruhan kesepakatan antara PARA PIHAK mengenai pokok pekerjaan yang disebutkan dan menggantikan seluruh komunikasi atau perjanjian sebelumnya mengenai hal yang sama;</li>
          <li style={{ marginBottom: 6 }}>Apabila terdapat ketentuan dalam SPK ini yang bertentangan dengan peraturan perundang-undangan yang berlaku, maka ketentuan tersebut tidak berlaku, namun tidak mempengaruhi keabsahan ketentuan lainnya;</li>
          <li style={{ marginBottom: 6 }}>Perubahan atau penambahan terhadap SPK ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh PARA PIHAK dalam bentuk Addendum;</li>
          <li style={{ marginBottom: 6 }}>SPK ini tunduk pada dan diinterpretasikan sesuai dengan hukum yang berlaku di Republik Indonesia.</li>
        </ol>

        {/* PASAL 18 — PEMUTUSAN KONTRAK */}
        <h2 style={S.h2}>Pasal 18 — Pemutusan Kontrak</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 6 }}>PIHAK PERTAMA dapat mengakhiri SPK ini sewaktu-waktu dengan pemberitahuan tertulis <strong>14 (empat belas) hari kalender</strong> sebelumnya. Seluruh pembayaran termin yang sudah diterima PIHAK KEDUA tidak dapat diminta kembali, dan PIHAK KEDUA berhak atas pembayaran proporsional atas pekerjaan yang telah diselesaikan;</li>
          <li style={{ marginBottom: 6 }}>PIHAK KEDUA dapat mengakhiri SPK ini apabila PIHAK PERTAMA tidak melakukan pembayaran melebihi <strong>30 (tiga puluh) hari kalender</strong> dari batas waktu yang disepakati, setelah sebelumnya memberikan peringatan tertulis setidaknya 1 (satu) kali. PIHAK KEDUA berhak menahan seluruh aset hingga pembayaran diselesaikan;</li>
          <li style={{ marginBottom: 6 }}>Dalam hal pemutusan kontrak karena alasan apapun, PARA PIHAK sepakat untuk berkoordinasi secara baik-baik terkait serah terima aset yang telah selesai dikerjakan.</li>
        </ol>

        {/* PASAL 19 — LAMPIRAN */}
        <h2 style={S.h2}>Pasal 19 — Lampiran</h2>
        <p style={S.p}>Dokumen berikut menjadi bagian yang tidak terpisahkan dari SPK ini:</p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '12%' }}>No. Lampiran</th>
              <th style={{ ...S.th, width: '30%' }}>Judul Dokumen</th>
              <th style={{ ...S.th }}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Lampiran 1', 'Proposal Biaya Final 2026', 'Redesign & Improvement Portal ALSITS / ALSITS Connect — dokumen yang menjadi dasar penetapan nilai kontrak, lingkup pekerjaan, dan skema pembayaran.'],
              ['Lampiran 2', 'Scope of Work & Daftar Deliverables', 'Dokumen rinci yang menjabarkan seluruh fitur, modul, dan aset yang wajib diserahkan PIHAK KEDUA pada setiap fase pekerjaan.'],
              ['Lampiran 3', 'Jadwal & Milestone Pekerjaan', 'Timeline pelaksanaan per fase beserta target tanggal selesai masing-masing milestone, sebagaimana tertuang dalam Pasal 6 SPK ini.'],
              ['Lampiran 4', 'Format BAST-1 dan BAST Akhir', 'Template resmi Berita Acara Serah Terima Fase 1 dan Berita Acara Serah Terima Akhir, yang wajib ditandatangani PARA PIHAK sebagai syarat pencairan Termin 2 dan Termin 3.'],
              ['Lampiran 5', 'Daftar Aset Serah Terima Akhir', 'Daftar lengkap akses, source code, kredensial, password, file konfigurasi, aset desain, backup data, dan dokumentasi teknis yang wajib diserahkan PIHAK KEDUA kepada PIHAK PERTAMA pada saat BAST Akhir.'],
            ].map(([no, judul, ket]) => (
              <tr key={no}>
                <td style={{ ...S.tdLabel, textAlign: 'center' }}>{no}</td>
                <td style={S.td}><strong>{judul}</strong></td>
                <td style={S.td}>{ket}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={S.note}>
          <strong>Catatan:</strong> Apabila terdapat perbedaan antara isi lampiran dan isi pasal-pasal dalam SPK ini, maka isi SPK (pasal-pasal di atas) yang diutamakan, kecuali lampiran tersebut merupakan addendum yang secara eksplisit menyatakan perubahan terhadap ketentuan SPK.
        </div>

        {/* PASAL 20 — PENUTUP */}
        <h2 style={S.h2}>Pasal 20 — Penutup</h2>
        <p style={S.p}>
          SPK ini dibuat dalam 2 (dua) rangkap asli, masing-masing bermeterai cukup, dan memiliki kekuatan hukum yang sama. Satu rangkap dipegang oleh PIHAK PERTAMA dan satu rangkap oleh PIHAK KEDUA. SPK ini berlaku sejak tanggal penandatanganan dan mengikat PARA PIHAK beserta penerus hak dan kewajibannya.
        </p>

        {/* TANDA TANGAN */}
        <h2 style={S.h2}>Penandatanganan</h2>
        <p style={{ ...S.p, marginBottom: 24 }}>Demikian Surat Perintah Kerja ini dibuat dan ditandatangani pada hari, tanggal, dan tempat sebagaimana tersebut di atas:</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 4 }}>PIHAK PERTAMA</p>
            <p style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS)</p>
            <p style={{ fontSize: 11, color: '#555', marginBottom: 60 }}>Diwakili oleh:</p>
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>[Nama]</p>
              <p style={{ fontSize: 11, color: '#555' }}>[Jabatan]</p>
              <p style={{ fontSize: 11, color: '#888' }}>Jakarta, 17 Mei 2026</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 4 }}>PIHAK KEDUA</p>
            <p style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Perancang & Developer Portal ALSITS</p>
            <p style={{ fontSize: 11, color: '#555', marginBottom: 60 }}>Diwakili oleh:</p>
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>Hazril "abu_thariq" Firdhanni</p>
              <p style={{ fontSize: 11, color: '#555' }}>Developer Portal ALSITS</p>
              <p style={{ fontSize: 11, color: '#888' }}>Jakarta, 17 Mei 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div style={S.footer}>
        SPK/ALSITS/DIGITAL/001/2026 · Redesign &amp; Improvement Portal ALSITS · Jakarta, 17 Mei 2026 · Konfidensial
      </div>
    </div>
  );
}