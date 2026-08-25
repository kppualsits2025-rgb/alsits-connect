import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';


const DOCS = [
  {
    group: 'KONTRAK & KESEPAKATAN',
    items: [
      { icon: '📋', title: 'Surat Perintah Kerja (SPK)', desc: '001/SPK-KOMJUR-ALSITS/VI/2026 · Jakarta, 8 Juni 2026 · Nilai Rp 10.000.000 · 20 Pasal · ditandatangani PARA PIHAK.', path: '/spk', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
      { icon: '📝', title: 'Notulen Kick-off & Rencana Kerja', desc: 'Notulen rapat kick-off, kesepakatan PARA PIHAK, rencana kerja & timeline 3 fase pengembangan. Edit konten & upload TTD developer.', path: '/notulen-kickoff', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)' },
      { icon: '📄', title: 'Draft Kontrak Kerja', desc: 'Perjanjian kerja sama 13 pasal antara Developer dan ALSITS — dapat diedit langsung sebelum ditandatangani.', path: '/draft-kontrak', color: '#60a5fa', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
    ]
  },
  {
    group: 'BERITA ACARA SERAH TERIMA (BAST)',
    items: [
      { icon: '✅', title: 'BAST 1 — Phase 1 & 2', desc: 'Berita Acara Serah Terima Phase 1 (Foundation) & Phase 2 (Core Development) · Platform staging · Pencairan Termin 1+2 (Rp 7.000.000).', path: '/bast-1', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' },
      { icon: '📋', title: 'Lampiran A — Deliverable Phase 1 (Foundation)', desc: 'Daftar lengkap deliverable Phase 1: UX Research, Figma Design System, Interactive Prototype, Notulen Kick-off — status Selesai.', path: '/bast-1-lampiran-a', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
      { icon: '📋', title: 'Lampiran B — Deliverable Phase 2 (Core Development)', desc: 'Daftar 14 fitur/deliverable Phase 2 yang telah live di alsits.id — status Selesai dengan URL verifikasi.', path: '/bast-1-lampiran-b', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
      { icon: '🏁', title: 'BAST Akhir — Phase 3 / Go-Live', desc: 'Berita Acara Serah Terima Akhir · Platform live production · Training selesai · Serah terima aset & akses · Pelunasan (Rp 3.000.000).', path: '/bast-akhir', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
    ]
  },
  {
    group: 'INVOICE & TAGIHAN',
    items: [
      { icon: '🧾', title: 'Invoice & Tagihan', desc: 'Invoice Termin 1 (DP Rp 3 jt), Termin 2 (Rp 4 jt), Termin 3/Pelunasan (Rp 3 jt), dan Tagihan Biaya Operasional platform Base44 (Rp 3.327.396 · 4 invoice Apr–Jun 2026).', path: '/invoice', color: '#D4A017', bg: 'rgba(212,160,23,0.12)', border: 'rgba(212,160,23,0.35)' },
    ]
  },
  {
    group: 'LAMPIRAN SPK',
    items: [
      { icon: '💰', title: 'Lampiran 1 — Proposal Biaya Final', desc: 'Rincian biaya 3 fase pengembangan portal ALSITS, deliverable per fase, rekapitulasi, dan skema pembayaran.', path: '/lampiran-1', color: '#D4A017', bg: 'rgba(212,160,23,0.10)', border: 'rgba(212,160,23,0.30)' },
      { icon: '📝', title: 'Lampiran 2 — Scope of Work & Deliverables', desc: 'Daftar lengkap 20+ modul/fitur, cakupan pekerjaan, kriteria penerimaan, dan daftar out of scope.', path: '/lampiran-2', color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.30)' },
      { icon: '📅', title: 'Lampiran 3 — Jadwal & Milestone', desc: 'Timeline pelaksanaan seluruh fase beserta status terkini (✅ Selesai / 🔄 Berjalan) dan kolom tanda tangan.', path: '/lampiran-3', color: '#6366f1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.30)' },
      { icon: '📋', title: 'Lampiran 4 — Format BAST-1 & BAST Akhir', desc: 'Checklist deliverable lengkap untuk BAST-1 (Termin 1+2) dan BAST Akhir (Termin 3) beserta blok tanda tangan. Ref: 001/SPK-KOMJUR-ALSITS/VI/2026.', path: '/lampiran-4', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
      { icon: '📦', title: 'Lampiran 5 — Daftar Aset & Credential Serah Terima Akhir', desc: 'Daftar lengkap akses platform, source code, desain, data alumni, credential, dan dokumen legal yang wajib diserahkan saat BAST Akhir. Ref: 001/SPK-KOMJUR-ALSITS/VI/2026.', path: '/lampiran-5', color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.30)' },
    ]
  },
  {
    group: 'SURAT & UNDANGAN',
    items: [
      { icon: '✉️', title: 'Undangan Review & Demo Live Portal ALSITS', desc: 'Undangan kepada Ketua & Sekjen ALSITS untuk sesi review, demonstrasi live fitur, dan penandatanganan BAST-1 · Selasa 16 Juni 2026 · Google Meet.', path: '/undangan-review', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)' },
    ]
  },
  {
    group: 'DOKUMEN PHASE 1 (BUKTI ADMINISTRATIF)',
    items: [
      { icon: '🔬', title: 'Laporan UX Research', desc: 'Metodologi, 10 responden alumni, temuan, 4 persona pengguna, rekomendasi strategis — dasar perancangan ulang portal. Nomor: UXR/ALSITS/DIGITAL/001/2026.', path: '/ux-research', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
      { icon: '📊', title: 'Competitive Analysis Report', desc: 'Benchmark 4 portal alumni PT: IKA ITS, IKA UI, Brawijaya, ITB. Matriks 14 fitur — ALSITS unggul di semua. Nomor: CAR/ALSITS/DIGITAL/001/2026.', path: '/competitive-analysis', color: '#6366f1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.30)' },
      { icon: '🖼️', title: 'Wireframe, UX Flow & Prototype', desc: '12 halaman di-wireframe, 5 user flow utama, sitemap arsitektur informasi. Prototype = portal live alsits.id (Lean UX). Nomor: WFP/ALSITS/DIGITAL/001/2026.', path: '/wireframe-prototype', color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.30)' },
      { icon: '🎨', title: 'Design System Documentation', desc: 'Color tokens (biru ITS + emas ALSITS), tipografi (Montserrat + Open Sans), komponen UI (shadcn/ui + Tailwind). Nomor: DSD/ALSITS/DIGITAL/001/2026.', path: '/design-system', color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.30)' },
    ]
  },
  {
    group: 'DOKUMEN PHASE 2 (BUKTI ADMINISTRATIF)',
    items: [
      { icon: '⚙️', title: 'Laporan Pelaksanaan Phase 2 — Core Development', desc: '14 fitur/modul live di alsits.id: direktori alumni, peta sebaran, business hub, forum, job board, admin panel, sync API S32/S51, dan lainnya. Nomor: RPT-P2/ALSITS/DIGITAL/001/2026.', path: '/docs-phase-2', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.30)' },
    ]
  },
  {
    group: 'DOKUMEN PHASE 3 (BUKTI ADMINISTRATIF)',
    items: [
      { icon: '🏁', title: 'Laporan Pelaksanaan Phase 3 — Intelligence & Go-Live', desc: 'PWA, Voting OMOV, dashboard analitik, optimasi performa, SEO, training admin 2 sesi, dokumentasi teknis lengkap. Nomor: RPT-P3/ALSITS/DIGITAL/001/2026.', path: '/docs-phase-3', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
    ]
  },
  {
    group: 'PAKET LAMPIRAN',
    items: [
      { icon: '📦', title: 'Gabung & Ekspor Semua Lampiran', desc: 'Pilih dokumen yang ingin disertakan, buka semuanya sekaligus untuk di-print/PDF, dan simpan daftar indeks otomatis ke Google Drive folder "ALSITS - Dokumen Proyek 2026".', path: '/gabung-lampiran', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)' },
    ]
  },
  {
    group: 'PROPOSAL & DELIVERABLES',
    items: [
      { icon: '📊', title: 'Proposal Biaya Final', desc: 'Rincian biaya 3 fase pengembangan portal ALSITS, skema pembayaran, dan perbandingan nilai pasar.', path: '/proposal-biaya', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)' },
      { icon: '📦', title: 'Deliverables', desc: 'Dokumentasi teknis lengkap: UX research, design system, source code, panduan admin, dan laporan pengerjaan.', path: '/deliverables', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)' },
      { icon: '📋', title: 'Presentasi Proposal', desc: 'Slide presentasi interaktif untuk paparan kepada pengurus ALSITS.', path: '/presentation', color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.35)' },
    ]
  },
];

export default function DokumenHub() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      setAllowed(user?.email === 'hazrilf@gmail.com');
    }).catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return (
    <div style={{ minHeight: '100vh', background: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', fontSize: 14 }}>Memuat...</div>
    </div>
  );

  if (!allowed) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 50%,#060d1f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>🔒</div>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Akses Terbatas</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Halaman ini hanya dapat diakses oleh pemilik proyek.<br />Hubungi administrator jika Anda membutuhkan dokumen tertentu.
        </p>
        <Link to="/beranda" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', color: '#f59e0b', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>← Kembali ke Beranda</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 50%,#060d1f 100%)', fontFamily: 'Open Sans, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0b1f4a,#060d1f)', borderBottom: '3px solid #D4A017', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 40 }} />
        <div>
          <div style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17 }}>Dokumen Proyek ALSITS</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Redesign & Improvement Portal alsits.id · 2026</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 20, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Montserrat, sans-serif' }}>Dokumen Resmi Proyek</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Semua Dokumen<br /><span style={{ color: '#f59e0b' }}>di Satu Tempat</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Pilih dokumen yang ingin dibuka. Semua dapat dicetak atau di-export ke PDF.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {DOCS.map(group => (
            <div key={group.group}>
              <div style={{ fontSize: 10, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 }}>
                {group.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.items.map(doc => (
                  <Link key={doc.path} to={doc.path} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', borderRadius: 14, background: doc.bg, border: `1px solid ${doc.border}`, transition: 'all 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{ fontSize: 32, flexShrink: 0 }}>{doc.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>{doc.title}</div>
                        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.50)', lineHeight: 1.6 }}>{doc.desc}</div>
                      </div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 20, color: doc.color, flexShrink: 0 }}>→</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 52 }}>
          Dokumen ini bersifat konfidensial · Ditujukan untuk Pengurus ALSITS · alsits.id · 2026
        </p>
      </div>
    </div>
  );
}