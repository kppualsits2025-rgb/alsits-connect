import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';
import SignatureUpload from '@/components/docs/SignatureUpload';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.8 },
  section: { padding: '32px 56px' },
  h1: { fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '30%' },
  box: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  boxGreen: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5 },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 56px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const LEVEL_COLOR = { 'Kritis': '#dc2626', 'Tinggi': '#d97706', 'Sedang': '#2563eb', 'Rendah': '#666' };
const LEVEL_OPTS = ['Kritis', 'Tinggi', 'Sedang', 'Rendah'];

export default function UXResearch() {
  const [editMode, setEditMode] = useState(false);

  // Metadata dokumen
  const [docNomor, setDocNomor] = useState('UXR/ALSITS/DIGITAL/001/2026');
  const [p1Nama, setP1Nama] = useState('Hazril "abu_thariq" Firdhanni');
  const [p1Jabatan, setP1Jabatan] = useState('UX Researcher & Developer Portal ALSITS');
  const [p1Tanggal, setP1Tanggal] = useState('Maret 2026');
  const [p2Nama, setP2Nama] = useState('Gunawan Wibisono');
  const [p2Jabatan, setP2Jabatan] = useState('Sekretaris Jenderal PP Komjur ALSITS');
  const [p2Tanggal, setP2Tanggal] = useState('[Tanggal Persetujuan]');
  const [ttd1, setTtd1] = useState(null);
  const [ttd2, setTtd2] = useState(null);

  // Tabel A — Informasi Dokumen
  const [docInfo, setDocInfo] = useState([
    ['Judul', 'Laporan UX Research — Portal Alumni ALSITS'],
    ['Proyek', 'Redesign & Improvement Portal ALSITS (alsits.id)'],
    ['Nomor SPK', 'SPK/ALSITS/DIGITAL/001/2026'],
    ['Peneliti', 'Hazril "abu_thariq" Firdhanni — Developer & UX Researcher'],
    ['Periode', 'Januari — Maret 2026'],
    ['Metode', 'User Interview (kualitatif) + Survei online + Observasi langsung portal lama'],
    ['Jumlah Responden', '10 alumni representatif dari berbagai angkatan (S28–S51)'],
    ['Output Utama', 'Temuan, Persona, Pain Points, Rekomendasi, dan Benchmark'],
  ]);
  const updDocInfo = (i, col, val) => setDocInfo(r => r.map((row, idx) => idx === i ? (col === 0 ? [val, row[1]] : [row[0], val]) : row));
  const delDocInfo = (i) => setDocInfo(r => r.filter((_, idx) => idx !== i));
  const addDocInfo = () => setDocInfo(r => [...r, ['Field baru', 'Isi']]);

  // Tabel B — Metodologi
  const [metodologi, setMetodologi] = useState([
    ['User Interview (Semi-terstruktur)', 'Wawancara mendalam 30–45 menit dengan alumni dari berbagai segmen: fresh graduate, profesional mid-level, senior, dan pengurus ALSITS. Dilakukan via Zoom/Meet dan tatap muka.', '6 alumni'],
    ['Survei Online', 'Kuesioner Google Form dengan 25 pertanyaan tertutup dan terbuka, disebarkan via WhatsApp group angkatan dan grup ALSITS. Fokus pada kebiasaan penggunaan portal dan prioritas fitur.', '4 alumni + 6 data historis'],
    ['Heuristic Evaluation', 'Evaluasi mandiri terhadap portal lama (s32its.id, s51its.id, portal ALSITS sebelumnya) menggunakan 10 prinsip heuristik Nielsen. Dilakukan oleh peneliti dan 1 reviewer independen.', 'Peneliti + reviewer'],
    ['Competitive Benchmark', 'Analisis mendalam 4 portal alumni PT serupa: IKA ITS, IKA UI, Brawijaya Alumni, dan ITB Alumni. Fokus pada fitur, UX, dan best practice.', '4 platform'],
  ]);
  const updMetode = (i, col, val) => setMetodologi(r => r.map((row, idx) => idx === i ? row.map((v, j) => j === col ? val : v) : row));
  const delMetode = (i) => setMetodologi(r => r.filter((_, idx) => idx !== i));
  const addMetode = () => setMetodologi(r => [...r, ['Metode baru', 'Deskripsi', 'Sampel']]);

  // Ringkasan temuan
  const [ringkasan, setRingkasan] = useState('Dari 10 responden, 100% menyatakan portal alumni yang ada saat ini tidak memenuhi kebutuhan mereka. Masalah utama: tidak mobile-friendly, tidak bisa update profil mandiri, dan tidak bisa dicari di Google.');

  // Tabel C — Findings
  const [findings, setFindings] = useState([
    ['Profil tidak bisa diupdate sendiri', 'Kritis', '9 dari 10 responden', 'Self-service profil alumni'],
    ['Tampilan tidak mobile-friendly', 'Kritis', '8 dari 10 responden', 'Mobile-first redesign'],
    ['Tidak ada search alumni', 'Tinggi', '7 dari 10 responden', 'Global search bar'],
    ['Forum tidak aktif / tidak ada', 'Tinggi', '6 dari 10 responden', 'Forum diskusi terintegrasi'],
    ['Tidak ada direktori bisnis', 'Sedang', '5 dari 10 responden', 'Business Hub alumni'],
    ['Tidak ada notifikasi event', 'Sedang', '5 dari 10 responden', 'Sistem notifikasi in-app & email'],
    ['Loading lambat', 'Sedang', '4 dari 10 responden', 'Performance optimization & PWA'],
    ['Tidak ada statistik keanggotaan', 'Rendah', '3 dari 10 responden', 'Dashboard analitik admin'],
  ]);
  const updFinding = (i, col, val) => setFindings(r => r.map((row, idx) => idx === i ? row.map((v, j) => j === col ? val : v) : row));
  const cycleFindingLevel = (i) => {
    const cur = findings[i][1];
    const next = LEVEL_OPTS[(LEVEL_OPTS.indexOf(cur) + 1) % LEVEL_OPTS.length];
    updFinding(i, 1, next);
  };
  const delFinding = (i) => setFindings(r => r.filter((_, idx) => idx !== i));
  const addFinding = () => setFindings(r => [...r, ['Temuan baru', 'Sedang', 'x dari 10 responden', 'Rekomendasi']]);

  // Persona
  const [personas, setPersonas] = useState([
    { nama: 'Budi Santoso', angkatan: 'S32 (2014)', profil: 'Project Manager, Jakarta', kebutuhan: 'Ingin terhubung kembali dengan teman angkatan, mencari peluang bisnis dari jaringan alumni', pain: 'Portal lama sulit dicari di Google, tampilan tidak mobile-friendly, tidak bisa update kontak sendiri', solusi: 'Self-service profil, mobile-first design, global search alumni' },
    { nama: 'Sari Dewi', angkatan: 'S44 (2019)', profil: 'Fresh Graduate, Surabaya', kebutuhan: 'Mencari lowongan kerja dari alumni senior, ingin bergabung komunitas', pain: 'Tidak tahu portal alumni ada, tidak ada notifikasi kegiatan, forum tidak aktif', solusi: 'Landing page publik, sistem notifikasi, forum diskusi aktif' },
    { nama: 'Gunawan P.', angkatan: 'S28 (2009)', profil: 'Direktur BUMN, Jakarta', kebutuhan: 'Ingin rekrut alumni muda, showcase proyek perusahaan ke jaringan ALSITS', pain: 'Tidak ada direktori bisnis alumni, susah kontak alumni spesifik', solusi: 'Business Hub, direktori alumni dengan filter industri/jabatan' },
    { nama: 'Admin ALSITS', angkatan: '—', profil: 'Pengurus PP Komjur', kebutuhan: 'Kelola data alumni, update berita & event, pantau statistik keanggotaan', pain: 'Harus minta developer tiap kali update konten, tidak ada dashboard statistik', solusi: 'Admin panel mandiri, content management, dashboard analitik' },
  ]);
  const updPersona = (i, field, val) => setPersonas(r => r.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const delPersona = (i) => setPersonas(r => r.filter((_, idx) => idx !== i));
  const addPersona = () => setPersonas(r => [...r, { nama: 'Persona Baru', angkatan: 'Sxx (20xx)', profil: 'Profil', kebutuhan: 'Kebutuhan', pain: 'Pain points', solusi: 'Solusi' }]);

  // Rekomendasi
  const [rekomendasi, setRekomendasi] = useState([
    'Implementasi mobile-first design dengan Tailwind CSS responsive framework',
    'Self-service profile management — alumni dapat update data sendiri tanpa bantuan admin',
    'Global search bar yang mencakup alumni, berita, lowongan, dan forum',
    'Integrasi real-time data dari web angkatan (S32, S51) via API sync otomatis',
    'Business Hub — direktori usaha alumni dengan filter industri dan kontak',
    'Sistem notifikasi in-app dan email untuk event, ulang tahun, dan aktivitas forum',
    'Progressive Web App (PWA) untuk pengalaman seperti aplikasi mobile tanpa download',
    'Dashboard admin mandiri — pengurus bisa kelola konten tanpa ketergantungan developer',
    'Voting System OMOV untuk pemilihan pengurus secara digital dan terverifikasi',
  ]);
  const updRek = (i, val) => setRekomendasi(r => r.map((v, idx) => idx === i ? val : v));
  const delRek = (i) => setRekomendasi(r => r.filter((_, idx) => idx !== i));
  const addRek = () => setRekomendasi(r => [...r, 'Rekomendasi baru']);

  // Tabel F — Bukti Implementasi
  const [bukti, setBukti] = useState([
    ['Mobile-first responsive design', '✅ Selesai', 'Dapat diakses di alsits.id via HP'],
    ['Self-service profil alumni', '✅ Selesai', 'alsits.id/alumni → Klaim Profil'],
    ['Global search bar', '✅ Selesai', 'alsits.id/alumni → Search'],
    ['Integrasi API S32 & S51', '✅ Selesai', 'alsits.id/admin → Sync Data'],
    ['Business Hub', '✅ Selesai', 'alsits.id/business-hub'],
    ['Sistem notifikasi email (ulang tahun, event)', '✅ Selesai', 'Admin → Kirim Notifikasi'],
    ['PWA (installable)', '✅ Selesai', 'Browser → Install App'],
    ['Admin panel mandiri', '✅ Selesai', 'alsits.id/admin'],
    ['Voting System OMOV', '✅ Selesai', 'alsits.id/voting'],
  ]);
  const updBukti = (i, col, val) => setBukti(r => r.map((row, idx) => idx === i ? row.map((v, j) => j === col ? val : v) : row));
  const delBukti = (i) => setBukti(r => r.filter((_, idx) => idx !== i));
  const addBukti = () => setBukti(r => [...r, ['Fitur', '✅ Selesai', 'URL / Lokasi']]);

  // Kesimpulan
  const [kesimpulan, setKesimpulan] = useState('Penelitian UX ini membuktikan adanya kebutuhan nyata dari anggota ALSITS terhadap portal yang lebih modern, mobile-friendly, dan fungsional. Seluruh temuan dan rekomendasi penelitian telah berhasil diimplementasikan dalam platform alsits.id yang sekarang beroperasi, dan dapat diverifikasi langsung oleh PIHAK PERTAMA melalui akses langsung ke portal.');

  return (
    <div style={S.page}>
      <style>{`@media print { @page { size: A4; margin: 12mm 14mm 12mm 14mm; } html, body, #root { background: #fff !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } tr { page-break-inside: avoid; } thead { display: table-header-group; } h2 { page-break-after: avoid; } }`}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / Download PDF</button>
        <button onClick={() => setEditMode(e => !e)} style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk edit · 🗑️ hapus · + tambah</span>}
        <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginLeft: 'auto' }}>💡 "Save as PDF" di dialog print</span>
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Dokumen Phase 1 · <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} /></div>
          <h1 style={S.h1}>LAPORAN UX RESEARCH</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Redesign & Improvement Portal ALSITS — alsits.id</p>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#666', marginTop: 4 }}>Nomor: <EditableField value={docNomor} onChange={setDocNomor} editMode={editMode} /> · Periode: <EditableField value={p1Tanggal} onChange={setP1Tanggal} editMode={editMode} /></p>
        </div>

        {/* A. Informasi Dokumen */}
        <h2 style={S.h2}>A. Informasi Dokumen</h2>
        <table style={S.table}>
          <tbody>
            {docInfo.map(([l, v], i) => (
              <tr key={i}>
                <td style={S.tdL}><EditableField value={l} onChange={val => updDocInfo(i, 0, val)} editMode={editMode} /></td>
                <td style={{ ...S.td, width: '3%', textAlign: 'center', background: '#f5f7fb' }}>:</td>
                <td style={S.td}>
                  <EditableField value={v} onChange={val => updDocInfo(i, 1, val)} editMode={editMode} style={{ width: '100%' }} />
                  {editMode && <button onClick={() => delDocInfo(i)} style={{ marginLeft: 6, background: '#fee2e2', border: 'none', borderRadius: 4, padding: '1px 5px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={11} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={addDocInfo} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah baris</button>}

        {/* B. Metodologi */}
        <h2 style={S.h2}>B. Metodologi</h2>
        <p style={S.p}>Penelitian dilakukan menggunakan pendekatan <strong>mixed method</strong> yang menggabungkan data kualitatif dan kuantitatif untuk mendapatkan pemahaman menyeluruh tentang kebutuhan pengguna portal alumni ALSITS.</p>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '5%' }}>No.</th>
            <th style={{ ...S.th, width: '22%' }}>Metode</th>
            <th style={S.th}>Deskripsi</th>
            <th style={{ ...S.th, width: '16%' }}>Peserta/Sampel</th>
            {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
          </tr></thead>
          <tbody>
            {metodologi.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><strong><EditableField value={row[0]} onChange={v => updMetode(i, 0, v)} editMode={editMode} style={{ width: '100%' }} /></strong></td>
                <td style={S.td}><EditableField value={row[1]} onChange={v => updMetode(i, 1, v)} editMode={editMode} multiline style={{ width: '100%' }} /></td>
                <td style={S.td}><EditableField value={row[2]} onChange={v => updMetode(i, 2, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delMetode(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={addMetode} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah metode</button>}

        {/* C. Temuan */}
        <h2 style={S.h2}>C. Temuan Utama (Key Findings)</h2>
        <div style={S.box}><strong>📊 Ringkasan:</strong> <EditableField value={ringkasan} onChange={setRingkasan} editMode={editMode} multiline style={{ width: '90%' }} /></div>
        <table style={S.table}>
          <thead><tr>
            <th style={{ ...S.th, width: '5%' }}>No.</th>
            <th style={S.th}>Temuan</th>
            <th style={{ ...S.th, width: '12%' }}>Tingkat</th>
            <th style={{ ...S.th, width: '20%' }}>Prevalensi</th>
            <th style={{ ...S.th, width: '25%' }}>Rekomendasi Solusi</th>
            {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
          </tr></thead>
          <tbody>
            {findings.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.td}><EditableField value={row[0]} onChange={v => updFinding(i, 0, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, fontWeight: 700, color: LEVEL_COLOR[row[1]] || '#666', cursor: editMode ? 'pointer' : 'default' }}
                  onClick={() => editMode && cycleFindingLevel(i)} title={editMode ? 'Klik untuk ganti tingkat' : ''}>
                  {row[1]}
                </td>
                <td style={S.td}><EditableField value={row[2]} onChange={v => updFinding(i, 2, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={S.td}><EditableField value={row[3]} onChange={v => updFinding(i, 3, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delFinding(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={addFinding} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah temuan</button>}

        {/* D. Persona */}
        <h2 style={S.h2}>D. Persona Pengguna</h2>
        <p style={S.p}>Berdasarkan temuan interview dan survei, diidentifikasi {personas.length} ({personas.length === 1 ? 'satu' : personas.length === 2 ? 'dua' : personas.length === 3 ? 'tiga' : personas.length === 4 ? 'empat' : personas.length} ) persona pengguna utama yang merepresentasikan segmen alumni ALSITS:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {personas.map((p, i) => (
            <div key={i} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '14px 16px', background: i % 2 === 0 ? '#fff' : '#f8fafc', position: 'relative' }}>
              {editMode && <button onClick={() => delPersona(i)} style={{ position: 'absolute', top: 8, right: 8, background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={11} /></button>}
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', marginBottom: 2 }}>
                👤 <EditableField value={p.nama} onChange={v => updPersona(i, 'nama', v)} editMode={editMode} />
              </div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>
                <EditableField value={p.angkatan} onChange={v => updPersona(i, 'angkatan', v)} editMode={editMode} /> · <EditableField value={p.profil} onChange={v => updPersona(i, 'profil', v)} editMode={editMode} />
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}><strong>Kebutuhan:</strong> <EditableField value={p.kebutuhan} onChange={v => updPersona(i, 'kebutuhan', v)} editMode={editMode} multiline style={{ width: '90%' }} /></div>
              <div style={{ fontSize: 11, marginBottom: 4, color: '#dc2626' }}><strong>Pain Points:</strong> <EditableField value={p.pain} onChange={v => updPersona(i, 'pain', v)} editMode={editMode} multiline style={{ width: '90%' }} /></div>
              <div style={{ fontSize: 11, color: '#16a34a' }}><strong>Solusi Dirancang:</strong> <EditableField value={p.solusi} onChange={v => updPersona(i, 'solusi', v)} editMode={editMode} multiline style={{ width: '90%' }} /></div>
            </div>
          ))}
        </div>
        {editMode && <button onClick={addPersona} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah persona</button>}

        {/* E. Rekomendasi */}
        <h2 style={S.h2}>E. Rekomendasi Strategis</h2>
        <p style={S.p}>Berdasarkan temuan di atas, berikut rekomendasi yang menjadi dasar perancangan ulang portal ALSITS:</p>
        <ol style={{ paddingLeft: 20, marginBottom: 12, fontSize: 11.5 }}>
          {rekomendasi.map((r, i) => (
            <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ flex: 1 }}><EditableField value={r} onChange={v => updRek(i, v)} editMode={editMode} style={{ width: '100%' }} /></span>
              {editMode && <button onClick={() => delRek(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '1px 5px', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}><Trash2 size={11} /></button>}
            </li>
          ))}
        </ol>
        {editMode && <button onClick={addRek} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah rekomendasi</button>}

        {/* F. Bukti Implementasi */}
        <h2 style={S.h2}>F. Bukti Implementasi</h2>
        <div style={S.boxGreen}>
          <strong>✅ Status:</strong> Seluruh rekomendasi di atas telah diimplementasikan dalam portal alsits.id yang saat ini sudah live dan beroperasi. Portal dapat diakses dan diverifikasi langsung di <strong>https://alsits.id</strong>.
        </div>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Rekomendasi</th>
            <th style={{ ...S.th, width: '15%', textAlign: 'center' }}>Status</th>
            <th style={{ ...S.th, width: '30%' }}>Bukti / Link Verifikasi</th>
            {editMode && <th style={{ ...S.th, width: '5%' }}>Del</th>}
          </tr></thead>
          <tbody>
            {bukti.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={S.td}><EditableField value={row[0]} onChange={v => updBukti(i, 0, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                <td style={{ ...S.td, color: '#16a34a', fontWeight: 700, textAlign: 'center' }}><EditableField value={row[1]} onChange={v => updBukti(i, 1, v)} editMode={editMode} /></td>
                <td style={S.td}><span style={{ color: '#2563eb' }}><EditableField value={row[2]} onChange={v => updBukti(i, 2, v)} editMode={editMode} style={{ width: '100%' }} /></span></td>
                {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delBukti(i)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && <button onClick={addBukti} style={{ marginBottom: 12, background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={12} /> Tambah baris</button>}

        {/* G. Kesimpulan */}
        <h2 style={S.h2}>G. Kesimpulan</h2>
        <p style={S.p}><EditableField value={kesimpulan} onChange={setKesimpulan} editMode={editMode} multiline style={{ width: '100%' }} /></p>

        {/* Tanda Tangan */}
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

      <div style={S.footer}>{docNomor} · Laporan UX Research — Portal ALSITS · Konfidensial · alsits.id · 2026</div>
    </div>
  );
}