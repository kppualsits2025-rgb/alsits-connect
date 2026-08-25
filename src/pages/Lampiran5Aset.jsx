import React, { useState } from 'react';
import { Printer, Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableField from '@/components/docs/EditableField';
import SignatureBlock from '@/components/docs/SignatureBlock';

const S = {
  page: { fontFamily: 'Arial, sans-serif', fontSize: 11.5, color: '#1a1a1a', lineHeight: 1.7 },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 15, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, background: '#1a3a6e', color: '#fff', padding: '6px 12px', marginTop: 18, marginBottom: 0 },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 4, fontSize: 11 },
  th: { background: '#1a3a6e', color: '#fff', padding: '6px 10px', textAlign: 'left', fontWeight: 700, border: '1px solid #1a3a6e' },
  td: { padding: '6px 10px', border: '1px solid #ccc', verticalAlign: 'top' },
  tdAlt: { padding: '6px 10px', border: '1px solid #ccc', verticalAlign: 'top', background: '#f5f7fa' },
  note: { fontSize: 10.5, color: '#555', fontStyle: 'italic', marginTop: 6, marginBottom: 12 },
};

const DEFAULT_ASET = [
  { kategori: '1. Akses Platform & Server', items: [
    ['Email admin@alsits.id', 'Akun email domain proyek yang digunakan untuk seluruh layanan. Diserahkan: email + password + recovery code / backup code 2FA.', 'Diserahkan dalam amplop tertutup / PDF berpassword saat BAST Akhir'],
    ['Transfer Super Admin Google Workspace (jika pakai Workspace)', 'Jika admin@alsits.id menggunakan Google Workspace: kepemilikan dialihkan ke koordinator ALSITS secara langsung saat serah terima.', 'Screenshot konfirmasi pengalihan Super Admin — dilampirkan saat BAST Akhir'],
    ['Akses Registrar Domain alsits.id', 'Kepemilikan akun registrar domain alsits.id dialihkan ke email proyek. Developer tidak menyerahkan akun pribadi.', 'Screenshot halaman registrar menunjukkan pemilik domain sudah diubah — dilampirkan saat BAST Akhir'],
    ['Akses Admin Base44 (transfer ownership)', 'Ownership platform Base44 dipindahkan ke email yang ditunjuk ALSITS melalui fitur Transfer Ownership di dashboard.', 'Screenshot konfirmasi Transfer Ownership berhasil — dilampirkan saat BAST Akhir'],
    ['Konfigurasi DNS aktif', 'Catatan lengkap DNS record aktif (A, CNAME, MX, TXT, SPF, DKIM) sebagai backup migrasi.', 'File dns-records-alsits.id.txt — disertakan dalam paket serah terima'],
    ['API Keys aktif (S32, S51, Resend)', 'Seluruh API key layanan terintegrasi — diserahkan dalam dokumen terenkripsi.', 'Termasuk dalam dokumen kredensial terenkripsi — diserahkan saat BAST Akhir'],
  ]},
  { kategori: '2. Source Code & Codebase', items: [
    ['Repository source code (GitHub/ZIP)', 'Seluruh file source code proyek dalam kondisi berjalan (include .env.example)', 'File ZIP: alsits-portal-src-2026.zip — dikirim ke Google Drive folder ALSITS'],
    ['File entities (JSON schema)', 'Seluruh skema entitas database yang digunakan di aplikasi — 15 entitas', 'Termasuk dalam paket source code ZIP'],
    ['File backend functions', 'Seluruh file fungsi backend — 26 fungsi backend', 'Termasuk dalam paket source code ZIP'],
    ['File konfigurasi (tailwind, vite, dll)', 'File konfigurasi proyek (tailwind.config.js, vite.config.js, package.json, dll)', 'Termasuk dalam paket source code ZIP'],
    ['Environment Variables (.env)', 'Daftar semua variabel lingkungan + nilainya (dalam dokumen terpisah, dirahasiakan)', 'Termasuk dalam dokumen kredensial terenkripsi — diserahkan saat BAST Akhir'],
  ]},
  { kategori: '3. Aset Desain', items: [
    ['File Figma Design System', 'Link akses Figma atau export file .fig yang berisi design system & mockup', 'Design system terdokumentasi di alsits.id/design-system; dapat di-print/PDF'],
    ['Logo & aset grafis ALSITS', 'File PNG/SVG logo, ikon, dan aset brand (resolusi tinggi)', 'File logo dikirim ke Google Drive folder ALSITS (PNG + SVG resolusi tinggi)'],
    ['Foto/gambar yang digunakan di platform', 'Seluruh foto alumni, banner, dan ilustrasi yang terunggah di platform', 'Tersimpan di platform; link media dapat di-export dari Admin Panel'],
    ['Font yang digunakan', 'Montserrat + Open Sans via Google Fonts — tidak perlu file lokal', 'Referensi: fonts.google.com/specimen/Montserrat & fonts.google.com/specimen/Open+Sans'],
  ]},
  { kategori: '4. Data & Database', items: [
    ['Export data Alumni (CSV/JSON)', 'Seluruh record entitas Alumni dalam format yang dapat diimpor ulang', 'File: alumni-export-2026.csv — dikirim ke Google Drive folder ALSITS'],
    ['Export data News, Events, Jobs, Forum', 'Backup seluruh konten yang diproduksi selama platform berjalan', 'File: news-events-jobs-forum-export-2026.zip — dikirim ke Google Drive folder ALSITS'],
    ['Export data Voting (jika ada event aktif)', 'Data VotingEvent, VotingCandidate, VoterRegistry, VoteRecord', 'File: voting-data-export-2026.zip — dikirim ke Google Drive folder ALSITS'],
    ['Export data PageContent', 'Konten statis halaman Tentang, Sejarah, Visi-Misi, dll', 'File: pagecontent-export-2026.json — dikirim ke Google Drive folder ALSITS'],
  ]},
  { kategori: '5. Dokumentasi Teknis', items: [
    ['Panduan Admin (Panduan Admin & CS)', 'Dokumen SOP penggunaan panel admin, manajemen konten, dan sinkronisasi data', 'alsits.id/panduan-admin (dapat di-print/PDF) + file PDF dikirim ke Google Drive folder ALSITS'],
    ['Panduan Sinkronisasi Data (S32, S51)', 'Langkah-langkah sync data alumni dari portal angkatan S32 & S51', 'Termasuk dalam panduan admin — bagian Sinkronisasi Data'],
    ['Dokumentasi API Backend Functions', 'Daftar 26 fungsi backend beserta parameter input-output', 'File: api-docs-alsits-2026.pdf — dikirim ke Google Drive folder ALSITS'],
    ['Deployment Guide', 'Panduan langkah-langkah deploy ulang atau migrasi platform jika diperlukan', 'File: deployment-guide-alsits-2026.pdf — dikirim ke Google Drive folder ALSITS'],
    ['Modul + Rekaman Training Admin (2 Sesi)', 'File presentasi training + link rekaman video sesi training (2 sesi)', 'Link rekaman + slide — dikirim ke Google Drive folder ALSITS / via email hazrilf@gmail.com'],
    ['Dokumen Kredensial Terenkripsi', 'Dokumen berisi seluruh akses & password akun PROYEK (bukan akun pribadi) — diserahkan dalam format terenkripsi', 'File: credentials-alsits-2026.pdf (berpassword) — diserahkan langsung kepada Ketua/Sekjen saat BAST Akhir'],
  ]},
  { kategori: '6. Dokumen Legal & Keuangan', items: [
    ['SPK Asli (2 rangkap bermeterai)', 'Dokumen fisik SPK yang telah ditandatangani kedua belah pihak', 'Fisik: 2 rangkap bermeterai; Digital: alsits.id/spk (dapat di-print/PDF) + PDF dikirim ke Google Drive'],
    ['BAST-1 yang telah ditandatangani', 'Berita Acara Serah Terima Phase 1 & 2 (syarat Termin 2)', 'Fisik: 2 rangkap bermeterai; Digital: alsits.id/bast-1 + PDF dikirim ke Google Drive folder ALSITS'],
    ['BAST Akhir yang telah ditandatangani', 'Berita Acara Serah Terima Akhir (syarat Termin 3 / Pelunasan)', 'Fisik: 2 rangkap bermeterai; Digital: alsits.id/bast-akhir + PDF dikirim ke Google Drive folder ALSITS'],
    ['Bukti pembayaran Termin 1, 2, 3', 'Screenshot/bukti transfer masing-masing termin pembayaran', 'File PDF/JPG: BuktiTransfer-T1, T2, T3 — dikirim ke Google Drive folder ALSITS'],
  ]},
];

const DEFAULT_SIGNATORIES = [
  { role: 'PIHAK PERTAMA (Klien / ALSITS)', sub: 'Yang Menerima Aset', name: 'Gunawan Wibisono', jabatan: 'Sekretaris Jenderal PP Komjur ALSITS', signatureUrl: null },
  { role: 'PIHAK KEDUA (Developer)', sub: 'Yang Menyerahkan Aset', name: 'Hazril Firdhanni', jabatan: 'Perancang & Developer Portal ALSITS', signatureUrl: null },
];

// Nomor dokumen terbaru (23 Juni 2026)
const DOC_NO = '001/SPK-KOMJUR-ALSITS/VI/2026';

export default function Lampiran5Aset() {
  const [editMode, setEditMode] = useState(false);
  const [asetData, setAsetData] = useState(DEFAULT_ASET);
  const [signatories, setSignatories] = useState(DEFAULT_SIGNATORIES);
  const updSign = (i, field, val) => setSignatories(s => s.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const updKategori = (ci, val) => setAsetData(d => d.map((cat, i) => i === ci ? { ...cat, kategori: val } : cat));
  const updItem = (ci, ri, col, val) => setAsetData(d => d.map((cat, i) => i === ci ? { ...cat, items: cat.items.map((item, j) => { if (j !== ri) return item; const arr = [...item]; arr[col] = val; return arr; }) } : cat));
  const delItem = (ci, ri) => setAsetData(d => d.map((cat, i) => i === ci ? { ...cat, items: cat.items.filter((_, j) => j !== ri) } : cat));
  const addItem = (ci) => setAsetData(d => d.map((cat, i) => i === ci ? { ...cat, items: [...cat.items, ['Item baru', 'Keterangan', '']] } : cat));
  const delKategori = (ci) => setAsetData(d => d.filter((_, i) => i !== ci));
  const addKategori = () => setAsetData(d => [...d, { kategori: `${d.length + 1}. Kategori Baru`, items: [['Item baru', 'Keterangan']] }]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="font-bold text-gray-800 text-base">📦 Lampiran 5 — Daftar Aset Serah Terima Akhir</h1>
            <p className="text-xs text-gray-500">Bagian tidak terpisahkan dari SPK No. {DOC_NO}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/dokumen" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition" style={{ textDecoration: 'none' }}>← Dokumen</Link>
            <button onClick={() => setEditMode(e => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${editMode ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <Pencil size={13} /> {editMode ? '✓ Mode Edit Aktif' : 'Edit Konten'}
            </button>
            {editMode && <button onClick={addKategori} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-400 text-purple-600 text-xs font-semibold hover:bg-purple-50 transition"><Plus size={13} /> Tambah Kategori</button>}
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
              <Printer size={15} /> Print / PDF
            </button>
          </div>
        </div>
        {editMode && <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-xs text-amber-700 max-w-5xl mx-auto">💡 Klik teks bergaris biru untuk edit · 🗑️ untuk hapus item atau kategori · + untuk tambah</div>}
      </div>

      <div className="max-w-5xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none">
        <div className="px-14 py-10 print:px-12 print:py-8" style={S.page}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1a3a6e', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Lampiran 5 · {DOC_NO}</div>
            <h1 style={S.h1}>Daftar Aset Serah Terima Akhir</h1>
            <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>Portal ALSITS — Redesign & Improvement · Alumni Teknik Sipil ITS</div>
          </div>

          <p style={{ marginBottom: 6, fontSize: 11.5 }}>Dokumen ini merupakan daftar lengkap seluruh aset, akses, source code, kredensial, dan dokumentasi yang wajib diserahkan oleh <strong>PIHAK KEDUA (Developer)</strong> kepada <strong>PIHAK PERTAMA (Klien / ALSITS)</strong> pada saat BAST Akhir, sebagai syarat pencairan <strong>Termin 3 (Pelunasan)</strong>.</p>
          <p style={S.note}>Kolom "Diserahkan" diisi (✓) pada saat BAST Akhir. Setiap item wajib diverifikasi sebelum BAST ditandatangani.</p>

          {asetData.map((cat, ci) => (
            <div key={ci} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 0 }}>
                <h2 style={{ ...S.h2, flex: 1, margin: 0 }}>
                  <EditableField value={cat.kategori} onChange={v => updKategori(ci, v)} editMode={editMode} style={{ color: '#fff', width: '100%' }} />
                </h2>
                {editMode && <button onClick={() => delKategori(ci)} title="Hapus kategori" style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}><Trash2 size={13} /></button>}
              </div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, width: '30%' }}>Item Aset</th>
                    <th style={S.th}>Keterangan</th>
                    <th style={{ ...S.th, width: '12%', textAlign: 'center' }}>Diserahkan</th>
                    <th style={{ ...S.th, width: '18%' }}>Catatan / Lokasi File</th>
                    {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map(([item, ket, bukti = ''], ri) => (
                    <tr key={ri}>
                      <td style={ri % 2 === 0 ? S.td : S.tdAlt}><strong><EditableField value={item} onChange={v => updItem(ci, ri, 0, v)} editMode={editMode} style={{ width: '100%' }} /></strong></td>
                      <td style={ri % 2 === 0 ? S.td : S.tdAlt}><EditableField value={ket} onChange={v => updItem(ci, ri, 1, v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                      <td style={{ ...(ri % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>☐</td>
                      <td style={ri % 2 === 0 ? S.td : S.tdAlt}><EditableField value={bukti} onChange={v => updItem(ci, ri, 2, v)} editMode={editMode} multiline style={{ width: '100%', fontSize: 10.5, color: '#555' }} /></td>
                      {editMode && <td style={{ ...(ri % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}><button onClick={() => delItem(ci, ri)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
              {editMode && <button onClick={() => addItem(ci)} style={{ marginBottom: 8, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Tambah item</button>}
            </div>
          ))}

          <p style={{ ...S.note, marginTop: 16 }}>* Seluruh item di atas wajib diserahkan dalam kondisi lengkap dan dapat berfungsi.</p>

          <div className="sign-block" style={{ marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 16 }}>
            <SignatureBlock signatories={signatories} onChange={updSign} editMode={editMode} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: '#aaa', marginTop: 20 }}>
            Lampiran 5 · {DOC_NO} · Konfidensial · alsits.id · 2026
          </div>
        </div>
      </div>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print\\:hidden { display: none !important; } .print\\:shadow-none { box-shadow: none !important; } .print\\:my-0 { margin: 0 !important; } button, a { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } h2 { page-break-after: avoid; } }`}</style>
    </div>
  );
}