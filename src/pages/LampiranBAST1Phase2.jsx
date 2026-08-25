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
  { fitur: 'Platform staging live & dapat diakses di alsits.id (production)', catatan: 'Verified live di production', url: 'https://alsits.id' },
  { fitur: 'Implementasi design system baru ke seluruh halaman', catatan: 'Selesai seluruh halaman', url: '' },
  { fitur: 'Redesign navigasi flat IA + mega-menu + responsive mobile-first', catatan: 'Responsif di semua ukuran layar', url: '' },
  { fitur: 'Database Alumni — direktori lengkap dengan filter & search', catatan: 'Aktif, data dari S32 & S51', url: 'https://alsits.id/alumni' },
  { fitur: 'Halaman Profil Mandiri alumni (self-service update foto, jabatan, kontak)', catatan: 'Alumni dapat update mandiri', url: '' },
  { fitur: 'Integrasi API web angkatan S32 & S51 (sync otomatis tiap 30 menit)', catatan: 'Sync berjalan otomatis terjadwal', url: '' },
  { fitur: 'Peta Sebaran Alumni — visualisasi domisili & usaha per kota', catatan: 'Tampilkan 2 layer: domisili & bisnis', url: 'https://alsits.id/peta' },
  { fitur: 'Dashboard Statistik — grafik angkatan, industri, kota', catatan: 'Tersedia di halaman Dashboard', url: 'https://alsits.id/dashboard' },
  { fitur: 'Business Hub — direktori usaha & portofolio bisnis alumni', catatan: 'Filter per industri & kota', url: 'https://alsits.id/business-hub' },
  { fitur: 'Voting System OMOV — event voting, kandidat, DPT, OTP, hasil real-time', catatan: 'Sistem OTP email aktif', url: 'https://alsits.id/voting' },
  { fitur: 'Forum Diskusi & E-Library & Lowongan Kerja', catatan: 'Ketiga fitur aktif', url: 'https://alsits.id/forum' },
  { fitur: 'Sistem berita, event kegiatan, dan halaman konten statis', catatan: 'Aktif & dapat dikelola admin', url: 'https://alsits.id/berita' },
  { fitur: 'DPT Alumni — daftar pemilih yang dapat di-filter dan di-print', catatan: 'Dapat di-export & dicetak', url: 'https://alsits.id/dpt' },
  { fitur: 'Admin Panel — kelola berita, konten, sync data, user management', catatan: 'Akses admin aktif', url: 'https://alsits.id/admin' },
];

export default function LampiranBAST1Phase2() {
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [noLampiran, setNoLampiran] = useState('LAMP-B/BAST-1/ALSITS/DIGITAL/001/2026');
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
  const add = () => setItems(rows => [...rows, { fitur: 'Fitur baru', catatan: '', url: '' }]);

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
            LAMPIRAN B — DELIVERABLE PHASE 2
          </h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Core Development · Platform alsits.id Live Production</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>
            Nomor: <EditableField value={noLampiran} onChange={setNoLampiran} editMode={editMode} /> · Tanggal: <EditableField value={tanggal} onChange={setTanggal} editMode={editMode} />
          </p>
        </div>

        {/* Pernyataan */}
        <div style={{ background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 11.5, color: '#14532d' }}>
          <strong>✅ Status:</strong> Seluruh 14 fitur/deliverable Phase 2 (Core Development) telah <strong>selesai, live di production</strong>, dan dapat diakses melalui <strong>alsits.id</strong> sesuai SPK/ALSITS/DIGITAL/001/2026.
        </div>

        <h2 style={S.h2}>Daftar Deliverable Phase 2 (Core Development)</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '5%' }}>No.</th>
              <th style={S.th}>Deliverable / Fitur</th>
              <th style={{ ...S.th, width: '22%' }}>Catatan Verifikasi</th>
              <th style={{ ...S.th, width: '10%', textAlign: 'center' }}>Status</th>
              {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={i}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}>
                  <EditableField value={row.fitur} onChange={v => upd(i, 'fitur', v)} editMode={editMode} multiline style={{ width: '100%' }} />
                  {row.url && !editMode && (
                    <div style={{ marginTop: 3, fontSize: 10, color: '#3b82f6' }}>{row.url}</div>
                  )}
                  {editMode && (
                    <div style={{ marginTop: 4 }}>
                      <EditableField value={row.url} onChange={v => upd(i, 'url', v)} editMode={editMode} style={{ width: '100%', fontSize: 10, color: '#3b82f6' }} placeholder="URL (opsional)" />
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
            <Plus size={12} /> Tambah fitur
          </button>
        )}

        {/* Ringkasan */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 16px', marginBottom: 24, fontSize: 11 }}>
          <strong>Ringkasan:</strong> Total <strong>{items.length} deliverable</strong> Phase 2 telah selesai dan live di production. Platform dapat diakses publik di <strong>alsits.id</strong>.
        </div>

        {/* Tanda tangan */}
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

      <div style={S.footer}>LAMP-B/BAST-1/ALSITS/DIGITAL/001/2026 · Lampiran B — Deliverable Phase 2 (Core Development) · Konfidensial</div>
    </div>
  );
}