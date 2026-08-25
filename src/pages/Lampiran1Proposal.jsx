import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditableField from '@/components/docs/EditableField';

const S = {
  page: { background: '#fff', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 12, lineHeight: 1.7 },
  section: { padding: '32px 48px' },
  h2: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13, color: '#0b2d6b', borderBottom: '2px solid #0b2d6b', paddingBottom: 4, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: 1 },
  p: { marginBottom: 10, textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: 11.5 },
  th: { background: '#0b2d6b', color: '#fff', padding: '8px 12px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 11 },
  td: { padding: '7px 12px', border: '1px solid #ddd', verticalAlign: 'top' },
  tdL: { padding: '7px 12px', border: '1px solid #ddd', background: '#f5f7fb', fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', fontSize: 11, width: '28%' },
  note: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 11.5, color: '#1e3a8a' },
  footer: { textAlign: 'center', fontSize: 10, color: '#888', padding: '14px 80px', borderTop: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' },
};

const DEFAULT_PHASES = [
  {
    fase: 'Phase 1', nama: 'Foundation', minggu: 'Minggu 1–7', nilai: 3000000,
    items: [
      'UX Research & User Interview (5–10 alumni representatif)',
      'Competitive Analysis & Benchmark (4 platform alumni PT)',
      'Wireframe & UX Flow (10+ halaman)',
      'UI Design High-Fidelity + Design System (Figma)',
      'Interactive Prototype + User Testing & revisi',
    ]
  },
  {
    fase: 'Phase 2', nama: 'Core Development', minggu: 'Minggu 7–16', nilai: 4000000,
    items: [
      'Implementasi design system baru ke seluruh halaman',
      'Redesign navigasi flat IA, mega-menu, breadcrumb, mobile-first',
      'Halaman Profil Mandiri alumni (self-service update)',
      'Global Search, Notifikasi in-app, Onboarding Flow',
      'Integrasi API web angkatan S32 & S51 + sync otomatis 30 menit',
      'Business Hub, Voting OMOV, Forum, E-Library, Lowongan Kerja',
      'Sistem berita, event, DPT, Peta Sebaran, Dashboard Statistik',
      'Admin Panel lengkap (CRUD konten, user management)',
    ]
  },
  {
    fase: 'Phase 3', nama: 'Intelligence & Launch', minggu: 'Minggu 14–17', nilai: 3000000,
    items: [
      'Dashboard analitik dinamis (filter, chart interaktif)',
      'Performance optimization & SEO on-page',
      'Testing menyeluruh: functional, responsive, cross-browser',
      'Deployment production + monitoring setup',
      'Training admin ALSITS (2 sesi) + dokumentasi teknis & user guide lengkap',
      'BAST Akhir & serah terima seluruh aset',
    ]
  },
];

function rupiah(n) { return 'Rp ' + n.toLocaleString('id-ID') + ',-'; }

export default function Lampiran1Proposal() {
  const [editMode, setEditMode] = useState(false);
  const [phases, setPhases] = useState(DEFAULT_PHASES);

  const updPhase = (pi, key, val) => setPhases(p => p.map((ph, i) => i === pi ? { ...ph, [key]: val } : ph));
  const updItem = (pi, ii, val) => setPhases(p => p.map((ph, i) => i === pi ? { ...ph, items: ph.items.map((it, j) => j === ii ? val : it) } : ph));
  const delItem = (pi, ii) => setPhases(p => p.map((ph, i) => i === pi ? { ...ph, items: ph.items.filter((_, j) => j !== ii) } : ph));
  const addItem = (pi) => setPhases(p => p.map((ph, i) => i === pi ? { ...ph, items: [...ph.items, 'Item deliverable baru'] } : ph));

  const total = phases.reduce((s, ph) => s + (Number(ph.nilai) || 0), 0);

  return (
    <div style={S.page}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 14mm 12mm 14mm; }
          html, body, #root, .min-h-screen { background: #fff !important; color: #1a1a1a !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
          .sign-block { page-break-inside: avoid; }
        }
      `}</style>

      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={{ background: '#0b2d6b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak / PDF</button>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : '#f1f5f9', color: editMode ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit Konten'}
        </button>
        {editMode && <span style={{ fontSize: 11, color: '#d97706', fontStyle: 'italic' }}>💡 Klik teks bergaris biru untuk edit · 🗑️ hapus · + tambah</span>}
        <button onClick={() => window.history.back()} style={{ background: '#f1f5f9', color: '#333', border: '1px solid #ddd', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>← Kembali</button>
      </div>

      <div style={S.section}>
        <div style={{ borderBottom: '3px solid #D4A017', paddingBottom: 16, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Lampiran 1 · SPK/ALSITS/DIGITAL/001/2026</div>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 22, color: '#0b2d6b', marginBottom: 4 }}>PROPOSAL BIAYA FINAL</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#D4A017', fontWeight: 700 }}>Redesign & Improvement Portal ALSITS — alsits.id · 2026</p>
        </div>

        <h2 style={S.h2}>Identitas Proyek</h2>
        <table style={S.table}>
          <tbody>
            {[
              ['Nama Proyek', 'Redesign & Improvement Portal Digital ALSITS'],
              ['Klien', 'Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS)'],
              ['Developer', 'Hazril "abu_thariq" Firdhanni'],
              ['Tanggal Proposal', 'Mei 2026'],
              ['Nomor Referensi', 'SPK/ALSITS/DIGITAL/001/2026'],
            ].map(([l, v]) => (
              <tr key={l}><td style={S.tdL}>{l}</td><td style={{ ...S.td, background: '#fff', width: '3%', textAlign: 'center' }}>:</td><td style={S.td}>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>Rincian Biaya Per Fase</h2>
        {phases.map((ph, pi) => (
          <div key={pi} style={{ marginBottom: 20 }}>
            <div style={{ background: '#0b2d6b', color: '#fff', padding: '8px 14px', borderRadius: '6px 6px 0 0', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <EditableField value={ph.fase} onChange={v => updPhase(pi, 'fase', v)} editMode={editMode} style={{ color: '#fff', fontWeight: 700 }} /> — <EditableField value={ph.nama} onChange={v => updPhase(pi, 'nama', v)} editMode={editMode} style={{ color: '#fff' }} /> · <EditableField value={ph.minggu} onChange={v => updPhase(pi, 'minggu', v)} editMode={editMode} style={{ color: '#fff' }} />
              </span>
              <span style={{ background: '#D4A017', padding: '2px 10px', borderRadius: 4, fontSize: 11 }}>
                {editMode
                  ? <input type="number" value={ph.nilai} onChange={e => updPhase(pi, 'nilai', Number(e.target.value))} style={{ width: 120, textAlign: 'right', border: '1px solid #fff', borderRadius: 3, padding: '1px 6px', background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
                  : rupiah(ph.nilai)
                }
              </span>
            </div>
            <table style={{ ...S.table, marginBottom: 0 }}>
              <thead><tr>
                <th style={{ ...S.th, background: '#1e4080', width: '5%' }}>No.</th>
                <th style={{ ...S.th, background: '#1e4080' }}>Deliverable / Lingkup Pekerjaan</th>
                {editMode && <th style={{ ...S.th, background: '#1e4080', width: '5%' }}>Del</th>}
              </tr></thead>
              <tbody>
                {ph.items.map((item, ii) => (
                  <tr key={ii}>
                    <td style={{ ...S.td, textAlign: 'center' }}>{ii + 1}</td>
                    <td style={S.td}><EditableField value={item} onChange={v => updItem(pi, ii, v)} editMode={editMode} style={{ width: '100%' }} /></td>
                    {editMode && <td style={{ ...S.td, textAlign: 'center' }}><button onClick={() => delItem(pi, ii)} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={12} /></button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {editMode && <button onClick={() => addItem(pi)} style={{ background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: '0 0 6px 6px', padding: '4px 14px', fontSize: 11, cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}><Plus size={11} /> Tambah item</button>}
          </div>
        ))}

        <h2 style={S.h2}>Rekapitulasi Biaya</h2>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Fase</th>
            <th style={{ ...S.th, textAlign: 'right', width: '20%' }}>Nilai</th>
            <th style={{ ...S.th, width: '20%' }}>Termin Pembayaran</th>
          </tr></thead>
          <tbody>
            {phases.map((ph, pi) => (
              <tr key={pi}>
                <td style={S.td}><strong>{ph.fase}: {ph.nama}</strong></td>
                <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{rupiah(ph.nilai)}</td>
                <td style={S.td}>Termin {pi + 1} ({pi === 0 ? '30%' : pi === 1 ? '40%' : '30%'})</td>
              </tr>
            ))}
            <tr style={{ background: '#0b2d6b' }}>
              <td style={{ ...S.td, background: '#0b2d6b', color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>TOTAL NILAI KONTRAK</td>
              <td style={{ ...S.td, background: '#D4A017', color: '#fff', fontWeight: 900, fontSize: 14, textAlign: 'right' }}>{rupiah(total)}</td>
              <td style={{ ...S.td, background: '#0b2d6b', color: '#fff', fontSize: 11 }}>3 Termin</td>
            </tr>
          </tbody>
        </table>

        <div style={S.note}>
          <strong>Catatan:</strong> Nilai di atas belum termasuk biaya platform/hosting (Base44), domain (alsits.id), dan layanan pihak ketiga, yang ditagihkan secara terpisah dengan bukti pembayaran (reimbursement).
        </div>

        <div className="sign-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
          {[['PIHAK PERTAMA (ALSITS)', '[Nama]', '[Jabatan]'], ['PIHAK KEDUA (Developer)', 'Hazril "abu_thariq" Firdhanni', 'Developer Portal ALSITS']].map(([role, name, jabatan], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, marginBottom: 2 }}>{role}</p>
              <div style={{ height: 48 }} />
              <div style={{ borderTop: '1px solid #333', paddingTop: 6 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{name}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{jabatan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.footer}>Lampiran 1 · SPK/ALSITS/DIGITAL/001/2026 · Proposal Biaya Final — Portal ALSITS · Konfidensial</div>
    </div>
  );
}