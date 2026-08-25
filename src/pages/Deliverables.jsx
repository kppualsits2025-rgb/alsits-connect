import React, { useState } from 'react';

export default function Deliverables() {
  const [activeDoc, setActiveDoc] = useState('all');

  const docs = [
    { id: 'all', label: '📋 Semua' },
    { id: 'ux', label: '📄 UX Research' },
    { id: 'figma', label: '🎨 Design System' },
    { id: 'docs', label: '📚 Dokumentasi Teknis' },
    { id: 'code', label: '💻 Source Code' },
  ];

  const show = (id) => activeDoc === 'all' || activeDoc === id;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d1f 0%,#071224 50%,#060d1f 100%)', fontFamily: "'Open Sans', sans-serif", color: '#e2e8f0' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a1628; }
        ::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 4px; }

        @media print {
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 12mm 14mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { background: #060d1f !important; margin: 0; padding: 0; }
          #main-wrap { padding: 0 !important; max-width: 100% !important; }
          /* ── PRINT LAYOUT ── */
          /* Semua konten mengalir natural, tidak ada page-break paksa */
          .doc-section { margin-top: 0 !important; }
          #doc-cover { page-break-after: auto !important; break-after: auto !important; }

          /* Kunci utama: setiap .section-block (heading+konten dalam 1 div) tidak boleh terpotong */
          .section-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: block !important;
          }

          /* DocHeader (nomor + judul besar) tidak terpotong dan tidak sendirian */
          .doc-header-wrap {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Elemen individual yang tidak boleh terpotong */
          .keep { page-break-inside: avoid !important; break-inside: avoid !important; }

          /* Grid tidak boleh dipotong */
          .grid2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 6pt !important; }
          .grid3 { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 6pt !important; }
          .grid2 > *, .grid3 > * { page-break-inside: avoid !important; break-inside: avoid !important; }

          /* Tabel: baris tidak terpotong, header selalu mengikuti */
          thead { display: table-header-group !important; }
          tr { page-break-inside: avoid !important; break-inside: avoid !important; }

          p, li, td, th, span { font-size: 9pt !important; line-height: 1.55 !important; }
          h2.sec-title { font-size: 14pt !important; }
          pre, code { font-size: 7.5pt !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="no-print" style={{ background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(12px)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(212,160,23,0.4)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 36 }} />
          <div>
            <div style={{ color: '#fff', fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 15 }}>Dokumen Deliverable</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Redesign Portal ALSITS · 2026</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/dokumen" style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>← Hub Dokumen</a>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(212,160,23,0.2))', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', cursor: 'pointer' }}>
            🖨️ Cetak / Export PDF
          </button>
        </div>
      </div>

      {/* TAB NAV */}
      <div className="no-print" style={{ background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '0 24px', overflowX: 'auto' }}>
        {docs.map(d => (
          <button key={d.id} onClick={() => setActiveDoc(d.id)} style={{ padding: '12px 18px', fontSize: 13, fontWeight: activeDoc === d.id ? 700 : 500, color: activeDoc === d.id ? '#f59e0b' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', borderBottom: activeDoc === d.id ? '2px solid #f59e0b' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Montserrat,sans-serif', transition: 'all 0.2s' }}>
            {d.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div id="main-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 20px' }}>

        {/* COVER */}
        <div id="doc-cover" className="keep" style={{ background: 'linear-gradient(135deg, #0b1f4a 0%, #0d2a5e 40%, #0b1f4a 100%)', borderRadius: 20, padding: '32px 40px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden', boxShadow: '0 16px 60px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          {/* Decorative */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#D4A017,#f59e0b,#fbbf24,#f59e0b,#D4A017)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,160,23,0.08) 0%,transparent 70%)' }} />

          <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center', position: 'relative' }}>
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 48 }} />
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS ITS" style={{ height: 42 }} />
          </div>

          <div style={{ display: 'inline-flex', padding: '4px 16px', borderRadius: 20, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', marginBottom: 14, position: 'relative' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 3, fontFamily: 'Montserrat,sans-serif' }}>Dokumen Serah Terima · 2026</span>
          </div>

          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.15, position: 'relative' }}>
            Paket Deliverable<br /><span style={{ color: '#f59e0b', textShadow: '0 0 40px rgba(245,158,11,0.4)' }}>Redesign Portal ALSITS</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 22px', position: 'relative' }}>
            Dokumen lengkap serah terima hasil pengerjaan — Alumni Teknik Sipil ITS
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative' }}>
            {[
              { num: '01', icon: '📄', title: 'Laporan UX Research', color: '#3b82f6' },
              { num: '02', icon: '🎨', title: 'Figma Design System', color: '#8b5cf6' },
              { num: '03', icon: '📚', title: 'Dokumentasi Teknis', color: '#10b981' },
              { num: '04', icon: '💻', title: 'Source Code Lengkap', color: '#0891b2' },
            ].map(d => (
              <div key={d.num} className="keep" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${d.color}25`, backdropFilter: 'blur(4px)' }}>
                <span style={{ fontSize: 24 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 9.5, color: d.color, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.8 }}>DOKUMEN {d.num}</div>
                  <div style={{ fontSize: 14, color: '#fff', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, marginTop: 2 }}>{d.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOC 1 — UX RESEARCH */}
        {show('ux') && (
          <div className="doc-section">
            <DocHeader num="1" color="#3b82f6" title="📄 Laporan UX Research — Portal ALSITS" />

            <div className="section-block">
              <SubHeading letter="A" title="Metodologi Riset" color="#3b82f6" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { icon: '🗣️', t: 'User Interview', d: 'Wawancara 7 alumni representatif (S32–S50) berbagai profesi & kota domisili.' },
                  { icon: '🖥️', t: 'Usability Testing', d: 'Observasi langsung penggunaan alsits.id pada 5 skenario tugas berbeda.' },
                  { icon: '📊', t: 'Analytics Review', d: 'Analisis pola navigasi & halaman yang paling/kurang dikunjungi.' },
                  { icon: '🔍', t: 'Competitive Benchmark', d: 'Perbandingan mendalam dengan 4 platform alumni PT terkemuka Indonesia.' },
                ].map(m => (
                  <DarkCard key={m.t}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12.5, color: '#e2e8f0', margin: '0 0 4px' }}>{m.t}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{m.d}</p>
                    </div>
                  </DarkCard>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="B" title="Temuan Utama (Key Findings) — Status Resolusi" color="#3b82f6" />
              <DarkTable
                headers={['#', 'Temuan', 'Severity', 'Frekuensi', 'Status']}
                widths={['4%','47%','13%','10%','16%']}
                rows={[
                  ['1', 'Navigasi 4-level membingungkan pengguna baru', <SBadge color="#ef4444">🔴 High</SBadge>, '6/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['2', 'Tidak ada search global lintas halaman', <SBadge color="#ef4444">🔴 High</SBadge>, '7/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['3', 'Tampilan mobile kurang nyaman (tabel, peta)', <SBadge color="#ef4444">🔴 High</SBadge>, '5/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['4', 'Alumni tidak bisa update profil sendiri', <SBadge color="#f59e0b">🟡 Medium</SBadge>, '6/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['5', 'Tidak ada notifikasi atau activity feed', <SBadge color="#f59e0b">🟡 Medium</SBadge>, '4/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['6', 'Loading state tidak konsisten antar halaman', <SBadge color="#f59e0b">🟡 Medium</SBadge>, '3/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                  ['7', 'Tidak ada onboarding untuk anggota baru', <SBadge color="#f59e0b">🟡 Medium</SBadge>, '5/7', <SBadge color="#10b981">✅ Resolved</SBadge>],
                ]}
              />
            </div>

            <div className="section-block">
              <SubHeading letter="C" title="Benchmark Kompetitor — Kondisi Terkini alsits.id" color="#3b82f6" />
              <DarkTable
                headers={['Platform', 'Navigasi', 'Mobile', 'Search', 'Self-Profile', 'Notif']}
                widths={['28%','14%','14%','14%','16%','14%']}
                rows={[
                  ['alsits.id (terkini)', <SBadge color="#10b981">✅ 2-level</SBadge>, <SBadge color="#10b981">✅ Responsif</SBadge>, <SBadge color="#10b981">✅ Global</SBadge>, <SBadge color="#10b981">✅ Mandiri</SBadge>, <SBadge color="#10b981">✅ Email+PWA</SBadge>],
                  ['IKA UI', <SBadge color="#10b981">✅ Flat</SBadge>, <SBadge color="#10b981">✅ Baik</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>],
                  ['Alumni ITB', <SBadge color="#10b981">✅ Flat</SBadge>, <SBadge color="#10b981">✅ Baik</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#f59e0b">⚠️ Terbatas</SBadge>],
                  ['Kagama (UGM)', <SBadge color="#10b981">✅ Flat</SBadge>, <SBadge color="#10b981">✅ Baik</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>, <SBadge color="#10b981">✅ Ada</SBadge>],
                  ['Alumni ITS lain', <SBadge color="#f59e0b">⚠️ Sedang</SBadge>, <SBadge color="#f59e0b">⚠️ Partial</SBadge>, <SBadge color="#f59e0b">⚠️ Terbatas</SBadge>, <SBadge color="#f59e0b">⚠️ Terbatas</SBadge>, <SBadge color="#ef4444">❌ Tidak</SBadge>],
                ]}
              />
            </div>

            <div className="section-block">
              <SubHeading letter="D" title="Persona Pengguna" color="#3b82f6" />
              <div className="grid3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { name: 'Alumni Aktif Muda', color: '#3b82f6', usia: '28–35 thn | S45–S55', device: 'Smartphone (Android)', need: 'Update profil, networking, lowongan', quote: '"Sekarang mudah nemuin teman satu kota — fitur peta & search global sangat membantu!"' },
                  { name: 'Senior Alumni', color: '#10b981', usia: '45–60 thn | S32–S40', device: 'Laptop / Desktop', need: 'Berita reuni, direktori, komunitas', quote: '"Navigasi jauh lebih simpel, menu dropdown jelas dan tidak membingungkan lagi."' },
                  { name: 'Admin Organisasi', color: '#f59e0b', usia: 'Pengurus ALSITS aktif', device: 'Laptop + Mobile', need: 'Upload berita, kelola alumni, voting', quote: '"Sekarang ada notifikasi email otomatis setiap ada event atau ulang tahun alumni."' },
                ].map(p => (
                  <div key={p.name} className="keep" style={{ padding: '16px', border: `1px solid ${p.color}30`, borderTop: `3px solid ${p.color}`, borderRadius: 12, background: `${p.color}08` }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 13, color: p.color, margin: '0 0 10px' }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>👤 {p.usia}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>📱 {p.device}</p>
                    <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 8px' }}><strong style={{ color: '#e2e8f0' }}>Kebutuhan:</strong> {p.need}</p>
                    <p style={{ fontSize: 11.5, color: '#10b981', fontStyle: 'italic', margin: 0, borderTop: `1px solid ${p.color}20`, paddingTop: 8, lineHeight: 1.6 }}>{p.quote}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="E" title="Rekomendasi Desain — Status Implementasi" color="#3b82f6" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { n: '01', t: 'Sederhanakan IA', d: 'Navbar 2-level dengan dropdown ikon intuitif — navigasi Beranda, Tentang, Alumni, Komunitas, Lainnya', c: '#3b82f6', done: true },
                  { n: '02', t: 'Global Search', d: 'Search bar ⌘K di navbar — hasil terkategorisasi: Alumni, Berita, Lowongan, Forum dengan fuzzy search', c: '#10b981', done: true },
                  { n: '03', t: 'Redesign Mobile-First', d: 'Seluruh halaman responsif mobile, sheet navigation, touch-friendly, viewport 375px ke atas', c: '#f59e0b', done: true },
                  { n: '04', t: 'Self-Service Profile', d: 'Klaim profil via OTP + AlumniSelfEditModal: foto, jabatan, perusahaan, kontak, LinkedIn, bio', c: '#8b5cf6', done: true },
                  { n: '05', t: 'Sistem Notifikasi', d: 'Email otomatis: ulang tahun alumni (Resend), event baru (notifyNewEvent), BirthdayNotifBar in-app, PWA support', c: '#ef4444', done: true },
                  { n: '06', t: 'Onboarding Flow', d: 'Wizard 3 langkah untuk anggota baru: sambutan, klaim profil, jelajahi fitur — localStorage-based, tampil sekali', c: '#0891b2', done: true },
                ].map(r => (
                  <div key={r.n} className="keep" style={{ display: 'flex', gap: 14, padding: '13px 16px', border: `1px solid ${r.c}20`, borderLeft: `3px solid ${r.c}`, borderRadius: 10, background: r.done ? `${r.c}08` : 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 18, color: r.c, lineHeight: 1, minWidth: 28, opacity: 0.35, flexShrink: 0 }}>{r.n}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 13, color: '#e2e8f0', margin: 0 }}>{r.t}</p>
                        {r.done && <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '1px 8px', borderRadius: 20, flexShrink: 0 }}>✅ SELESAI</span>}
                      </div>
                      <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{r.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOC 2 — FIGMA DESIGN SYSTEM */}
        {show('figma') && (
          <div className="doc-section sec-gap" style={{ marginTop: 36 }}>
            <DocHeader num="2" color="#8b5cf6" title="🎨 Figma Design System — Portal ALSITS" />

            <div className="section-block">
              <SubHeading letter="A" title="Color Tokens" color="#8b5cf6" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Primary (Navy ITS)', colors: ['#eff6ff','#dbeafe','#3b82f6','#1d4ed8','#0b1f4a'], names: ['50','100','500','700','900'] },
                  { label: 'Accent (Gold ITS)', colors: ['#fef3c7','#fbbf24','#f59e0b','#d97706','#D4A017'], names: ['50','400','500','600','Heritage'] },
                  { label: 'Neutral', colors: ['#f8fafc','#f1f5f9','#94a3b8','#475569','#0f172a'], names: ['50','100','400','600','900'] },
                  { label: 'Semantic', colors: ['#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6'], names: ['Success','Warning','Danger','Info','Purple'] },
                ].map(g => (
                  <DarkCard key={g.label}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 10px' }}>{g.label}</p>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {g.colors.map((c, i) => (
                          <div key={c} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ height: 28, borderRadius: 6, background: c, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }} />
                            <span style={{ fontSize: 9, color: '#475569', fontFamily: 'Montserrat,sans-serif' }}>{g.names[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DarkCard>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="B" title="Typography Scale" color="#8b5cf6" />
              <div className="keep" style={{ border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, background: 'rgba(139,92,246,0.04)', overflow: 'hidden', marginBottom: 16 }}>
                {[
                  { size: '32px', fw: 900, label: 'Display / Hero', sample: 'ALSITS — Alumni Teknik Sipil ITS', font: 'Montserrat' },
                  { size: '22px', fw: 800, label: 'Heading 1', sample: 'Database Alumni Terdaftar', font: 'Montserrat' },
                  { size: '16px', fw: 700, label: 'Heading 2', sample: 'Filter Berdasarkan Angkatan', font: 'Montserrat' },
                  { size: '14px', fw: 600, label: 'Subtitle', sample: 'Bergabunglah dengan komunitas alumni ITS', font: 'Montserrat' },
                  { size: '13px', fw: 400, label: 'Body Text', sample: 'Temukan rekan alumni, informasi karir, dan kegiatan komunitas', font: 'Open Sans' },
                  { size: '11px', fw: 400, label: 'Caption / Label', sample: 'Terakhir diperbarui: 21 Juni 2026', font: 'Open Sans' },
                ].map((t, i) => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ minWidth: 140, flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: '#8b5cf6', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>{t.label}</div>
                      <div style={{ fontSize: 9.5, color: '#334155', fontFamily: 'monospace' }}>{t.size} · {t.fw} · {t.font}</div>
                    </div>
                    <span style={{ fontFamily: t.font === 'Montserrat' ? 'Montserrat,sans-serif' : 'Open Sans,sans-serif', fontSize: t.size, fontWeight: t.fw, color: '#e2e8f0', lineHeight: 1 }}>{t.sample}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="C" title="Component Library" color="#8b5cf6" />
              <div className="grid3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { cat: '⚛️ Atoms', c: '#3b82f6', items: ['Button (5 variant, 4 size)', 'Badge (5 variant)', 'Input (5 type)', 'Avatar (5 size)', 'Icon (Lucide subset)'] },
                  { cat: '🧩 Molecules', c: '#10b981', items: ['AlumniCard', 'NewsCard', 'JobCard', 'GlobalSearch', 'BirthdayNotifBar', 'StatCard', 'FilterChip'] },
                  { cat: '🏗️ Organisms', c: '#f59e0b', items: ['Navbar + GlobalSearch', 'AlumniTable', 'AlumniMapCard', 'DashboardChart', 'VotingBooth', 'OnboardingModal'] },
                ].map(g => (
                  <div key={g.cat} className="keep" style={{ padding: '14px 16px', border: `1px solid ${g.c}25`, borderTop: `3px solid ${g.c}`, borderRadius: 12, background: `${g.c}06` }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: g.c, margin: '0 0 10px' }}>{g.cat}</p>
                    <ul style={{ paddingLeft: 14, margin: 0 }}>
                      {g.items.map(item => <li key={item} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, lineHeight: 1.5 }}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="D" title="Spacing, Grid & Border Radius" color="#8b5cf6" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <DarkCard>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 10px' }}>Spacing Scale (base: 4px)</p>
                    {[['--space-1','4px'],['--space-2','8px'],['--space-3','12px'],['--space-4','16px'],['--space-6','24px'],['--space-8','32px'],['--space-12','48px']].map(([k,v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                        <span style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>{k}</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </DarkCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="keep" style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 10px' }}>Breakpoints & Grid</p>
                    {[['Mobile','< 640px','1 kolom, padding 16px'],['Tablet','640–1024px','2 kolom, padding 24px'],['Desktop','> 1024px','12 kolom, max 1280px']].map(([bp,sz,gr]) => (
                      <div key={bp} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                        <strong style={{ color: '#e2e8f0', fontFamily: 'Montserrat,sans-serif' }}>{bp}</strong>
                        <span style={{ color: '#8b5cf6', margin: '0 8px', fontFamily: 'monospace', fontSize: 11 }}>{sz}</span>
                        <span style={{ color: '#64748b' }}>{gr}</span>
                      </div>
                    ))}
                  </div>
                  <div className="keep" style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 10px' }}>Border Radius</p>
                    {[['--radius-sm','4px'],['--radius-md','8px'],['--radius-lg','12px'],['--radius-xl','16px'],['--radius-full','9999px']].map(([k,v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOC 3 — DOKUMENTASI TEKNIS */}
        {show('docs') && (
          <div className="doc-section sec-gap" style={{ marginTop: 36 }}>
            <DocHeader num="3" color="#10b981" title="📚 Dokumentasi Teknis — Portal ALSITS" />

            <div className="section-block">
              <SubHeading letter="A" title="Stack Teknologi" color="#10b981" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Frontend', c: '#3b82f6', items: ['React 18 + Vite','Tailwind CSS + shadcn/ui','TanStack Query v5','React Router DOM v6','Recharts, React-Leaflet + OSM','Framer Motion, Lucide React'] },
                  { label: 'Backend (Base44 BaaS)', c: '#10b981', items: ['Database: Base44 Entities (15+ schema)','Functions: Deno Deploy (Edge, 20+ functions)','Auth: Google OAuth + Email + OTP','Storage: Base44 File CDN','Realtime: Base44 Subscriptions'] },
                  { label: 'Hosting & Domain', c: '#f59e0b', items: ["Platform: Base44 Startup Plan","Domain: alsits.id (Hostinger)","SSL: Auto — Let's Encrypt","CDN: Global edge network","Email: Resend via admin@alsits.id"] },
                  { label: 'Backend Functions (20+)', c: '#8b5cf6', items: ['syncFromS32/S51 — Auto sync angkatan','notifyNewEvent — Blast email event','sendBirthdayEmail — Notif ulang tahun','omovSendOtp / omovSubmitVote — E-voting','claimAlumni / claimVerifyOtp — Klaim profil','bulkInviteFromAlumniDB — Bulk invite'] },
                ].map(s => (
                  <div key={s.label} className="keep" style={{ padding: '14px 16px', border: `1px solid ${s.c}20`, borderLeft: `3px solid ${s.c}`, borderRadius: 12, background: `${s.c}06` }}>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: s.c, margin: '0 0 8px' }}>{s.label}</p>
                    <ul style={{ paddingLeft: 14, margin: 0 }}>
                      {s.items.map(i => <li key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, lineHeight: 1.5 }}>{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="B" title="Cara Menggunakan SDK (Entities)" color="#10b981" />
              <Code>{`import { base44 } from '@/api/base44Client';

// LIST — Ambil 50 alumni terbaru
const alumni = await base44.entities.Alumni.list('-created_date', 50);

// FILTER — Dengan kondisi spesifik
const filtered = await base44.entities.Alumni.filter(
  { angkatan: 'S32', bidang_industri: 'Konstruksi' }, '-tahun_lulus', 20
);

// CREATE / UPDATE / DELETE
await base44.entities.Alumni.create({ full_name: 'Budi', angkatan: 'S42' });
await base44.entities.Alumni.update(id, { jabatan: 'Senior Engineer' });
await base44.entities.Alumni.delete(id);

// REALTIME — Subscribe perubahan live
const unsub = base44.entities.Alumni.subscribe((event) => {
  if (event.type === 'create') setData(prev => [...prev, event.data]);
  if (event.type === 'update') setData(prev => prev.map(a => a.id === event.id ? event.data : a));
  if (event.type === 'delete') setData(prev => prev.filter(a => a.id !== event.id));
});
return () => unsub(); // cleanup useEffect`}</Code>
            </div>

            <div className="section-block">
              <SubHeading letter="C" title="Struktur Backend Function (Deno)" color="#10b981" />
              <Code>{`// File: functions/namaFungsi.js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const result = await base44.asServiceRole.entities.Alumni.list();
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Panggil dari frontend:
// const res = await base44.functions.invoke('namaFungsi', { param: 'value' });
// const data = res.data;`}</Code>
            </div>

            <div className="section-block">
              <SubHeading letter="D" title="Panduan Auth & Role" color="#10b981" />
              <Code>{`const isAuth = await base44.auth.isAuthenticated();   // → boolean
const user  = await base44.auth.me();                  // id, email, full_name, role
// Role: 'admin' (CRUD semua) | 'user' (baca, submit, voting)

await base44.auth.updateMe({ jabatan: 'Engineer' });   // Update profil sendiri
base44.auth.logout('/');                               // Logout + redirect
base44.auth.redirectToLogin('/tujuan');                // Redirect ke login`}</Code>
            </div>

            <div className="section-block">
              <SubHeading letter="E" title="Environment Variables & Secrets" color="#10b981" />
              <div className="keep" style={{ border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, background: 'rgba(16,185,129,0.04)', padding: '16px 18px', marginBottom: 16 }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: '#10b981', margin: '0 0 8px', fontFamily: 'Montserrat,sans-serif' }}>Auto-populated:</p>
                <Code>{`BASE44_APP_ID   ← ID aplikasi (otomatis tersedia di setiap functions)`}</Code>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: '#10b981', margin: '10px 0 8px', fontFamily: 'Montserrat,sans-serif' }}>Custom Secrets yang aktif (Base44 Dashboard → Settings → Secrets):</p>
                <Code>{`RESEND_API_KEY  ← Email transaksional via Resend (admin@alsits.id)
S32_API_KEY    ← API key portal s32its.id (sync alumni S32)
S32_APP_ID     ← App ID portal s32its.id
S51_API_KEY    ← API key portal s51its.id (sync alumni S51)
S51_APP_ID     ← App ID portal s51its.id`}</Code>
              </div>
            </div>
          </div>
        )}

        {/* DOC 4 — SOURCE CODE */}
        {show('code') && (
          <div className="doc-section sec-gap" style={{ marginTop: 36 }}>
            <DocHeader num="4" color="#0891b2" title="💻 Source Code Lengkap — Portal ALSITS" />

            <div className="section-block">
              <SubHeading letter="A" title="Cara Export / Download Source Code" color="#0891b2" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div className="keep" style={{ padding: '14px 16px', border: '1px solid rgba(8,145,178,0.25)', borderLeft: '3px solid #0891b2', borderRadius: 12, background: 'rgba(8,145,178,0.06)' }}>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12.5, color: '#0891b2', margin: '0 0 10px' }}>📦 Via Base44 Dashboard</p>
                  <ol style={{ paddingLeft: 16, margin: 0 }}>
                    {['Buka base44.com → Dashboard proyek','Klik tab "Code" atau "Files"','Pilih "Export as ZIP"','Download → berisi seluruh src/'].map((s,i) => <li key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, lineHeight: 1.5 }}>{s}</li>)}
                  </ol>
                </div>
                <div className="keep" style={{ padding: '14px 16px', border: '1px solid rgba(16,185,129,0.25)', borderLeft: '3px solid #10b981', borderRadius: 12, background: 'rgba(16,185,129,0.06)' }}>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12.5, color: '#10b981', margin: '0 0 10px' }}>🐙 Via GitHub Sync (Rekomendasi)</p>
                  <ol style={{ paddingLeft: 16, margin: 0 }}>
                    {['Dashboard → Settings → GitHub Integration','Connect ke GitHub account','Pilih repo target (baru / existing)','Aktifkan 2-way sync','→ Kode otomatis push + version history'].map((s,i) => <li key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, lineHeight: 1.5 }}>{s}</li>)}
                  </ol>
                </div>
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="B" title="Struktur File Proyek (Terkini)" color="#0891b2" />
              <Code>{`alsits-portal/
├── src/
│   ├── pages/          Home, AlumniDatabase, AlumniMap, Dashboard
│   │                   NewsPage, JobPostings, Library, Forum
│   │                   VotingPage, VotingAdmin, AdminPanel
│   │                   ContentAdmin, StaticPage, EventsPage
│   │                   BusinessHub, Inbox, DPT, PanduanAdmin
│   │                   PublicView, PublicPortal, DokumenHub
│   │                   SPK, BAST1, BASTAkhir, InvoiceTagihan, ...
│   ├── components/
│   │   ├── layout/     AppLayout, Navbar, Footer, GlobalSearch
│   │   │               BirthdayNotifBar
│   │   ├── onboarding/ OnboardingModal (wizard 3-step)
│   │   ├── alumni/     AlumniCard, AlumniFilters, AlumniDetailModal
│   │   │               AlumniSelfEditModal, AlumniClaimModal
│   │   ├── voting/     VotingAuth, VotingBooth, VotingResults
│   │   ├── admin/      NewsForm, PageContentEditor, EventsAdmin
│   │   │               AlumniClaimVerifier, BulkInvitePanel
│   │   ├── home/       HeroSection, FeaturesSection, LatestNews
│   │   ├── public/     PublicHome, PublicAlumniDirectory, PublicAlumniMap
│   │   │               PublicBusinessHub, PublicAlumniDetailModal
│   │   ├── business/   BusinessDetailView, ContactPersonPanel
│   │   └── ui/         shadcn/ui components (50+ komponen)
│   ├── entities/       Alumni, News, JobPosting, ForumPost, ForumReply
│   │                   LibraryItem, AlsitsEvent, PageContent
│   │                   VotingEvent, VotingCandidate, VoterRegistry
│   │                   AlumniClaim, AngkatanContact, Message
│   ├── functions/      syncFromS32, syncFromS51, notifyNewEvent
│   │                   sendBirthdayEmail, claimAlumni, claimVerifyOtp
│   │                   omovSendOtp, omovSubmitVote, bulkInviteFromAlumniDB
│   │                   getPublicAlumniData, importFromLinkedIn, ...
│   ├── agents/         (AI agents — opsional)
│   ├── api/            base44Client.js (SDK pre-initialized)
│   ├── lib/            AuthContext, utils, query-client, PageNotFound
│   ├── App.jsx         Router & 60+ route definitions
│   ├── main.jsx        Entry point React + PWA SW registration
│   └── index.css       Dark space-theme design tokens + Tailwind
├── public/
│   ├── manifest.json   PWA manifest (icon, theme, display)
│   ├── sw.js           Service Worker (offline cache)
│   └── .well-known/    assetlinks.json (Android PWA)
├── index.html          HTML shell + SEO/OG meta tags + PWA meta
├── tailwind.config.js  Theme extension (colors, fonts, radius)
└── package.json        Dependencies (50+ packages)`}</Code>
            </div>

            <div className="section-block">
              <SubHeading letter="C" title="Lisensi & Kepemilikan" color="#0891b2" />
              <div className="keep" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 13, color: '#10b981', margin: '0 0 12px' }}>✅ Hak Kepemilikan Source Code</p>
                {[
                  'Seluruh source code menjadi hak milik penuh ALSITS setelah pelunasan',
                  'Bebas dimodifikasi, dikembangkan, atau dipindah ke platform lain',
                  'Tidak ada vendor lock-in — kode React/Vite standar yang portable',
                  'Dokumentasi teknis ini adalah bagian integral dari deliverable',
                ].map((s,i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: '#10b981', flexShrink: 0 }}>☑</span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{s}</span>
                  </div>
                ))}
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#10b981', margin: '14px 0 8px' }}>Komponen Open Source (MIT/ISC/BSD License):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['React (MIT)','Tailwind CSS (MIT)','shadcn/ui (MIT)','Lucide React (ISC)','React-Leaflet (BSD)','Recharts (MIT)','Framer Motion (MIT)','TanStack Query (MIT)'].map(lib => (
                    <span key={lib} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 600 }}>{lib}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-block">
              <SubHeading letter="D" title="Checklist Serah Terima Final" color="#0891b2" />
              <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="keep" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 12px' }}>📦 Dokumen & Aset Digital</p>
                  {[
                    ['Source code ZIP (seluruh file proyek)', true],
                    ['File entities/*.json (15 schema DB)', true],
                    ['File functions/*.js (20+ backend)', true],
                    ['Laporan UX Research (dokumen ini)', true],
                    ['Figma Design System (dokumen ini)', true],
                    ['Dokumentasi Teknis (dokumen ini)', true],
                    ['Export data alumni (JSON/CSV backup)', true],
                  ].map(([s, done], i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                      <span style={{ color: done ? '#10b981' : '#475569', flexShrink: 0, fontSize: 13 }}>{done ? '☑' : '☐'}</span>
                      <span style={{ fontSize: 12, color: done ? '#94a3b8' : '#475569', lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="keep" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 12, color: '#e2e8f0', margin: '0 0 12px' }}>🔑 Akses & Training</p>
                  {[
                    ['Akses GitHub repo (jika sync aktif)', false],
                    ['Transfer ownership Base44 Dashboard', false],
                    ['Akses admin alsits.id (role transfer)', false],
                    ['Training session #1 selesai', false],
                    ['Training session #2 selesai', false],
                    ['User guide admin (PDF)', false],
                    ['3 bulan support pasca-launch aktif', false],
                  ].map(([s, done], i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                      <span style={{ color: '#475569', flexShrink: 0, fontSize: 13 }}>☐</span>
                      <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="keep" style={{ marginTop: 48, padding: '28px 36px', borderRadius: 16, background: 'linear-gradient(135deg,#0b1f4a,#060d1f)', textAlign: 'center', border: '1px solid rgba(212,160,23,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 38 }} />
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS" style={{ height: 34 }} />
          </div>
          <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 15, color: '#f59e0b', margin: '0 0 5px' }}>Dokumen Deliverable — Redesign Portal ALSITS</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Alumni Teknik Sipil ITS · alsits.id · 2026 · Konfidensial</p>
        </div>

      </div>
    </div>
  );
}

// ─── REUSABLE MICRO-COMPONENTS ────────────────────────────────────────────────

function DocHeader({ num, color, title }) {
  return (
    <div className="keep doc-header-wrap" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${color}25` }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${color}, ${color}aa)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 18, flexShrink: 0, boxShadow: `0 6px 20px ${color}40` }}>{num}</div>
      <h2 className="sec-title" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 20, fontWeight: 800, color: '#e2e8f0', margin: 0 }}>{title}</h2>
    </div>
  );
}

function SubHeading({ letter, title, color }) {
  return (
    <div className="sub-heading keep" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 12px', paddingBottom: 8, borderBottom: `1px solid ${color}25` }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg,${color},${color}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', flexShrink: 0 }}>{letter}</span>
      <span className="sub-label" style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 11, color: color, textTransform: 'uppercase', letterSpacing: 2 }}>{title}</span>
    </div>
  );
}

function DarkCard({ children }) {
  return (
    <div className="keep card" style={{ display: 'flex', gap: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
      {children}
    </div>
  );
}

function DarkTable({ headers, rows, widths }) {
  return (
    <div className="keep" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg,#0b1f4a,#1e3a8a)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: i === 0 ? 'center' : 'left', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 11.5, color: '#93c5fd', width: widths?.[i], letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '9px 14px', color: '#94a3b8', textAlign: j === 0 ? 'center' : 'left', verticalAlign: 'middle' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SBadge({ color, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${color}18`, color: color, border: `1px solid ${color}35`, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function Code({ children }) {
  return (
    <pre className="keep" style={{ background: '#050d1a', color: '#a5f3fc', borderRadius: 10, padding: '14px 18px', fontSize: 11.5, lineHeight: 1.7, overflowX: 'auto', fontFamily: "'Fira Code', 'Courier New', monospace", margin: '0 0 16px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid rgba(8,145,178,0.2)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)' }}>
      {children}
    </pre>
  );
}