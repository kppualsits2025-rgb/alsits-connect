import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, FileDown, Loader2, Pencil, X, Check, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// ─── DEFAULT SLIDE DATA (editable by admin) ──────────────────────────────────
const DEFAULT_SLIDE_DATA = {
  cover: {
    badge: 'Demo & Serah Terima · 16 Juni 2026',
    title1: 'Portal Digital Alumni',
    title2: 'ALSITS — alsits.id',
    subtitle: 'Alumni Teknik Sipil — Institut Teknologi Sepuluh Nopember',
    footer: 'Review & Demo Live · Sesi Serah Terima Phase 1 & 2',
  },
  agenda: {
    title: 'Agenda Presentasi',
    subtitle: 'Struktur pembahasan sesi hari ini',
    items: [
      { num: '01', label: 'Tentang ALSITS & Filosofi Platform', sub: 'Latar belakang, visi, dan nilai-nilai yang diemban' },
      { num: '02', label: 'Ekosistem Fitur yang Telah Dibangun', sub: 'Overview seluruh modul & halaman yang sudah live' },
      { num: '03', label: 'Fitur Unggulan & Filosofinya', sub: 'Notifikasi Ultah, Tentang ALSITS, Direktori, Peta, dll.' },
      { num: '04', label: 'Sinkronisasi Data Real-time', sub: 'Integrasi otomatis dari s32its.id & s51its.id' },
      { num: '05', label: 'Demo Live', sub: 'Demonstrasi fitur secara langsung di alsits.id' },
      { num: '06', label: 'Serah Terima & Next Steps', sub: 'BAST-1 & rencana Phase 3 ke depan' },
    ],
  },
  about: {
    title: 'Tentang ALSITS',
    subtitle: 'Ekosistem Digital Alumni Sipil ITS — Profesional, Terbuka, Guyub',
    desc: 'ALSITS (Alumni Sipil ITS) adalah komunitas lintas angkatan alumni Program Studi Teknik Sipil Institut Teknologi Sepuluh Nopember. Portal alsits.id hadir sebagai ekosistem digital yang menghubungkan, memberdayakan, dan mendokumentasikan perjalanan serta kontribusi para alumni — dari Sabang sampai Merauke, bahkan mancanegara. Filosofinya sederhana: kekeluargaan, keprofesionalan, dan keterbukaan informasi.',
    stats: [
      { val: '247', label: 'Alumni Tersinkron (98 S-32 + 149 S-51)' },
      { val: 'S32 & S51', label: 'Angkatan Terintegrasi' },
      { val: '30+', label: 'Kota Sebaran' },
      { val: '12+', label: 'Modul Platform Live' },
    ],
  },
  'current-overview': {
    title: 'Ekosistem Fitur — Platform Live',
    subtitle: 'Seluruh modul berikut sudah aktif dan dapat diakses di alsits.id',
    pages: [
      { icon: '🏠', name: 'Beranda', desc: 'Hero, statistik real-time & berita terkini' },
      { icon: '🗂️', name: 'Database Alumni', desc: 'Direktori + filter multidimensi + kartu profil' },
      { icon: '🗺️', name: 'Peta Sebaran', desc: 'Map interaktif OpenStreetMap per kota' },
      { icon: '📊', name: 'Statistik Dashboard', desc: 'Chart distribusi industri, keahlian & angkatan' },
      { icon: '📰', name: 'Berita & Kegiatan', desc: 'CMS berita dengan kategori & galeri events' },
      { icon: '💼', name: 'Lowongan & Proyek', desc: 'Job board oleh & untuk alumni ALSITS' },
      { icon: '📚', name: 'E-Library', desc: 'Repositori jurnal, skripsi & dokumen teknis' },
      { icon: '💬', name: 'Forum Diskusi', desc: 'Komunitas tanya jawab per bidang keahlian' },
      { icon: '🗳️', name: 'Voting OMOV', desc: 'Sistem voting demokratis terverifikasi OTP' },
      { icon: '💡', name: 'Business Hub', desc: 'Direktori usaha & bisnis alumni' },
      { icon: '📋', name: 'DPT & Admin Panel', desc: 'Manajemen data, sync & moderasi konten' },
      { icon: '🎉', name: 'Events & Komunitas', desc: 'Gowes, Golf, Jalan Sehat, Trading & lainnya' },
    ],
  },
  'current-features': {
    title: 'Fitur Unggulan & Filosofinya',
    subtitle: 'Setiap fitur dirancang dengan nilai dan tujuan yang jelas',
  },
  'fitur-notifikasi': {
    title: '🎂 Notifikasi Ulang Tahun',
    subtitle: 'Tidak ada lagi momen kekeluargaan yang terlewatkan',
    filosofi: 'Di WAG ALSITS, budaya saling memberi ucapan ulang tahun adalah cerminan keguyuban dan keakraban antar anggota. Namun dengan ratusan member, mudah sekali momen ini terlewat. Fitur ini hadir sebagai pengingat digital yang menjaga semangat kekeluargaan tetap hidup — karena satu ucapan "Selamat Ulang Tahun" bisa berarti sangat besar bagi yang merayakannya.',
    highlights: [
      'Notifikasi muncul otomatis di bagian atas portal setiap hari',
      'Menampilkan anggota yang berulang tahun hari ini, besok, dan dalam 7 hari ke depan',
      'Dilengkapi foto profil & kode angkatan (S-32, S-51, dll.) untuk konteks',
      'Urutan prioritas: hari ini → terdekat → baru lewat',
      'Dapat diklik untuk dismiss setelah dibaca',
    ],
  },
  'fitur-tentang': {
    title: '📖 Menu "Tentang ALSITS"',
    subtitle: 'Transparansi & profesionalisme dalam satu menu',
    filosofi: 'Sebuah organisasi yang baik tidak hanya bergerak — ia juga mendokumentasikan dirinya dengan baik. Menu "Tentang ALSITS" adalah wajah resmi kepengurusan Komjur Sipil ITS kepada seluruh anggota dan publik. Di sini tersimpan sejarah panjang perjalanan alumni, sambutan ketua yang menginspirasi, struktur organisasi yang jelas, serta visi-misi yang menjadi kompas gerak kepengurusan. Filosofinya: keprofesionalan dan keterbukaan informasi adalah hak setiap anggota ALSITS.',
    highlights: [
      'Sejarah ALSITS — rekam jejak organisasi dari masa ke masa',
      'Sambutan Ketua — pesan resmi kepada seluruh anggota',
      'Struktur Organisasi — siapa melakukan apa, transparan & akuntabel',
      'Visi & Misi — panduan arah gerak kepengurusan periode saat ini',
      'Semua konten dapat diedit oleh admin langsung dari portal',
    ],
  },
  'fitur-direktori': {
    title: '🗂️ Direktori & Peta Alumni',
    subtitle: 'Menghubungkan alumni di seluruh penjuru negeri',
    filosofi: 'Alumni Sipil ITS tersebar dari Sabang sampai Merauke — ada yang menjadi kontraktor besar, konsultan, birokrat, akademisi, hingga wirausahawan. Tanpa direktori yang baik, jaringan ini tidak pernah benar-benar terhubung. Database alumni hadir sebagai ruang temu digital: cari berdasarkan angkatan, kota, industri, atau bidang keahlian. Peta sebaran memvisualisasikan kekuatan jaringan ini — bahwa di mana pun kita berada, ada saudara alumnus di sana.',
    highlights: [
      'Filter multidimensi: angkatan, kota, industri, bidang keahlian',
      'Peta interaktif OpenStreetMap — marker per kota dengan jumlah alumni',
      'Profil lengkap: foto, kontak, perusahaan, kegiatan usaha',
      'Data tersinkronisasi otomatis dari s32its.id & s51its.id setiap 5 menit',
      'Business Hub terintegrasi: direktori usaha & layanan antar alumni',
    ],
  },
  'fitur-sinkronisasi': {
    title: '🔄 Sinkronisasi Data Otomatis',
    subtitle: 'Data selalu segar — tanpa input manual',
    filosofi: 'Masalah terbesar direktori alumni adalah data yang cepat usang. Orang pindah kota, ganti kerja, update foto — dan administrator tidak selalu tahu. Sistem sinkronisasi otomatis menyelesaikan ini: alsits.id secara rutin menarik data terbaru langsung dari platform masing-masing angkatan (s32its.id & s51its.id). Hasilnya: direktori yang selalu relevan, tanpa membebani admin dengan input manual.',
    highlights: [
      'Sinkronisasi otomatis setiap 5 menit (near real-time)',
      'Incremental sync — hanya memproses data yang berubah',
      'Sumber data: s32its.id (S-32) & s51its.id (S-51)',
      'Data yang disinkronisasi: nama, kota, perusahaan, jabatan, kontak, foto, ulang tahun',
      'Admin dapat trigger sync manual kapan saja dari Admin Panel',
    ],
  },
  'fitur-voting': {
    title: '🗳️ Voting OMOV — One Member One Vote',
    subtitle: 'Demokrasi alumni yang transparan & terverifikasi',
    filosofi: 'Pemilihan ketua atau keputusan strategis komunitas harusnya melibatkan seluruh anggota — bukan hanya yang hadir di satu rapat. Sistem OMOV (One Member One Vote) dirancang untuk memastikan setiap suara anggota ALSITS terhitung, terverifikasi, dan tidak bisa dipalsukan. Dengan autentikasi OTP via email, tidak ada celah untuk memilih lebih dari sekali. Ini adalah wujud demokrasi digital yang sesungguhnya.',
    highlights: [
      'Autentikasi ganda: verifikasi NRP + OTP 6 digit via email',
      'One Member One Vote — satu anggota hanya bisa memilih satu kali',
      'Kandidat dengan foto, visi & misi yang ditampilkan secara setara',
      'Hasil real-time dapat dipantau admin tanpa bisa dimanipulasi',
      'Audit trail anonim — privasi pilihan terjaga, namun keabsahan terverifikasi',
    ],
  },
  'fitur-konten': {
    title: '📰 Ekosistem Konten & Komunitas',
    subtitle: 'Portal yang hidup — bukan sekadar direktori statis',
    filosofi: 'Sebuah portal alumni yang baik bukan hanya tempat menyimpan data — ia harus menjadi ruang yang hidup, tempat informasi mengalir dan komunitas berinteraksi. Berita & kegiatan mendokumentasikan jejak aktivitas ALSITS. Forum diskusi menjadi ruang berbagi ilmu antar sesama profesional. E-Library melestarikan karya akademik. Lowongan & proyek membuka peluang kolaborasi bisnis. Business Hub menghubungkan potensi usaha antar anggota.',
    highlights: [
      'CMS Berita — publish berita & event dengan editor kaya teks & gambar',
      'Forum Diskusi — kategori per bidang keahlian (Struktur, Geotek, dll.)',
      'E-Library — repositori jurnal, skripsi, thesis & modul teknis',
      'Lowongan & Proyek — job board eksklusif alumni ALSITS',
      'Business Hub — direktori usaha & kontak bisnis antar anggota',
      'Halaman Komunitas — Gowes, Golf, Jalan Sehat, Trading & Saham',
    ],
  },
  ia: {
    title: 'Arsitektur Informasi Platform',
    subtitle: 'Struktur navigasi & hierarki konten alsits.id',
  },
  'capaian': {
    title: 'Capaian Phase 1 & Phase 2',
    subtitle: 'Yang telah diselesaikan dan diserahterimakan',
    phase1: [
      'Desain sistem & arsitektur informasi platform',
      'Setup infrastruktur Base44 BaaS (database, auth, hosting)',
      'Implementasi desain dark-mode branding ITS (navy-gold)',
      'Halaman Beranda, Tentang ALSITS, Komunitas',
      'Sistem manajemen konten (Berita, Events, Library, Forum)',
      'Integrasi data awal dari s32its.id',
    ],
    phase2: [
      'Database & Direktori Alumni dengan filter multidimensi',
      'Peta Sebaran Interaktif (OpenStreetMap)',
      'Dashboard Statistik & Analitik',
      'Sinkronisasi otomatis s32its.id & s51its.id (setiap 5 menit)',
      'Sistem Voting OMOV dengan verifikasi OTP',
      'Business Hub — direktori usaha alumni',
      'Notifikasi Ulang Tahun otomatis',
      'Admin Panel & DPT lengkap',
      'Self-edit profil mandiri oleh alumni',
    ],
  },
  closing: {
    title1: 'Terima Kasih atas Kepercayaan',
    title2: 'Pengurus Komjur ALSITS',
    desc: 'alsits.id kini hadir sebagai wujud nyata komitmen bersama — platform yang profesional, terbuka, dan guyub untuk seluruh alumni Teknik Sipil ITS. Ini baru permulaan. Masih banyak yang bisa kita bangun bersama.',
    footer: 'Review & Demo Live · 16 Juni 2026 · alsits.id',
  },
};

const STORAGE_KEY = 'alsits_presentation_data_v2';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_SLIDE_DATA, ...JSON.parse(saved) };
  } catch (e) { /* ignore */ }
  return DEFAULT_SLIDE_DATA;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── SLIDE COMPONENTS ────────────────────────────────────────────────────────

function PoweredByFooter() {
  return (
    <div style={{ position: 'absolute', bottom: 10, right: 18, zIndex: 10, display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'Open Sans, sans-serif' }}>@Powered by</span>
      <span style={{ fontSize: 9, color: '#f59e0b', fontFamily: "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif", fontWeight: 700 }}>abu_thariq</span>
    </div>
  );
}

function SlideCover({ d }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0b1f4a 50%, #0d2860 100%)', fontFamily: "'Berlin Sans FB', 'Trebuchet MS', sans-serif" }}>
      <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
      <div className="relative text-center px-8 max-w-3xl">
        <div className="flex items-center justify-center gap-5 mb-6">
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" className="h-20 w-auto drop-shadow-lg" />
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS ITS" className="h-18 w-auto drop-shadow-lg" />
        </div>
        <div className="inline-block px-5 py-2 rounded-full font-semibold tracking-widest uppercase mb-5"
          style={{ background: 'rgba(212,160,23,0.15)', color: '#f59e0b', border: '1px solid rgba(212,160,23,0.3)', fontSize: 13 }}>
          {d.badge}
        </div>
        <h1 className="font-bold leading-tight mb-5"
          style={{ fontFamily: "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif", fontSize: 'clamp(36px,4.8vw,64px)', color: '#ffffff' }}>
          {d.title1}<br /><span style={{ color: '#f59e0b' }}>{d.title2}</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Berlin Sans FB', 'Trebuchet MS', sans-serif", fontSize: 'clamp(16px,1.6vw,22px)', marginBottom: 20 }}>{d.subtitle}</p>
        <div className="w-24 h-0.5 mx-auto mb-5" style={{ background: '#f59e0b' }} />
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Open Sans, sans-serif' }}>{d.footer}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
      <PoweredByFooter />
    </div>
  );
}

function SlideAgenda({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        {d.items.map(i => (
          <div key={i.num} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <span style={{ color: '#f59e0b', fontFamily: FONT_BOLD, fontSize: 40, opacity: 0.65, flexShrink: 0, minWidth: 52, lineHeight: 1 }}>{i.num}</span>
            <div>
              <p style={{ fontFamily: FONT_BOLD, fontSize: 18, color: '#fff', margin: 0 }}>{i.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, fontFamily: FONT_BODY, marginTop: 3 }}>{i.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideAbout({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'hidden', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '16px 20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 18, lineHeight: 1.7, textAlign: 'justify', fontFamily: FONT_BODY, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 7, WebkitBoxOrient: 'vertical' }}>{d.desc}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flexShrink: 0 }}>
          {d.stats.map(s => (
            <div key={s.val} style={{ padding: '14px 10px', borderRadius: 14, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: '#f59e0b', fontFamily: FONT_BOLD, fontSize: 26, margin: 0, fontWeight: 700 }}>{s.val}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: FONT_BODY, marginTop: 4, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

function SlideCurrentOverview({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        {d.pages.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{p.icon}</span>
            <div>
              <p style={{ fontFamily: FONT_BOLD, fontSize: 16, color: '#fff', margin: 0 }}>{p.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: FONT_BODY, marginTop: 2 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideCurrentFeatures({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  const features = [
    { cat: 'Data & Direktori', color: '#3b82f6', items: ['Database alumni tersinkron otomatis (S-32 & S-51)', 'Filter: angkatan, kota, industri, bidang keahlian', 'Profil lengkap: foto, kontak, perusahaan, kegiatan usaha', 'Business Hub — direktori bisnis alumni'] },
    { cat: 'Visualisasi & Analitik', color: '#10b981', items: ['Peta sebaran interaktif OpenStreetMap per kota', 'Dashboard chart: industri, keahlian, angkatan', 'Notifikasi ulang tahun otomatis 7 hari ke depan', 'DPT — daftar pemilih terverifikasi per angkatan'] },
    { cat: 'Konten & Komunitas', color: '#f59e0b', items: ['CMS berita, events & galeri dokumentasi', 'Forum diskusi per bidang keahlian teknik', 'E-Library: jurnal, skripsi, modul teknis', 'Lowongan & proyek antar alumni ALSITS'] },
    { cat: 'Sistem & Keamanan', color: '#8b5cf6', items: ['Autentikasi email + role admin/member', 'Voting OMOV — OTP terverifikasi per anggota', 'Sinkronisasi inkremental setiap 5 menit', 'Self-edit profil mandiri oleh alumni'] },
  ];
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        {features.map(f => (
          <div key={f.cat} style={{ padding: '14px 18px', borderRadius: 14, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.color}44` }}>
            <p style={{ color: f.color, fontFamily: FONT_BOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, flexShrink: 0, marginBottom: 8 }}>{f.cat}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', minHeight: 0 }}>
              {f.items.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'rgba(255,255,255,0.9)', fontSize: 16, fontFamily: FONT_BODY, lineHeight: 1.5, paddingTop: 5, paddingBottom: 5 }}>
                  <span style={{ color: f.color, flexShrink: 0, fontSize: 17, marginTop: 1 }}>▸</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideIA({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  const tree = [
    { label: 'Beranda', color: '#60a5fa', children: [] },
    { label: 'Tentang ALSITS', color: '#60a5fa', children: ['Sejarah', 'Sambutan Ketua', 'Struktur Org', 'Visi & Misi'] },
    { label: 'Alumni', color: '#34d399', children: ['Database', 'Peta Sebaran', 'Statistik', 'Prestasi & Karya', 'Kontribusi', 'Events'] },
    { label: 'Komunitas', color: '#f59e0b', children: ['Gowes', 'Golf', 'Jalan Sehat', 'Trading & Saham'] },
    { label: 'Platform', color: '#a78bfa', children: ['Berita', 'Lowongan', 'E-Library', 'Forum', 'Voting OMOV', 'Business Hub'] },
  ];
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ marginTop: 8, height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', minHeight: 0 }}>
        {tree.map(node => (
          <div key={node.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: '8px 18px', borderRadius: 10, fontFamily: FONT_BOLD, fontSize: 17, color: node.color, background: `${node.color}22`, border: `1px solid ${node.color}44`, minWidth: 170, textAlign: 'center', flexShrink: 0 }}>
              {node.label}
            </div>
            {node.children.length > 0 && (
              <>
                <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {node.children.map(c => (
                    <span key={c} style={{ padding: '5px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: FONT_BODY, fontSize: 16 }}>
                      {c}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideUXAudit({ d }) {
  const Col = ({ label, items, positive, accent }) => (
    <div className="p-3 rounded-xl flex flex-col" style={{ background: positive ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${positive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: positive ? '#10b981' : '#f87171', fontFamily: 'Montserrat, sans-serif' }}>
        <span>{positive ? '✅' : '⚠️'}</span> {label}
      </p>
      <ul className="space-y-1.5">
        {(items || []).map(s => (
          <li key={s} className="flex items-start gap-1.5 text-[10.5px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ color: positive ? '#10b981' : '#f87171', marginTop: 1, flexShrink: 0 }}>{positive ? '+' : '−'}</span>{s}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* UX row */}
        <div className="col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#60a5fa', fontFamily: 'Montserrat, sans-serif', letterSpacing: 2 }}>— UX (User Experience) —</p>
        </div>
        <Col label="Kekuatan UX" items={d.uxStrengths} positive />
        <Col label="Area Improvement UX" items={d.uxWeaknesses} positive={false} />
        {/* UI row */}
        <div className="col-span-2 mt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#a78bfa', fontFamily: 'Montserrat, sans-serif', letterSpacing: 2 }}>— UI (User Interface) —</p>
        </div>
        <Col label="Kekuatan UI" items={d.uiStrengths} positive />
        <Col label="Area Improvement UI" items={d.uiWeaknesses} positive={false} />
      </div>
    </SlideLayout>
  );
}

function SlidePainPoints({ d }) {
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {d.points.map(p => (
          <div key={p.title} className="p-3.5 rounded-xl flex gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.color}22` }}>
            <span className="text-2xl shrink-0">{p.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.title}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: `${p.color}22`, color: p.color }}>{p.severity}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideProposalVision({ d }) {
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {d.pillars.map((p, i) => (
          <div key={p.title} className="p-5 rounded-2xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span className="text-3xl block mb-3">{p.icon}</span>
            <p className="font-bold text-sm text-white mb-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
            <span className="absolute top-3 right-4 text-4xl font-black opacity-5 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>0{i + 1}</span>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideRoadmap({ d }) {
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-4 space-y-3">
        {d.phases.map(p => (
          <div key={p.phase} className="flex gap-4 items-start p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.color}33` }}>
            <div className="shrink-0 text-center" style={{ minWidth: 90 }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.phase}</p>
              <p className="text-sm font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.label}</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.duration}</p>
            </div>
            <div className="w-px self-stretch" style={{ background: `${p.color}44` }} />
            <div className="flex flex-wrap gap-2">
              {p.tasks.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-[11px]"
                  style={{ background: `${p.color}18`, color: `${p.color}dd`, border: `1px solid ${p.color}33` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideNewFeatures({ d }) {
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {d.features.map(f => (
          <div key={f.title} className="p-4 rounded-xl text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-3xl block mb-2">{f.icon}</span>
            <p className="text-xs font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{f.title}</p>
            <p className="text-[10.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function SlideTimeline({ d }) {
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.2)' }}>
              <th className="text-left px-4 py-2.5 font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Fase</th>
              <th className="text-left px-4 py-2.5 font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Detail</th>
              <th className="text-right px-4 py-2.5 font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>Durasi</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r, i) => (
              <tr key={r.phase} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <td className="px-4 py-2.5 font-semibold" style={{ color: '#60a5fa', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>{r.phase}</td>
                <td className="px-4 py-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{r.detail}</td>
                <td className="px-4 py-2.5 text-right font-medium" style={{ color: '#f59e0b', whiteSpace: 'nowrap' }}>{r.week}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgba(245,158,11,0.1)', borderTop: '1px solid rgba(245,158,11,0.3)' }}>
              <td colSpan={2} className="px-4 py-2.5 font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total Estimasi</td>
              <td className="px-4 py-2.5 text-right font-bold" style={{ color: '#f59e0b' }}>{d.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>{d.note}</p>
    </SlideLayout>
  );
}

function SlideClosing({ d }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0b1f4a 50%, #0d2860 100%)' }}>
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
      <div className="relative text-center px-10" style={{ maxWidth: 700, width: '100%' }}>
        <div className="flex items-center justify-center gap-5 mb-5">
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" className="h-16 w-auto drop-shadow-lg" />
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS" className="h-14 w-auto drop-shadow-lg" />
        </div>
        <h2 className="font-bold mb-3 leading-tight"
          style={{ fontFamily: "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif", fontSize: 'clamp(26px,3.5vw,48px)', color: '#ffffff' }}>
          {d.title1}<br /><span style={{ color: '#f59e0b' }}>{d.title2}</span>
        </h2>
        <p className="mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Berlin Sans FB', 'Trebuchet MS', sans-serif", lineHeight: 1.65, fontSize: 16 }}>{d.desc}</p>
        <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: '#f59e0b' }} />
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🤝', label: 'Diskusi Lanjutan' }, { icon: '📋', label: 'Proposal Detail' }, { icon: '🚀', label: 'Mulai Bersama' }].map(a => (
            <div key={a.label} className="p-4 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>{a.icon}</span>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif", fontSize: 14, fontWeight: 700 }}>{a.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Open Sans, sans-serif' }}>{d.footer}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #D4A017, #f59e0b, #D4A017)' }} />
      <PoweredByFooter />
    </div>
  );
}

function SlideLayout({ title, subtitle, children }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 40px 24px', overflow: 'hidden', background: 'linear-gradient(135deg, #060d1f 0%, #0b1f4a 60%, #060d1f 100%)' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, borderRadius: '50%', opacity: 0.05, background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
      <div style={{ flexShrink: 0, marginBottom: 6 }}>
        <h2 style={{ fontFamily: FONT_BOLD, fontSize: 'clamp(26px,3vw,40px)', color: '#fff', lineHeight: 1.15, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: FONT_BODY, fontSize: 15, marginTop: 4 }}>{subtitle}</p>}
        <div style={{ marginTop: 7, height: 3, width: 52, borderRadius: 2, background: '#D4A017' }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>{children}</div>
      <PoweredByFooter />
    </div>
  );
}

// ─── ADMIN EDIT PANEL ────────────────────────────────────────────────────────

function EditPanel({ slideId, data, onSave, onClose }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(data)));

  const handleSave = () => { onSave(draft); onClose(); };

  // Helper: edit flat string fields
  const Field = ({ label, field, multiline }) => (
    <div className="mb-3">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{label}</label>
      {multiline ? (
        <textarea
          value={draft[field] || ''}
          onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
          rows={3}
          style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: 12, resize: 'vertical', fontFamily: 'inherit' }}
        />
      ) : (
        <input
          type="text"
          value={draft[field] || ''}
          onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
          style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: 12, fontFamily: 'inherit' }}
        />
      )}
    </div>
  );

  // Helper: edit array of strings
  const StringArrayField = ({ label, field }) => (
    <div className="mb-3">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{label} <span style={{ opacity: 0.4 }}>(satu per baris)</span></label>
      <textarea
        value={(draft[field] || []).join('\n')}
        onChange={e => setDraft(d => ({ ...d, [field]: e.target.value.split('\n') }))}
        rows={6}
        style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: 12, resize: 'vertical', fontFamily: 'inherit' }}
      />
    </div>
  );

  // Render fields per slide type
  const renderFields = () => {
    switch (slideId) {
      case 'cover':
        return (<>
          <Field label="Badge (baris atas)" field="badge" />
          <Field label="Judul Baris 1" field="title1" />
          <Field label="Judul Baris 2 (emas)" field="title2" />
          <Field label="Subtitle" field="subtitle" />
          <Field label="Teks bawah (kecil)" field="footer" />
        </>);
      case 'agenda':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <div className="mb-2">
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Item Agenda</label>
            {draft.items.map((item, i) => (
              <div key={i} style={{ marginBottom: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={item.num} onChange={e => { const arr = [...draft.items]; arr[i] = { ...arr[i], num: e.target.value }; setDraft(d => ({ ...d, items: arr })); }}
                    style={{ width: 36, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 6px', color: '#f59e0b', fontSize: 12, textAlign: 'center' }} />
                  <input value={item.label} onChange={e => { const arr = [...draft.items]; arr[i] = { ...arr[i], label: e.target.value }; setDraft(d => ({ ...d, items: arr })); }}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#fff', fontSize: 12 }} placeholder="Label" />
                </div>
                <input value={item.sub} onChange={e => { const arr = [...draft.items]; arr[i] = { ...arr[i], sub: e.target.value }; setDraft(d => ({ ...d, items: arr })); }}
                  style={{ marginTop: 4, width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: 'rgba(255,255,255,0.6)', fontSize: 11 }} placeholder="Sub-label" />
              </div>
            ))}
          </div>
        </>);
      case 'about':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <Field label="Paragraf Deskripsi" field="desc" multiline />
          <div className="mb-2">
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Statistik (4 kotak)</label>
            {draft.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input value={s.val} onChange={e => { const arr = [...draft.stats]; arr[i] = { ...arr[i], val: e.target.value }; setDraft(d => ({ ...d, stats: arr })); }}
                  style={{ width: 80, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#f59e0b', fontSize: 12, fontWeight: 700 }} placeholder="Nilai" />
                <input value={s.label} onChange={e => { const arr = [...draft.stats]; arr[i] = { ...arr[i], label: e.target.value }; setDraft(d => ({ ...d, stats: arr })); }}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#fff', fontSize: 12 }} placeholder="Label" />
              </div>
            ))}
          </div>
        </>);
      case 'current-overview':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <div className="mb-2">
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Item Halaman (12 kotak)</label>
            {(draft.pages || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={p.icon} onChange={e => { const arr = [...draft.pages]; arr[i] = { ...arr[i], icon: e.target.value }; setDraft(d => ({ ...d, pages: arr })); }}
                  style={{ width: 36, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 6px', color: '#fff', fontSize: 14, textAlign: 'center' }} />
                <input value={p.name} onChange={e => { const arr = [...draft.pages]; arr[i] = { ...arr[i], name: e.target.value }; setDraft(d => ({ ...d, pages: arr })); }}
                  style={{ width: 90, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#fff', fontSize: 12, fontWeight: 700 }} placeholder="Nama" />
                <input value={p.desc} onChange={e => { const arr = [...draft.pages]; arr[i] = { ...arr[i], desc: e.target.value }; setDraft(d => ({ ...d, pages: arr })); }}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: 'rgba(255,255,255,0.6)', fontSize: 11 }} placeholder="Deskripsi" />
              </div>
            ))}
          </div>
        </>);
      case 'current-features':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>4 kategori fitur sudah tetap. Edit subtitle-nya di atas.</p>
        </>);
      case 'fitur-notifikasi':
      case 'fitur-tentang':
      case 'fitur-direktori':
      case 'fitur-sinkronisasi':
      case 'fitur-voting':
      case 'fitur-konten':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <Field label="Filosofi / Latar Belakang" field="filosofi" multiline />
          <StringArrayField label="Fitur yang Sudah Live (satu per baris)" field="highlights" />
        </>);
      case 'ia':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Struktur IA (5 node) bersifat statis. Hubungi developer untuk mengubah node/child.</p>
        </>);
      case 'capaian':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <StringArrayField label="Phase 1 — Capaian (satu per baris)" field="phase1" />
          <StringArrayField label="Phase 2 — Capaian (satu per baris)" field="phase2" />
        </>);
      case 'ux-audit':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <StringArrayField label="Kekuatan UX" field="uxStrengths" />
          <StringArrayField label="Area Improvement UX" field="uxWeaknesses" />
          <StringArrayField label="Kekuatan UI" field="uiStrengths" />
          <StringArrayField label="Area Improvement UI" field="uiWeaknesses" />
        </>);
      case 'timeline':
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
          <Field label="Total Durasi" field="total" />
          <Field label="Catatan bawah" field="note" />
          <div className="mb-2">
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Baris Tabel</label>
            {draft.rows.map((r, i) => (
              <div key={i} style={{ marginBottom: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                <input value={r.phase} onChange={e => { const arr = [...draft.rows]; arr[i] = { ...arr[i], phase: e.target.value }; setDraft(d => ({ ...d, rows: arr })); }}
                  style={{ width: '100%', marginBottom: 4, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#60a5fa', fontSize: 12, fontWeight: 700 }} placeholder="Nama Fase" />
                <input value={r.detail} onChange={e => { const arr = [...draft.rows]; arr[i] = { ...arr[i], detail: e.target.value }; setDraft(d => ({ ...d, rows: arr })); }}
                  style={{ width: '100%', marginBottom: 4, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: 'rgba(255,255,255,0.6)', fontSize: 12 }} placeholder="Detail" />
                <input value={r.week} onChange={e => { const arr = [...draft.rows]; arr[i] = { ...arr[i], week: e.target.value }; setDraft(d => ({ ...d, rows: arr })); }}
                  style={{ width: 100, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', color: '#f59e0b', fontSize: 12 }} placeholder="Durasi" />
              </div>
            ))}
          </div>
        </>);
      case 'closing':
        return (<>
          <Field label="Judul Baris 1" field="title1" />
          <Field label="Judul Baris 2 (emas)" field="title2" />
          <Field label="Deskripsi" field="desc" multiline />
          <Field label="Footer kecil" field="footer" />
        </>);
      default:
        return (<>
          <Field label="Judul Slide" field="title" />
          <Field label="Subtitle" field="subtitle" />
        </>);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, zIndex: 200,
      background: 'rgba(6,13,31,0.97)', borderLeft: '1px solid rgba(245,158,11,0.3)',
      display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={14} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', fontFamily: 'Montserrat, sans-serif' }}>Edit Slide</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 2 }}>
          <X size={16} />
        </button>
      </div>
      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {renderFields()}
      </div>
      {/* Footer actions */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onClose}
          style={{ flex: 1, padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
          Batal
        </button>
        <button onClick={handleSave}
          style={{ flex: 1, padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: 'rgba(245,158,11,0.25)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Check size={13} /> Simpan
        </button>
      </div>
    </div>
  );
}

// ─── SLIDE ID LIST ───────────────────────────────────────────────────────────
const SLIDE_IDS = ['cover','agenda','about','current-overview','current-features','fitur-notifikasi','fitur-tentang','fitur-direktori','fitur-sinkronisasi','fitur-voting','fitur-konten','ia','capaian','closing'];

// ─── FITUR SLIDE COMPONENT ────────────────────────────────────────────────────
function SlideFitur({ d }) {
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        {/* Filosofi box */}
        <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <p style={{ color: '#60a5fa', fontFamily: FONT_BOLD, fontSize: 12, fontWeight: 700, flexShrink: 0, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            💡 Filosofi &amp; Latar Belakang
          </p>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 1.65, textAlign: 'justify', fontFamily: FONT_BODY, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical' }}>{d.filosofi}</p>
        </div>
        {/* Highlights */}
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <p style={{ color: '#f59e0b', fontFamily: FONT_BOLD, fontSize: 12, fontWeight: 700, flexShrink: 0, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            ✅ Fitur yang Sudah Live
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', minHeight: 0 }}>
            {(d.highlights || []).map((h, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>→</span>
                <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 17, lineHeight: 1.45, fontFamily: FONT_BODY }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}

// ─── CAPAIAN SLIDE ────────────────────────────────────────────────────────────
function SlideCapaian({ d }) {
  const FONT_BOLD = "'Berlin Sans FB Demi', 'Trebuchet MS', sans-serif";
  const FONT_BODY = "'Berlin Sans FB', 'Trebuchet MS', sans-serif";
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8, height: 'calc(100% - 48px)', minHeight: 0 }}>
        <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <p style={{ color: '#60a5fa', fontFamily: FONT_BOLD, fontSize: 12, flexShrink: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>✔ SELESAI</span>
            Phase 1 — Foundation &amp; Design
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', minHeight: 0 }}>
            {(d.phase1 || []).map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.9)', fontSize: 16, fontFamily: FONT_BODY, lineHeight: 1.45, paddingTop: 5, paddingBottom: 5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#60a5fa', flexShrink: 0, marginTop: 1, fontFamily: FONT_BOLD, fontSize: 17 }}>✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <p style={{ color: '#10b981', fontFamily: FONT_BOLD, fontSize: 12, flexShrink: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>✔ SELESAI</span>
            Phase 2 — Core Development
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', minHeight: 0 }}>
            {(d.phase2 || []).map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.9)', fontSize: 16, fontFamily: FONT_BODY, lineHeight: 1.45, paddingTop: 5, paddingBottom: 5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1, fontFamily: FONT_BOLD, fontSize: 17 }}>✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}

function renderSlide(id, data) {
  const d = data[id] || {};
  switch (id) {
    case 'cover': return <SlideCover d={d} />;
    case 'agenda': return <SlideAgenda d={d} />;
    case 'about': return <SlideAbout d={d} />;
    case 'current-overview': return <SlideCurrentOverview d={d} />;
    case 'current-features': return <SlideCurrentFeatures d={d} />;
    case 'fitur-notifikasi': return <SlideFitur d={d} />;
    case 'fitur-tentang': return <SlideFitur d={d} />;
    case 'fitur-direktori': return <SlideFitur d={d} />;
    case 'fitur-sinkronisasi': return <SlideFitur d={d} />;
    case 'fitur-voting': return <SlideFitur d={d} />;
    case 'fitur-konten': return <SlideFitur d={d} />;
    case 'ia': return <SlideIA d={d} />;
    case 'capaian': return <SlideCapaian d={d} />;
    case 'closing': return <SlideClosing d={d} />;
    default: return null;
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Presentation() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [current, setCurrent] = useState(0);
  const [exporting, setExporting] = useState(false); // false | 'pdf' | 'pptx'
  const [showEdit, setShowEdit] = useState(false);
  const [slideData, setSlideData] = useState(loadData);
  const slideRef = useRef(null);
  const total = SLIDE_IDS.length;

  const prev = () => { setShowEdit(false); setCurrent(c => Math.max(0, c - 1)); };
  const next = () => { setShowEdit(false); setCurrent(c => Math.min(total - 1, c + 1)); };

  useEffect(() => {
    const handler = (e) => {
      if (showEdit) return; // disable keyboard nav when editing
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showEdit]);

  const handleSave = (updated) => {
    const id = SLIDE_IDS[current];
    const newData = { ...slideData, [id]: updated };
    setSlideData(newData);
    saveData(newData);
  };

  const handleReset = () => {
    if (confirm('Reset semua slide ke konten default?')) {
      localStorage.removeItem(STORAGE_KEY);
      setSlideData(DEFAULT_SLIDE_DATA);
      setShowEdit(false);
    }
  };

  // Capture all slides as image data (shared by PDF & PPT)
  const captureAllSlides = async (w, h) => {
    const { default: html2canvas } = await import('html2canvas');
    const container = slideRef.current;
    const images = [];
    for (let i = 0; i < total; i++) {
      setCurrent(i);
      await new Promise(r => setTimeout(r, 700));
      const canvas = await html2canvas(container, { scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: '#020914', width: w, height: h });
      images.push(canvas.toDataURL('image/jpeg', 0.93));
    }
    return images;
  };

  // PDF — A4 portrait (210×297mm), slide image scaled to fit width
  const handleExportPDF = async () => {
    setExporting('pdf');
    setShowEdit(false);
    try {
      const { default: jsPDF } = await import('jspdf');
      const W = 1280, H = 720;
      const images = await captureAllSlides(W, H);
      // A4 portrait: 210×297mm; fit slide (16:9) width=210mm → height=210*(9/16)=118.125mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210, pageH = 297;
      const imgW = pageW, imgH = pageW * (H / W); // 118.125mm
      const yOffset = (pageH - imgH) / 2;
      images.forEach((img, i) => {
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(img, 'JPEG', 0, yOffset, imgW, imgH);
      });
      pdf.save('ALSITS-Demo-Live-16-Juni-2026.pdf');
      setCurrent(0);
    } catch (err) {
      alert('Export PDF gagal: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // PowerPoint — landscape 33.87cm × 19.05cm (widescreen 16:9)
  const handleExportPPTX = async () => {
    setExporting('pptx');
    setShowEdit(false);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const W = 1280, H = 720;
      const images = await captureAllSlides(W, H);
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE';
      images.forEach(img => {
        const slide = pptx.addSlide();
        slide.addImage({ data: img, x: 0, y: 0, w: '100%', h: '100%' });
      });
      await pptx.writeFile({ fileName: 'ALSITS-Demo-Live-16-Juni-2026.pptx' });
      setCurrent(0);
    } catch (err) {
      alert('Export PPT gagal: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const CONTROLS_H = 52;
  const GAP = 12;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020914', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top-right buttons */}
      <div style={{ position: 'absolute', top: 10, right: 16, zIndex: 50, display: 'flex', gap: 8 }}>
        {isAdmin && (
          <>
            <button onClick={handleReset}
              style={{ padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Reset
            </button>
            <button onClick={() => setShowEdit(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: showEdit ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)', color: showEdit ? '#f59e0b' : 'rgba(255,255,255,0.7)', border: `1px solid ${showEdit ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.12)'}`, cursor: 'pointer' }}>
              <Pencil size={14} /> Edit Slide
            </button>
          </>
        )}
        <button onClick={handleExportPDF} disabled={!!exporting}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: exporting === 'pdf' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.22)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.45)', cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting && exporting !== 'pdf' ? 0.4 : 1 }}>
          {exporting === 'pdf' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileDown size={14} />}
          {exporting === 'pdf' ? `PDF ${current + 1}/${total}...` : 'PDF (A4)'}
        </button>
        <button onClick={handleExportPPTX} disabled={!!exporting}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: exporting === 'pptx' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.22)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.45)', cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting && exporting !== 'pptx' ? 0.4 : 1 }}>
          {exporting === 'pptx' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileDown size={14} />}
          {exporting === 'pptx' ? `PPT ${current + 1}/${total}...` : 'PowerPoint'}
        </button>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${CONTROLS_H + GAP * 2}px ${showEdit ? '332px' : '12px'} ${GAP}px 12px`, transition: 'padding 0.2s' }}>
        <div
          ref={slideRef}
          style={{
            position: 'relative', width: '100%',
            maxWidth: `min(calc(100vw - ${showEdit ? 356 : 24}px), calc((100vh - ${CONTROLS_H + GAP * 3}px) * 16 / 9))`,
            aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            transition: 'max-width 0.2s',
          }}
        >
          {renderSlide(SLIDE_IDS[current], slideData)}
        </div>
      </div>

      {/* Admin edit panel */}
      {isAdmin && showEdit && (
        <EditPanel
          slideId={SLIDE_IDS[current]}
          data={slideData[SLIDE_IDS[current]] || {}}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Controls bar */}
      <div style={{ height: CONTROLS_H, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(2,9,20,0.95)' }}>
        <button onClick={prev} disabled={current === 0}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.3 : 1 }}>
          <ChevronLeft size={16} /> Sebelumnya
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {SLIDE_IDS.map((_, i) => (
              <button key={i} onClick={() => { setShowEdit(false); setCurrent(i); }}
                style={{ borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: i === current ? 20 : 6, height: 6, background: i === current ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
            {current + 1} / {total} · ← → keyboard{isAdmin ? ' · Edit untuk admin' : ''}
          </span>
        </div>

        <button onClick={next} disabled={current === total - 1}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', cursor: current === total - 1 ? 'not-allowed' : 'pointer', opacity: current === total - 1 ? 0.3 : 1 }}>
          Selanjutnya <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}