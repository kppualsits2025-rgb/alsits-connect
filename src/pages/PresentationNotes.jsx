import React, { useState } from 'react';

// Halaman ini adalah dokumen penjelasan detail untuk mendukung presentasi ALSITS
// Dapat dicetak sebagai PDF via Ctrl+P → Save as PDF

const Section = ({ title, children, color = '#3b82f6' }) => (
  <div style={{ marginBottom: 40, pageBreakInside: 'avoid' }}>
    <div style={{
      borderLeft: `4px solid ${color}`,
      paddingLeft: 16,
      marginBottom: 16,
    }}>
      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Card = ({ title, badge, badgeColor, children }) => (
  <div style={{
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '16px 20px',
    marginBottom: 16,
    pageBreakInside: 'avoid',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h3>
      {badge && (
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
          background: badgeColor === 'high' ? '#fee2e2' : badgeColor === 'medium' ? '#fef3c7' : '#dbeafe',
          color: badgeColor === 'high' ? '#dc2626' : badgeColor === 'medium' ? '#d97706' : '#2563eb',
        }}>{badge}</span>
      )}
    </div>
    {children}
  </div>
);

const P = ({ children }) => (
  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 8 }}>{children}</p>
);

const Li = ({ children }) => (
  <li style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 4 }}>{children}</li>
);

const SubTitle = ({ children }) => (
  <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginTop: 12 }}>{children}</p>
);

export default function PresentationNotes() {
  const [activeTab, setActiveTab] = useState('ux');

  const tabs = [
    { id: 'ux', label: '1. UX Audit — Area Improvement' },
    { id: 'pain', label: '2. Pain Points Detail' },
    { id: 'vision', label: '3. Visi Redesign & Resolusi' },
    { id: 'proposal', label: '4. Proposal Detail' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Open Sans, sans-serif' }}>

      {/* Print Header */}
      <div className="print-only" style={{ display: 'none' }}>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; }
            @page { margin: 20mm; size: A4 portrait; }
          }
        `}</style>
      </div>

      {/* Top Bar */}
      <div className="no-print" style={{
        background: 'linear-gradient(135deg, #0b1f4a, #060d1f)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '3px solid #D4A017',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 36 }} />
          <div>
            <div style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16 }}>Dokumen Penjelasan Detail</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Pendukung Presentasi Redesign Portal ALSITS · 2026</div>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'rgba(245,158,11,0.2)', color: '#f59e0b',
            border: '1px solid rgba(245,158,11,0.4)', cursor: 'pointer',
          }}
        >
          🖨️ Cetak / Export PDF
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="no-print" style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        display: 'flex', overflowX: 'auto', padding: '0 24px',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              padding: '12px 20px', fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? '#1d4ed8' : '#64748b',
              borderBottom: activeTab === t.id ? '2px solid #1d4ed8' : '2px solid transparent',
              background: 'none', border: 'none', borderBottom: activeTab === t.id ? '2px solid #1d4ed8' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* ═══ TAB 1: UX AUDIT ══════════════════════════════════════════════ */}
        {activeTab === 'ux' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                UI/UX Audit — Kekuatan & Area Improvement
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
                Penjelasan detail terpisah antara aspek UX (User Experience) dan UI (User Interface)
              </p>
            </div>

            {/* UX Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>UX — User Experience</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <Card title="✅ Kekuatan UX">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Navigasi mega-menu terstruktur & responsif mobile — memudahkan pengguna menemukan fitur utama</Li>
                <Li>Peta sebaran alumni real-time berbasis OpenStreetMap — memberikan nilai visualisasi yang tinggi</Li>
                <Li>Sistem voting terverifikasi (OMOV dengan OTP) — alur voting yang aman dan mudah diikuti</Li>
                <Li>Sinkronisasi data otomatis dari platform angkatan — mengurangi beban input manual admin</Li>
              </ul>
            </Card>

            <Card title="⚠️ Area Improvement UX" badge="Overview" badgeColor="low">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>IA terlalu dalam — sub-menu 4 level membingungkan</Li>
                <Li>Tidak ada onboarding bagi anggota baru</Li>
                <Li>Search global belum tersedia lintas halaman</Li>
                <Li>Mobile UX pada tabel & peta kurang optimal</Li>
              </ul>
            </Card>

            {/* UI Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>UI — User Interface</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <Card title="✅ Kekuatan UI">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Desain dark-mode modern & konsisten (navy-gold ITS branding) — identitas visual yang kuat dan profesional</Li>
                <Li>Dashboard analitik visual (chart interaktif) — data tersaji secara menarik dan mudah dipahami</Li>
                <Li>Branding ITS (navy-gold) konsisten di seluruh halaman — meningkatkan kepercayaan & brand recall</Li>
                <Li>Tipografi & hierarki visual yang jelas — pengguna mudah membedakan informasi penting</Li>
              </ul>
            </Card>

            <Card title="⚠️ Area Improvement UI" badge="Overview" badgeColor="low">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Loading state tidak konsisten di semua halaman</Li>
                <Li>Tidak ada notifikasi in-app / push notification</Li>
                <Li>Komponen mobile belum sepenuhnya dioptimalkan</Li>
                <Li>Tidak ada empty state & error state yang konsisten</Li>
              </ul>
            </Card>

            {/* Detail UX Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>Detail Penjelasan — UX Issues</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <Card title="1. IA Terlalu Dalam — Sub-menu 4 Level Membingungkan" badge="High" badgeColor="high">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Struktur navigasi portal ALSITS saat ini memiliki hierarki yang terlalu dalam. Pengguna harus melewati hingga 4 level klik untuk mencapai konten tertentu. Contoh: <em>Beranda → Alumni → Prestasi & Karya → Detail Alumni → Profil Lengkap</em>. Ini melanggar prinsip "3-click rule" dalam UX design yang modern.</P>
              <SubTitle>Dampak ke Pengguna</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Pengguna baru mengalami disorientasi dan sering tidak tahu sedang berada di mana</Li>
                <Li>Tingkat bounce rate tinggi karena frustrasi navigasi</Li>
                <Li>Pengguna mobile lebih terdampak karena layar kecil membatasi visibilitas menu</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Terapkan <strong>flat navigation</strong> — maksimal 2 level hierarki</Li>
                <Li>Gunakan <strong>mega-menu visual</strong> dengan kategori ikon yang intuitif</Li>
                <Li>Tambahkan <strong>breadcrumb</strong> di setiap halaman agar pengguna tahu posisinya</Li>
                <Li>Konsolidasikan sub-menu yang jarang diakses ke dalam halaman "Tentang" tunggal</Li>
              </ul>
            </Card>

            <Card title="2. Tidak Ada Onboarding bagi Anggota Baru" badge="Medium" badgeColor="medium">
              <SubTitle>Konteks Khusus ALSITS</SubTitle>
              <P>Portal ALSITS memiliki alur unik: anggota baru harus <strong>terlebih dahulu mendaftar di web angkatan masing-masing</strong> (mis. s32its.id, s33its.id, dst.), baru kemudian datanya disinkronisasi ke portal ALSITS. Ini adalah desain yang disengaja — bukan bug — karena mendorong web angkatan tetap aktif dan terisi data terkini.</P>
              <SubTitle>Masalah yang Timbul</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Tidak ada petunjuk di halaman login/register yang menjelaskan alur ini</Li>
                <Li>Alumni baru yang langsung mengakses alsits.id bingung mengapa datanya tidak ada</Li>
                <Li>Tidak ada halaman "Cara Bergabung" atau FAQ yang menjelaskan ekosistem ini</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Buat halaman <strong>"Cara Bergabung"</strong> yang menjelaskan alur: Daftar di Web Angkatan → Sync ke ALSITS → Akses Portal</Li>
                <Li>Tampilkan banner informatif di halaman login: <em>"Belum terdaftar? Daftar dulu di web angkatan Anda"</em></Li>
                <Li>Buat <strong>welcome tour</strong> singkat (3-5 langkah) saat pertama kali login</Li>
                <Li>Manfaatkan ini sebagai nilai jual: ekosistem lintas angkatan yang terintegrasi</Li>
              </ul>
            </Card>

            <Card title="3. Search Global Belum Tersedia Lintas Halaman" badge="High" badgeColor="high">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Setiap halaman memiliki filter/search tersendiri (alumni database punya filter sendiri, forum punya filter kategori, dll.), namun <strong>tidak ada satu pun search bar terpusat</strong> yang bisa mencari di semua konten sekaligus.</P>
              <SubTitle>Dampak ke Pengguna</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Pengguna yang mencari nama alumni harus masuk ke halaman Database lebih dulu</Li>
                <Li>Tidak bisa mencari dari satu tempat: alumni, berita, lowongan, forum, event</Li>
                <Li>Pengalaman terasa terfragmentasi dan tidak modern dibanding platform sejenis</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Tambahkan <strong>search bar global</strong> di navbar yang aktif di semua halaman</Li>
                <Li>Hasil pencarian tampil dalam kategori: Alumni, Berita, Lowongan, Forum, Event</Li>
                <Li>Implementasikan <strong>fuzzy search</strong> agar typo tetap menemukan hasil relevan</Li>
              </ul>
            </Card>

            <Card title="4. Mobile UX pada Tabel & Peta Kurang Optimal" badge="High" badgeColor="high">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Tabel di halaman Database Alumni dan komponen peta interaktif belum didesain secara <em>mobile-first</em>. Di layar smartphone, tabel terpotong horizontal dan peta sulit dioperasikan dengan jari (zoom/scroll konflik).</P>
              <SubTitle>Data Relevan</SubTitle>
              <P>Berdasarkan tren penggunaan platform komunitas alumni, lebih dari <strong>60% akses dilakukan via smartphone</strong>. Pengalaman mobile yang buruk langsung berdampak pada tingkat keterlibatan.</P>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Ubah tabel alumni menjadi <strong>card grid</strong> di mobile, tabel hanya untuk desktop</Li>
                <Li>Peta: tambahkan tombol zoom terpisah, tangani konflik scroll dengan gesture detection</Li>
                <Li>Terapkan pendekatan <strong>Progressive Web App (PWA)</strong> untuk pengalaman native-like</Li>
                <Li>Lakukan testing khusus mobile (minimal iPhone SE & Android mid-range)</Li>
              </ul>
            </Card>

            <Card title="5. Loading State Tidak Konsisten di Semua Halaman" badge="Medium" badgeColor="medium">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Beberapa halaman menampilkan skeleton loading yang baik, namun halaman lain langsung menampilkan layout kosong atau spinner generik. Tidak ada standar loading state yang konsisten di seluruh platform.</P>
              <SubTitle>Dampak ke Pengguna</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Pengguna tidak yakin apakah halaman sedang loading atau error</Li>
                <Li>Persepsi kecepatan platform terasa lebih lambat dari kenyataannya</Li>
                <Li>Kepercayaan terhadap platform menurun jika loading tidak ada feedback visual</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Buat <strong>design system loading</strong>: skeleton card, skeleton list, skeleton chart</Li>
                <Li>Terapkan konsisten di semua 10+ halaman</Li>
                <Li>Tambahkan <strong>optimistic UI</strong> untuk aksi seperti submit form agar terasa responsif</Li>
              </ul>
            </Card>

            <Card title="6. Tidak Ada Notifikasi In-app / Push Notification" badge="Medium" badgeColor="medium">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Platform saat ini bersifat <em>passive</em> — alumni hanya mendapat informasi jika aktif membuka portal. Tidak ada sistem yang mendorong alumni untuk kembali ke platform (re-engagement).</P>
              <SubTitle>Dampak ke Ekosistem</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Event dan lowongan baru tidak diketahui hingga alumni secara manual membuka portal</Li>
                <Li>Keterlibatan (engagement rate) rendah karena tidak ada trigger untuk kembali</Li>
                <Li>Platform terasa "mati" bagi alumni yang sudah jarang login</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Implementasikan <strong>in-app notification center</strong> (lonceng ikon di navbar)</Li>
                <Li>Push notification via PWA untuk event baru, lowongan relevan, dan reuni angkatan</Li>
                <Li>Email digest mingguan: rangkuman aktivitas platform yang dipersonalisasi</Li>
                <Li>Notification preference settings agar alumni bisa pilih jenis notifikasi yang diinginkan</Li>
              </ul>
            </Card>

            {/* Detail UI Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>Detail Penjelasan — UI Issues</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <Card title="7. Loading State Tidak Konsisten" badge="Medium" badgeColor="medium">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Beberapa halaman sudah memiliki skeleton loading yang baik, namun halaman lain menampilkan layout kosong atau spinner generik tanpa standar yang seragam.</P>
              <SubTitle>Dampak ke Pengguna</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Pengguna tidak yakin apakah halaman sedang loading atau error</Li>
                <Li>Persepsi kecepatan platform terasa lebih lambat dari kenyataannya</Li>
              </ul>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Buat <strong>UI design system loading</strong>: skeleton card, skeleton list, skeleton chart</Li>
                <Li>Terapkan konsisten di semua halaman</Li>
                <Li>Tambahkan <strong>optimistic UI</strong> untuk aksi submit form agar terasa responsif</Li>
              </ul>
            </Card>

            <Card title="8. Komponen Mobile Belum Sepenuhnya Dioptimalkan" badge="High" badgeColor="high">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Secara visual, beberapa komponen (tabel, modal, dan kartu alumni) belum di-redesign secara khusus untuk ukuran layar mobile. Ukuran font, padding, dan touch target belum memenuhi standar aksesibilitas mobile (minimal 44×44px per Apple HIG).</P>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Audit setiap komponen di breakpoint 375px dan 390px</Li>
                <Li>Semua tombol interaktif minimal 44×44px</Li>
                <Li>Tabel diganti card grid di mobile, modal full-screen di mobile</Li>
                <Li>Gunakan touch-friendly gestures (swipe untuk navigasi slide, pinch untuk peta)</Li>
              </ul>
            </Card>

            <Card title="9. Tidak Ada Empty State & Error State yang Konsisten" badge="Medium" badgeColor="medium">
              <SubTitle>Kondisi Saat Ini</SubTitle>
              <P>Ketika data kosong atau terjadi error, beberapa halaman hanya menampilkan layar kosong tanpa pesan yang informatif. Ini membingungkan pengguna — apakah tidak ada data, atau ada masalah teknis?</P>
              <SubTitle>Rekomendasi Perbaikan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Buat <strong>empty state component</strong> standar: ilustrasi + pesan ramah + CTA (mis. "Belum ada alumni terdaftar. Undang alumni pertama!")</Li>
                <Li>Buat <strong>error state component</strong>: ikon error + pesan + tombol "Coba Lagi"</Li>
                <Li>Terapkan di semua halaman yang memuat data dari server</Li>
              </ul>
            </Card>
          </div>
        )}

        {/* ═══ TAB 2: PAIN POINTS ═══════════════════════════════════════════ */}
        {activeTab === 'pain' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Pain Points Utama — Penjelasan Detail
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
                Penjelasan mendalam setiap masalah, termasuk konteks, dampak, status severity, dan resolusi
              </p>
            </div>

            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', margin: '0 0 8px 0' }}>Panduan Severity Level:</p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#dc2626' }}>🔴 <strong>High</strong> — Berdampak langsung ke UX & retensi pengguna, prioritas utama untuk segera diselesaikan</span>
                <span style={{ fontSize: 12, color: '#d97706' }}>🟡 <strong>Medium</strong> — Penting namun tidak kritis, bisa diselesaikan di fase kedua pengembangan</span>
                <span style={{ fontSize: 12, color: '#2563eb' }}>🔵 <strong>Low</strong> — Nice-to-have, ditangani sebagai enhancement di fase akhir</span>
              </div>
            </div>

            <Card title="🧭 Navigasi Kompleks" badge="HIGH" badgeColor="high">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Menu navigasi saat ini memiliki 5 parent menu dengan total lebih dari 20 item sub-menu. Pengguna baru — terutama alumni yang jarang menggunakan platform digital — sering tersesat dan tidak tahu harus membuka menu mana untuk mencapai tujuan mereka.</P>
              <SubTitle>Contoh Nyata</SubTitle>
              <P>Seorang alumni angkatan S40 ingin melihat peta sebaran rekannya. Dia harus: klik "Alumni" di navbar → hover muncul sub-menu → klik "Peta Sebaran". Tanpa petunjuk visual yang jelas, banyak yang tidak tahu menu Alumni menyimpan fitur Peta.</P>
              <SubTitle>Resolusi yang Diusulkan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li><strong>Quick-access shortcuts</strong> di beranda untuk fitur paling sering diakses (Alumni, Peta, Forum, Lowongan)</Li>
                <Li>Navigasi utama hanya 4 item: Beranda, Alumni, Komunitas, Info</Li>
                <Li>Fitur lain diakses via dashboard personal atau search global</Li>
                <Li>Progressive disclosure: tampilkan fitur lanjutan hanya setelah pengguna familiar</Li>
              </ul>
            </Card>

            <Card title="📱 Mobile Experience" badge="HIGH" badgeColor="high">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Peta interaktif menggunakan Leaflet.js yang secara default memiliki konflik antara scroll halaman dan zoom peta di mobile. Tabel alumni di mobile memaksa pengguna scroll horizontal yang tidak nyaman. Beberapa modal dialog juga terpotong di layar kecil.</P>
              <SubTitle>Data Pendukung</SubTitle>
              <P>Alumni generasi S35 ke atas didominasi pengguna mobile. Jika pengalaman mobile buruk, engagement akan stagnan meski konten berkualitas tinggi.</P>
              <SubTitle>Resolusi yang Diusulkan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Redesign total dengan pendekatan <strong>Mobile-First</strong> — desain dari layar 375px dulu, baru scale up ke desktop</Li>
                <Li>Peta: ganti ke tampilan list/card di mobile, peta hanya untuk tablet ke atas</Li>
                <Li>Install sebagai PWA: pengalaman seperti native app tanpa perlu download di App Store</Li>
                <Li>Testing wajib di device nyata minimal 3 ukuran layar</Li>
              </ul>
            </Card>

            <Card title="🔍 Discoverability Rendah" badge="MEDIUM" badgeColor="medium">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Konten berkualitas tinggi tersimpan di sub-halaman yang dalam. Alumni yang mencari informasi tentang rekan satu kota, atau mencari lowongan dari angkatan tertentu, tidak punya cara cepat untuk menemukannya tanpa navigasi manual berlapis.</P>
              <SubTitle>Dampak Bisnis</SubTitle>
              <P>Platform dengan discoverability rendah kehilangan "nilai jaringan" (network value). Alumni tidak mendapat manfaat koneksi yang seharusnya menjadi daya tarik utama ALSITS.</P>
              <SubTitle>Resolusi yang Diusulkan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Global search bar dengan hasil terkategorisasi</Li>
                <Li>Halaman beranda dinamis: "Alumni di kota Anda", "Lowongan terbaru", "Alumni aktif bulan ini"</Li>
                <Li>Tag & label yang konsisten di semua konten untuk filtering lintas halaman</Li>
              </ul>
            </Card>

            <Card title="👤 Tidak Ada Profil Mandiri" badge="MEDIUM" badgeColor="medium">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Saat ini seluruh data alumni hanya bisa diperbarui melalui sinkronisasi dari web angkatan (mis. s32its.id). Alumni tidak memiliki kemampuan untuk memperbarui informasi mereka sendiri di portal ALSITS — seperti foto profil terbaru, jabatan baru, atau nomor telepon yang berubah.</P>
              <SubTitle>Implikasi Jangka Panjang</SubTitle>
              <P>Data alumni akan semakin tidak akurat seiring waktu jika tidak ada mekanisme self-update. Alumni yang pindah kota, ganti perusahaan, atau naik jabatan tidak bisa memperbarui info di ALSITS.</P>
              <SubTitle>Resolusi yang Diusulkan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Buat halaman <strong>"Profil Saya"</strong> yang bisa diedit langsung di ALSITS</Li>
                <Li>Sistem dual-source: data dasar dari web angkatan, data tambahan bisa diisi manual di ALSITS</Li>
                <Li>Alumni bisa tambahkan: foto terbaru, update karir, keahlian baru, portofolio proyek</Li>
                <Li>Admin tetap bisa override data jika diperlukan verifikasi</Li>
              </ul>
            </Card>

            <Card title="🔔 Minim Engagement" badge="MEDIUM" badgeColor="medium">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Platform saat ini tidak memiliki "reason to return" — tidak ada yang mendorong alumni untuk membuka portal secara rutin. Tanpa notifikasi, feed aktivitas, atau konten yang dipersonalisasi, ALSITS hanya dikunjungi saat ada keperluan spesifik.</P>
              <SubTitle>Benchmark Kompetitor</SubTitle>
              <P>Platform alumni ITS lain atau platform komunitas profesional (LinkedIn, Ikatan Alumni UI) memiliki fitur notifikasi, activity feed, dan rekomendasi konten yang membuat pengguna kembali setiap hari.</P>
              <SubTitle>Resolusi yang Diusulkan</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Activity feed: tampilkan update dari alumni satu angkatan, satu kota, atau satu industri</Li>
                <Li>Notifikasi event reuni angkatan, lowongan baru yang relevan, ulang tahun alumni</Li>
                <Li>Gamifikasi ringan: badge "Alumni Aktif", "Kontributor Forum", dll.</Li>
                <Li>Email digest mingguan yang dipersonalisasi berdasarkan minat alumni</Li>
              </ul>
            </Card>

            <Card title="📈 Data Analytics Terbatas" badge="LOW" badgeColor="low">
              <SubTitle>Apa Masalahnya?</SubTitle>
              <P>Dashboard statistik saat ini hanya menampilkan data statis: chart distribusi industri, keahlian, dan gelar. Tidak ada data trend waktu (mis. pertumbuhan alumni per tahun), tidak ada insight yang actionable, dan tidak ada data tentang aktivitas komunitas itu sendiri.</P>
              <SubTitle>Potensi yang Belum Dimaksimalkan</SubTitle>
              <P>Data alumni ALSITS sangat berharga untuk analisis profesional: pemetaan sebaran tenaga ahli sipil Indonesia, tren industri konstruksi, dominasi alumni di sektor BUMN vs swasta, dll. Saat ini potensi ini belum dimanfaatkan.</P>
              <SubTitle>Resolusi yang Diusulkan (Fase 3)</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Dashboard dinamis dengan filter periode waktu (2010–2026)</Li>
                <Li>Insight otomatis: "Alumni paling banyak di sektor Konstruksi, naik 12% dari tahun lalu"</Li>
                <Li>Export laporan statistik untuk kebutuhan akreditasi atau laporan ke DIKTI</Li>
                <Li>Heatmap sebaran alumni yang lebih interaktif dan informatif</Li>
              </ul>
            </Card>
          </div>
        )}

        {/* ═══ TAB 3: VISI REDESIGN ════════════════════════════════════════ */}
        {activeTab === 'vision' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Visi Redesign & Rencana Resolusi
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
                Penjelasan detail 4 pilar visi dan bagaimana masing-masing menjadi resolusi dari pain points
              </p>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: 10, padding: '14px 18px', marginBottom: 24, border: '1px solid #bfdbfe' }}>
              <p style={{ fontSize: 14, color: '#1e40af', margin: 0, lineHeight: 1.7 }}>
                <strong>Filosofi Redesign:</strong> Tujuan utama bukan sekadar mempercantik tampilan, melainkan <strong>meningkatkan nilai nyata bagi alumni</strong> — kemudahan menemukan rekan, peluang karir, dan informasi komunitas — yang pada akhirnya meningkatkan partisipasi dan kepercayaan terhadap ALSITS sebagai organisasi.
              </p>
            </div>

            <Card title="🎯 Pilar 1: Clarity First — Sederhanakan, Permudah, Percepat">
              <SubTitle>Visi</SubTitle>
              <P>Setiap pengguna — dari alumni senior S32 hingga alumni baru S60 — dapat menemukan apa yang mereka butuhkan dalam maksimal 3 klik, tanpa perlu membaca manual atau bertanya ke admin.</P>
              <SubTitle>Ini Resolusi untuk:</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>✅ IA terlalu dalam (UX Audit)</Li>
                <Li>✅ Navigasi Kompleks (Pain Points)</Li>
                <Li>✅ Loading State tidak konsisten (UX Audit)</Li>
              </ul>
              <SubTitle>Konkretnya dalam Desain</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Navbar disederhanakan: maksimal 4 menu utama dengan ikon visual</Li>
                <Li>Beranda baru: "dashboard personal" yang langsung menampilkan konten relevan untuk user tersebut</Li>
                <Li>Breadcrumb & progress indicator di setiap halaman</Li>
                <Li>Design system yang konsisten: warna, typography, spacing, komponen tombol seragam di semua halaman</Li>
              </ul>
            </Card>

            <Card title="📱 Pilar 2: Mobile-First — Desain dari Layar Kecil">
              <SubTitle>Visi</SubTitle>
              <P>Semua fitur inti ALSITS berfungsi sempurna dan nyaman digunakan di smartphone — tanpa perlu zoom, scroll horizontal, atau frustrasi dengan komponen yang terpotong.</P>
              <SubTitle>Ini Resolusi untuk:</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>✅ Mobile Experience (Pain Points HIGH)</Li>
                <Li>✅ Mobile UX pada tabel & peta (UX Audit)</Li>
              </ul>
              <SubTitle>Konkretnya dalam Desain</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Semua komponen didesain dari breakpoint 375px, lalu di-scale up</Li>
                <Li>Tabel alumni berubah jadi card grid di mobile</Li>
                <Li>Peta dengan mode "daftar kota" sebagai alternatif di mobile</Li>
                <Li>Progressive Web App: install di homescreen, akses offline untuk data yang sudah di-cache</Li>
                <Li>Touch-friendly: semua tombol minimal 44×44px sesuai Apple HIG</Li>
              </ul>
            </Card>

            <Card title="🔗 Pilar 3: Connected — Hubungkan Alumni Satu Sama Lain">
              <SubTitle>Visi</SubTitle>
              <P>Alumni bisa aktif terhubung dengan sesama — bukan hanya membaca data, tapi berinteraksi, berkolaborasi, dan saling memberi nilai melalui platform.</P>
              <SubTitle>Ini Resolusi untuk:</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>✅ Tidak ada Profil Mandiri (Pain Points)</Li>
                <Li>✅ Minim Engagement (Pain Points)</Li>
                <Li>✅ Tidak ada notifikasi (UX Audit)</Li>
                <Li>✅ Onboarding anggota baru (UX Audit)</Li>
              </ul>
              <SubTitle>Konkretnya dalam Desain</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Halaman profil mandiri: alumni update data sendiri, tambah portofolio, cerita karir</Li>
                <Li>Sistem pesan langsung (Direct Message) antar alumni</Li>
                <Li>Activity feed: lihat update dari alumni satu angkatan atau satu industri</Li>
                <Li>Notifikasi in-app + push notification via PWA</Li>
                <Li>Onboarding flow 3-langkah untuk anggota baru, termasuk panduan ekosistem web angkatan</Li>
              </ul>
            </Card>

            <Card title="📊 Pilar 4: Data-Driven — Jadikan Data sebagai Aset">
              <SubTitle>Visi</SubTitle>
              <P>Data alumni ALSITS — ribuan profesional teknik sipil terbaik Indonesia — dikelola, divisualisasikan, dan dimanfaatkan sebagai aset strategis organisasi, bukan sekadar spreadsheet digital.</P>
              <SubTitle>Ini Resolusi untuk:</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>✅ Data Analytics Terbatas (Pain Points)</Li>
                <Li>✅ Search global belum tersedia (UX Audit)</Li>
                <Li>✅ Discoverability Rendah (Pain Points)</Li>
              </ul>
              <SubTitle>Konkretnya dalam Desain</SubTitle>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <Li>Dashboard analitik interaktif dengan filter waktu dan segmen</Li>
                <Li>Laporan otomatis untuk kebutuhan akreditasi/pelaporan ke institusi</Li>
                <Li>Insight berbasis AI: rekomendasi konten, job matching, trend komunitas</Li>
                <Li>Global search dengan indexing real-time di semua konten platform</Li>
              </ul>
            </Card>
          </div>
        )}

        {/* ═══ TAB 4: PROPOSAL DETAIL ═══════════════════════════════════════ */}
        {activeTab === 'proposal' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Proposal Detail — Redesign & Improvement Portal ALSITS
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
                Dokumen proposal teknis untuk disampaikan & didiskusikan bersama klien
              </p>
            </div>

            <Section title="A. Ringkasan Eksekutif" color="#1d4ed8">
              <P>
                Portal ALSITS (alsits.id) adalah platform digital komunitas alumni Program Studi Teknik Sipil ITS yang telah berhasil dibangun dengan fondasi teknis yang kuat. Platform ini mencakup 10+ modul fungsional, database alumni real-time, sistem voting terverifikasi, dan desain visual yang sudah mencerminkan identitas ITS (navy-gold branding).
              </P>
              <P>
                Namun demikian, berdasarkan audit UX yang komprehensif, terdapat sejumlah area kritis yang perlu ditingkatkan untuk memaksimalkan <strong>keterlibatan (engagement) alumni</strong> dan <strong>nilai platform</strong> bagi ekosistem ALSITS secara keseluruhan.
              </P>
              <P>
                Proposal ini mengusulkan program <strong>Redesign & Improvement</strong> yang terstruktur dalam 3 fase selama ±17 minggu, dengan total investasi yang proporsional terhadap nilai dan dampak jangka panjang yang dihasilkan.
              </P>
            </Section>

            <Section title="B. Lingkup Pekerjaan Detail" color="#1d4ed8">
              <Card title="Fase 1: Foundation (Minggu 1–5)">
                <SubTitle>Discovery & Audit (Minggu 1–2)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: '0 0 12px 0' }}>
                  <Li>Riset mendalam: wawancara 5–10 alumni representatif dari berbagai angkatan</Li>
                  <Li>Analisis traffic & behavior: heatmap, session recording, funnel analysis</Li>
                  <Li>Benchmark 3–5 platform alumni perguruan tinggi terkemuka di Indonesia</Li>
                  <Li>Deliverable: Laporan UX Research + Competitive Analysis</Li>
                </ul>
                <SubTitle>UX/UI Design (Minggu 3–5)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <Li>Wireframe low-fidelity semua halaman utama (10+ halaman)</Li>
                  <Li>Prototype interaktif high-fidelity (Figma)</Li>
                  <Li>Design System: komponen, warna, tipografi, ikon, spacing — semuanya terdokumentasi</Li>
                  <Li>User testing dengan 3–5 alumni (validasi sebelum development)</Li>
                  <Li>Deliverable: Figma Design File + Design System Documentation</Li>
                </ul>
              </Card>

              <Card title="Fase 2: Core Development (Minggu 6–12)">
                <SubTitle>Development Phase 1 — Foundation (Minggu 6–8)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: '0 0 12px 0' }}>
                  <Li>Implementasi design system baru ke seluruh halaman</Li>
                  <Li>Redesign navigasi: flat IA, mega-menu visual, breadcrumb</Li>
                  <Li>Mobile-first responsive redesign semua halaman</Li>
                  <Li>Global search bar dengan indexing alumni, berita, lowongan, forum</Li>
                  <Li>Konsistensi loading state (skeleton loading) di semua halaman</Li>
                </ul>
                <SubTitle>Development Phase 2 — Engagement (Minggu 9–12)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <Li>Halaman Profil Mandiri alumni (self-service update)</Li>
                  <Li>Sistem notifikasi in-app + push notification (PWA)</Li>
                  <Li>Activity feed personal di beranda</Li>
                  <Li>Onboarding flow untuk anggota baru (3-langkah, skip-able)</Li>
                  <Li>Alumni Connect: sistem pesan langsung antar alumni</Li>
                </ul>
              </Card>

              <Card title="Fase 3: Intelligence & Launch (Minggu 13–17)">
                <SubTitle>Development Phase 3 — Intelligence (Minggu 13–15)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: '0 0 12px 0' }}>
                  <Li>Dashboard analitik dinamis dengan filter waktu & segmen</Li>
                  <Li>AI-powered rekomendasi: konten relevan, job matching</Li>
                  <Li>Progressive Web App (PWA): install di homescreen, offline mode</Li>
                  <Li>Performance optimization: Core Web Vitals, SEO on-page</Li>
                </ul>
                <SubTitle>QA & Launching (Minggu 16–17)</SubTitle>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <Li>Testing menyeluruh: functional, responsive, cross-browser</Li>
                  <Li>Bug fixing & refinement</Li>
                  <Li>Deployment ke production + monitoring setup</Li>
                  <Li>Training admin ALSITS (1–2 sesi)</Li>
                  <Li>Dokumentasi teknis & user guide</Li>
                </ul>
              </Card>
            </Section>

            <Section title="C. Estimasi Investasi" color="#1d4ed8">
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: 'white' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>Komponen</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>Durasi</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'Montserrat, sans-serif' }}>Estimasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Discovery & Audit', '2 minggu', 'Sesuai kesepakatan'],
                      ['UX/UI Design + Prototype', '3 minggu', 'Sesuai kesepakatan'],
                      ['Development Phase 1 (Foundation)', '3 minggu', 'Sesuai kesepakatan'],
                      ['Development Phase 2 (Engagement)', '4 minggu', 'Sesuai kesepakatan'],
                      ['Development Phase 3 (Intelligence)', '3 minggu', 'Sesuai kesepakatan'],
                      ['QA, Deployment & Training', '2 minggu', 'Sesuai kesepakatan'],
                    ].map(([comp, dur, est], i) => (
                      <tr key={comp} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '9px 16px', color: '#1e293b', fontWeight: 500 }}>{comp}</td>
                        <td style={{ padding: '9px 16px', color: '#64748b' }}>{dur}</td>
                        <td style={{ padding: '9px 16px', textAlign: 'right', color: '#1d4ed8', fontWeight: 600 }}>{est}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#dbeafe', borderTop: '2px solid #1d4ed8' }}>
                      <td colSpan={2} style={{ padding: '10px 16px', fontWeight: 700, color: '#1e3a8a', fontFamily: 'Montserrat, sans-serif' }}>Total Estimasi Durasi</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 800, color: '#1e3a8a', fontFamily: 'Montserrat, sans-serif' }}>~17 Minggu</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <P style={{ fontSize: 12, color: '#94a3b8' }}>* Estimasi biaya akan disampaikan secara terpisah setelah diskusi detail lingkup dan prioritas fase yang disepakati bersama.</P>
            </Section>

            <Section title="D. Deliverables yang Akan Diterima Klien" color="#1d4ed8">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '📄', title: 'Laporan UX Research', desc: 'Hasil riset user, competitive analysis, temuan & rekomendasi' },
                  { icon: '🎨', title: 'Figma Design System', desc: 'Semua komponen, warna, tipografi terdokumentasi & siap pakai' },
                  { icon: '📱', title: 'Prototype Interaktif', desc: 'Demo klik-able yang bisa dipresentasikan ke stakeholder' },
                  { icon: '💻', title: 'Source Code Lengkap', desc: 'Kode sumber bersih, terdokumentasi, & ter-deploy di hosting' },
                  { icon: '📚', title: 'Dokumentasi Teknis', desc: 'Panduan penggunaan admin, API documentation, deployment guide' },
                  { icon: '🎓', title: 'Training Admin', desc: '1–2 sesi training penggunaan platform & content management' },
                ].map(d => (
                  <div key={d.title} style={{ display: 'flex', gap: 12, padding: 14, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
                    <span style={{ fontSize: 24 }}>{d.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', margin: '0 0 4px 0', fontFamily: 'Montserrat, sans-serif' }}>{d.title}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="E. Langkah Selanjutnya" color="#1d4ed8">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '01', title: 'Diskusi & Alignment', desc: 'Presentasikan proposal ini kepada decision maker ALSITS. Diskusikan prioritas fase dan lingkup yang sesuai kebutuhan & anggaran.' },
                  { step: '02', title: 'Proposal Biaya Final', desc: 'Setelah alignment lingkup, sampaikan proposal biaya detail dengan breakdown per fase.' },
                  { step: '03', title: 'Kick-off & Discovery', desc: 'Penandatanganan kontrak, kick-off meeting, dan mulai fase Discovery & Audit.' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: 16, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 28, color: '#dbeafe', lineHeight: 1, minWidth: 40 }}>{s.step}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', margin: '0 0 4px 0', fontFamily: 'Montserrat, sans-serif' }}>{s.title}</p>
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Footer Proposal */}
            <div style={{
              marginTop: 40, padding: '20px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #0b1f4a, #060d1f)',
              color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 13,
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
                <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 36 }} />
                <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS" style={{ height: 32 }} />
              </div>
              <p style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
                Redesign & Improvement Portal ALSITS
              </p>
              <p style={{ margin: 0, fontSize: 12 }}>
                Alumni Teknik Sipil ITS · Proposal 2026 · alsits.id
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}