import React, { useState } from 'react';
import { Printer, Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableField from '@/components/docs/EditableField';
import SignatureBlock from '@/components/docs/SignatureBlock';

const S = {
  page: { fontFamily: 'Arial, sans-serif', fontSize: 11.5, color: '#1a1a1a', lineHeight: 1.7 },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 15, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  h2: (bg) => ({ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12.5, background: bg || '#1a3a6e', color: '#fff', padding: '7px 12px', marginTop: 22, marginBottom: 0 }),
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11 },
  th: (bg) => ({ background: bg || '#1a3a6e', color: '#fff', padding: '7px 10px', textAlign: 'left', fontWeight: 700, border: `1px solid ${bg || '#1a3a6e'}` }),
  td: { padding: '7px 10px', border: '1px solid #ccc', verticalAlign: 'top' },
  tdAlt: { padding: '7px 10px', border: '1px solid #ccc', verticalAlign: 'top', background: '#f5f7fa' },
};

const DEFAULT_BAST1 = [
  ['UX Research Report', 'Laporan hasil interview 5–10 alumni, insight, dan rekomendasi UX'],
  ['Competitive Analysis Report', 'Dokumen benchmark 3–5 portal alumni serupa'],
  ['Wireframe & UX Flow (Figma)', '10+ halaman, termasuk user journey dan sitemap'],
  ['UI Design High-Fidelity (Figma)', 'Mockup lengkap semua halaman dalam design system baru'],
  ['Interactive Prototype (Figma)', 'Prototype yang dapat diuji coba + laporan user testing'],
  ['Design System Documentation', 'Token warna, tipografi, spacing, komponen UI'],
  ['Platform live di Production (alsits.id)', 'Semua halaman Phase 2 dapat diakses di alsits.id'],
  ['Navigasi flat, mega-menu, breadcrumb', 'Mobile-first, responsive di semua breakpoint'],
  ['Halaman Profil Mandiri Alumni', 'Alumni dapat update profil sendiri via self-service'],
  ['Global Search bar', 'Mencakup alumni, berita, lowongan, dan forum'],
  ['Sistem notifikasi in-app & Activity feed', 'Notifikasi real-time aktivitas terbaru'],
  ['Onboarding flow anggota baru (3-langkah)', 'Alur pendaftaran/verifikasi anggota baru'],
];

const DEFAULT_BASTAKHIR = [
  ['Dashboard Analitik Dinamis', 'Filter waktu & segmen, chart interaktif'],
  ['Progressive Web App (PWA)', 'Dapat diinstal di homescreen mobile/desktop'],
  ['AI-Powered Rekomendasi Konten & Job Matching', 'Berbasis profil alumni'],
  ['Performance Optimization & SEO On-Page', 'Lighthouse score ≥ 90, meta SEO lengkap'],
  ['Laporan Testing UAT (Functional, Responsive, Cross-browser)', 'Dokumen testing + sign-off'],
  ['Training Admin ALSITS — Sesi 1', 'Modul + rekaman sesi training pertama'],
  ['Training Admin ALSITS — Sesi 2', 'Modul + rekaman sesi training kedua'],
  ['Dokumentasi Teknis Lengkap', 'Panduan admin, API doc, deployment guide'],
  ['Seluruh aset Lampiran 5 diserahkan', 'Source code, akses, desain, data, dokumen legal'],
];

function EditableTable({ items, setItems, editMode, thBg }) {
  const upd = (i, col, val) => setItems(rows => rows.map((r, idx) => idx === i ? [col === 0 ? val : r[0], col === 1 ? val : r[1]] : r));
  const del = (i) => setItems(rows => rows.filter((_, idx) => idx !== i));
  const add = () => setItems(rows => [...rows, ['Item baru', 'Keterangan']]);

  return (
    <>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={{ ...S.th(thBg), width: '5%' }}>No</th>
            <th style={{ ...S.th(thBg), width: '38%' }}>Deliverable</th>
            <th style={S.th(thBg)}>Keterangan</th>
            <th style={{ ...S.th(thBg), width: '12%', textAlign: 'center' }}>Diterima (✓)</th>
            {editMode && <th style={{ ...S.th(thBg), width: '5%' }}>Del</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(([item, ket], i) => (
            <tr key={i}>
              <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>{i + 1}</td>
              <td style={i % 2 === 0 ? S.td : S.tdAlt}><strong><EditableField value={item} onChange={v => upd(i, 0, v)} editMode={editMode} style={{ width: '100%' }} /></strong></td>
              <td style={i % 2 === 0 ? S.td : S.tdAlt}><EditableField value={ket} onChange={v => upd(i, 1, v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
              <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>☐</td>
              {editMode && <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}><button onClick={() => del(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && <button onClick={add} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah item</button>}
    </>
  );
}

const DEFAULT_SIGNATORIES_BAST1 = [
  { role: 'PIHAK PERTAMA (Klien / ALSITS)', sub: 'Yang Menerima', name: 'Gunawan Wibisono', jabatan: 'Sekretaris Jenderal PP Komjur ALSITS', signatureUrl: null },
  { role: 'PIHAK KEDUA (Developer)', sub: 'Yang Menyerahkan', name: 'Hazril Firdhanni', jabatan: 'Perancang & Developer Portal ALSITS', signatureUrl: null },
];
const DEFAULT_SIGNATORIES_BASTAKHIR = [
  { role: 'PIHAK PERTAMA (Klien / ALSITS)', sub: 'Yang Menerima', name: 'Gunawan Wibisono', jabatan: 'Sekretaris Jenderal PP Komjur ALSITS', signatureUrl: null },
  { role: 'PIHAK KEDUA (Developer)', sub: 'Yang Menyerahkan', name: 'Hazril Firdhanni', jabatan: 'Perancang & Developer Portal ALSITS', signatureUrl: null },
];

export default function Lampiran4BAST() {
  const [editMode, setEditMode] = useState(false);
  const [bast1Items, setBast1Items] = useState(DEFAULT_BAST1);
  const [bastAkhirItems, setBastAkhirItems] = useState(DEFAULT_BASTAKHIR);
  const [signBast1, setSignBast1] = useState(DEFAULT_SIGNATORIES_BAST1);
  const [signBastAkhir, setSignBastAkhir] = useState(DEFAULT_SIGNATORIES_BASTAKHIR);
  const updSign = (setter) => (i, field, val) => setter(s => s.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="font-bold text-gray-800 text-base">📋 Lampiran 4 — Format BAST-1 & BAST Akhir</h1>
            <p className="text-xs text-gray-500">Bagian tidak terpisahkan dari SPK No. 001/SPK-KOMJUR-ALSITS/VI/2026</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/dokumen" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition" style={{ textDecoration: 'none' }}>← Dokumen</Link>
            <Link to="/bast-1" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-400 text-green-700 text-xs font-semibold hover:bg-green-50 transition" style={{ textDecoration: 'none' }}>📄 BAST-1</Link>
            <Link to="/bast-akhir" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-yellow-400 text-yellow-700 text-xs font-semibold hover:bg-yellow-50 transition" style={{ textDecoration: 'none' }}>🏁 BAST Akhir</Link>
            <button onClick={() => setEditMode(e => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${editMode ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <Pencil size={13} /> {editMode ? '✓ Mode Edit Aktif' : 'Edit Konten'}
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
              <Printer size={15} /> Print
            </button>
          </div>
        </div>
        {editMode && <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-xs text-amber-700 max-w-4xl mx-auto">💡 Klik teks bergaris biru untuk edit · 🗑️ untuk hapus item · + untuk tambah item baru</div>}
      </div>

      <div className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none">
        <div className="px-14 py-10 print:px-12 print:py-8" style={S.page}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1a3a6e', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Lampiran 4 · 001/SPK-KOMJUR-ALSITS/VI/2026</div>
            <h1 style={S.h1}>Format BAST-1 dan BAST Akhir</h1>
            <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>Portal ALSITS — Redesign & Improvement · Alumni Teknik Sipil ITS</div>
          </div>

          <h2 style={S.h2()}>A. Daftar Deliverable BAST-1 (Phase 1 & Phase 2)</h2>
          <EditableTable items={bast1Items} setItems={setBast1Items} editMode={editMode} thBg="#1a3a6e" />

          <div className="sign-block" style={{ border: '1px solid #ccc', borderRadius: 8, padding: '14px 16px', marginBottom: 8, background: '#f9fafb' }}>
            <p style={{ fontSize: 11, marginBottom: 12 }}>Dengan ditandatanganinya dokumen ini, PARA PIHAK menyatakan bahwa seluruh deliverable Phase 1 dan Phase 2 di atas telah diserahterimakan, dan <strong>PIHAK PERTAMA setuju untuk mencairkan Termin 1 & Termin 2 (Rp 7.000.000)</strong>.</p>
            <SignatureBlock signatories={signBast1} onChange={updSign(setSignBast1)} editMode={editMode} />
          </div>

          <div style={{ pageBreakBefore: 'always', marginTop: 24 }} />

          <h2 style={S.h2('#92400e')}>B. Daftar Deliverable BAST Akhir (Phase 3 / Serah Terima Final)</h2>
          <EditableTable items={bastAkhirItems} setItems={setBastAkhirItems} editMode={editMode} thBg="#92400e" />

          <div className="sign-block" style={{ border: '1px solid #fcd34d', borderRadius: 8, padding: '14px 16px', marginBottom: 8, background: '#fffbeb' }}>
            <p style={{ fontSize: 11, marginBottom: 12 }}>Dengan ditandatanganinya dokumen ini, PARA PIHAK menyatakan bahwa seluruh deliverable Phase 3 dan seluruh aset Lampiran 5 telah diserahterimakan. <strong>PIHAK PERTAMA setuju untuk mencairkan Termin 3 / Pelunasan (Rp 3.000.000)</strong> dan kontrak dinyatakan selesai.</p>
            <SignatureBlock signatories={signBastAkhir} onChange={updSign(setSignBastAkhir)} editMode={editMode} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: '#aaa', marginTop: 20 }}>
            Lampiran 4 · 001/SPK-KOMJUR-ALSITS/VI/2026 · Konfidensial · alsits.id · 2026
          </div>
        </div>
      </div>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print\\:hidden { display: none !important; } .print\\:shadow-none { box-shadow: none !important; } .print\\:my-0 { margin: 0 !important; } button, a { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } }`}</style>
    </div>
  );
}