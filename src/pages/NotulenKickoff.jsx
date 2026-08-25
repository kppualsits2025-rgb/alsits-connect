import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  section: { padding: '28px 48px' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 24, color: '#0b2d6b' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  h3: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, color: '#1a1a1a', marginBottom: 8, marginTop: 14 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_INFO = [
  ['Nomor Dokumen', 'NOTUL-KO/001/SPK-KOMJUR-ALSITS/VI/2026'],
  ['Tanggal Rapat', '08 Juni 2026'],
  ['Tempat', 'Daring by WA chat/call'],
  ['Dipimpin oleh', 'Hazril Firdhanni (PIHAK KEDUA / Developer)'],
  ['Dihadiri oleh', 'Harum Akhmad Zuhdi — Ketua Komisariat Jurusan Sipil ITS\nGunawan Wibisono — Sekjen Komisariat Jurusan Sipil ITS'],
  ['Dicatat oleh', 'Hazril Firdhanni'],
];

const DEFAULT_AGENDA = [
  'Pembukaan dan perkenalan PARA PIHAK',
  'Penandatanganan SPK No. 001/SPK-KOMJUR-ALSITS/VI/2026',
  'Pemaparan lingkup pekerjaan (3 fase) dan deliverable tiap fase',
  'Pembahasan rencana kerja dan jadwal timeline',
  'Penetapan skema pembayaran dan mekanisme tagihan',
  'Penetapan narahubung/koordinator dari masing-masing pihak',
  'Mekanisme pelaporan progress dan review pekerjaan',
  'Tanya jawab dan kesepakatan akhir',
];

const DEFAULT_PHASES = [
  {
    phase: 'Phase 1', name: 'Foundation', minggu: '', nilai: 'Rp 3.000.000',
    items: [
      ['09 Juni 2026', 'UX Research & User Interview (5–10 alumni representatif)'],
      ['10 Juni 2026', 'Competitive Analysis & Benchmark (4 platform alumni PT)'],
      ['11 Juni 2026', 'Wireframe & UX Flow (10+ halaman)'],
      ['12 Juni 2026', 'UI Design High-Fidelity + Design System (Figma)'],
      ['15 Juni 2026', 'Interactive Prototype + User Testing & revisi'],
    ]
  },
  {
    phase: 'Phase 2', name: 'Core Development', minggu: '', nilai: 'Rp 4.000.000',
    items: [
      ['16 Juni 2026', 'Implementasi design system baru ke seluruh halaman'],
      ['17 Juni 2026', 'Redesign navigasi: flat IA, mega-menu, breadcrumb'],
      ['17 Juni 2026', 'Mobile-first responsive redesign semua halaman'],
      ['18 Juni 2026', 'Global Search bar (alumni, berita, lowongan, forum)'],
      ['19 Juni 2026', 'Halaman Profil Mandiri alumni (self-service update)'],
      ['20 Juni 2026', 'Integrasi API web angkatan S32, S51 + sync otomatis'],
      ['20 Juni 2026', 'Business Hub, Voting OMOV, Forum, sistem notifikasi'],
      ['22 Juni 2026', 'Staging review, penyesuaian, BAST 1'],
    ]
  },
  {
    phase: 'Phase 3', name: 'Intelligence & Launch', minggu: '', nilai: 'Rp 3.000.000',
    items: [
      ['22 Juni 2026 - 30 Juni 2026', 'Dashboard analitik dinamis (DPT, peta sebaran, statistik)'],
      ['01 Juli 2026 - 07 Juli 2026', 'Performance optimization & SEO on-page'],
      ['08 Juli 2026 - 22 Juli 2026', 'Testing menyeluruh: functional, responsive, cross-browser'],
      ['23 Juli 2026 - 31 Juli 2026', 'Deployment production + monitoring setup'],
      ['01 Agustus 2026 - 16 Agustus 2026', 'Training admin ALSITS (2 sesi) + penyusunan dokumentasi'],
      ['17 Agustus 2026', 'Serah terima dokumen & akses, BAST Akhir'],
    ]
  }
];

export default function NotulenKickoff() {
  const [editMode, setEditMode] = useState(false);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [agenda, setAgenda] = useState(DEFAULT_AGENDA);
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [devSignature, setDevSignature] = useState(null);

  // Koordinator
  const [koordinator1Nama, setKoordinator1Nama] = useState('Gunawan Wibisono');
  const [koordinator1Kontak, setKoordinator1Kontak] = useState('+62 821-2389-9311');
  const [koordinator2Kontak, setKoordinator2Kontak] = useState('+62 817-0350-2778');

  // Signing
  const [p1Nama, setP1Nama] = useState('[Nama]');
  const [p1Jabatan, setP1Jabatan] = useState('[Jabatan]');
  const [p1Tanggal, setP1Tanggal] = useState('Jakarta, 08 Juni 2026');
  const [p2Tanggal, setP2Tanggal] = useState('Jakarta, 08 Juni 2026');

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDevSignature(ev.target.result);
    reader.readAsDataURL(file);
  };

  const updInfo = (i, val) => setInfo(rows => rows.map((r, idx) => idx === i ? [r[0], val] : r));
  const updAgenda = (i, val) => setAgenda(rows => rows.map((r, idx) => idx === i ? val : r));
  const updPhaseItem = (pi, ii, col, val) => setPhases(ph => ph.map((p, pi2) => pi2 !== pi ? p : {
    ...p, items: p.items.map((it, ii2) => ii2 !== ii ? it : it.map((v, c) => c === col ? val : v))
  }));

  const TTD_HEIGHT = 90;

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } }`}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / PDF</button>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru · 🗑️ hapus · + tambah</span>}
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Proyek · 001/SPK-KOMJUR-ALSITS/VI/2026</div>
          <h1 style={{ ...S.h1, fontSize: 22 }}>NOTULEN KICK-OFF MEETING</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Redesign & Improvement Portal ALSITS</p>
        </div>

        {/* Info Meeting */}
        <h2 style={S.h2}>Informasi Rapat</h2>
        <table style={S.table}>
          <tbody>
            {info.map(([l, v], i) => (
              <tr key={l}>
                <td style={S.tdL}>{l}</td>
                <td style={{ ...S.td, background: '#fff', width: '3%', textAlign: 'center' }}>:</td>
                <td style={S.td}><EditableField value={v} onChange={val => updInfo(i, val)} editMode={editMode} multiline style={{ width: '100%', whiteSpace: 'pre-line' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Agenda */}
        <h2 style={S.h2}>Agenda Rapat</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 16, fontSize: 11.5 }}>
          {agenda.map((item, i) => (
            <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <EditableField value={item} onChange={v => updAgenda(i, v)} editMode={editMode} style={{ flex: 1 }} />
              {editMode && <button onClick={() => setAgenda(a => a.filter((_, j) => j !== i))} style={{ background: '#fee2e2', border: 'none', borderRadius: 3, padding: '1px 5px', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}><Trash2 size={11} /></button>}
            </li>
          ))}
        </ol>
        {editMode && <button onClick={() => setAgenda(a => [...a, 'Agenda baru'])} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah agenda</button>}

        {/* Hasil */}
        <h2 style={S.h2}>Hasil & Kesepakatan Rapat</h2>

        <h3 style={S.h3}>1. SPK Telah Ditandatangani</h3>
        <p style={S.p}>PARA PIHAK telah menandatangani SPK No. 001/SPK-KOMJUR-ALSITS/VI/2026 tertanggal 08 Juni 2026. Pekerjaan bersifat retroaktif mencakup seluruh kegiatan yang telah dilakukan sejak awal 2026.</p>

        <h3 style={S.h3}>2. Status Pekerjaan Saat Kick-off</h3>
        <p style={S.p}>Pada saat kick-off meeting, pekerjaan telah memasuki <strong>Phase 3 (Intelligence & Launch)</strong> dengan kondisi:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>✅ Phase 1 (Foundation) — <strong>Selesai</strong>: UX Research, Design System Figma, Prototype</li>
          <li style={{ marginBottom: 4 }}>✅ Phase 2 (Core Development) — <strong>Selesai</strong>: Platform live di production, seluruh modul inti berjalan</li>
          <li style={{ marginBottom: 4 }}>🔄 Phase 3 (Intelligence & Launch) — <strong>Sedang Berjalan</strong>: Fitur lanjutan, optimasi, dan dokumentasi</li>
        </ul>

        <h3 style={S.h3}>3. Koordinator Proyek</h3>
        <table style={S.table}>
          <thead><tr><th style={S.th}>Pihak</th><th style={S.th}>Nama Koordinator</th><th style={S.th}>Kontak</th></tr></thead>
          <tbody>
            <tr>
              <td style={S.td}>PIHAK PERTAMA (ALSITS)</td>
              <td style={S.td}><EditableField value={koordinator1Nama} onChange={setKoordinator1Nama} editMode={editMode} /></td>
              <td style={S.td}><EditableField value={koordinator1Kontak} onChange={setKoordinator1Kontak} editMode={editMode} /></td>
            </tr>
            <tr>
              <td style={S.td}>PIHAK KEDUA (Developer)</td>
              <td style={S.td}>Hazril "abu_thariq" Firdhanni</td>
              <td style={S.td}><EditableField value={koordinator2Kontak} onChange={setKoordinator2Kontak} editMode={editMode} /></td>
            </tr>
          </tbody>
        </table>

        <h3 style={S.h3}>4. Mekanisme Pelaporan Progress</h3>
        <ul style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          <li style={{ marginBottom: 4 }}>Progress update disampaikan via WhatsApp Group / email setiap akhir minggu</li>
          <li style={{ marginBottom: 4 }}>Demo/review dilakukan setiap akhir fase sebelum BAST ditandatangani</li>
          <li style={{ marginBottom: 4 }}>Perubahan lingkup disampaikan tertulis (email/WA) dengan minimum 3 hari sebelum eksekusi</li>
        </ul>

        <h3 style={S.h3}>5. Mekanisme Pembayaran</h3>
        <p style={S.p}>Disepakati pembayaran via transfer bank ke rekening PIHAK KEDUA, dengan keterangan transfer sesuai nomor invoice yang diterbitkan PIHAK KEDUA.</p>

        {/* Rencana Kerja */}
        <h2 style={S.h2}>Rencana Kerja (Project Timeline)</h2>
        {phases.map((ph, pi) => (
          <div key={ph.phase} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b2d6b', color: '#fff', padding: '8px 14px', borderRadius: '6px 6px 0 0' }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12 }}>{ph.phase}: {ph.name}{ph.minggu ? ` — ${ph.minggu}` : ''}</span>
              <span style={{ background: '#D4A017', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{ph.nilai}</span>
            </div>
            <table style={{ ...S.table, marginBottom: 0 }}>
              <thead><tr><th style={{ ...S.th, background: '#1e4080', width: '25%' }}>Periode</th><th style={{ ...S.th, background: '#1e4080' }}>Kegiatan</th></tr></thead>
              <tbody>
                {ph.items.map(([periode, kegiatan], ii) => (
                  <tr key={ii}>
                    <td style={{ ...S.td, background: ii % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <EditableField value={periode} onChange={v => updPhaseItem(pi, ii, 0, v)} editMode={editMode} />
                    </td>
                    <td style={{ ...S.td, background: ii % 2 === 0 ? '#fff' : '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <EditableField value={kegiatan} onChange={v => updPhaseItem(pi, ii, 1, v)} editMode={editMode} style={{ flex: 1 }} />
                      {editMode && <button onClick={() => setPhases(ph2 => ph2.map((p, pi2) => pi2 !== pi ? p : { ...p, items: p.items.filter((_, j) => j !== ii) }))} style={{ background: '#fee2e2', border: 'none', borderRadius: 3, padding: '1px 5px', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}><Trash2 size={11} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editMode && (
              <button onClick={() => setPhases(ph2 => ph2.map((p, pi2) => pi2 !== pi ? p : { ...p, items: [...p.items, ['Minggu X', 'Kegiatan baru']] }))}
                style={{ width: '100%', background: '#eff6ff', border: '1px dashed #93c5fd', borderTop: 'none', padding: '4px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Plus size={11} /> Tambah baris
              </button>
            )}
          </div>
        ))}

        {/* Tanda Tangan */}
        <div className="sign-block">
          <h2 style={S.h2}>Persetujuan & Penandatanganan Notulen</h2>
          <p style={S.p}>Notulen ini disetujui dan ditandatangani sebagai bukti bahwa rapat kick-off telah dilaksanakan dan PARA PIHAK menyepakati rencana kerja di atas.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
            {/* PIHAK PERTAMA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK PERTAMA</p>
              <p style={{ fontSize: 10.5, color: '#666', marginBottom: 4 }}>Komisariat Jurusan Alumni Teknik Sipil ITS</p>
              <div style={{ height: TTD_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              <div className="no-print" style={{ height: editMode ? 32 : 0 }} />
              <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}><EditableField value={p1Nama} onChange={setP1Nama} editMode={editMode} /></p>
                <p style={{ fontSize: 11, color: '#555' }}><EditableField value={p1Jabatan} onChange={setP1Jabatan} editMode={editMode} /></p>
                <p style={{ fontSize: 11, color: '#888' }}><EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} /></p>
              </div>
            </div>
            {/* PIHAK KEDUA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK KEDUA</p>
              <p style={{ fontSize: 10.5, color: '#666', marginBottom: 4 }}>Developer Portal ALSITS</p>
              <div style={{ height: TTD_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {devSignature
                  ? <img src={devSignature} alt="TTD Developer" style={{ maxHeight: TTD_HEIGHT - 4, maxWidth: 220, objectFit: 'contain' }} />
                  : <div className="no-print" style={{ border: '1.5px dashed #cbd5e1', borderRadius: 6, padding: '8px 20px', color: '#94a3b8', fontSize: 10, fontStyle: 'italic' }}>[tanda tangan]</div>
                }
              </div>
              {editMode
                ? <div className="no-print" style={{ display: 'flex', gap: 6, justifyContent: 'center', height: 32, alignItems: 'center' }}>
                    <label style={{ cursor: 'pointer', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#2563eb', fontWeight: 600 }}>
                      📎 Upload TTD
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{ display: 'none' }} />
                    </label>
                    {devSignature && <button onClick={() => setDevSignature(null)} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>🗑 Hapus</button>}
                  </div>
                : <div style={{ height: 0 }} />
              }
              <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>Hazril "abu_thariq" Firdhanni</p>
                <p style={{ fontSize: 11, color: '#555' }}>Developer Portal ALSITS</p>
                <p style={{ fontSize: 11, color: '#888' }}><EditableField value={p2Tanggal} onChange={setP2Tanggal} editMode={editMode} /></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={S.footer}>
        NOTUL-KO/001/SPK-KOMJUR-ALSITS/VI/2026 · Notulen Kick-off Meeting — Redesign Portal ALSITS · Konfidensial
      </div>
    </div>
  );
}