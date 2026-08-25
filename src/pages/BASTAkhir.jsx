import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureUpload from '@/components/docs/SignatureUpload';

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

const DEFAULT_DELIV = [
  { item: 'Platform live di production (alsits.id)', fmt: 'URL', status: '✅' },
  { item: 'Source code lengkap (ZIP / GitHub repository)', fmt: 'ZIP / GitHub', status: '☐' },
  { item: 'File entities/*.json (semua schema database)', fmt: 'ZIP', status: '☐' },
  { item: 'File functions/*.js (semua backend functions)', fmt: 'ZIP', status: '☐' },
  { item: 'Figma Design System (link / export)', fmt: 'Link Figma', status: '✅' },
  { item: 'Laporan UX Research', fmt: 'PDF', status: '✅' },
  { item: 'Dokumentasi Teknis (stack, API docs, panduan deployment)', fmt: 'PDF', status: '☐' },
  { item: 'User Guide Admin & admin_cs (Panduan Admin PDF)', fmt: 'PDF', status: '✅' },
  { item: 'Panduan maintenance & troubleshooting', fmt: 'PDF', status: '☐' },
  { item: 'Export data alumni (JSON/CSV backup)', fmt: 'JSON/CSV', status: '☐' },
  { item: 'Seluruh dokumen akses, kredensial, password, konfigurasi deployment', fmt: 'Dokumen terenkripsi', status: '☐' },
  { item: 'Transfer ownership Base44 Dashboard kepada PIHAK PERTAMA', fmt: 'Selesai', status: '☐' },
  { item: 'Akses admin alsits.id diserahkan kepada koordinator PIHAK PERTAMA', fmt: 'Email/akun', status: '☐' },
  { item: 'Laporan training admin sesi 1 (materi & absensi)', fmt: 'PDF', status: '☐' },
  { item: 'Laporan training admin sesi 2 (materi & absensi)', fmt: 'PDF', status: '☐' },
  { item: 'Notulen & Rencana Kerja (kick-off)', fmt: 'PDF', status: '✅' },
  { item: 'BAST 1 yang telah ditandatangani', fmt: 'PDF bermeterai', status: '☐' },
];

export default function BASTAkhir() {
  const [editMode, setEditMode] = useState(false);
  const [delivs, setDelivs] = useState(DEFAULT_DELIV);
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);

  const upd = (i, key, val) => setDelivs(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const del = (i) => setDelivs(rows => rows.filter((_, idx) => idx !== i));
  const toggleStatus = (i) => upd(i, 'status', delivs[i].status === '✅' ? '☐' : '✅');
  const add = () => setDelivs(rows => [...rows, { item: 'Item baru', fmt: 'PDF', status: '☐' }]);

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } thead { display: table-header-group; } .sign-block { page-break-inside: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / PDF</button>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru · klik status ✅/☐ untuk toggle · 🗑️ hapus · + tambah</span>}
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Proyek · SPK/ALSITS/DIGITAL/001/2026</div>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b', marginBottom: 4 }}>BERITA ACARA SERAH TERIMA AKHIR</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Phase 3 — Intelligence & Launch · Go-Live & Selesai</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: BAST-AKHIR/ALSITS/DIGITAL/001/2026</p>
        </div>

        <h2 style={S.h2}>Data Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Nomor BAST Akhir', 'BAST-AKHIR/ALSITS/DIGITAL/001/2026'],
              ['Tanggal', '[Tanggal penandatanganan]'],
              ['Tempat', '[Jakarta / Surabaya / daring]'],
              ['Nomor SPK Referensi', 'SPK/ALSITS/DIGITAL/001/2026'],
              ['BAST 1 Referensi', 'BAST-1/ALSITS/DIGITAL/001/2026 (tertanggal [tanggal])'],
              ['Nilai Termin Pelunasan', 'Rp 3.000.000,- (Termin 3 / 30%)'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, background: '#fff', width: '3%', textAlign: 'center' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>Checklist Serah Terima Final</h2>
        <p style={{ fontSize: 11, fontStyle: 'italic', color: '#666', marginBottom: 8 }}>
          {editMode ? '⬜/✅ klik untuk toggle · bergaris biru = klik untuk edit' : '☐ = Akan diserahkan saat BAST Akhir · ✅ = Sudah tersedia/selesai'}
        </p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>No.</th>
              <th style={S.th}>Item / Deliverable</th>
              <th style={S.th}>Format</th>
              <th style={{ ...S.th, width: '8%', textAlign: 'center' }}>Status</th>
              {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
            </tr>
          </thead>
          <tbody>
            {delivs.map((row, i) => (
              <tr key={i}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><EditableField value={row.item} onChange={v => upd(i, 'item', v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={S.td}><EditableField value={row.fmt} onChange={v => upd(i, 'fmt', v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, textAlign: 'center', color: row.status === '✅' ? '#16a34a' : '#6b7280', fontWeight: 700, fontSize: 14, cursor: editMode ? 'pointer' : 'default' }}
                  onClick={() => editMode && toggleStatus(i)} title={editMode ? 'Klik untuk toggle' : ''}>
                  {row.status}
                </td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => del(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={add} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah item</button>}

        <div style={S.success}>
          <strong>✅ Pernyataan PIHAK PERTAMA:</strong> Dengan menandatangani dokumen ini, PIHAK PERTAMA menyatakan bahwa seluruh pekerjaan telah <strong>diterima, diperiksa, dan dinyatakan selesai</strong> sesuai dengan lingkup yang disepakati dalam SPK.
        </div>

        <h2 style={S.h2}>Pelunasan & Ketentuan Support</h2>
        <p style={S.p}>Dengan ditandatanganinya BAST Akhir ini, PIHAK PERTAMA wajib melakukan <strong>pelunasan Termin 3 sebesar Rp 3.000.000,- (Tiga Juta Rupiah)</strong> paling lambat <strong>7 (tujuh) hari kalender</strong> sejak penandatanganan.</p>
        <p style={S.p}>Setelah pelunasan diterima, <strong>seluruh hak kepemilikan</strong> atas source code, desain, dokumentasi, dan aset digital beralih sepenuhnya kepada PIHAK PERTAMA. PIHAK KEDUA tetap memberikan support teknis gratis selama <strong>3 (tiga) bulan</strong> sejak tanggal BAST ini.</p>

        <div className="sign-block" style={{ marginTop: 16 }}>
        <h2 style={S.h2}>Catatan Penutup</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '12px 16px', minHeight: 60, marginBottom: 16 }}>
          <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: 11 }}>[Catatan tambahan dari PARA PIHAK, jika ada.]</p>
        </div>

        <h2 style={S.h2}>Penandatanganan BAST Akhir</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK PERTAMA</p>
            <p style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Komisariat Jurusan Alumni Teknik Sipil ITS</p>
            <p style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 4 }}>Menyatakan menerima & menyetujui penyelesaian pekerjaan</p>
            <SignatureUpload value={ttd1} onChange={setTtd1} editMode={editMode} />
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>Gunawan Wibisono</p>
              <p style={{ fontSize: 11, color: '#555' }}>Sekretaris Jenderal PP Komjur ALSITS</p>
              <p style={{ fontSize: 11, color: '#888' }}>[Tempat], [Tanggal] [Bulan] 2026</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>PIHAK KEDUA</p>
            <p style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Developer Portal ALSITS</p>
            <p style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 4 }}>Menyatakan telah menyelesaikan & menyerahkan seluruh pekerjaan</p>
            <SignatureUpload value={ttd2} onChange={setTtd2} editMode={editMode} />
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>Hazril "abu_thariq" Firdhanni</p>
              <p style={{ fontSize: 11, color: '#555' }}>Developer Portal ALSITS</p>
              <p style={{ fontSize: 11, color: '#888' }}>[Tempat], [Tanggal] [Bulan] 2026</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div style={S.footer}>BAST-AKHIR/ALSITS/DIGITAL/001/2026 · Berita Acara Serah Terima Akhir — Portal ALSITS · Konfidensial</div>
    </div>
  );
}