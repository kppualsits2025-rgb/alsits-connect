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
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_FITUR = [
  ['Design System Implementation', 'Seluruh halaman menggunakan token warna, tipografi, dan komponen seragam', '✅ Live', 'alsits.id — tampilan konsisten semua halaman'],
  ['Navigasi Flat & Mobile-First Responsive', 'Navbar baru, mega-menu, breadcrumb, tampilan optimal di mobile', '✅ Live', 'alsits.id — coba di HP'],
  ['Direktori Alumni (Search & Filter)', 'Search multi-parameter: nama, angkatan, kota, industri, jabatan', '✅ Live', 'alsits.id/alumni'],
  ['Self-Service Profil Alumni (Klaim & Edit)', 'Alumni klaim profil via OTP, edit mandiri tanpa admin', '✅ Live', 'alsits.id/alumni → Klaim Profil'],
  ['Peta Sebaran Alumni (Interactive Map)', 'Leaflet map interaktif, cluster, filter kota/angkatan, popup detail', '✅ Live', 'alsits.id/peta'],
  ['Business Hub', 'Direktori usaha alumni, filter industri, detail bisnis, kontak', '✅ Live', 'alsits.id/business-hub'],
  ['Forum Diskusi', 'Post per kategori bidang keahlian, reply, author info', '✅ Live', 'alsits.id/forum'],
  ['Job Board (Lowongan & Proyek)', 'Posting dan pencarian lowongan kerja, proyek, magang, freelance', '✅ Live', 'alsits.id/lowongan'],
  ['E-Library', 'Upload & akses jurnal, skripsi, thesis, modul teknik', '✅ Live', 'alsits.id/library'],
  ['Sistem Notifikasi Email (Event & Ulang Tahun)', 'Auto email blast untuk event baru dan ulang tahun alumni', '✅ Live', 'Admin → Kirim Notifikasi'],
  ['Dashboard Statistik Alumni', 'Chart angkatan, industri, kota, tabel statistik, filter dinamis', '✅ Live', 'alsits.id/dashboard'],
  ['Admin Panel Mandiri', 'Kelola alumni, konten, sync data S32/S51, user management', '✅ Live', 'alsits.id/admin'],
  ['Integrasi API Web Angkatan (S32, S51)', 'Sync data otomatis dari portal web angkatan via API', '✅ Live', 'alsits.id/admin → Sync Data'],
  ['Portal Rekruter Publik', 'Akses publik terbatas untuk pencarian alumni by skill', '✅ Live', 'alsits.id/public'],
];

export default function DocsPhase2() {
  const [editMode, setEditMode] = useState(false);
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('Developer Portal ALSITS');
  const [p1Tanggal, setP1Tanggal] = useState('Juni 2026');
  const [p2Nama, setP2Nama] = useState('Gunawan Wibisono');
  const [p2Jabatan, setP2Jabatan] = useState('Sekretaris Jenderal PP Komjur ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('[Tanggal Persetujuan]');
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);
  const [docNomor, setDocNomor] = useState('RPT-P2/ALSITS/DIGITAL/001/2026');
  const [rows, setRows] = useState(DEFAULT_FITUR);

  const updRow = (i, col, val) => setRows(r => r.map((row, idx) => idx === i ? row.map((v, j) => j === col ? val : v) : row));
  const delRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const addRow = () => setRows(r => [...r, ['Fitur baru', 'Keterangan', '✅ Live', 'alsits.id/...']]);
  const toggleStatus = (i) => updRow(i, 2, rows[i][2] === '✅ Live' ? '🔄 Berjalan' : '✅ Live');

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root { background: #fff !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } tr { page-break-inside: avoid; } thead { display: table-header-group; } h2 { page-break-after: avoid; } .sign-block { page-break-inside: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)} style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <button onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #22c55e', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', color: '#16a34a', fontSize: 12, fontWeight: 600 }}><Plus size={13} /> Tambah Fitur</button>}
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk edit · Upload TTD saat edit aktif</span>}
        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginLeft: 'auto' }}>💡 "Save as PDF" di dialog print</span>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
            Dokumen Phase 2 (Bukti Administratif) · <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} />
          </div>
          <h1 style={S.h1}>LAPORAN PELAKSANAAN PHASE 2</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Core Development — Implementasi Fitur Utama Portal ALSITS</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>
            Nomor: <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} /> · Periode: <EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} />
          </p>
        </div>

        <h2 style={S.h2}>A. Informasi Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Judul', 'Laporan Pelaksanaan Phase 2 — Core Development Portal ALSITS'],
              ['Proyek', 'Redesign & Improvement Portal ALSITS (alsits.id)'],
              ['Nomor SPK', '001/SPK-KOMJUR-ALSITS/VI/2026'],
              ['Developer', 'Hazril "abu_thariq" Firdhanni'],
              ['Lingkup Phase 2', 'Implementasi 14 fitur/modul utama portal — live di production'],
              ['Platform', 'Base44 BaaS · React + Tailwind CSS · alsits.id'],
              ['Status', 'Seluruh 14 fitur telah live dan dapat diverifikasi di alsits.id'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, width: '3%', textAlign: 'center', background: '#f5f7fb' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>B. Daftar Fitur Terselesaikan Phase 2</h2>
        <div style={S.boxGreen}>
          <strong>✅ Status Keseluruhan:</strong> Seluruh 14 fitur utama Phase 2 telah berhasil diimplementasikan dan dapat diakses live di <strong>https://alsits.id</strong>. Setiap fitur dapat diverifikasi langsung oleh PIHAK PERTAMA via URL yang tercantum.
        </div>

        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '4%' }}>No.</th>
              <th style={{ ...S.th, width: '22%' }}>Fitur / Modul</th>
              <th style={S.th}>Deskripsi Implementasi</th>
              <th style={{ ...S.th, width: '12%', textAlign: 'center' }}>Status</th>
              <th style={{ ...S.th, width: '22%' }}>URL Verifikasi</th>
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
                  onClick={() => editMode && toggleStatus(i)} title={editMode ? 'Klik toggle' : ''}>
                  {row[2]}
                </td>
                <td style={{ ...S.td, color: '#2563eb', fontSize: 10.5 }}><EditableField value={row[3]} onChange={v => updRow(i, 3, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delRow(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>C. Pencapaian Teknis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          {[
            ['14', 'Fitur/Modul Live'],
            ['50+', 'Halaman & Komponen React'],
            ['20+', 'Backend Functions'],
            ['15+', 'Entity Database'],
          ].map(([num, label]) => (
            <div key={label} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '12px 16px', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 28, color: '#0b2d6b' }}>{num}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>D. Kesimpulan</h2>
        <p style={S.p}>Phase 2 (Core Development) telah diselesaikan sepenuhnya. Seluruh 14 fitur yang disepakati dalam Lampiran 2 (Scope of Work) telah berhasil diimplementasikan, diuji, dan di-deploy ke production. Portal ALSITS kini dapat diakses publik di <strong>https://alsits.id</strong> dengan seluruh fitur berfungsi penuh.</p>
        <div style={S.boxGreen}>
          <strong>✅ Pernyataan Developer:</strong> Seluruh deliverable Phase 2 telah diselesaikan sesuai scope yang disepakati dan siap untuk diverifikasi oleh PIHAK PERTAMA sebagai dasar penandatanganan BAST-1.
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

      <div style={S.footer}>{docNomor} · Laporan Pelaksanaan Phase 2 — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}