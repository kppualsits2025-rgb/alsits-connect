import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Star, Users, ChevronDown, ChevronUp,
  AlertTriangle, Info, CheckCircle2, BookOpen,
  Database, UserCheck, Bell, Settings, FileSpreadsheet,
  Trash2, Edit3, UserPlus, Map, BarChart3, Newspaper,
  Calendar, Lock, Phone
} from 'lucide-react';

/* ─── Komponen kecil ─── */
const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    admin_cs: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    user: 'bg-white/10 text-white/60 border border-white/20',
  };
  const icons = { admin: '🛡️', admin_cs: '⭐', user: '👤' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${styles[role]}`}>
      {icons[role]} {role}
    </span>
  );
};

const InfoBox = ({ type = 'info', children }) => {
  const cfg = {
    info: { bg: 'bg-blue-500/10 border-blue-500/30', icon: <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" /> },
    warning: { bg: 'bg-amber-500/10 border-amber-500/30', icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> },
    success: { bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> },
  };
  const c = cfg[type];
  return (
    <div className={`flex gap-3 p-3 rounded-xl border text-sm text-white/80 leading-relaxed ${c.bg}`}>
      {c.icon}
      <span>{children}</span>
    </div>
  );
};

const StepItem = ({ num, title, children }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary font-mono">
      {num}
    </div>
    <div className="flex-1 pt-0.5 space-y-2">
      <h4 className="font-heading font-bold text-white text-base">{title}</h4>
      {children}
    </div>
  </div>
);



const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-white/10 p-6 space-y-4 ${className}`}
    style={{ background: 'rgba(255,255,255,0.04)' }}>
    {children}
  </div>
);

const Accordion = ({ title, icon, badge, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-heading font-bold text-white">{title}</span>
          {badge && <RoleBadge role={badge} />}
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
      </button>
      {open && (
        <div className="px-5 pb-6 space-y-4 border-t border-white/10 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── KONTEN UTAMA ─── */
export default function PanduanAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen py-10" style={{ background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 50%,#060d1f 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── COVER ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest font-mono px-3 py-1 rounded-full"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>
              DOKUMEN INTERNAL
            </span>
          </div>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-2">Panduan Admin & CS</h1>
          <p className="text-white/60 text-lg mb-4">
            Tugas, wewenang &amp; tanggung jawab pengelola portal <strong className="text-white/80">ALSITS</strong> — Alumni Teknik Sipil ITS
          </p>
          <div className="flex flex-wrap gap-2">
            <RoleBadge role="admin" />
            <RoleBadge role="admin_cs" />
          </div>
        </div>

        {/* ── TABEL HAK AKSES ── */}
        <Card className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-lg text-white">Perbandingan Hak Akses: admin vs admin_cs vs user</h2>
          </div>
          <p className="text-sm text-white/50 mb-4">Tabel ini menunjukkan apa saja yang bisa dan tidak bisa dilakukan oleh masing-masing role.</p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <th className="text-left px-4 py-3 font-heading font-bold text-white/70">Fitur / Aksi</th>
                  <th className="text-center px-4 py-3 font-heading font-bold"><RoleBadge role="admin" /></th>
                  <th className="text-center px-4 py-3 font-heading font-bold"><RoleBadge role="admin_cs" /></th>
                  <th className="text-center px-4 py-3 font-heading font-bold"><RoleBadge role="user" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['Lihat direktori alumni', true, true, true],
                  ['Edit data profil alumni lain', true, true, false],
                  ['Tambah alumni baru (manual)', true, true, false],
                  ['Hapus data alumni', true, true, false],
                  ['Sync data dari S32 / S51', true, false, false],
                  ['Bulk import dari Excel', true, false, false],
                  ['Kelola berita & pengumuman (tambah/edit/hapus)', true, false, false],
                  ['Kelola event kegiatan (tambah/edit/hapus)', true, false, false],
                  ['Kelola konten halaman statis (Sejarah, Sambutan, dll)', true, false, false],
                  ['Manage Voting OMOV (kandidat, DPT, event)', true, false, false],
                  ['Undang user baru (role admin)', true, false, false],
                  ['Undang user baru (role user)', true, true, false],
                  ['Lihat & edit profil sendiri', true, true, true],
                  ['Akses dashboard statistik', true, true, true],
                  ['Akses peta sebaran alumni', true, true, true],
                  ['Posting di Forum Diskusi', true, true, true],
                  ['Akses Business Hub', true, true, true],
                  ['Lihat DPT alumni', true, true, true],
                ].map(([label, adm, cs, usr], i) => (
                  <tr key={i} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white/80">{label}</td>
                    <td className="px-4 py-3 text-center">{adm ? '✅' : <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-3 text-center">{cs ? '✅' : <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-3 text-center">{usr ? '✅' : <span className="text-white/20">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── TUGAS admin_cs ── */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-6 w-6 text-amber-400" />
            <h2 className="font-heading font-bold text-xl text-white">Tugas &amp; Tanggung Jawab: <span className="text-amber-300">admin_cs</span> (Customer Service)</h2>
          </div>
          <p className="text-white/60 text-sm mb-5">
            Role <RoleBadge role="admin_cs" /> adalah <strong className="text-white/80">operator harian portal</strong>. Bertugas membantu anggota, memastikan data akurat, dan menjaga kelancaran operasional.{' '}
            <strong className="text-amber-300">admin_cs TIDAK bisa mengelola berita/event, melakukan sync data, atau memberi akses admin kepada orang lain.</strong>
          </p>

          {/* Seksi ① */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">①</span>
              PENGELOLAAN DATA ALUMNI
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <StepItem num={1} title="Mengupdate Data Profil Alumni">
              <p className="text-sm text-white/70">Saat alumni melaporkan perubahan data (pindah kota, ganti perusahaan, nomor HP baru), admin_cs wajib mengupdate data di sistem.</p>
              <InfoBox type="info">
                Cara: Menu <strong>Alumni</strong> → <strong>Database Alumni</strong> → cari nama → klik ikon edit (✏️) → ubah field yang perlu → klik <strong>Simpan Perubahan</strong>.
              </InfoBox>
            </StepItem>

            <StepItem num={2} title="Menandai Status Almarhum / Almarhumah">
              <p className="text-sm text-white/70">Jika menerima laporan bahwa alumni telah berpulang, ubah status profil menjadi <em>Almarhum</em> atau <em>Almarhumah</em>.</p>
              <InfoBox type="info">
                Cara: Database Alumni → cari nama → klik edit → ubah field <strong>Status</strong> menjadi <em>Almarhum</em> atau <em>Almarhumah</em> → Simpan.
              </InfoBox>
              <InfoBox type="warning">
                Setelah ditandai Almarhum/Almarhumah, profil tersebut akan otomatis <strong>disembunyikan dari direktori, peta, DPT, dan semua halaman listing alumni</strong>. Pastikan kabar sudah dikonfirmasi sebelum mengubah status ini.
              </InfoBox>
            </StepItem>

            <StepItem num={3} title="Menambah Alumni Baru (Manual)">
              <p className="text-sm text-white/70">Jika ada alumni yang belum terdaftar di sistem, admin_cs bisa menambahkan secara manual satu per satu.</p>
              <InfoBox type="info">
                Cara: Database Alumni → tombol <strong>+ Tambah Alumni</strong> → isi data minimal (Nama Lengkap, NRM/NRP, Angkatan) → Simpan.
              </InfoBox>
              <InfoBox type="warning">
                Untuk import massal dari Excel, hubungi admin utama. Fitur bulk import hanya tersedia untuk role admin.
              </InfoBox>
            </StepItem>

            <StepItem num={4} title="Memeriksa Konsistensi Data">
              <p className="text-sm text-white/70">Secara berkala, periksa apakah ada data alumni yang kosong, duplikat, atau tidak konsisten (nama, angkatan, NRP).</p>
              <InfoBox type="info">
                Gunakan halaman <strong>Dashboard Statistik</strong> untuk melihat ringkasan data dan filter per angkatan.
              </InfoBox>
            </StepItem>
          </div>

          {/* Seksi ② */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">②</span>
              PENGELOLAAN AKUN USER
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <StepItem num={5} title="Mengundang Alumni untuk Mendaftar (Login)">
              <p className="text-sm text-white/70">Ketika alumni ingin bisa login ke portal, admin_cs bisa mengundang mereka melalui email dengan role <em>user</em>.</p>
              <InfoBox type="info">
                Cara: Halaman <strong>Admin Panel</strong> → bagian <strong>Undang User</strong> → masukkan email alumni → pilih role <em>user</em> → kirim undangan.
              </InfoBox>
              <InfoBox type="warning">
                Admin_cs hanya boleh mengundang dengan role <strong>user</strong>. Untuk mengundang role admin, harus dilakukan oleh admin utama.
              </InfoBox>
            </StepItem>

            <StepItem num={6} title="Memastikan Satu Profil Satu Akun">
              <p className="text-sm text-white/70">Setiap profil alumni hanya boleh dimiliki oleh satu akun email. Jika terjadi duplikasi atau kebingungan, segera koordinasikan dengan admin utama.</p>
              <InfoBox type="warning">
                Jika ada konflik data antara dua alumni dengan nama mirip, jangan langsung hapus — verifikasi dulu via WhatsApp / komunikasi langsung.
              </InfoBox>
            </StepItem>
          </div>

          {/* Seksi ③ */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">③</span>
              MONITORING & PELAPORAN
            </p>
          </div>
          <div className="space-y-6">
            <StepItem num={7} title="Memantau Aktivitas Forum Diskusi">
              <p className="text-sm text-white/70">Pantau halaman Forum Diskusi secara rutin. Jika ada posting yang tidak pantas atau SARA, laporkan ke admin utama.</p>
              <InfoBox type="warning">
                Admin_cs tidak bisa menghapus posting forum. Laporkan dengan menyertakan nama anggota dan screenshot konten bermasalah.
              </InfoBox>
            </StepItem>

            <StepItem num={8} title="Melaporkan Masalah Teknis ke Admin Utama">
              <p className="text-sm text-white/70">Jika menemukan bug, data rusak, atau masalah teknis yang tidak bisa diselesaikan, segera laporkan ke admin utama dengan detail: nama alumni terkait, langkah yang sudah dicoba, dan screenshot jika ada.</p>
            </StepItem>
          </div>
        </Card>

        {/* ── TUGAS admin ── */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <h2 className="font-heading font-bold text-xl text-white">Tugas &amp; Tanggung Jawab: <span className="text-blue-300">admin</span> (Administrator Utama)</h2>
          </div>
          <p className="text-white/60 text-sm mb-5">
            Role <RoleBadge role="admin" /> memiliki semua wewenang admin_cs <strong className="text-blue-300">PLUS</strong> kendali penuh atas konten, sinkronisasi data, dan konfigurasi sistem.
          </p>

          <div className="rounded-xl border border-white/10 p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm text-white/70">
              ✅ Admin utama dapat melakukan <strong className="text-white">semua yang bisa dilakukan admin_cs</strong>. Lihat bagian sebelumnya.
            </p>
          </div>

          {/* Seksi ① */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">①</span>
              PENGELOLAAN KONTEN
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <StepItem num={1} title="Membuat & Mengelola Berita / Pengumuman">
              <p className="text-sm text-white/70">Buat pengumuman, artikel berita, atau info kegiatan yang relevan untuk seluruh alumni ALSITS.</p>
              <InfoBox type="info">
                Cara: Menu dropdown User → <strong>Admin Panel</strong> → klik <strong>+ Tambah Berita</strong> → isi judul, kategori, konten, gambar cover → set status <em>Published</em> → Simpan.
              </InfoBox>
              <InfoBox type="success">
                Gunakan tombol 👁️ (toggle publish) untuk menyembunyikan atau menampilkan artikel kapan saja tanpa menghapus konten.
              </InfoBox>
            </StepItem>

            <StepItem num={2} title="Mengelola Event & Kegiatan">
              <p className="text-sm text-white/70">Tambahkan event reuni, webinar, olahraga, atau kegiatan angkatan. Lengkapi dengan tanggal, lokasi, deskripsi, dan gambar cover.</p>
              <InfoBox type="info">
                Cara: Menu dropdown User → <strong>Admin Konten</strong> → tab <strong>Events</strong> → klik <strong>+ Buat Event</strong> → isi semua field → Simpan.
              </InfoBox>
              <InfoBox type="warning">
                Isi gambar cover dengan resolusi minimal 800×600px untuk tampilan optimal di halaman utama.
              </InfoBox>
            </StepItem>

            <StepItem num={3} title="Mengelola Halaman Statis">
              <p className="text-sm text-white/70">Update konten halaman Sejarah, Sambutan Ketua, Struktur Organisasi, Visi-Misi, Prestasi, Kontribusi, dan halaman Komunitas.</p>
              <InfoBox type="info">
                Cara: Menu dropdown User → <strong>Admin Konten</strong> → pilih tab halaman yang ingin diedit → ubah konten → Simpan.
              </InfoBox>
            </StepItem>
          </div>

          {/* Seksi ② */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">②</span>
              SINKRONISASI DATA
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <StepItem num={4} title="Sync Data Alumni dari S32 ITS">
              <p className="text-sm text-white/70">Sinkronkan data profil dan kegiatan usaha alumni dari web s32its.id ke database ALSITS secara berkala (otomatis setiap 30 menit, bisa manual juga).</p>
              <InfoBox type="info">
                Cara Manual: Halaman <strong>Admin Panel</strong> → tab <strong>Sinkronisasi</strong> → klik <strong>Sync dari S32</strong>.
              </InfoBox>
              <InfoBox type="warning">
                Sync otomatis berjalan setiap 30 menit. Lakukan sync manual hanya jika ada data penting yang harus segera diperbarui.
              </InfoBox>
            </StepItem>

            <StepItem num={5} title="Sync Data Alumni dari S51 ITS">
              <p className="text-sm text-white/70">Sinkronkan data alumni dari web angkatan S51 untuk melengkapi database ALSITS.</p>
              <InfoBox type="info">
                Cara: Admin Panel → tab Sinkronisasi → klik <strong>Sync dari S51</strong>. Proses berjalan secara batch untuk menghindari batas API.
              </InfoBox>
            </StepItem>

            <StepItem num={6} title="Bulk Import Data Anggota dari Excel">
              <p className="text-sm text-white/70">Untuk memasukkan banyak alumni sekaligus dari file Excel (.xlsx), gunakan fungsi bulk import.</p>
              <InfoBox type="info">
                Format kolom Excel yang dibutuhkan: <strong>full_name, nrm_nrp, angkatan, tahun_masuk, tahun_lulus, email, telepon, domisili_kota, perusahaan, jabatan</strong>.
              </InfoBox>
              <InfoBox type="warning">
                Pastikan tidak ada duplikat NRP di file Excel. Duplikat akan menyebabkan error saat import.
              </InfoBox>
            </StepItem>
          </div>

          {/* Seksi ③ */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">③</span>
              PENGELOLAAN AKUN & KEAMANAN
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <StepItem num={7} title="Mengundang Admin atau Admin_CS Baru">
              <p className="text-sm text-white/70">Hanya admin utama yang bisa mengundang user dengan role <em>admin</em>. Gunakan hak ini dengan sangat selektif.</p>
              <InfoBox type="warning">
                Berikan role <strong>admin</strong> hanya kepada pengurus ALSITS yang dipercaya. Admin punya akses penuh termasuk hapus data dan sinkronisasi.
              </InfoBox>
              <InfoBox type="info">
                Cara: Admin Panel → tab <strong>User Management</strong> → klik <strong>Undang User</strong> → masukkan email → pilih role → Kirim.
              </InfoBox>
            </StepItem>

            <StepItem num={8} title="Manage Voting OMOV">
              <p className="text-sm text-white/70">Kelola seluruh siklus pemilihan: buat event voting, tambah kandidat, upload DPT, kirim notifikasi, dan pantau hasil suara real-time.</p>
              <InfoBox type="info">
                Cara: Menu dropdown User → <strong>Admin Voting OMOV</strong> → kelola Event, Kandidat, dan DPT via tab yang tersedia. Tombol <strong>"Kirim Notifikasi"</strong> di tab Pemilih mengirim email undangan ke seluruh DPT.
              </InfoBox>
              <InfoBox type="success">
                Dashboard hasil live ada di <strong>alsits.id/voting</strong> — halaman publik, bisa dibuka siapapun tanpa login. Kandidat tersortir otomatis berdasarkan nomor urut, hasil update setiap 60 detik.
              </InfoBox>
              <InfoBox type="warning">
                Setelah voting dibuka (status <em>active</em>), sistem otomatis blast email undangan ke seluruh DPT. Pastikan semua data kandidat dan DPT sudah benar SEBELUM mengaktifkan.
              </InfoBox>
            </StepItem>

            <StepItem num={9} title="Hapus Data Alumni (Permanen)">
              <p className="text-sm text-white/70">Hapus data alumni yang duplikat atau salah input. Tindakan ini bersifat permanen dan tidak bisa dibatalkan.</p>
              <InfoBox type="warning">
                <strong>SELALU konfirmasi ulang sebelum menghapus.</strong> Hapus data bersifat permanen. Jika ragu, tandai sebagai tidak aktif terlebih dahulu daripada langsung menghapus.
              </InfoBox>
            </StepItem>
          </div>

          {/* Seksi ④ */}
          <div className="space-y-1 mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">④</span>
              MONITORING & PELAPORAN
            </p>
          </div>
          <div className="space-y-6">
            <StepItem num={10} title="Memantau Dashboard Statistik">
              <p className="text-sm text-white/70">Pantau statistik alumni: total terdaftar, sebaran angkatan, kota domisili, bidang industri, dan progress kelengkapan data.</p>
              <InfoBox type="info">
                Akses via: menu <strong>Alumni → Statistik</strong> atau langsung ke <strong>/dashboard</strong>.
              </InfoBox>
            </StepItem>

            <StepItem num={11} title="Menghapus Posting Forum yang Melanggar">
              <p className="text-sm text-white/70">Admin bisa menghapus posting atau reply di Forum Diskusi yang melanggar etika paguyuban.</p>
              <InfoBox type="warning">
                Penghapusan posting bersifat permanen dan tidak bisa dibatalkan. Tangkap screenshot sebagai arsip sebelum menghapus.
              </InfoBox>
            </StepItem>
          </div>
        </Card>

        {/* ── SOP KASUS UMUM ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-xl text-white">SOP Penanganan Kasus Umum</h2>
          </div>
          <div className="space-y-3">
            <Accordion title="Alumni minta update data (nomor HP, alamat, pekerjaan)" icon="📋" badge="admin_cs">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Minta konfirmasi data baru via WhatsApp / komunikasi langsung.',
                  'Buka Database Alumni → cari nama → klik edit.',
                  'Update field yang diperlukan → klik Simpan Perubahan.',
                  'Konfirmasi ke alumni bahwa data sudah diperbarui.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
            </Accordion>

            <Accordion title="Ada alumni yang belum masuk ke database" icon="📋" badge="admin_cs">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Kumpulkan data alumni: nama lengkap, NRP, angkatan, HP, email, perusahaan.',
                  'Tambahkan manual via tombol "+ Tambah Alumni" di halaman Database Alumni.',
                  'Jika banyak alumni sekaligus, hubungi admin utama untuk bulk import dari Excel.',
                  'Jika alumni ingin bisa login, undang via email setelah profil dibuat.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
            </Accordion>

            <Accordion title="Ada laporan alumni yang telah berpulang (Almarhum)" icon="📋" badge="admin_cs">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Verifikasi kabar dari sumber yang dapat dipercaya (keluarga atau anggota paguyuban).',
                  'Buka Database Alumni → cari nama → klik edit.',
                  'Ubah field Status menjadi "Almarhum" atau "Almarhumah" sesuai.',
                  'Simpan perubahan. Profil akan otomatis disembunyikan dari semua listing.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
              <InfoBox type="warning">Verifikasi dulu sebelum mengubah status. Perubahan ini langsung mempengaruhi tampilan di seluruh portal.</InfoBox>
            </Accordion>

            <Accordion title="Membuat event / kegiatan paguyuban" icon="📋" badge="admin">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Siapkan info: judul event, tanggal mulai & selesai, lokasi, deskripsi lengkap.',
                  'Siapkan gambar cover dan flyer/poster (format JPG/PNG, resolusi minimal 800×600px).',
                  'Buka Admin Konten → tab Events → klik "+ Buat Event".',
                  'Isi semua field → upload gambar cover → Simpan.',
                  'Upload gambar promo tambahan (flyer, rundown) di bagian Galeri jika ada.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
            </Accordion>

            <Accordion title="Sinkronisasi data gagal atau tidak update" icon="📋" badge="admin">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Periksa koneksi internet dan coba ulangi sync manual.',
                  'Cek apakah API key S32 / S51 masih valid (via Dashboard → Settings → Secrets).',
                  'Jika masih gagal, screenshot pesan error dan laporkan ke developer / pembuat aplikasi.',
                  'Data sync otomatis berjalan setiap 30 menit — tunggu siklus berikutnya jika tidak urgent.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
            </Accordion>

            <Accordion title="Ada postingan forum yang melanggar etika" icon="📋" badge="admin">
              <ol className="space-y-2 text-sm text-white/70">
                {[
                  'Screenshot konten yang melanggar sebagai bukti arsip.',
                  'Admin_cs: laporkan ke admin utama dengan detail nama poster dan konten.',
                  'Admin utama: buka halaman Forum Diskusi → cari posting → klik hapus.',
                  'Jika perlu, hubungi anggota terkait secara personal untuk klarifikasi.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span> {s}</li>
                ))}
              </ol>
              <InfoBox type="warning">Penghapusan posting bersifat permanen. Selalu simpan screenshot sebelum menghapus.</InfoBox>
            </Accordion>
          </div>
        </div>

        {/* ── ETIKA & PRINSIP ── */}
        <Card className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="font-heading font-bold text-lg text-white">Etika &amp; Prinsip Pengelolaan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: '🔒 Kerahasiaan Data', desc: 'Data pribadi alumni (HP, email, alamat) hanya boleh digunakan untuk keperluan paguyuban. Dilarang keras disebarkan ke pihak ketiga tanpa izin.' },
              { title: '⚖️ Netralitas', desc: 'Admin tidak boleh menggunakan akses portal untuk kepentingan pribadi, bisnis, atau golongan tertentu.' },
              { title: '🎯 Kehati-hatian', desc: 'Sebelum menghapus data atau mengubah status alumni, selalu verifikasi terlebih dahulu. Tindakan ini tidak dapat dibatalkan.' },
              { title: '📝 Transparansi', desc: 'Jika melakukan perubahan data atas permintaan alumni, catat dan simpan bukti komunikasi (screenshot WA/email) sebagai arsip.' },
              { title: '📞 Pelaporan', desc: 'Jika ragu atau menemukan situasi yang tidak ada dalam panduan ini, segera konsultasikan ke admin utama sebelum mengambil tindakan.' },
              { title: '🤝 Kolaborasi', desc: 'Admin dan admin_cs bekerja sama. Admin_cs menghandle operasional harian, admin utama fokus pada konfigurasi dan keputusan strategis.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-4 space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h4 className="font-heading font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── ESCALATION PATH ── */}
        <Card className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide">Escalation Path</h2>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p>Jika ada masalah yang tidak dapat diselesaikan oleh <RoleBadge role="admin_cs" /> → eskalasi ke <RoleBadge role="admin" /> utama.</p>
            <p>Jika ada masalah teknis / bug pada aplikasi → laporkan ke <strong className="text-white/90">developer / pembuat aplikasi</strong> dengan menyertakan screenshot dan langkah reproduksi.</p>
            <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xs text-blue-300">Dokumen ini dibuat untuk penggunaan internal <strong>Paguyuban Alumni Teknik Sipil ITS — ALSITS</strong>. Revisi panduan dilakukan seiring perkembangan fitur portal.</p>
            </div>
          </div>
        </Card>

        {/* ── ARSITEKTUR & SOP OMOV ── */}
        <Card className="mb-8" style={{ borderColor: 'rgba(212,160,23,0.3)', background: 'rgba(212,160,23,0.04)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗳️</span>
            <h2 className="font-heading font-bold text-xl text-white">Arsitektur &amp; SOP OMOV — One Man One Vote</h2>
          </div>
          <p className="text-sm text-white/50 mb-5">Panduan teknis, troubleshooting, dan SOP operasional untuk pelaksanaan OMOV. <strong className="text-amber-300">Update v2:</strong> Voting sekarang pure dashboard publik — pemilih akses via link di email undangan, bukan form login di portal.</p>

          {/* Bagian A — Alur Sistem */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70 font-mono mb-3">A. ALUR SISTEM OMOV (v2 — PURE EMAIL-BASED VOTING)</p>
            <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xs text-blue-300 leading-relaxed">
                <strong>⚡ Perubahan arsitektur v2:</strong> Halaman <code className="bg-white/10 px-1 rounded">/voting</code> sekarang adalah <strong>pure live dashboard publik</strong> — bisa dibuka siapapun tanpa login, menampilkan hasil real-time dengan auto-refresh setiap 60 detik. Form identifikasi pemilih (NRP + email) <strong>tidak ada di /voting</strong> — akses voting dilakukan via link di email undangan yang dikirimkan ke DPT.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center mb-4">
              {[
                { n: '1', t: 'Email Undangan Otomatis', d: 'Saat admin aktifkan event → sistem otomatis blast email ke seluruh DPT via Resend (admin@alsits.id)', c: '#3b82f6' },
                { n: '2', t: 'Input NRP + Email', d: 'Pemilih buka link di email undangan → masukkan NRP dan email terdaftar di DPT', c: '#10b981' },
                { n: '3', t: 'OTP via Resend', d: 'Backend kirim OTP 6 digit via Resend. Pemilih cek inbox — umumnya <10 detik', c: '#f59e0b' },
                { n: '4', t: 'Verify OTP → Bilik', d: 'Backend validasi OTP (omovVerifyOtp) sebelum pemilih masuk bilik suara', c: '#8b5cf6' },
                { n: '5', t: 'Pilih + Anti Double', d: 'Hash deterministik (SHA-256 NRP+event_id) cegah double vote. VoteRecord = sumber kebenaran', c: '#ef4444' },
              ].map((s, i, arr) => (
                <div key={s.n} className="flex md:flex-col items-center gap-2">
                  <div className="rounded-xl p-3 flex-1 md:w-full text-center" style={{ background: `${s.c}12`, border: `1px solid ${s.c}30` }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto mb-1" style={{ background: s.c }}>{s.n}</div>
                    <p className="font-bold text-white text-xs mb-1">{s.t}</p>
                    <p className="text-[11px] leading-snug" style={{ color: '#94a3b8' }}>{s.d}</p>
                  </div>
                  {i < arr.length - 1 && <span className="text-white/20 font-bold text-lg md:rotate-90 shrink-0">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Bagian B — Perbaikan Teknis */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70 font-mono mb-3">B. PERBAIKAN TEKNIS YANG SUDAH DIIMPLEMENTASIKAN</p>
            <div className="space-y-3">
              {[
                {
                  icon: '📧', title: 'Email OTP via Resend (bukan relay bawaan)',
                  status: 'FIXED', color: '#10b981',
                  desc: 'omovSendOtp.js sekarang menggunakan Resend API (admin@alsits.id) — bukan Base44 default email relay. Deliverability meningkat drastis, tidak ada delay.',
                },
                {
                  icon: '🔒', title: 'Rate Limiting OTP (anti-spam)',
                  status: 'FIXED', color: '#10b981',
                  desc: 'Pemilih hanya bisa request OTP baru 60 detik setelah request sebelumnya. Mencegah email flood dan server overload.',
                },
                {
                  icon: '✅', title: 'OTP diverifikasi SEBELUM masuk bilik suara',
                  status: 'FIXED', color: '#10b981',
                  desc: 'Endpoint baru omovVerifyOtp.js memvalidasi OTP via backend dulu. Sebelumnya OTP hanya di-pass ke frontend tanpa validasi server — celah keamanan kritis.',
                },
                {
                  icon: '🛡️', title: 'Anti Double-Vote dengan Hash Deterministik',
                  status: 'FIXED', color: '#10b981',
                  desc: 'VoteRecord menggunakan SHA-256(nrp+event_id) tanpa timestamp. Jika request datang bersamaan, hash yang sama akan ditolak (duplikat). VoteRecord sekarang jadi sumber kebenaran untuk vote_count.',
                },
                {
                  icon: '🔢', title: 'vote_count dihitung dari VoteRecord (bukan increment)',
                  status: 'FIXED', color: '#10b981',
                  desc: 'Dulu: candidate.vote_count + 1 (rawan race condition jika 2 request datang bersamaan). Sekarang: COUNT semua VoteRecord untuk kandidat tersebut — selalu akurat.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>{item.status}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian C — SOP Pelaksanaan */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70 font-mono mb-3">C. SOP PELAKSANAAN OMOV — H-7 sampai H+1</p>
            <div className="space-y-3">
              {[
                { when: 'H-7', icon: '📋', title: 'Persiapan DPT', steps: ['Kumpulkan data pemilih: NRP + Email aktif (WAJIB email yang bisa terima email, bukan email mati)', 'Upload DPT ke Admin Voting → tab Pemilih → Upload CSV', 'Format CSV: kolom nrp, email, full_name', 'Test kirim email ke 3–5 akun sample untuk verifikasi deliverability', 'Gunakan tombol "Kirim Notifikasi" di tab Pemilih untuk blast undangan ke seluruh DPT'] },
                { when: 'H-3', icon: '🧪', title: 'Dry Run & Testing', steps: ['Buat event voting TEST (status draft)', 'Tambah 2–3 kandidat dummy', 'Upload 5–10 DPT sample dengan email yang bisa dimonitor', 'Aktifkan event → test full flow: email OTP → link di email → bilik → submit', 'Verifikasi email OTP masuk dalam <30 detik', 'Cek VoteRecord terbuat, vote_count akurat', 'Buka alsits.id/voting tanpa login — pastikan dashboard hasil tampil (pure public)'] },
                { when: 'H-1', icon: '⚙️', title: 'Konfigurasi Final', steps: ['Ganti event dari TEST ke event resmi', 'Pastikan semua kandidat data sudah benar (nama, foto, visi, nomor urut)', 'Lock DPT — jangan edit pemilih setelah ini', 'Umumkan ke seluruh pemilih: waktu voting, cara akses via email undangan', 'Siapkan contact person (WA) untuk bantu pemilih yang kesulitan', 'Bagikan link alsits.id/voting ke publik/WAG untuk pantau hasil live'] },
                { when: 'H-0 (Hari H)', icon: '🗳️', title: 'Eksekusi Voting', steps: ['Aktifkan event: Admin Voting → ubah status ke "active"', 'Sistem otomatis blast email undangan ke seluruh DPT saat status berubah ke active', 'Pantau partisipasi real-time di tab Pemilih (sudah_memilih counter)', 'Pantau hasil live di alsits.id/voting — dapat dibuka siapapun tanpa login', 'Siagakan admin untuk bantu pemilih yang email OTP tidak masuk (cek spam!)', 'Jika ada pemilih yang email salah: update email di DPT SEBELUM mereka request OTP', 'JANGAN tutup event sebelum waktu yang diumumkan'] },
                { when: 'H+0 (Tutup)', icon: '🏁', title: 'Penutupan & Hasil', steps: ['Ubah status event ke "closed" di Admin Panel tepat waktu', 'Screenshot hasil dari dashboard alsits.id/voting (kartu kandidat + perolehan suara)', 'Export CSV voter status via Admin Voting → tombol Export CSV untuk audit trail', 'Umumkan hasil resmi — dashboard di /voting tetap bisa dilihat publik setelah ditutup', 'Arsipkan event (jangan hapus) untuk keperluan verifikasi jika ada sengketa'] },
              ].map((phase, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(212,160,23,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-lg">{phase.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-amber-400 font-mono mr-2">{phase.when}</span>
                      <span className="font-bold text-white text-sm">{phase.title}</span>
                    </div>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5">
                    {phase.steps.map((s, j) => (
                      <li key={j} className="flex gap-2 text-xs text-white/65 leading-relaxed">
                        <span className="text-amber-400/60 shrink-0">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian D — Troubleshooting */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70 font-mono mb-3">D. TROUBLESHOOTING — MASALAH UMUM & SOLUSINYA</p>
            <div className="space-y-2">
              {[
                { prob: 'Email OTP tidak masuk', sol: '1) Minta pemilih cek folder Spam/Junk. 2) Tunggu max 60 detik (Resend umumnya <10 detik). 3) Jika masih tidak masuk: admin update email di DPT ke email lain yang aktif. 4) Cek Resend Dashboard untuk status delivery.', sev: 'warning' },
                { prob: 'Pemilih klik "Kirim Ulang OTP" berkali-kali dan kena rate limit', sol: 'Sistem membatasi 1 OTP per 60 detik. Minta pemilih tunggu 60 detik lalu coba lagi. Ini NORMAL dan sengaja untuk mencegah email flood.', sev: 'info' },
                { prob: '"NRP atau Email tidak terdaftar"', sol: '1) Verifikasi NRP dan email yang diinput (perhatikan spasi, typo). 2) Cek di admin apakah email di DPT sudah benar (bisa beda case: kapital vs huruf kecil — sistem sudah handle lowercase). 3) Jika email memang salah di DPT, update dulu sebelum pemilih retry.', sev: 'warning' },
                { prob: '"Anda sudah menggunakan hak suara"', sol: 'Ini BENAR — suara sudah tercatat. Tidak perlu tindakan. Jika pemilih mengklaim belum memilih, cek VoteRecord di admin untuk audit trail dengan voter_hash.', sev: 'info' },
                { prob: 'Dashboard /voting tidak update otomatis', sol: 'Dashboard auto-refresh setiap 60 detik — ini normal. Tombol Refresh manual tersedia di bagian "Dashboard Hasil Live". Jika kandidat tidak muncul, pastikan kandidat sudah ditambahkan di Admin Voting dan event statusnya "active".', sev: 'info' },
                { prob: 'Sistem lambat / timeout saat banyak user bersamaan', sol: 'Base44 berjalan di edge Deno — sudah auto-scale. Jika terjadi: 1) Jangan lakukan sync S32/S51 saat voting berlangsung (tunggu selesai). 2) Dashboard /voting menggunakan staleTime 60 detik — tidak ada polling agresif. 3) Umumkan ke pemilih untuk tidak refresh berulang.', sev: 'warning' },
                { prob: 'vote_count kandidat tidak akurat', sol: 'vote_count sekarang dihitung dari COUNT VoteRecord yang sudah tersimpan — bukan increment manual. Jika masih tidak akurat, admin bisa jalankan fungsi rekonsiliasi manual (hubungi developer).', sev: 'info' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${item.sev === 'warning' ? 'rgba(251,191,36,0.2)' : 'rgba(59,130,246,0.2)'}` }}>
                  <div className="px-4 py-2.5 font-bold text-sm" style={{ background: item.sev === 'warning' ? 'rgba(251,191,36,0.08)' : 'rgba(59,130,246,0.08)', color: item.sev === 'warning' ? '#fbbf24' : '#93c5fd' }}>
                    ⚠️ {item.prob}
                  </div>
                  <p className="px-4 py-2.5 text-xs text-white/65 leading-relaxed">{item.sol}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian E — Arsitektur Base44 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70 font-mono mb-3">E. CATATAN ARSITEKTUR — KENAPA BASE44 TAHAN HIGH CONCURRENCY</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '⚡', title: 'Deno Deploy Edge Functions', desc: 'Backend functions berjalan di Deno Deploy — infrastructure serverless yang auto-scale secara global. Tidak ada "server" yang perlu dikonfigurasi atau bisa "jatuh" karena traffic.' },
                { icon: '📧', title: 'Resend — Transactional Email', desc: 'Resend memiliki dedicated IP, SPF/DKIM/DMARC, dan queue internal. Burst 1000 email bersamaan sekalipun tidak masalah — jauh lebih andal dari relay email generic.' },
                { icon: '🔒', title: 'Anti Double-Vote Layer Ganda', desc: 'Proteksi berlapis: (1) cek sudah_memilih di VoterRegistry, (2) cek VoteRecord dengan hash deterministik. Meski ada race condition, kedua layer saling backup.' },
                { icon: '🏗️', title: 'Tidak Perlu Redis/RabbitMQ', desc: 'Base44 sudah menggunakan managed database dengan connection pooling. Queue email tidak diperlukan karena Resend handle-nya sendiri secara async di sisi mereka.' },
                { icon: '🌐', title: 'Domain alsits.id sudah dikonfigurasi', desc: 'Email dari admin@alsits.id via Resend memiliki reputasi domain yang baik. Pastikan DNS records (SPF, DKIM) di Hostinger sudah dikonfigurasi sesuai panduan Resend.' },
                { icon: '🖥️', title: 'Public Live Dashboard', desc: 'alsits.id/voting adalah halaman publik — siapapun bisa membuka tanpa login. Bagikan link ini ke WAG atau publik untuk pantau hasil secara real-time. Auto-refresh 60 detik, dengan tombol Refresh manual.' },
                { icon: '📊', title: 'Rekomendasi Skala Berikutnya', desc: 'Untuk DPT >2000 orang: pertimbangkan stagger waktu voting (undang per batch angkatan), atau tambahkan pre-notif email H-1 agar tidak semua akses bersamaan di menit pertama.' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-3 flex gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white text-xs mb-1">{item.title}</p>
                    <p className="text-[11px] text-white/55 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── FOOTER ── */}
        <div className="text-center pb-8 space-y-2">
          <img
            src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png"
            alt="ALSITS"
            className="h-12 mx-auto opacity-80"
          />
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 font-mono">PAGUYUBAN ALUMNI TEKNIK SIPIL ITS</p>
          <p className="text-xs text-white/30">ALSITS · Sejak 1957 · Portal Digital Alumni</p>
          <p className="text-xs text-white/20">Powered by <em>abu_thariq</em></p>
        </div>

      </div>
    </div>
  );
}