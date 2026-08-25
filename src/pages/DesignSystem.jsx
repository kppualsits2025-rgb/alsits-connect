import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureUpload from '@/components/docs/SignatureUpload';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.8 },
  section: { padding: '32px 56px' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  h3: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, color: '#1a1a1a', marginBottom: 8, marginTop: 16 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '25%' },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const COLORS = [
  { token: '--background', hex: '#0E1728', hsl: 'hsl(222, 35%, 7%)', name: 'Background Utama', desc: 'Latar belakang halaman — dark navy' },
  { token: '--card', hex: '#141E34', hsl: 'hsl(222, 35%, 11%)', name: 'Background Card', desc: 'Latar belakang card dan panel' },
  { token: '--primary', hex: '#2563EB', hsl: 'hsl(217, 89%, 55%)', name: 'Biru ITS (Primary)', desc: 'Warna utama, tombol, link aktif' },
  { token: '--accent', hex: '#D4A017', hsl: 'hsl(43, 90%, 55%)', name: 'Emas ALSITS (Accent)', desc: 'Warna aksen, highlight, badge penting' },
  { token: '--foreground', hex: '#E8EDF5', hsl: 'hsl(210, 40%, 95%)', name: 'Teks Utama', desc: 'Warna teks pada dark background' },
  { token: '--muted-foreground', hex: '#607090', hsl: 'hsl(215, 20%, 55%)', name: 'Teks Muted', desc: 'Teks sekunder, placeholder, label' },
  { token: '--border', hex: '#283A55', hsl: 'hsl(222, 30%, 18%)', name: 'Border', desc: 'Garis batas card dan input' },
  { token: '--destructive', hex: '#EF4444', hsl: 'hsl(0, 84%, 60%)', name: 'Merah (Destructive)', desc: 'Pesan error, aksi berbahaya, hapus' },
];

const TYPOGRAPHY = [
  ['Font Heading', 'Montserrat', '300, 400, 500, 600, 700, 800, 900', 'Judul halaman, heading, navbar, tombol'],
  ['Font Body', 'Open Sans', '300, 400, 500, 600, 700', 'Teks paragraf, label, konten artikel'],
  ['Font Monospace', 'System Mono', 'Default browser', 'Kode, NRP, nomor dokumen, data teknis'],
];

const COMPONENTS = [
  ['Button (Primary)', 'bg-primary text-white', 'Aksi utama — Simpan, Kirim, Konfirmasi'],
  ['Button (Secondary)', 'bg-secondary text-foreground', 'Aksi sekunder — Batal, Kembali, Lihat'],
  ['Button (Ghost)', 'hover:bg-secondary', 'Aksi tersier — di dalam list/table'],
  ['Button (Destructive)', 'bg-destructive text-white', 'Hapus, Reset — aksi tidak dapat dibatalkan'],
  ['Card', 'bg-card border border-border rounded-xl', 'Container konten — alumni card, news card'],
  ['Badge (Default)', 'bg-primary/20 text-primary', 'Label status, kategori, angkatan'],
  ['Badge (Accent)', 'bg-accent/20 text-accent', 'Highlight khusus — featured, unggul, admin'],
  ['Input', 'bg-input border border-border rounded-md', 'Form field — search, email, teks'],
  ['Dialog/Modal', 'bg-card shadow-2xl', 'Detail alumni, form edit, konfirmasi'],
  ['Navbar', 'bg-sidebar border-b border-sidebar-border', 'Navigasi utama — sticky top, dark navy'],
];

export default function DesignSystem() {
  const [editMode, setEditMode] = useState(false);
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('Designer & Developer Portal ALSITS');
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
          <h1 style={S.h1}>DESIGN SYSTEM DOCUMENTATION</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Sistem Desain Visual Portal ALSITS — alsits.id</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: DSD/ALSITS/DIGITAL/001/2026 · Versi 1.0 · 2026</p>
        </div>

        <h2 style={S.h2}>A. Informasi Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Nama Sistem', 'ALSITS Design System v1.0'],
              ['Framework', 'React + Tailwind CSS + shadcn/ui (Radix UI)'],
              ['Versi', '1.0 — Rilis awal 2026'],
              ['Design Tool', 'Figma (token desain) + tailwind.config.js (implementasi kode)'],
              ['Dibuat oleh', 'Hazril "abu_thariq" Firdhanni — Developer & Designer Portal ALSITS'],
              ['Implementasi', 'Portal ALSITS — alsits.id (live & beroperasi)'],
              ['Lisensi Komponen', 'MIT (shadcn/ui, Tailwind CSS, Radix UI) + Custom ALSITS tokens'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, width: '3%', textAlign: 'center', background: '#f5f7fb' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>B. Color Tokens (Palet Warna)</h2>
        <p style={S.p}>Sistem warna ALSITS menggunakan pendekatan <strong>dark-first</strong> dengan palet biru navy ITS dan aksen emas ALSITS. Seluruh warna didefinisikan sebagai CSS custom properties dalam <code>index.css</code> dan dimapping ke Tailwind classes di <code>tailwind.config.js</code>.</p>

        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '8%' }}>Swatch</th>
            <th style={{ ...S.th, width: '22%' }}>Token CSS</th>
            <th style={{ ...S.th, width: '14%' }}>Hex</th>
            <th style={{ ...S.th, width: '22%' }}>Tailwind Class</th>
            <th style={S.th}>Penggunaan</th>
          </tr></thead>
          <tbody>
            {COLORS.map((c, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={S.td}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: c.hex, border: '1px solid #ddd', display: 'inline-block' }} />
                </td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 10 }}>{c.token}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 10 }}>{c.hex}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 10 }}>bg-{c.token.replace('--', '').replace(/-/g, '-')}</td>
                <td style={S.td}>{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>C. Typography Scale</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Font Role</th>
            <th style={S.th}>Nama Font</th>
            <th style={{ ...S.th, width: '25%' }}>Weights</th>
            <th style={S.th}>Penggunaan</th>
          </tr></thead>
          <tbody>
            {TYPOGRAPHY.map(([role, font, weights, usage], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{role}</td>
                <td style={{ ...S.td, fontFamily: font === 'Montserrat' ? 'Montserrat, sans-serif' : font === 'Open Sans' ? 'Open Sans, sans-serif' : 'monospace', fontSize: 13 }}>{font}</td>
                <td style={S.td}>{weights}</td>
                <td style={S.td}>{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>D. Spacing & Grid System</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Grid Layout', 'CSS Grid + Flexbox dengan Tailwind gap utilities'],
              ['Base Unit', '4px (Tailwind default: 1 unit = 4px)'],
              ['Container Max Width', 'max-w-7xl (1280px) untuk halaman utama, max-w-4xl untuk dokumen'],
              ['Responsive Breakpoints', 'sm: 640px · md: 768px · lg: 1024px · xl: 1280px · 2xl: 1536px'],
              ['Border Radius', '--radius: 0.75rem (12px) · lg: 12px · md: 10px · sm: 8px'],
              ['Sidebar Width', '240px desktop · sheet/drawer di mobile'],
            ].map(([l, v], i) => (
              <tr key={i}><td style={{ ...S.tdL, width: '30%' }}>{l}</td><td style={{ ...S.td, width: '3%', background: '#f5f7fb', textAlign: 'center' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>E. Component Library</h2>
        <p style={S.p}>Semua komponen dibangun di atas <strong>shadcn/ui</strong> (Radix UI primitives) dengan styling Tailwind CSS dan design tokens ALSITS. Komponen dapat dilihat langsung di portal alsits.id yang sudah live.</p>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Komponen</th>
            <th style={S.th}>Kelas Utama</th>
            <th style={S.th}>Konteks Penggunaan di ALSITS</th>
          </tr></thead>
          <tbody>
            {COMPONENTS.map(([comp, cls, ctx], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{comp}</td>
                <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 10 }}>{cls}</td>
                <td style={S.td}>{ctx}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>F. Implementasi & Akses</h2>
        <div style={{ background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 }}>
          <strong>✅ Status:</strong> Seluruh design system ini telah diimplementasikan dalam kode sumber portal alsits.id. Token warna, tipografi, dan komponen dapat diverifikasi langsung di file <code>src/index.css</code>, <code>src/tailwind.config.js</code>, dan folder <code>src/components/ui/</code>.
        </div>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Aset</th>
            <th style={S.th}>Lokasi / Akses</th>
          </tr></thead>
          <tbody>
            {[
              ['CSS Token Variables', 'src/index.css — :root dan .dark class'],
              ['Tailwind Config', 'src/tailwind.config.js — extends.colors'],
              ['Komponen UI', 'src/components/ui/ — Button, Card, Input, Dialog, dll.'],
              ['Font Import', 'index.css baris 1 — Google Fonts (Montserrat + Open Sans)'],
              ['Live Preview', 'https://alsits.id — dapat diinspeksi via browser DevTools'],
            ].map(([a, l], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, fontWeight: 700 }}>{a}</td>
                <td style={{ ...S.td, color: '#2563eb', fontFamily: 'monospace', fontSize: 10.5 }}>{l}</td>
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

      <div style={S.footer}>DSD/ALSITS/DIGITAL/001/2026 · Design System Documentation — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}