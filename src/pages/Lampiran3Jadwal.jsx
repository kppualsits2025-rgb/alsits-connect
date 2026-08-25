import React, { useState } from 'react';
import { Printer, Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableField from '@/components/docs/EditableField';
import SignatureBlock from '@/components/docs/SignatureBlock';

const S = {
  page: { fontFamily: 'Arial, sans-serif', fontSize: 11.5, color: '#1a1a1a', lineHeight: 1.7 },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 15, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11 },
  th: { background: '#1a3a6e', color: '#fff', padding: '7px 10px', textAlign: 'left', fontWeight: 700, border: '1px solid #1a3a6e' },
  td: { padding: '7px 10px', border: '1px solid #ccc', verticalAlign: 'top' },
  tdAlt: { padding: '7px 10px', border: '1px solid #ccc', verticalAlign: 'top', background: '#f5f7fa' },
  note: { fontSize: 10.5, color: '#555', fontStyle: 'italic', marginTop: 8 },
  badge: (color) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: color === 'green' ? '#d1fae5' : '#fef9c3', color: color === 'green' ? '#065f46' : '#92400e', border: `1px solid ${color === 'green' ? '#6ee7b7' : '#fcd34d'}` }),
};

const DEFAULT_MILESTONES = [
  { fase: 'Pre-Project', milestone: 'Penandatanganan SPK & Pembayaran DP (Termin 1)', status: 'done', ket: 'Syarat dimulainya pekerjaan' },
  { fase: 'Phase 1\nFoundation', milestone: 'Kick-off Meeting & Mulai Phase 1', status: 'done', ket: 'Rapat perdana, pemaparan scope, penentuan PIC' },
  { fase: '', milestone: 'UX Research & User Interview (5–10 alumni)', status: 'done', ket: 'Laporan hasil interview alumni' },
  { fase: '', milestone: 'Competitive Analysis & Benchmark Portal Alumni', status: 'done', ket: 'Dokumen benchmark 3–5 portal alumni serupa' },
  { fase: '', milestone: 'Wireframe & UX Flow (10+ halaman)', status: 'done', ket: 'File Figma wireframe' },
  { fase: '', milestone: 'UI Design High-Fidelity + Design System', status: 'done', ket: 'File Figma design system + mockup lengkap' },
  { fase: '', milestone: 'Interactive Prototype + User Testing', status: 'done', ket: 'Prototype Figma + laporan user testing' },
  { fase: 'Phase 2\nCore Dev', milestone: 'Implementasi Design System ke Semua Halaman', status: 'done', ket: 'Semua halaman menggunakan design token baru' },
  { fase: '', milestone: 'Redesign Navigasi & Mobile-First Responsive', status: 'done', ket: 'Navigasi flat, mega-menu, breadcrumb, mobile-first' },
  { fase: '', milestone: 'Halaman Profil Mandiri Alumni (Self-Service)', status: 'done', ket: 'Alumni dapat update profil sendiri' },
  { fase: '', milestone: 'Global Search, Notifikasi, Onboarding Flow', status: 'done', ket: 'Search bar global + activity feed + onboarding 3-langkah' },
  { fase: '', milestone: 'Platform Live di Production (alsits.id)', status: 'done', ket: 'Platform dapat diakses publik di alsits.id' },
  { fase: 'Phase 3\nIntelligence', milestone: 'Dashboard Analitik Dinamis', status: 'progress', ket: 'Filter waktu, segmen, chart interaktif' },
  { fase: '', milestone: 'Progressive Web App (PWA)', status: 'progress', ket: 'Dapat diinstal di homescreen' },
  { fase: '', milestone: 'Performance Optimization & SEO On-Page', status: 'progress', ket: 'Lighthouse score ≥ 90, SEO meta lengkap' },
  { fase: '', milestone: 'Testing Menyeluruh (Functional, Responsive, Cross-browser)', status: 'progress', ket: 'Laporan testing UAT' },
  { fase: '', milestone: 'Training Admin ALSITS (2 Sesi)', status: 'progress', ket: 'Modul training + rekaman sesi' },
  { fase: '', milestone: 'Dokumentasi Teknis Lengkap', status: 'progress', ket: 'Panduan admin, API doc, deployment guide' },
  { fase: 'Serah Terima', milestone: 'BAST Akhir & Pelunasan (Termin 3)', status: 'progress', ket: 'Serah terima seluruh aset + pembayaran lunas' },
];

const DEFAULT_SIGNATORIES = [
  { role: 'PIHAK PERTAMA (Klien / ALSITS)', sub: '', name: 'Gunawan Wibisono', jabatan: 'Sekretaris Jenderal PP Komjur ALSITS', signatureUrl: null },
  { role: 'PIHAK KEDUA (Developer)', sub: '', name: 'Hazril Firdhanni', jabatan: 'Perancang & Developer Portal ALSITS', signatureUrl: null },
];

export default function Lampiran3Jadwal() {
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState(DEFAULT_MILESTONES);
  const [nomorSpk, setNomorSpk] = useState('001/SPK-KOMJUR-ALSITS/VI/2026');
  const [signatories, setSignatories] = useState(DEFAULT_SIGNATORIES);

  const updRow = (i, key, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  const delRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const addRow = () => setRows(r => [...r, { fase: '', milestone: 'Milestone baru', status: 'progress', ket: '' }]);
  const toggleStatus = (i) => updRow(i, 'status', rows[i].status === 'done' ? 'progress' : 'done');
  const updSign = (i, key, val) => setSignatories(s => s.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="font-bold text-gray-800 text-base">📅 Lampiran 3 — Jadwal & Milestone Pekerjaan</h1>
            <p className="text-xs text-gray-500">Bagian tidak terpisahkan dari SPK No. {nomorSpk}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/dokumen" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition" style={{ textDecoration: 'none' }}>← Dokumen</Link>
            <button onClick={() => setEditMode(e => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${editMode ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <Pencil size={13} /> {editMode ? '✓ Mode Edit Aktif' : 'Edit Konten'}
            </button>
            {editMode && <button onClick={addRow} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-400 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition"><Plus size={13} /> Tambah Baris</button>}
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
              <Printer size={15} /> Print / PDF
            </button>
          </div>
        </div>
        {editMode && <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-xs text-amber-700 max-w-4xl mx-auto">💡 Klik teks bergaris biru untuk edit · Klik badge status untuk toggle · Edit No. SPK & nama penandatangan · 🗑️ untuk hapus baris</div>}
      </div>

      <div className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none">
        <div className="px-14 py-10 print:px-12 print:py-8" style={S.page}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1a3a6e', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span>Lampiran 3 ·</span>
              {editMode
                ? <input value={nomorSpk} onChange={e => setNomorSpk(e.target.value)} style={{ border: '1px solid #93c5fd', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'Arial, sans-serif', color: '#333', letterSpacing: 1, width: 280 }} />
                : <span>{nomorSpk}</span>
              }
            </div>
            <h1 style={S.h1}>Jadwal Pelaksanaan & Milestone Pekerjaan</h1>
            <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>Portal ALSITS — Redesign & Improvement · Alumni Teknik Sipil ITS</div>
          </div>

          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '13%' }}>Fase</th>
                <th style={{ ...S.th, width: '38%' }}>Milestone / Deliverable</th>
                <th style={{ ...S.th, width: '14%', textAlign: 'center' }}>Status</th>
                <th style={S.th}>Keterangan</th>
                {editMode && <th style={{ ...S.th, width: '5%', textAlign: 'center' }}>Del</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? S.td : S.tdAlt}>
                    <EditableField value={m.fase} onChange={v => updRow(i, 'fase', v)} editMode={editMode} multiline style={{ whiteSpace: 'pre-line', fontSize: 11, fontWeight: 700, width: '100%' }} />
                  </td>
                  <td style={i % 2 === 0 ? S.td : S.tdAlt}>
                    <EditableField value={m.milestone} onChange={v => updRow(i, 'milestone', v)} editMode={editMode} style={{ width: '100%' }} />
                  </td>
                  <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>
                    <span onClick={() => editMode && toggleStatus(i)} style={{ ...S.badge(m.status === 'done' ? 'green' : 'yellow'), cursor: editMode ? 'pointer' : 'default' }} title={editMode ? 'Klik untuk toggle status' : ''}>
                      {m.status === 'done' ? '✅ Selesai' : '🔄 Berjalan'}
                    </span>
                  </td>
                  <td style={i % 2 === 0 ? S.td : S.tdAlt}>
                    <EditableField value={m.ket} onChange={v => updRow(i, 'ket', v)} editMode={editMode} style={{ width: '100%' }} />
                  </td>
                  {editMode && (
                    <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>
                      <button onClick={() => delRow(i)} title="Hapus baris" style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <p style={S.note}>* Jadwal bersifat estimasi untuk milestone yang masih berjalan. Keterlambatan akibat force majeure atau lambatnya feedback/approval dari Klien tidak menjadi tanggung jawab Developer.</p>

          {/* Blok Tanda Tangan */}
          <div className="sign-block" style={{ marginTop: 24, borderTop: '1px solid #ccc', paddingTop: 16 }}>
            <SignatureBlock signatories={signatories} onChange={updSign} editMode={editMode} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: '#aaa', marginTop: 20 }}>
            Lampiran 3 · {nomorSpk} · Konfidensial · alsits.id · 2026
          </div>
        </div>
      </div>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print\\:hidden { display: none !important; } .print\\:shadow-none { box-shadow: none !important; } .print\\:my-0 { margin: 0 !important; } button, a { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } }`}</style>
    </div>
  );
}