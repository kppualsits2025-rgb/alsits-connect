import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  section: { padding: '28px 48px' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '9px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_ITEMS = [
  { del: 'Laporan UX Research — metodologi, temuan, persona pengguna, benchmark, rekomendasi strategis', fmt: 'PDF / Dokumen digital', catatan: 'Tersedia dalam format digital', link: '' },
  { del: 'Figma Design System — color tokens, typography scale, component library, spacing & grid', fmt: 'Link Figma / Export PDF', catatan: 'Link Figma aktif, export tersedia', link: '' },
  { del: 'Interactive Prototype — demo klik-able 10+ halaman utama', fmt: 'Link Figma Prototype', catatan: 'Link prototype aktif & dapat diuji', link: '' },
  { del: 'Notulen Kick-off Meeting & Rencana Kerja', fmt: 'PDF (Cetak dari /notulen-kickoff)', catatan: 'Tersedia & dapat dicetak di portal', link: '/notulen-kickoff' },
];

export default function LampiranBAST1Phase1() {
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [noLampiran, setNoLampiran] = useState('LAMP-A/BAST-1/ALSITS/DIGITAL/001/2026');
  const [tanggal, setTanggal] = useState('12 Juni 2026');
  const [devSignature, setDevSignature] = useState(null);

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDevSignature(ev.target.result);
    reader.readAsDataURL(file);
  };

  const upd = (i, key, val) => setItems(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const del = (i) => setItems(rows => rows.filter((_, idx) => idx !== i));
  const add = () => setItems(rows => [...rows, { del: 'Deliverable baru', fmt: 'PDF', catatan: '', link: '' }]);

  return (
    <div style={S.page}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 14mm; }
          html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
      `}</style>

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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
            Lampiran BAST-1 · SPK/ALSITS/DIGITAL/001/2026
          </div>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 20, color: '#0b2d6b', marginBottom: 4 }}>
            LAMPIRAN A — DELIVERABLE PHASE 1
          </h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Foundation · UX Research, Design System & Prototype</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>
            Nomor: <EditableField value={noLampiran} onChange={setNoLampiran} editMode={editMode} /> · Tanggal: <EditableField value={tanggal} onChange={setTanggal} editMode={editMode} />
          </p>
        </div>

        {/* Pernyataan */}
        <div style={{ background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 11.5, color: '#14532d' }}>
          <strong>✅ Status:</strong> Seluruh deliverable Phase 1 (Foundation) telah <strong>diselesaikan dan diserahterimakan</strong> kepada PIHAK PERTAMA sesuai SPK/ALSITS/DIGITAL/001/2026.
        </div>

        <h2 style={S.h2}>Daftar Deliverable Phase 1 (Foundation)</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '5%' }}>No.</th>
              <th style={S.th}>Deliverable</th>
              <th style={{ ...S.th, width: '16%' }}>Format / Link</th>
              <th style={{ ...S.th, width: '18%' }}>Catatan</th>
              <th style={{ ...S.th, width: '10%', textAlign: 'center' }}>Status</th>
              {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={i}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><EditableField value={row.del} onChange={v => upd(i, 'del', v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={S.td}>
                  <EditableField value={row.fmt} onChange={v => upd(i, 'fmt', v)} editMode={editMode} style={{ width: '100%' }} />
                  {row.link && !editMode && (
                    <div style={{ marginTop: 4 }}>
                      <a href={row.link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 10, color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {row.link}
                      </a>
                    </div>
                  )}
                  {editMode && (
                    <div style={{ marginTop: 4 }}>
                      <EditableField value={row.link || ''} onChange={v => upd(i, 'link', v)} editMode={editMode}
                        style={{ width: '100%', fontSize: 10, color: '#2563eb' }} placeholder="URL / Link (opsional)" />
                    </div>
                  )}
                </td>
                <td style={S.td}><EditableField value={row.catatan} onChange={v => upd(i, 'catatan', v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, textAlign: 'center', color: '#16a34a', fontWeight: 700, fontSize: 13 }}>✅<br /><span style={{ fontSize: 10 }}>Selesai</span></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => del(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && (
          <button onClick={add} style={{ marginBottom: 16, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={12} /> Tambah deliverable
          </button>
        )}

        {/* Tanda tangan konfirmasi */}
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* PIHAK PERTAMA */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>Diterima oleh — PIHAK PERTAMA</p>
            <p style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Komisariat Jurusan Alumni Teknik Sipil ITS</p>
            <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            <div className="no-print" style={{ height: editMode ? 32 : 0 }} />
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>[Nama]</p>
              <p style={{ fontSize: 11, color: '#555' }}>[Jabatan]</p>
              <p style={{ fontSize: 11, color: '#888' }}>[Tempat], [Tanggal] 2026</p>
            </div>
          </div>
          {/* PIHAK KEDUA */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>Diserahkan oleh — PIHAK KEDUA</p>
            <p style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Developer Portal ALSITS</p>
            <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {devSignature
                ? <img src={devSignature} alt="TTD Developer" style={{ maxHeight: 86, maxWidth: 220, objectFit: 'contain' }} />
                : <div className="no-print" style={{ border: '1.5px dashed #cbd5e1', borderRadius: 6, padding: '8px 20px', color: '#94a3b8', fontSize: 10, fontStyle: 'italic' }}>[tanda tangan]</div>
              }
            </div>
            {editMode
              ? <div className="no-print" style={{ display: 'flex', gap: 6, justifyContent: 'center', height: 32, alignItems: 'center' }}>
                  <label style={{ cursor: 'pointer', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#2563eb', fontWeight: 600 }}>
                    📎 Upload TTD
                    <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{ display: 'none' }} />
                  </label>
                  {devSignature && (
                    <button onClick={() => setDevSignature(null)} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 5, padding: '4px 12px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>🗑 Hapus</button>
                  )}
                </div>
              : <div style={{ height: 0 }} />
            }
            <div style={{ borderTop: '1px solid #333', paddingTop: 8 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>Hazril "abu_thariq" Firdhanni</p>
              <p style={{ fontSize: 11, color: '#555' }}>Developer Portal ALSITS</p>
              <p style={{ fontSize: 11, color: '#888' }}>Kab. Bekasi, 12 Juni 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div style={S.footer}>LAMP-A/BAST-1/ALSITS/DIGITAL/001/2026 · Lampiran A — Deliverable Phase 1 (Foundation) · Konfidensial</div>
    </div>
  );
}