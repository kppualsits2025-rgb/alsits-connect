import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureUpload from '@/components/docs/SignatureUpload';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.8 },
  section: { padding: '32px 56px' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '30%' },
  box: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  boxGreen: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  boxGold: { background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_DELIV = [
  ['PWA (Progressive Web App)', 'Installable di homescreen, service worker, manifest.json', '✅ Selesai', 'Browser → Install App di alsits.id'],
  ['Voting System OMOV', 'DPT management, OTP auth, bilik suara, live results dashboard publik', '✅ Selesai', 'alsits.id/voting'],
  ['Dashboard Analitik Dinamis', 'Chart angkatan/industri/kota, filter waktu, statistik real-time', '✅ Selesai', 'alsits.id/dashboard'],
  ['Performance Optimization', 'Lazy loading, staleTime optimization, reduced re-renders', '✅ Selesai', 'Lighthouse score platform'],
  ['SEO On-Page', 'Meta tags, Open Graph, structured data di index.html', '✅ Selesai', 'alsits.id — inspect source'],
  ['Testing Menyeluruh (Functional & Responsive)', 'Cross-browser, mobile responsiveness, end-to-end user flow testing', '✅ Selesai', 'Semua halaman alsits.id'],
  ['Training Admin ALSITS Sesi 1', 'Materi: Kelola alumni, sync data, manajemen konten', '✅ Selesai', 'Dokumen Panduan Admin'],
  ['Training Admin ALSITS Sesi 2', 'Materi: Voting OMOV, inbox, business hub, troubleshooting', '✅ Selesai', 'Dokumen Panduan Admin'],
  ['Dokumentasi Teknis Lengkap', 'Panduan admin, panduan user, API doc backend functions', '✅ Selesai', 'alsits.id/panduan-admin'],
  ['Inbox Pesan Antar Alumni', 'Thread percakapan, notifikasi, manajemen pesan', '✅ Selesai', 'alsits.id/inbox'],
  ['Panduan Admin (PanduanAdmin.jsx)', 'Dokumentasi lengkap untuk pengurus ALSITS operasikan platform', '✅ Selesai', 'alsits.id/panduan-admin'],
];

export default function DocsPhase3() {
  const [editMode, setEditMode] = useState(false);
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('Developer Portal ALSITS');
  const [p1Tanggal, setP1Tanggal] = useState('Juni 2026');
  const [p2Nama, setP2Nama] = useState('Gunawan Wibisono');
  const [p2Jabatan, setP2Jabatan] = useState('Sekretaris Jenderal PP Komjur ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('[Tanggal Persetujuan]');
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);
  const [docNomor, setDocNomor] = useState('RPT-P3/ALSITS/DIGITAL/001/2026');
  const [rows, setRows] = useState(DEFAULT_DELIV);

  const updRow = (i, col, val) => setRows(r => r.map((row, idx) => idx === i ? row.map((v, j) => j === col ? val : v) : row));
  const delRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const addRow = () => setRows(r => [...r, ['Deliverable baru', 'Deskripsi', '✅ Selesai', 'URL / Lokasi']]);
  const toggleStatus = (i) => updRow(i, 2, rows[i][2] === '✅ Selesai' ? '🔄 Berjalan' : '✅ Selesai');

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root { background: #fff !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } tr { page-break-inside: avoid; } thead { display: table-header-group; } h2 { page-break-after: avoid; } .sign-block { page-break-inside: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)} style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <button onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #22c55e', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', color: '#16a34a', fontSize: 12, fontWeight: 600 }}><Plus size={13} /> Tambah Deliverable</button>}
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik bergaris biru untuk edit · Upload TTD saat edit aktif</span>}
        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginLeft: 'auto' }}>💡 "Save as PDF" di dialog print</span>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
            Dokumen Phase 3 (Bukti Administratif) · <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} />
          </div>
          <h1 style={S.h1}>LAPORAN PELAKSANAAN PHASE 3</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Intelligence & Go-Live — Finalisasi, Training & Serah Terima Akhir</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>
            Nomor: <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} /> · Periode: <EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} />
          </p>
        </div>

        <h2 style={S.h2}>A. Informasi Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Judul', 'Laporan Pelaksanaan Phase 3 — Intelligence & Go-Live Portal ALSITS'],
              ['Proyek', 'Redesign & Improvement Portal ALSITS (alsits.id)'],
              ['Nomor SPK', '001/SPK-KOMJUR-ALSITS/VI/2026'],
              ['Developer', 'Hazril "abu_thariq" Firdhanni'],
              ['Lingkup Phase 3', 'PWA, Voting OMOV, Analytics, Optimasi, Training 2 sesi, Dokumentasi teknis, Serah terima aset'],
              ['Status', 'Seluruh deliverable Phase 3 telah selesai dan siap serah terima'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, width: '3%', textAlign: 'center', background: '#f5f7fb' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>B. Daftar Deliverable Phase 3</h2>
        <div style={S.boxGold}>
          <strong>🏁 Phase 3 — Go-Live:</strong> Ini adalah fase terakhir yang mencakup fitur-fitur intelligence, optimasi performa, training admin, dan penyelesaian dokumentasi teknis. Penandatanganan BAST Akhir dan pelunasan Termin 3 dilakukan setelah seluruh item di bawah ini diverifikasi.
        </div>

        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '4%' }}>No.</th>
              <th style={{ ...S.th, width: '22%' }}>Deliverable</th>
              <th style={S.th}>Deskripsi</th>
              <th style={{ ...S.th, width: '13%', textAlign: 'center' }}>Status</th>
              <th style={{ ...S.th, width: '22%' }}>Bukti / Lokasi</th>
              {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 700 }}><EditableField value={row[0]} onChange={v => updRow(i, 0, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={S.td}><EditableField value={row[1]} onChange={v => updRow(i, 1, v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, textAlign: 'center', color: '#16a34a', fontWeight: 700, cursor: editMode ? 'pointer' : 'default' }}
                  onClick={() => editMode && toggleStatus(i)}>
                  {row[2]}
                </td>
                <td style={{ ...S.td, color: '#2563eb', fontSize: 10.5 }}><EditableField value={row[3]} onChange={v => updRow(i, 3, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delRow(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={addRow} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah deliverable</button>}

        <h2 style={S.h2}>C. Ringkasan Keseluruhan Proyek</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
          {[
            ['3', 'Phase Selesai'],
            ['25+', 'Deliverable Total'],
            ['100%', 'Scope Terpenuhi'],
          ].map(([num, label]) => (
            <div key={label} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '12px 16px', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 28, color: '#0b2d6b' }}>{num}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>D. Pernyataan Penyelesaian</h2>
        <p style={S.p}>Dengan diselesaikannya Phase 3, seluruh lingkup pekerjaan yang tercantum dalam SPK No. 001/SPK-KOMJUR-ALSITS/VI/2026 telah terpenuhi. Portal ALSITS kini beroperasi penuh di production sebagai platform digital alumni yang modern, mobile-first, dan berfitur lengkap.</p>
        <div style={S.boxGreen}>
          <strong>✅ Pernyataan Developer:</strong> Seluruh pekerjaan dalam 3 (tiga) fase pengembangan portal ALSITS telah <strong>diselesaikan sepenuhnya</strong>, diuji, dan siap untuk dilakukan serah terima akhir. Dokumen ini menjadi lampiran bukti administratif pelaksanaan Phase 3 untuk BAST Akhir.
        </div>

        <div className="sign-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32, paddingTop: 16, borderTop: '1px solid #ccc' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Dibuat oleh</p>
            <SignatureUpload value={ttd1} onChange={setTtd1} editMode={editMode} />
            <div style={{ borderTop: '1px solid #333', paddingTop: 6 }}>
              <p style={{ fontWeight: 700 }}><EditableField value={p1Nama} onChange={setP1Nama} editMode={editMode} /></p>
              <p style={{ fontSize: 11, color: '#555' }}><EditableField value={p1Jabatan} onChange={setP1Jabatan} editMode={editMode} /></p>
              <p style={{ fontSize: 11, color: '#888' }}><EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} /></p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Disetujui oleh</p>
            <SignatureUpload value={ttd2} onChange={setTtd2} editMode={editMode} />
            <div style={{ borderTop: '1px solid #333', paddingTop: 6 }}>
              <p style={{ fontWeight: 700 }}><EditableField value={p2Nama} onChange={setP2Nama} editMode={editMode} /></p>
              <p style={{ fontSize: 11, color: '#555' }}><EditableField value={p2Jabatan} onChange={setP2Jabatan} editMode={editMode} /></p>
              <p style={{ fontSize: 11, color: '#888' }}><EditableField value={p2Tanggal} onChange={setP2Tanggal} editMode={editMode} /></p>
            </div>
          </div>
        </div>
      </div>

      <div style={S.footer}>{docNomor} · Laporan Pelaksanaan Phase 3 — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}