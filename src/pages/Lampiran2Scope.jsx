import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureBlock from '@/components/docs/SignatureBlock';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  section: { padding: '32px 48px' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdAlt: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top', background: '#f8fafc' },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_MODULES = [
  { modul: 'Direktori Alumni', desc: 'Database alumni lengkap dengan filter angkatan, kota, industri, keahlian. Tampilan kartu + tabel.' },
  { modul: 'Profil Mandiri Alumni (Self-Service)', desc: 'Setiap alumni dapat memperbarui foto, jabatan, perusahaan, kontak, dan bio secara mandiri.' },
  { modul: 'Peta Sebaran Alumni', desc: 'Visualisasi peta interaktif: marker per kota dengan clustering. Dua tab: Domisili & Usaha.' },
  { modul: 'Dashboard Statistik', desc: 'Grafik distribusi per angkatan, bidang industri, kota, dan tren pertumbuhan anggota.' },
  { modul: 'Business Hub', desc: 'Direktori usaha/bisnis alumni. Profil perusahaan, kategori, kontak, dan tags produk/layanan.' },
  { modul: 'Voting System OMOV', desc: 'One Member One Vote: event voting, manajemen kandidat, DPT, OTP email, hasil real-time.' },
  { modul: 'Forum Diskusi', desc: 'Thread tematik per bidang keahlian (Struktur, Geoteknik, dll) dengan reply & moderasi.' },
  { modul: 'E-Library', desc: 'Upload & akses dokumen teknis: jurnal, skripsi, modul, standar teknis dengan filter kategori.' },
  { modul: 'Lowongan Kerja & Proyek', desc: 'Board lowongan kerja, magang, freelance, dan proyek yang diposting sesama alumni.' },
  { modul: 'Berita & Pengumuman', desc: 'Manajemen berita, artikel, dan pengumuman resmi dengan kategori dan gambar cover.' },
  { modul: 'Event & Kegiatan', desc: 'Kalender kegiatan ALSITS, angkatan, dan komunitas. Galeri foto & video per event.' },
  { modul: 'Halaman Konten Statis', desc: 'Sejarah, Sambutan Ketua, Struktur Organisasi, Visi-Misi, Prestasi Alumni, Kontribusi.' },
  { modul: 'Komunitas Alumni', desc: '4 halaman komunitas: Gowes, Golf, Jalan Sehat, Trading — konten dapat dikelola admin.' },
  { modul: 'DPT (Daftar Pemilih Tetap)', desc: 'Daftar alumni aktif yang dapat dipilih. Filter angkatan & gelar, dapat di-print sebagai dokumen resmi.' },
  { modul: 'Admin Panel', desc: 'Dashboard admin: CRUD berita, event, konten, sinkronisasi data S32/S51, manajemen user.' },
  { modul: 'Sinkronisasi Data Angkatan', desc: 'Sync otomatis setiap 30 menit dari S32 dan S51. Backend functions dengan rate-limit handling.' },
  { modul: 'Global Search', desc: 'Pencarian lintas konten: alumni, berita, lowongan, forum — dari satu search bar.' },
  { modul: 'Notifikasi & Activity Feed', desc: 'Feed aktivitas terbaru alumni. Sistem notifikasi in-app.' },
  { modul: 'Onboarding Flow Anggota Baru', desc: 'Alur pendaftaran 3-langkah untuk anggota baru yang baru bergabung.' },
  { modul: 'Sistem Autentikasi & RLS', desc: 'Login berbasis Base44 Auth. Row Level Security per entitas (admin vs user vs publik).' },
];

const DEFAULT_SIGNATORIES = [
  { role: 'PIHAK PERTAMA (ALSITS)', sub: '', name: 'Gunawan Wibisono', jabatan: 'Sekretaris Jenderal PP Komjur ALSITS', signatureUrl: null },
  { role: 'PIHAK KEDUA (Developer)', sub: '', name: 'Hazril Firdhanni', jabatan: 'Perancang & Developer Portal ALSITS', signatureUrl: null },
];

export default function Lampiran2Scope() {
  const [editMode, setEditMode] = useState(false);
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [nomorSpk, setNomorSpk] = useState('001/SPK-KOMJUR-ALSITS/VI/2026');
  const [signatories, setSignatories] = useState(DEFAULT_SIGNATORIES);

  const upd = (i, key, val) => setModules(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const del = (i) => setModules(rows => rows.filter((_, idx) => idx !== i));
  const add = () => setModules(rows => [...rows, { modul: 'Modul baru', desc: 'Deskripsi modul' }]);
  const updSign = (i, field, val) => setSignatories(s => s.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div style={S.page}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 14mm 12mm 14mm; }
          html, body, #root, [data-radix-dialog-overlay], .min-h-screen { background: #fff !important; color: #1a1a1a !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
          .sign-block { page-break-inside: avoid; page-break-before: auto; }
        }
      `}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / PDF</button>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <button onClick={add} style={{ background: '#eff6ff', border: '1px solid #93c5fd', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', color: '#2563eb', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={13} /> Tambah Modul</button>}
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk edit · 🗑️ hapus</span>}
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
            Lampiran 2 ·{' '}
            {editMode
              ? <input value={nomorSpk} onChange={e => setNomorSpk(e.target.value)} style={{ border: '1px solid #93c5fd', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'Arial, sans-serif', color: '#333', letterSpacing: 1, width: 280 }} />
              : nomorSpk
            }
          </div>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b', marginBottom: 4 }}>SCOPE OF WORK & DAFTAR DELIVERABLES</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Redesign & Improvement Portal ALSITS — alsits.id · 2026</p>
        </div>

        <h2 style={S.h2}>Lingkup Pekerjaan</h2>
        <p style={S.p}>Dokumen ini merinci seluruh modul, fitur, dan deliverable yang menjadi lingkup pekerjaan dalam proyek <strong>Redesign & Improvement Portal Digital ALSITS (alsits.id)</strong> sebagaimana dimaksud dalam {nomorSpk}.</p>

        <h2 style={S.h2}>Daftar Modul & Fitur</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '5%' }}>No.</th>
              <th style={{ ...S.th, width: '30%' }}>Modul / Fitur</th>
              <th style={S.th}>Deskripsi & Cakupan</th>
              <th style={{ ...S.th, width: '10%', textAlign: 'center' }}>Selesai</th>
              {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
            </tr>
          </thead>
          <tbody>
            {modules.map((row, i) => (
              <tr key={i}>
                <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}>{i + 1}</td>
                <td style={i % 2 === 0 ? S.td : S.tdAlt}><strong><EditableField value={row.modul} onChange={v => upd(i, 'modul', v)} editMode={editMode} style={{ width: '100%' }} /></strong></td>
                <td style={i % 2 === 0 ? S.td : S.tdAlt}><EditableField value={row.desc} onChange={v => upd(i, 'desc', v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center', fontSize: 14 }}>☐</td>
                {editMode && <td style={{ ...(i % 2 === 0 ? S.td : S.tdAlt), textAlign: 'center' }}><button onClick={() => del(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>Kriteria Penerimaan (Acceptance Criteria)</h2>
        <ul style={{ paddingLeft: 20, fontSize: 11.5, marginBottom: 12 }}>
          {[
            'Platform dapat diakses di alsits.id tanpa error kritis',
            'Semua halaman responsive di mobile (320px+) dan desktop',
            'Admin Panel berfungsi penuh untuk kelola berita, konten, dan data',
            'Sinkronisasi data S32 & S51 berjalan otomatis tanpa intervensi manual',
            'Voting System dapat dijalankan dari awal hingga publikasi hasil',
            'Lighthouse Performance score ≥ 80 di mobile',
            'Semua modul telah melalui UAT (User Acceptance Testing) oleh PIHAK PERTAMA',
          ].map((item, i) => <li key={i} style={{ marginBottom: 5 }}>{item}</li>)}
        </ul>

        <h2 style={S.h2}>Di Luar Lingkup (Out of Scope)</h2>
        <ul style={{ paddingLeft: 20, fontSize: 11.5, marginBottom: 12 }}>
          {[
            'Pengembangan aplikasi mobile native (Android/iOS) — platform menggunakan PWA',
            'Integrasi payment gateway untuk transaksi keuangan alumni',
            'Pembuatan konten berita, foto, atau materi marketing',
            'Pengelolaan data alumni secara manual oleh developer setelah serah terima',
            'Layanan hosting/domain (biaya ditagihkan terpisah sebagai reimbursement)',
          ].map((item, i) => <li key={i} style={{ marginBottom: 5 }}>{item}</li>)}
        </ul>

        {/* Blok Tanda Tangan */}
        <div className="sign-block" style={{ marginTop: 24 }}>
          <SignatureBlock signatories={signatories} onChange={updSign} editMode={editMode} />
        </div>
      </div>

      <div style={S.footer}>Lampiran 2 · {nomorSpk} · Scope of Work & Deliverables — Portal ALSITS · Konfidensial</div>
    </div>
  );
}