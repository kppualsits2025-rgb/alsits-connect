import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureUpload from '@/components/docs/SignatureUpload';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.8 },
  section: { padding: '32px 56px' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  h3: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, color: '#1a1a1a', marginBottom: 6, marginTop: 16 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '30%' },
  box: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  boxGreen: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const PAGES_WIREFRAMED = [
  ['1', 'Landing Page / Home', 'Hero section, statistik alumni, news, features overview, CTA klaim profil', '✅ Live'],
  ['2', 'Direktori Alumni', 'Filter & search multi-parameter, card grid alumni, pagination', '✅ Live'],
  ['3', 'Profil Alumni (Klaim & Edit)', 'Multi-step claim flow, self-service edit profil, foto, kontak, karir', '✅ Live'],
  ['4', 'Peta Sebaran Alumni', 'Interactive Leaflet map, cluster, filter kota/angkatan, popup detail', '✅ Live'],
  ['5', 'Business Hub', 'Direktori usaha, filter industri, detail bisnis, kontak pemilik', '✅ Live'],
  ['6', 'Dashboard Statistik (Admin)', 'Chart angkatan, industri, kota, tabel statistik, filter dinamis', '✅ Live'],
  ['7', 'Admin Panel', 'Tab: Sync data, user management, alumni management, konten', '✅ Live'],
  ['8', 'Voting System OMOV', 'Login DPT, OTP verification, bilik suara, live results dashboard', '✅ Live'],
  ['9', 'Forum Diskusi', 'Daftar post, kategori, reply, author info', '✅ Live'],
  ['10', 'Portal Rekruter (Public)', 'Akses terbatas, search alumni by skill, kontak rekruter', '✅ Live'],
  ['11', 'Halaman Berita & Events', 'Grid artikel, detail berita, galeri event', '✅ Live'],
  ['12', 'Inbox Pesan', 'Thread percakapan, kirim pesan antar alumni', '✅ Live'],
];

const USER_FLOWS = [
  ['Klaim Profil Alumni', 'Landing → Search nama → Modal klaim → Input identifier (email/HP) → OTP → Verifikasi → Edit profil → Simpan', '✅ Terimplementasi'],
  ['Login & Akses Portal', 'Navbar Login → Form email/password atau Google SSO → Redirect ke /beranda', '✅ Terimplementasi'],
  ['Voting OMOV', 'Halaman voting → Input NRP → Kirim OTP → Verifikasi OTP → Pilih kandidat → Submit vote → Halaman sukses', '✅ Terimplementasi'],
  ['Admin Sync Data', '/admin → Tab Sinkronisasi → Pilih sumber (S32/S51) → Jalankan sync → Preview → Konfirmasi', '✅ Terimplementasi'],
  ['Post Forum', '/forum → Tombol "Buat Topik" → Form judul+konten+kategori → Submit → Tampil di list', '✅ Terimplementasi'],
];

export default function WireframePrototype() {
  const [editMode, setEditMode] = useState(false);
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('UX Designer & Developer Portal ALSITS');
  const [p1Tanggal, setP1Tanggal] = useState('2026');
  const [p2Nama, setP2Nama] = useState('Gunawan Wibisono');
  const [p2Jabatan, setP2Jabatan] = useState('Sekretaris Jenderal PP Komjur ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('[Tanggal Persetujuan]');
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root { background: #fff !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } tr { page-break-inside: avoid; } thead { display: table-header-group; } h2, h3 { page-break-after: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)} style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk mengedit</span>}
        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginLeft: 'auto' }}>💡 "Save as PDF" di dialog print</span>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Phase 1 · SPK/ALSITS/DIGITAL/001/2026</div>
          <h1 style={S.h1}>WIREFRAME, UX FLOW & PROTOTYPE</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Dokumentasi Arsitektur Informasi & Alur Pengguna — Portal ALSITS</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: WFP/ALSITS/DIGITAL/001/2026 · Versi 1.0 · 2026</p>
        </div>

        <h2 style={S.h2}>A. Informasi Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Proyek', 'Redesign & Improvement Portal ALSITS (alsits.id)'],
              ['Nomor SPK', 'SPK/ALSITS/DIGITAL/001/2026'],
              ['Dibuat oleh', 'Hazril "abu_thariq" Firdhanni — UX Designer & Developer'],
              ['Tools', 'Figma (wireframe & prototype) + React (implementasi langsung)'],
              ['Jumlah Halaman', '12 halaman utama + 5 user flow utama'],
              ['Pendekatan', 'Lean UX — wireframe low-fidelity → langsung implementasi high-fidelity di kode'],
              ['Status', 'Seluruh wireframe dan user flow telah terimplementasi di alsits.id (live)'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, width: '3%', background: '#f5f7fb', textAlign: 'center' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>B. Sitemap & Arsitektur Informasi</h2>
        <p style={S.p}>Portal ALSITS menggunakan arsitektur informasi <strong>flat hierarchy</strong> — maksimal 2 level kedalaman navigasi untuk memastikan semua konten dapat dicapai dalam 1–2 klik dari halaman mana pun.</p>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '20%' }}>Level 1 (Menu Utama)</th>
            <th style={S.th}>Level 2 (Sub-halaman)</th>
            <th style={{ ...S.th, width: '15%' }}>URL</th>
          </tr></thead>
          <tbody>
            {[
              ['Beranda', 'Dashboard alumni, statistik, berita terbaru', '/beranda'],
              ['Alumni', 'Direktori, Peta Sebaran, Prestasi, Kontribusi, Live Voting', '/alumni'],
              ['Tentang ALSITS', 'Sejarah, Sambutan Ketua, Struktur Org, Visi Misi', '/tentang/*'],
              ['Komunitas', 'Gowes, Golf, Jalan Sehat, Trading', '/komunitas/*'],
              ['Events', 'Daftar kegiatan ALSITS & angkatan', '/events'],
              ['Bisnis', 'Business Hub — direktori usaha alumni', '/business-hub'],
              ['Lowongan', 'Job board & proyek dari alumni', '/lowongan'],
              ['Forum', 'Diskusi per kategori bidang keahlian', '/forum'],
              ['Perpustakaan', 'E-Library jurnal, skripsi, modul', '/library'],
              ['Inbox', 'Pesan antar alumni', '/inbox'],
              ['Admin (role: admin)', 'Panel admin: alumni, konten, sync, user, voting', '/admin, /voting/admin'],
            ].map(([l1, l2, url], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{l1}</td>
                <td style={S.td}>{l2}</td>
                <td style={{ ...S.td, color: '#2563eb', fontFamily: 'monospace', fontSize: 10.5 }}>{url}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>C. Daftar Halaman yang Di-wireframe</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '5%' }}>No.</th>
            <th style={{ ...S.th, width: '25%' }}>Nama Halaman</th>
            <th style={S.th}>Elemen Utama yang Dirancang</th>
            <th style={{ ...S.th, width: '13%' }}>Status</th>
          </tr></thead>
          <tbody>
            {PAGES_WIREFRAMED.map(([no, name, elems, status], i) => (
              <tr key={no} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, textAlign: 'center' }}>{no}</td>
                <td style={{ ...S.td, fontWeight: 700 }}>{name}</td>
                <td style={S.td}>{elems}</td>
                <td style={{ ...S.td, color: '#16a34a', fontWeight: 700 }}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>D. User Flow Utama</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '20%' }}>Flow</th>
            <th style={S.th}>Langkah</th>
            <th style={{ ...S.th, width: '16%' }}>Status</th>
          </tr></thead>
          <tbody>
            {USER_FLOWS.map(([flow, steps, status], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{flow}</td>
                <td style={{ ...S.td, fontSize: 11 }}>{steps}</td>
                <td style={{ ...S.td, color: '#16a34a', fontWeight: 700 }}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>E. Prototype — Bukti Implementasi Live</h2>
        <div style={S.boxGreen}>
          <strong>✅ Catatan Penting:</strong> Untuk proyek ini, prototype interaktif diwujudkan langsung sebagai <strong>platform live di production</strong> (alsits.id), bukan sebagai link Figma terpisah. Ini merupakan pendekatan <em>Lean UX</em> yang lebih efisien — PIHAK PERTAMA dapat menguji seluruh user flow secara nyata, bukan hanya mockup.
        </div>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Halaman / Fitur</th>
            <th style={{ ...S.th, width: '35%' }}>URL Akses Langsung</th>
            <th style={{ ...S.th, width: '15%' }}>Status</th>
          </tr></thead>
          <tbody>
            {[
              ['Landing Page Alumni', 'https://alsits.id/public-home', '✅ Live'],
              ['Direktori Alumni', 'https://alsits.id/alumni', '✅ Live'],
              ['Peta Sebaran', 'https://alsits.id/peta', '✅ Live'],
              ['Business Hub', 'https://alsits.id/business-hub', '✅ Live'],
              ['Live Voting Dashboard', 'https://alsits.id/voting', '✅ Live'],
              ['Forum Diskusi', 'https://alsits.id/forum', '✅ Live (login)'],
              ['Dashboard Admin', 'https://alsits.id/dashboard', '✅ Live (admin)'],
            ].map(([f, url, s], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{f}</td>
                <td style={{ ...S.td, color: '#2563eb' }}>{url}</td>
                <td style={{ ...S.td, color: '#16a34a', fontWeight: 700 }}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32, paddingTop: 16, borderTop: '1px solid #ccc' }}>
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

      <div style={S.footer}>WFP/ALSITS/DIGITAL/001/2026 · Wireframe, UX Flow & Prototype — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}