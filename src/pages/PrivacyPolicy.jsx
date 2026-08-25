import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar minimal */}
      <div className="sticky top-0 z-50 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderTop: '3px solid #D4A017', borderBottom: '3px solid #D4A017' }}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="font-heading font-bold text-white">Kebijakan Privasi ALSITS</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading font-black text-3xl text-foreground mb-2">Kebijakan Privasi</h1>
          <p className="text-muted-foreground text-sm">Portal Alumni Teknik Sipil ITS — ALSITS</p>
          <p className="text-muted-foreground text-xs mt-1">Berlaku sejak: 1 Juli 2025 · Terakhir diperbarui: 18 Juni 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/85">

          {/* 1 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">1. Pendahuluan</h2>
            <p>
              Portal ALSITS (<strong>alsits.id</strong>) adalah platform resmi Alumni Teknik Sipil Institut Teknologi Sepuluh Nopember (ITS) Surabaya. Kami berkomitmen untuk melindungi privasi dan data pribadi seluruh anggota yang terdaftar maupun pengunjung yang mengakses portal ini.
            </p>
            <p className="mt-2">
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda. Dengan menggunakan portal ALSITS, Anda menyatakan telah membaca, memahami, dan menyetujui kebijakan ini.
            </p>
          </section>

          {/* 2 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">2. Data yang Kami Kumpulkan</h2>
            <p className="mb-3">Kami mengumpulkan beberapa jenis data pribadi, antara lain:</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">a.</span>
                <div>
                  <strong className="text-foreground">Data Identitas</strong>: nama lengkap, NRP/NRM, angkatan, gelar akademik, tanggal lahir.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">b.</span>
                <div>
                  <strong className="text-foreground">Data Kontak</strong>: alamat email, nomor telepon/WhatsApp, alamat kantor.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">c.</span>
                <div>
                  <strong className="text-foreground">Data Profesional</strong>: nama perusahaan, jabatan, bidang keahlian, bidang industri, profil LinkedIn.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">d.</span>
                <div>
                  <strong className="text-foreground">Data Lokasi</strong>: kota domisili, negara, koordinat geografis (untuk peta sebaran alumni).
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">e.</span>
                <div>
                  <strong className="text-foreground">Data Akun</strong>: email login, password (disimpan terenkripsi), riwayat login.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold shrink-0">f.</span>
                <div>
                  <strong className="text-foreground">Data Bisnis</strong>: informasi usaha, produk/layanan, kata kunci bisnis (untuk Business Hub).
                </div>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">3. Tujuan Penggunaan Data</h2>
            <p className="mb-3">Data pribadi Anda kami gunakan untuk:</p>
            <ul className="space-y-2 list-none">
              {[
                'Membangun dan memelihara direktori alumni Teknik Sipil ITS yang akurat',
                'Memfasilitasi komunikasi dan jejaring antar alumni',
                'Menyediakan layanan Business Hub untuk koneksi bisnis sesama alumni',
                'Menampilkan statistik dan peta sebaran alumni secara agregat',
                'Mengirimkan undangan, pengumuman, dan informasi kegiatan ALSITS',
                'Memverifikasi identitas alumni melalui proses klaim profil (OTP)',
                'Meningkatkan fitur dan layanan platform secara berkelanjutan',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">4. Perlindungan Data Sensitif</h2>
            <p className="mb-3">Kami menerapkan perlindungan berlapis terhadap data sensitif:</p>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="font-semibold text-emerald-400 text-xs mb-1">🔒 NOMOR TELEPON & WHATSAPP</p>
                <p>Nomor telepon hanya ditampilkan kepada sesama alumni yang telah login sebagai member terverifikasi. Pengunjung publik (tamu) tidak dapat melihat nomor telepon dalam bentuk apapun.</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="font-semibold text-blue-400 text-xs mb-1">📧 ALAMAT EMAIL</p>
                <p>Email pribadi alumni hanya dapat dilihat oleh alumni yang sudah terverifikasi profilnya. Data email tidak pernah dijual atau diberikan kepada pihak ketiga untuk kepentingan komersial.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="font-semibold text-amber-400 text-xs mb-1">🛡️ PASSWORD</p>
                <p>Password akun disimpan dalam bentuk hash terenkripsi menggunakan standar industri. Kami tidak menyimpan password dalam bentuk teks biasa.</p>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">5. Berbagi Data dengan Pihak Ketiga</h2>
            <p className="mb-2">Kami <strong className="text-foreground">tidak menjual</strong> data pribadi Anda kepada pihak manapun. Data hanya dapat dibagikan dalam kondisi berikut:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">•</span>
                <span><strong className="text-foreground">Sumber data web angkatan</strong>: data alumni yang berasal dari s32its.id dan s51its.id disinkronisasi dari platform masing-masing angkatan atas persetujuan pengurus angkatan.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">•</span>
                <span><strong className="text-foreground">Kewajiban hukum</strong>: apabila diwajibkan oleh peraturan perundang-undangan yang berlaku di Indonesia.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">•</span>
                <span><strong className="text-foreground">Persetujuan eksplisit</strong>: atas permintaan dan persetujuan tertulis dari alumni yang bersangkutan.</span>
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">6. Hak-Hak Anda</h2>
            <p className="mb-3">Sebagai alumni terdaftar, Anda memiliki hak untuk:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '👁️', title: 'Akses', desc: 'Melihat data pribadi yang kami simpan tentang Anda' },
                { icon: '✏️', title: 'Koreksi', desc: 'Memperbarui atau memperbaiki data yang tidak akurat' },
                { icon: '🗑️', title: 'Penghapusan', desc: 'Meminta penghapusan data dalam kondisi tertentu' },
                { icon: '🔕', title: 'Opt-out', desc: 'Berhenti menerima komunikasi dari ALSITS' },
                { icon: '📦', title: 'Portabilitas', desc: 'Mendapatkan salinan data Anda dalam format yang dapat dibaca' },
                { icon: '🚫', title: 'Pembatasan', desc: 'Membatasi pemrosesan data Anda dalam kondisi tertentu' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-xs">{item.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-muted-foreground text-xs">Untuk menggunakan hak-hak di atas, hubungi kami melalui email di bawah.</p>
          </section>

          {/* 7 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">7. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data Anda, termasuk enkripsi data saat transit (HTTPS/TLS), kontrol akses berbasis peran (admin/member), dan pembatasan akses ke data sensitif.
            </p>
            <p className="mt-2">
              Meski demikian, tidak ada sistem keamanan yang sepenuhnya sempurna. Kami mendorong Anda untuk menggunakan password yang kuat dan tidak membagikan kredensial akun kepada siapapun.
            </p>
          </section>

          {/* 8 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">8. Penyimpanan Data</h2>
            <p>
              Data Anda disimpan di infrastruktur cloud yang berlokasi di wilayah yang tunduk pada standar keamanan data internasional. Data akan kami simpan selama akun Anda aktif atau selama diperlukan untuk kepentingan organisasi ALSITS, kecuali ada permintaan penghapusan yang sah dari Anda.
            </p>
          </section>

          {/* 9 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">9. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email terdaftar atau notifikasi di dalam platform setidaknya 14 hari sebelum berlaku. Penggunaan portal setelah tanggal efektif perubahan berarti Anda menyetujui kebijakan yang diperbarui.
            </p>
          </section>

          {/* 10 */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">10. Kontak</h2>
            <p className="mb-3">Jika Anda memiliki pertanyaan, keluhan, atau ingin menggunakan hak-hak Anda terkait privasi data, silakan hubungi kami:</p>
            <div className="space-y-2">
              <p>📧 <strong className="text-foreground">Email:</strong> admin@alsits.id</p>
              <p>🌐 <strong className="text-foreground">Website:</strong> <a href="https://alsits.id" className="text-primary hover:underline">alsits.id</a></p>
              <p>🏛️ <strong className="text-foreground">Organisasi:</strong> Alumni Teknik Sipil ITS (ALSITS), Surabaya, Indonesia</p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-muted-foreground border-t border-border pt-6">
          <p>© 2025–2026 ALSITS — Alumni Teknik Sipil ITS. Seluruh hak cipta dilindungi.</p>
          <p className="mt-1">
            <Link to="/login" className="text-primary hover:underline">Kembali ke Login</Link>
            {' · '}
            <a href="https://alsits.id" className="text-primary hover:underline">alsits.id</a>
          </p>
        </div>
      </div>
    </div>
  );
}