import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';

const STATUS_OPTIONS = ['✅ Selesai', '🔍 Ditinjau', '⏳ Menunggu TTD', '❌ Belum'];
const STATUS_COLORS = { '✅ Selesai': '#16a34a', '🔍 Ditinjau': '#2563eb', '⏳ Menunggu TTD': '#d97706', '❌ Belum': '#dc2626' };

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  section: { padding: '28px 48px' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '30%' },
  success: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5, color: '#14532d' },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_PHASE1 = [
  { del: 'UX Research Report — metodologi, 5–10 interview alumni, insight, persona pengguna, benchmark, rekomendasi strategis', fmt: 'PDF / Dokumen digital', link: 'alsits.id/ux-research' },
  { del: 'Competitive Analysis Report — benchmark 4 portal alumni PT serupa (IKA ITS, IKA UI, Brawijaya, ITB)', fmt: 'PDF / Dokumen digital', link: 'alsits.id/competitive-analysis' },
  { del: 'Wireframe & UX Flow — 12 halaman, user journey (5 flow), sitemap arsitektur informasi', fmt: 'Dokumen / Portal Live', link: 'alsits.id/wireframe-prototype' },
  { del: 'UI Design High-Fidelity — mockup lengkap semua halaman (implementasi langsung di portal live)', fmt: 'Portal Live alsits.id', link: 'alsits.id (live)' },
  { del: 'Interactive Prototype — portal alsits.id live dapat diuji langsung (Lean UX approach)', fmt: 'Portal Live', link: 'alsits.id/public-home' },
  { del: 'Design System Documentation — token warna, tipografi, spacing, komponen UI (Tailwind + shadcn/ui)', fmt: 'PDF / Dokumen digital', link: 'alsits.id/design-system' },
  { del: 'Notulen Kick-off Meeting & Rencana Kerja (Project Timeline)', fmt: 'PDF', link: 'alsits.id/notulen-kickoff' },
];

const DEFAULT_PHASE2 = [
  'Platform staging live & dapat diakses di alsits.id (production)',
  'Implementasi design system baru ke seluruh halaman',
  'Redesign navigasi flat IA + mega-menu + responsive mobile-first',
  'Database Alumni — direktori lengkap dengan filter & search',
  'Halaman Profil Mandiri alumni (self-service update foto, jabatan, kontak)',
  'Integrasi API web angkatan S32 & S51 (sync otomatis tiap 30 menit)',
  'Peta Sebaran Alumni — visualisasi domisili & usaha per kota',
  'Dashboard Statistik — grafik angkatan, industri, kota',
  'Business Hub — direktori usaha & portofolio bisnis alumni',
  'Voting System OMOV — event voting, kandidat, DPT, OTP, hasil real-time',
  'Forum Diskusi & E-Library & Lowongan Kerja',
  'Sistem berita, event kegiatan, dan halaman konten statis',
  'DPT Alumni — daftar pemilih yang dapat di-filter dan di-print',
  'Admin Panel — kelola berita, konten, sync data, user management',
];

const DEFAULT_DOC_DATA = [
  ['Nomor BAST', 'BAST-1/ALSITS/DIGITAL/001/2026'],
  ['Tanggal', '[Tanggal penandatanganan]'],
  ['Tempat', '[Jakarta / Surabaya / daring]'],
  ['Nomor SPK Referensi', 'SPK/ALSITS/DIGITAL/001/2026'],
  ['Fase yang Diserahterimakan', 'Phase 1 (Foundation) & Phase 2 (Core Development)'],
  ['Nilai Termin yang Dicairkan', 'Rp 7.000.000,- (Termin 1: Rp 3.000.000 + Termin 2: Rp 4.000.000)'],
];

export default function BAST1() {
  const [editMode, setEditMode] = useState(false);
  const [docData, setDocData] = useState([
    ['Nomor BAST', 'BAST-1/ALSITS/DIGITAL/001/2026'],
    ['Tanggal', '12 Juni 2026'],
    ['Tempat', 'Daring'],
    ['Nomor SPK Referensi', 'SPK/ALSITS/DIGITAL/001/2026'],
    ['Fase yang Diserahterimakan', 'Phase 1 (Foundation) & Phase 2 (Core Development)'],
    ['Nilai Termin yang Dicairkan', 'Rp 7.000.000,- (Termin 1: Rp 3.000.000 + Termin 2: Rp 4.000.000)'],
  ]);
  const [phase1, setPhase1] = useState([
    { del: 'Laporan UX Research — metodologi, temuan, persona pengguna, benchmark, rekomendasi strategis', fmt: 'PDF / Dokumen digital', link: '', status: '✅ Selesai' },
    { del: 'Figma Design System — color tokens, typography scale, component library, spacing & grid', fmt: 'Link Figma / Export PDF', link: '', status: '✅ Selesai' },
    { del: 'Interactive Prototype — demo klik-able 10+ halaman utama', fmt: 'Link Figma Prototype', link: '', status: '✅ Selesai' },
    { del: 'Notulen Kick-off Meeting & Rencana Kerja', fmt: 'PDF', link: '', status: '✅ Selesai' },
  ]);
  const [phase2, setPhase2] = useState([
    { text: 'Platform staging live & dapat diakses di alsits.id (production)', status: '✅ Selesai' },
    { text: 'Implementasi design system baru ke seluruh halaman', status: '✅ Selesai' },
    { text: 'Redesign navigasi flat IA + mega-menu + responsive mobile-first', status: '✅ Selesai' },
    { text: 'Database Alumni — direktori lengkap dengan filter & search', status: '✅ Selesai' },
    { text: 'Halaman Profil Mandiri alumni (self-service update foto, jabatan, kontak)', status: '✅ Selesai' },
    { text: 'Integrasi API web angkatan S32 & S51 (sync otomatis tiap 30 menit)', status: '✅ Selesai' },
    { text: 'Peta Sebaran Alumni — visualisasi domisili & usaha per kota', status: '✅ Selesai' },
    { text: 'Dashboard Statistik — grafik angkatan, industri, kota', status: '✅ Selesai' },
    { text: 'Business Hub — direktori usaha & portofolio bisnis alumni', status: '✅ Selesai' },
    { text: 'Voting System OMOV — event voting, kandidat, DPT, OTP, hasil real-time', status: '✅ Selesai' },
    { text: 'Forum Diskusi & E-Library & Lowongan Kerja', status: '✅ Selesai' },
    { text: 'Sistem berita, event kegiatan, dan halaman konten statis', status: '✅ Selesai' },
    { text: 'DPT Alumni — daftar pemilih yang dapat di-filter dan di-print', status: '✅ Selesai' },
    { text: 'Admin Panel — kelola berita, konten, sync data, user management', status: '✅ Selesai' },
  ]);
  const [catatan, setCatatan] = useState('');
  const [pencairanText, setPencairanText] = useState('Dengan ditandatanganinya BAST ini, PIHAK PERTAMA menyetujui pencairan Termin 2 sebesar Rp 4.000.000,- (Empat Juta Rupiah).');
  const [pernyataanText, setPernyataanText] = useState('PIHAK PERTAMA menyatakan telah memeriksa, menguji, dan menyetujui seluruh deliverable Phase 1 dan Phase 2 di atas. Platform staging dinyatakan memenuhi persyaratan dan PIHAK PERTAMA menyetujui untuk melanjutkan ke Phase 3.');

  // Penandatangan
  const [p1Nama, setP1Nama] = useState('[Nama]');
  const [p1Jabatan, setP1Jabatan] = useState('[Jabatan]');
  const [p1Sub, setP1Sub] = useState('Komisariat Jurusan Alumni Teknik Sipil ITS');
  const [p1Caption, setP1Caption] = useState('Menyatakan menerima & menyetujui deliverable Phase 1 & 2');
  const [p1Tanggal, setP1Tanggal] = useState('[Tempat], [Tanggal] [Bulan] 2026');

  const [p2Nama, setP2Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p2Jabatan, setP2Jabatan] = useState('Developer Portal ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('Kab. Bekasi, 12 Juni 2026');

  const [devSignature, setDevSignature] = useState(null);

  const updDoc = (i, val) => setDocData(rows => rows.map((r, idx) => idx === i ? [r[0], val] : r));
  const updP1 = (i, key, val) => setPhase1(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const cycleP1Status = (i) => setPhase1(rows => rows.map((r, idx) => idx === i ? { ...r, status: STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(r.status) + 1) % STATUS_OPTIONS.length] } : r));
  const updP2 = (i, key, val) => setPhase2(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const cycleP2Status = (i) => setPhase2(rows => rows.map((r, idx) => idx === i ? { ...r, status: STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(r.status) + 1) % STATUS_OPTIONS.length] } : r));

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDevSignature(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Tinggi area TTD yang sama untuk kedua kolom
  const TTD_HEIGHT = 90;

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru · 🗑️ hapus · + tambah</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic' }}>💡 Klik "Cetak / Download PDF" → pilih <strong>"Save as PDF"</strong> di dialog print browser</span>
          <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
        </div>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Proyek · SPK/ALSITS/DIGITAL/001/2026</div>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b', marginBottom: 4 }}>BERITA ACARA SERAH TERIMA 1</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Phase 1 & Phase 2 — Foundation & Core Development</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: BAST-1/ALSITS/DIGITAL/001/2026</p>
        </div>

        <h2 style={S.h2}>Data Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {docData.map(([l, v], i) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, background: '#fff', width: '3%', textAlign: 'center' }}>:</td><td style={S.td}><EditableField value={v} onChange={val => updDoc(i, val)} editMode={editMode} style={{ width: '100%' }} /></td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>A. Deliverable Phase 1 (Foundation)</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '4%' }}>No.</th>
            <th style={S.th}>Deliverable</th>
            <th style={{ ...S.th, width: '16%' }}>Format</th>
            <th style={{ ...S.th, width: '20%' }}>Link / Akses Dokumen</th>
            <th style={{ ...S.th, width: '13%' }}>Status</th>
            {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
          </tr></thead>
          <tbody>
            {phase1.map((row, i) => (
              <tr key={i}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><EditableField value={row.del} onChange={v => updP1(i, 'del', v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={S.td}><EditableField value={row.fmt} onChange={v => updP1(i, 'fmt', v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={S.td}>
                  <EditableField value={row.link || (editMode ? '' : '—')} onChange={v => updP1(i, 'link', v)} editMode={editMode} style={{ width: '100%', color: row.link ? '#0b2d6b' : '#aaa' }} />
                </td>
                <td style={{ ...S.td, textAlign: 'center' }}>
                  <button onClick={() => cycleP1Status(i)} title="Klik untuk ganti status"
                    style={{ fontWeight: 700, fontSize: 11, color: STATUS_COLORS[row.status] || '#16a34a', background: 'transparent', border: `1.5px solid ${STATUS_COLORS[row.status] || '#16a34a'}`, borderRadius: 14, padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {row.status}
                  </button>
                </td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => setPhase1(r => r.filter((_, j) => j !== i))} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={() => setPhase1(r => [...r, { del: 'Deliverable baru', fmt: 'PDF', link: '', status: '⏳ Menunggu TTD' }])} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah deliverable</button>}

        <h2 style={S.h2}>B. Deliverable Phase 2 (Core Development)</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '5%' }}>No.</th>
            <th style={S.th}>Deliverable / Fitur</th>
            <th style={{ ...S.th, width: '14%' }}>Status</th>
            {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
          </tr></thead>
          <tbody>
            {phase2.map((item, i) => (
              <tr key={i}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><EditableField value={item.text} onChange={v => updP2(i, 'text', v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, textAlign: 'center' }}>
                  <button onClick={() => cycleP2Status(i)} title="Klik untuk ganti status"
                    style={{ fontWeight: 700, fontSize: 11, color: STATUS_COLORS[item.status] || '#16a34a', background: 'transparent', border: `1.5px solid ${STATUS_COLORS[item.status] || '#16a34a'}`, borderRadius: 14, padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {item.status}
                  </button>
                </td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => setPhase2(r => r.filter((_, j) => j !== i))} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={() => setPhase2(r => [...r, { text: 'Fitur / deliverable baru', status: '⏳ Menunggu TTD' }])} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah item</button>}

        <div style={S.success}>
          <strong>✅ Pernyataan PIHAK PERTAMA:</strong>{' '}
          <EditableField value={pernyataanText} onChange={setPernyataanText} editMode={editMode} multiline />
        </div>

        <h2 style={S.h2}>Catatan & Revisi (jika ada)</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '12px 16px', minHeight: 80, marginBottom: 16 }}>
          {editMode
            ? <textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="[Diisi oleh PIHAK PERTAMA apabila ada catatan. Kosongkan apabila tidak ada.]"
                style={{ width: '100%', minHeight: 70, fontSize: 11, fontFamily: 'inherit', border: '1.5px solid #93c5fd', borderRadius: 4, padding: '6px 8px', background: '#eff6ff', resize: 'vertical', boxSizing: 'border-box' }} />
            : <p style={{ color: catatan ? '#1a1a1a' : '#aaa', fontStyle: catatan ? 'normal' : 'italic', fontSize: 11, margin: 0 }}>
                {catatan || '[Diisi oleh PIHAK PERTAMA apabila ada catatan. Kosongkan apabila tidak ada.]'}
              </p>
          }
        </div>

        <div className="sign-block" style={{ marginTop: 16 }}>
          <h2 style={S.h2}>Pencairan Termin 2</h2>
          <p style={S.p}>
            <EditableField value={pencairanText} onChange={setPencairanText} editMode={editMode} multiline style={{ width: '100%' }} />
          </p>

          <h2 style={S.h2}>Penandatanganan BAST 1</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>

            {/* PIHAK PERTAMA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK PERTAMA</p>
              <p style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>
                <EditableField value={p1Sub} onChange={setP1Sub} editMode={editMode} />
              </p>
              <p style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 4 }}>
                <EditableField value={p1Caption} onChange={setP1Caption} editMode={editMode} />
              </p>
              {/* Area TTD — fixed height, sama dengan pihak kedua */}
              <div style={{ height: TTD_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              {/* Placeholder tombol agar tinggi sama dengan pihak kedua saat edit mode */}
              <div className="no-print" style={{ height: editMode ? 32 : 0 }} />
              <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>
                  <EditableField value={p1Nama} onChange={setP1Nama} editMode={editMode} />
                </p>
                <p style={{ fontSize: 11, color: '#555' }}>
                  <EditableField value={p1Jabatan} onChange={setP1Jabatan} editMode={editMode} />
                </p>
                <p style={{ fontSize: 11, color: '#888' }}>
                  <EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} />
                </p>
              </div>
            </div>

            {/* PIHAK KEDUA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK KEDUA</p>
              <p style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Developer Portal ALSITS</p>
              <p style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 4 }}>Menyatakan telah menyerahkan deliverable Phase 1 & 2</p>
              {/* Area TTD dengan gambar */}
              <div style={{ height: TTD_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {devSignature
                  ? <img src={devSignature} alt="TTD Developer" style={{ maxHeight: TTD_HEIGHT - 4, maxWidth: 220, objectFit: 'contain' }} />
                  : <div className="no-print" style={{ border: '1.5px dashed #cbd5e1', borderRadius: 6, padding: '8px 20px', color: '#94a3b8', fontSize: 10, fontStyle: 'italic' }}>
                      [tanda tangan]
                    </div>
                }
              </div>
              {/* Tombol upload TTD — hanya saat edit mode */}
              {editMode
                ? <div className="no-print" style={{ display: 'flex', gap: 6, justifyContent: 'center', height: 32, alignItems: 'center' }}>
                    <label style={{ cursor: 'pointer', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#2563eb', fontWeight: 600 }}>
                      📎 Upload TTD
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{ display: 'none' }} />
                    </label>
                    {devSignature && (
                      <button onClick={() => setDevSignature(null)} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>
                        🗑 Hapus
                      </button>
                    )}
                  </div>
                : <div style={{ height: 0 }} />
              }
              <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>
                  <EditableField value={p2Nama} onChange={setP2Nama} editMode={editMode} />
                </p>
                <p style={{ fontSize: 11, color: '#555' }}>
                  <EditableField value={p2Jabatan} onChange={setP2Jabatan} editMode={editMode} />
                </p>
                <p style={{ fontSize: 11, color: '#888' }}>
                  <EditableField value={p2Tanggal} onChange={setP2Tanggal} editMode={editMode} />
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={S.footer}>BAST-1/ALSITS/DIGITAL/001/2026 · Berita Acara Serah Terima Phase 1 & 2 — Portal ALSITS · Konfidensial</div>
    </div>
  );
}