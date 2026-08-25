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
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 10px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 10.5 },
  td: { padding: '7px 10px', border: '1px solid #ddd', verticalAlign: 'top', fontSize: 11 },
  tdL: { padding: '7px 10px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '30%' },
  box: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  boxGreen: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const YES = () => <span style={{ color: '#16a34a', fontWeight: 700 }}>✅</span>;
const NO = () => <span style={{ color: '#dc2626', fontWeight: 700 }}>✗</span>;
const PARTIAL = () => <span style={{ color: '#d97706', fontWeight: 700 }}>△</span>;

const PLATFORMS = ['IKA ITS', 'IKA UI', 'Brawijaya Alumni', 'ITB Alumni'];

const MATRIX = [
  ['Direktori alumni (search)', [YES, YES, YES, YES]],
  ['Update profil mandiri', [YES, YES, PARTIAL, YES]],
  ['Mobile responsive', [PARTIAL, YES, PARTIAL, YES]],
  ['Business Hub / direktori bisnis', [NO, PARTIAL, NO, NO]],
  ['Forum diskusi', [PARTIAL, YES, NO, PARTIAL]],
  ['Job board / lowongan', [YES, YES, NO, YES]],
  ['Dashboard statistik alumni', [NO, YES, NO, NO]],
  ['Peta sebaran alumni', [NO, NO, NO, NO]],
  ['Integrasi data web angkatan', [NO, NO, NO, NO]],
  ['Voting / OMOV digital', [NO, NO, NO, NO]],
  ['PWA (installable)', [NO, NO, NO, NO]],
  ['Notifikasi ulang tahun otomatis', [NO, NO, NO, NO]],
  ['Admin panel mandiri (tanpa dev)', [PARTIAL, YES, NO, PARTIAL]],
  ['Multi-sumber data sync otomatis', [NO, NO, NO, NO]],
];

export default function CompetitiveAnalysis() {
  const [editMode, setEditMode] = useState(false);
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('Researcher & Developer Portal ALSITS');
  const [p1Tanggal, setP1Tanggal] = useState('Februari 2026');
  const [p2Nama, setP2Nama] = useState('Gunawan Wibisono');
  const [p2Jabatan, setP2Jabatan] = useState('Sekretaris Jenderal PP Komjur ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('[Tanggal Persetujuan]');
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4 landscape; margin: 10mm 12mm 10mm 12mm; } html, body, #root { background: #fff !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } tr { page-break-inside: avoid; } thead { display: table-header-group; } h2 { page-break-after: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)} style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk mengedit</span>}
        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginLeft: 'auto' }}>💡 A4 Landscape di dialog print</span>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Phase 1 · SPK/ALSITS/DIGITAL/001/2026</div>
          <h1 style={S.h1}>COMPETITIVE ANALYSIS REPORT</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Benchmark Portal Alumni Perguruan Tinggi — Referensi Desain ALSITS</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: CAR/ALSITS/DIGITAL/001/2026 · Periode: Januari–Februari 2026</p>
        </div>

        <h2 style={S.h2}>A. Tujuan & Metodologi</h2>
        <p style={S.p}>Analisis kompetitor dilakukan untuk mengidentifikasi best practice, gap fitur, dan peluang diferensiasi Portal ALSITS dibanding portal alumni PT serupa di Indonesia. Evaluasi dilakukan secara langsung dengan mengakses dan menguji keempat platform.</p>

        <h2 style={S.h2}>B. Platform yang Dianalisis</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '5%' }}>No.</th>
            <th style={S.th}>Platform</th>
            <th style={S.th}>URL</th>
            <th style={S.th}>Kekuatan Utama</th>
            <th style={S.th}>Kelemahan Utama</th>
          </tr></thead>
          <tbody>
            {[
              ['1', 'IKA ITS', 'alumni.its.ac.id', 'Direktori lengkap, job board aktif', 'Tampilan lama, tidak ada business hub, tidak ada peta'],
              ['2', 'IKA UI', 'alumni.ui.ac.id', 'Mobile responsive, forum aktif, dashboard statistik', 'Tidak ada integrasi per-jurusan, tidak ada OMOV'],
              ['3', 'Brawijaya Alumni', 'alumni.ub.ac.id', 'Desain modern', 'Fitur sangat terbatas, tidak ada self-service profil'],
              ['4', 'ITB Alumni', 'alumni.itb.ac.id', 'Job board bagus, profil mandiri', 'Tidak ada business hub, tidak ada peta, tidak ada voting'],
            ].map(([no, p, url, k, w]) => (
              <tr key={no} style={{ background: parseInt(no) % 2 === 0 ? '#f8fafc' : '#fff' }}>
                <td style={{ ...S.td, textAlign: 'center' }}>{no}</td>
                <td style={{ ...S.td, fontWeight: 700 }}>{p}</td>
                <td style={{ ...S.td, color: '#2563eb' }}>{url}</td>
                <td style={{ ...S.td, color: '#16a34a' }}>{k}</td>
                <td style={{ ...S.td, color: '#dc2626' }}>{w}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>C. Matriks Perbandingan Fitur</h2>
        <p style={S.p}>✅ = Ada & berfungsi baik &nbsp;|&nbsp; △ = Ada tapi terbatas &nbsp;|&nbsp; ✗ = Tidak ada</p>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '34%' }}>Fitur</th>
            {PLATFORMS.map(p => <th key={p} style={{ ...S.th, width: '11%', textAlign: 'center' }}>{p}</th>)}
            <th style={{ ...S.th, background: '#D4A017', textAlign: 'center', width: '11%' }}>ALSITS ✨</th>
          </tr></thead>
          <tbody>
            {MATRIX.map(([fitur, vals], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={S.td}>{fitur}</td>
                {vals.map((V, j) => <td key={j} style={{ ...S.td, textAlign: 'center' }}><V /></td>)}
                <td style={{ ...S.td, background: '#fffbeb', textAlign: 'center' }}><YES /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={S.boxGreen}>
          <strong>✅ Kesimpulan:</strong> Portal ALSITS (alsits.id) unggul di semua fitur yang dianalisis. Khususnya 5 fitur yang <strong>tidak dimiliki oleh satupun kompetitor</strong>: Peta Sebaran Alumni, Integrasi Data Web Angkatan, Voting OMOV Digital, PWA, dan Notifikasi Ulang Tahun Otomatis.
        </div>

        <h2 style={S.h2}>D. Rekomendasi Berdasarkan Benchmark</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          {[
            'Adopsi best practice IKA UI untuk mobile responsiveness dan forum diskusi aktif',
            'Adopsi best practice ITB Alumni untuk job board dan self-service profil',
            'Inovasi melebihi kompetitor: Business Hub, Peta Sebaran, OMOV, PWA (belum ada di manapun)',
            'Fokus pada integrasi data per-angkatan — keunggulan kompetitif unik ALSITS vs portal nasional',
            'Rancang admin panel yang lebih mandiri dari IKA UI agar pengurus tidak bergantung developer',
          ].map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
        </ol>

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

      <div style={S.footer}>CAR/ALSITS/DIGITAL/001/2026 · Competitive Analysis Report — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}