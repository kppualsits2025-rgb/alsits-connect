import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

function rupiah(n) {
  if (!n && n !== 0) return '—';
  return 'Rp ' + Number(n).toLocaleString('id-ID') + ',-';
}

const DEFAULT_SHARED = {
  klien_nama: 'Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS)',
  klien_alamat: 'Surabaya, Jawa Timur',
  klien_npwp: '-',
  dev_nama: 'Hazril "abu_thariq" Firdhanni',
  dev_jabatan: 'Developer Portal ALSITS',
  dev_alamat: 'Perumahan Taman Sentosa, Jl. Sentosa Lestari VII\nBlok D14 No. 12, RT24 RW008, Pasirsari,\nCikarang Selatan - Kab. Bekasi 17530',
  dev_nik: '3216192504700001',
  bank_nama: 'Bank Mandiri',
  bank_rekening: '166-000-5250048',
  bank_atasnama: 'Hazril Firdhanni',
  pihak1_nama: 'Harum Akhmad Zuhdi',
  pihak1_jabatan: 'Ketua Komisariat Jurusan Alumni Teknik Sipil ITS',
  spk_no: 'SPK/ALSITS/DIGITAL/001/2026',
};

const DEFAULT_INVOICES = [
  {
    no: 'INV-ALSITS-2026-001',
    termin: 'Termin 1 — Down Payment (30%)',
    phase: 'Phase 1: Foundation',
    tanggal: '17 Mei 2026',
    jatuh_tempo: '24 Mei 2026',
    desc: 'Down Payment — Phase 1: Foundation\nUX Research, Competitive Analysis, Wireframe & UX Flow, UI Design High-Fidelity + Design System (Figma), Interactive Prototype + User Testing',
    total: 3000000,
    catatan: 'Pembayaran ini merupakan syarat dimulainya pengerjaan formal / kick-off meeting.',
  },
  {
    no: 'INV-ALSITS-2026-002',
    termin: 'Termin 2 — Core Development (40%)',
    phase: 'Phase 2: Core Development',
    tanggal: '[Tanggal penerbitan]',
    jatuh_tempo: '7 hari setelah BAST 1 ditandatangani',
    desc: 'Phase 2: Core Development\nImplementasi design system, redesign navigasi, mobile-first responsive, global search, profil mandiri alumni, integrasi API S32 & S51, Business Hub, Voting OMOV, Forum, E-Library, Lowongan, berita & event, Admin Panel, DPT',
    total: 4000000,
    catatan: 'Dibayarkan setelah BAST 1 ditandatangani dan platform staging disetujui PIHAK PERTAMA.',
  },
  {
    no: 'INV-ALSITS-2026-003',
    termin: 'Termin 3 — Pelunasan (30%)',
    phase: 'Phase 3: Intelligence & Launch',
    tanggal: '[Tanggal penerbitan]',
    jatuh_tempo: '7 hari setelah BAST Akhir ditandatangani',
    desc: 'Phase 3: Intelligence & Launch\nDashboard analitik dinamis, performance optimization & SEO, testing menyeluruh, deployment production, monitoring setup, training admin ALSITS (2 sesi), dokumentasi teknis & user guide, serah terima aset & akses',
    total: 3000000,
    catatan: 'Setelah pelunasan diterima, seluruh hak kepemilikan atas platform beralih kepada PIHAK PERTAMA. Support teknis 3 bulan gratis.',
  },
  {
    no: 'INV-ALSITS-2026-OPS-1',
    termin: 'Tagihan Biaya Operasional Ke-1',
    phase: 'Reimbursement Domain & Hosting',
    tanggal: '12 Juni 2026',
    jatuh_tempo: '12 Juni 2026',
    desc: 'Reimbursement biaya operasional infrastruktur portal alsits.id yang telah dibayarkan oleh Developer selama periode pengembangan:\n\n• Domain alsits.id (Hostinger · Inv. HID-1558087 · 6 Mei 2026 · billed yearly May 2026–May 2027)\n  IDR 234.099\n\n• Cloud Startup / Hosting VPS (Hostinger · Inv. HID-1487370 · 27 Mar 2026 · billed yearly Mar 2026–Mar 2027)\n  IDR 1.972.759\n\n• Horizons Starter — email hosting (Hostinger · Inv. HID-1490470 · 30 Mar 2026 · billed monthly Mar–Apr 2026)\n  IDR 313.148\n\n• Horizons Top Up 50 — pertama (Hostinger · Inv. HID-1491780 · 31 Mar 2026 · Mar–Jun 2026)\n  IDR 368.409\n\n• Horizons Top Up 50 — kedua (Hostinger · Inv. HID-1494561 · 1 Apr 2026 · Apr–Jun 2026)\n  IDR 368.409\n\nSeluruh layanan ditagihkan oleh PT. Web Media Technology Indonesia (Hostinger ID). Bukti pembayaran terlampir.',
    total: 3256824,
    catatan: 'Tagihan ini merupakan reimbursement biaya infrastruktur dan layanan hosting yang telah dibayarkan terlebih dahulu oleh Developer (Hazril Firdhanni) demi kelangsungan portal alsits.id. Seluruh bukti pembayaran asli (invoice dari Hostinger) tersedia sebagai lampiran.',
  },
  {
    no: 'INV-ALSITS-2026-OPS-2',
    termin: 'Tagihan Biaya Operasional Ke-2',
    phase: 'Reimbursement Platform Base44',
    tanggal: '20 Juni 2026',
    jatuh_tempo: '22 Juni 2026',
    desc: 'Reimbursement biaya langganan platform Base44 (hosting & infrastruktur portal alsits.id) yang telah dibayarkan oleh Developer selama periode pengembangan dan operasional:\n\n• Inv. WADHND3S-0001 · 27 Apr 2026 · Base44 Subscription v3 (Apr 27–May 27, 2026) · $50.00 × Rp 17.636 = Rp 881.790\n• Inv. WADHND3S-0002 · 9 Mei 2026 · Upgrade plan Base44 Subscription v3 (prorated May 9–May 27, 2026) · $30.48 × Rp 17.740 = Rp 540.741\n• Inv. WADHND3S-0003 · 27 Mei 2026 · Base44 Subscription v3 (May 27–Jun 27, 2026) · $100.00 × Rp 17.845 = Rp 1.784.500\n• Inv. WADHND3S-0004 · 20 Jun 2026 · Upgrade plan Base44 Subscription v3 (prorated Jun 20–Jun 27, 2026) · $22.41 × Rp 18.215 = Rp 408.201\n\nTotal USD: $202.89 | Bukti pembayaran terlampir (4 Invoice + 4 Receipt dari Base44 by Wix.com Ltd)',
    total: 3615232,
    catatan: 'Tagihan ini merupakan reimbursement biaya operasional platform yang telah dibayarkan terlebih dahulu oleh Developer (Hazril Firdhanni) menggunakan kartu pribadi (Visa - 3365) kepada Base44 by Wix.com Ltd, Israel, demi kelangsungan portal alsits.id. Seluruh bukti pembayaran asli (invoice & receipt) tersedia sebagai lampiran.',
  },
];

// Inline editable field — hanya tampil saat editMode aktif
function EF({ value, onChange, multiline = false, editMode, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  if (!editMode) return <span style={style}>{value}</span>;

  if (editing) {
    const inputStyle = { fontSize: 'inherit', fontFamily: 'inherit', border: '1.5px solid #3b82f6', borderRadius: 4, padding: '2px 6px', background: '#eff6ff', width: '100%', lineHeight: 1.5, ...style };
    return (
      <span style={{ display: 'inline-flex', gap: 3, width: '100%', alignItems: 'flex-start' }}>
        {multiline
          ? <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') { onChange(draft); setEditing(false); } if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
              style={inputStyle} />
        }
        <button onClick={() => { onChange(draft); setEditing(false); }} style={{ background: '#22c55e', border: 'none', borderRadius: 3, padding: '2px 7px', cursor: 'pointer', color: '#fff', flexShrink: 0, fontSize: 11 }}>✓</button>
        <button onClick={() => { setDraft(value); setEditing(false); }} style={{ background: '#ef4444', border: 'none', borderRadius: 3, padding: '2px 7px', cursor: 'pointer', color: '#fff', flexShrink: 0, fontSize: 11 }}>✕</button>
      </span>
    );
  }

  return (
    <span onClick={() => { setDraft(value); setEditing(true); }} title="Klik untuk edit"
      style={{ cursor: 'pointer', borderBottom: '1px dashed #93c5fd', display: 'inline', ...style }}>
      {value || <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: '0.9em' }}>—klik untuk isi—</span>}
    </span>
  );
}

function InvoicePage({ inv, shared, onInvChange, onSharedChange, editMode, devSignature, onSignatureUpload, onClearSignature }) {
  const S = shared;
  const upd = (k, v) => onInvChange({ ...inv, [k]: v });
  const updS = (k, v) => onSharedChange({ ...S, [k]: v });

  return (
    <div className="invoice-page" style={{
      background: '#fff', width: '210mm', minHeight: '270mm',
      padding: '13mm 15mm', fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: 11, color: '#1a1a1a', boxSizing: 'border-box',
    }}>

      {/* TOP ACCENT */}
      <div style={{ height: 5, background: 'linear-gradient(90deg, #0b2d6b, #1a4fa0)', borderRadius: 2, marginBottom: 16 }} />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: '#0b2d6b', letterSpacing: 1 }}>INVOICE</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}><EF value={inv.no} onChange={v => upd('no', v)} editMode={editMode} /></div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>Ref: <EF value={S.spk_no} onChange={v => updS('spk_no', v)} editMode={editMode} /></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', background: '#0b2d6b', color: '#D4A017', padding: '4px 14px', borderRadius: 4, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>
            <EF value={inv.termin} onChange={v => upd('termin', v)} editMode={editMode} style={{ color: '#D4A017' }} />
          </div>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
            <EF value={inv.phase} onChange={v => upd('phase', v)} editMode={editMode} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1.5px solid #e2e8f0', marginBottom: 14 }} />

      {/* BILLING INFO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Ditagihkan Kepada</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#0b2d6b', lineHeight: 1.4 }}><EF value={S.klien_nama} onChange={v => updS('klien_nama', v)} editMode={editMode} /></div>
          <div style={{ color: '#475569', marginTop: 3 }}><EF value={S.klien_alamat} onChange={v => updS('klien_alamat', v)} editMode={editMode} multiline /></div>
          {S.klien_npwp !== '-' && <div style={{ color: '#64748b', marginTop: 2 }}>NPWP: <EF value={S.klien_npwp} onChange={v => updS('klien_npwp', v)} editMode={editMode} /></div>}
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Dikeluarkan Oleh</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#0b2d6b', lineHeight: 1.4 }}><EF value={S.dev_nama} onChange={v => updS('dev_nama', v)} editMode={editMode} /></div>
          <div style={{ color: '#475569', marginTop: 3, whiteSpace: 'pre-line' }}><EF value={S.dev_alamat} onChange={v => updS('dev_alamat', v)} editMode={editMode} multiline /></div>
          <div style={{ color: '#64748b', marginTop: 2 }}>NIK: <EF value={S.dev_nik} onChange={v => updS('dev_nik', v)} editMode={editMode} /></div>
        </div>
      </div>

      {/* META */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '9px 14px', marginBottom: 14, gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tanggal Invoice</div>
          <div style={{ fontWeight: 700, fontSize: 12, marginTop: 2 }}><EF value={inv.tanggal} onChange={v => upd('tanggal', v)} editMode={editMode} /></div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nomor SPK</div>
          <div style={{ fontWeight: 600, fontSize: 10, marginTop: 2 }}><EF value={S.spk_no} onChange={v => updS('spk_no', v)} editMode={editMode} /></div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Jatuh Tempo</div>
          <div style={{ fontWeight: 700, fontSize: 11, color: '#d97706', marginTop: 2 }}><EF value={inv.jatuh_tempo} onChange={v => upd('jatuh_tempo', v)} editMode={editMode} /></div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
        <thead>
          <tr style={{ background: '#0b2d6b' }}>
            <th style={{ color: '#fff', padding: '7px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, width: '5%' }}>No.</th>
            <th style={{ color: '#fff', padding: '7px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700 }}>Deskripsi</th>
            <th style={{ color: '#fff', padding: '7px 10px', textAlign: 'center', fontSize: 10, fontWeight: 700, width: '7%' }}>Qty</th>
            <th style={{ color: '#fff', padding: '7px 10px', textAlign: 'center', fontSize: 10, fontWeight: 700, width: '10%' }}>Satuan</th>
            <th style={{ color: '#fff', padding: '7px 10px', textAlign: 'right', fontSize: 10, fontWeight: 700, width: '22%' }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center', verticalAlign: 'top', color: '#64748b' }}>1</td>
            <td style={{ padding: '10px', border: '1px solid #e2e8f0', verticalAlign: 'top', lineHeight: 1.6 }}>
              <EF value={inv.desc} onChange={v => upd('desc', v)} editMode={editMode} multiline style={{ whiteSpace: 'pre-line', width: '100%' }} />
            </td>
            <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center', verticalAlign: 'top' }}>1</td>
            <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center', verticalAlign: 'top' }}>Paket</td>
            <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right', verticalAlign: 'top', fontWeight: 700, fontSize: 12 }}>
              {inv.total
                ? editMode
                  ? <input type="number" value={inv.total} onChange={e => upd('total', Number(e.target.value))}
                      style={{ width: 110, textAlign: 'right', border: '1.5px solid #3b82f6', borderRadius: 4, padding: '2px 6px', background: '#eff6ff', fontSize: 12, fontWeight: 700 }} />
                  : rupiah(inv.total)
                : <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>
                    <EF value={inv.totalText || 'Sesuai aktual'} onChange={v => upd('totalText', v)} editMode={editMode} />
                  </span>
              }
            </td>
          </tr>
          <tr style={{ background: inv.total ? '#0b2d6b' : '#f8fafc' }}>
            <td colSpan={4} style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, fontSize: 11, color: inv.total ? '#fff' : '#475569', border: '1px solid ' + (inv.total ? '#0b2d6b' : '#e2e8f0') }}>TOTAL</td>
            <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, fontSize: 13, color: inv.total ? '#D4A017' : '#94a3b8', border: '1px solid ' + (inv.total ? '#0b2d6b' : '#e2e8f0') }}>
              {inv.total ? rupiah(inv.total) : <span style={{ fontStyle: 'italic' }}>{inv.totalText || 'Sesuai tagihan aktual'}</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* PAYMENT + CATATAN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#f1f5f9', padding: '6px 12px', fontWeight: 700, fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>Informasi Pembayaran</div>
          <table style={{ width: '100%', fontSize: 11 }}>
            {[['Bank', 'bank_nama'], ['No. Rekening', 'bank_rekening'], ['Atas Nama', 'bank_atasnama']].map(([l, k]) => (
              <tr key={k}>
                <td style={{ padding: '5px 12px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #f1f5f9', width: '38%' }}>{l}</td>
                <td style={{ padding: '5px 4px', color: '#64748b' }}>:</td>
                <td style={{ padding: '5px 12px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', fontWeight: l === 'No. Rekening' ? 700 : 400 }}>
                  <EF value={S[k]} onChange={v => updS(k, v)} editMode={editMode} />
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: '5px 12px', color: '#64748b', fontWeight: 600 }}>Ket. Transfer</td>
              <td style={{ padding: '5px 4px', color: '#64748b' }}>:</td>
              <td style={{ padding: '5px 12px', color: '#1e293b', fontWeight: 600 }}>{inv.no}</td>
            </tr>
          </table>
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 9, color: '#92400e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Catatan</div>
          <div style={{ fontSize: 11, color: '#78350f', lineHeight: 1.6 }}>
            <EF value={inv.catatan} onChange={v => upd('catatan', v)} editMode={editMode} multiline />
          </div>
        </div>
      </div>

      {/* SIGNATURE */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* PIHAK PERTAMA */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 1 }}>Diterima oleh</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4 }}>PIHAK PERTAMA (ALSITS)</div>
            {/* Area tanda tangan — sama tinggi dengan pihak kedua */}
            <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* kosong untuk PIHAK PERTAMA */}
            </div>
            {/* Tombol upload placeholder agar tinggi sama */}
            <div className="no-print" style={{ height: editMode ? 28 : 0 }} />
            <div style={{ borderTop: '1px solid #334155', paddingTop: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}><EF value={S.pihak1_nama} onChange={v => updS('pihak1_nama', v)} editMode={editMode} /></div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}><EF value={S.pihak1_jabatan} onChange={v => updS('pihak1_jabatan', v)} editMode={editMode} /></div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Tanggal: ___________________</div>
            </div>
          </div>

          {/* PIHAK KEDUA — dengan tanda tangan digital */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 1 }}>Dikeluarkan oleh</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4 }}>PIHAK KEDUA (Developer)</div>
            {/* Area tanda tangan */}
            <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {devSignature
                ? <img src={devSignature} alt="TTD Developer" style={{ maxHeight: 85, maxWidth: 220, objectFit: 'contain' }} />
                : <div className="no-print" style={{ border: '1.5px dashed #cbd5e1', borderRadius: 6, padding: '6px 16px', color: '#94a3b8', fontSize: 10, fontStyle: 'italic' }}>
                    [tanda tangan]
                  </div>
              }
            </div>
            {/* Tombol upload — hanya tampil saat edit mode */}
            {editMode
              ? <div className="no-print" style={{ display: 'flex', gap: 6, justifyContent: 'center', height: 28, alignItems: 'center' }}>
                  <label style={{ cursor: 'pointer', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#2563eb', fontWeight: 600 }}>
                    📎 Upload TTD
                    <input type="file" accept="image/*" onChange={onSignatureUpload} style={{ display: 'none' }} />
                  </label>
                  {devSignature && (
                    <button onClick={onClearSignature} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>
                      🗑 Hapus
                    </button>
                  )}
                </div>
              : <div style={{ height: 0 }} />
            }
            <div style={{ borderTop: '1px solid #334155', paddingTop: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}><EF value={S.dev_nama} onChange={v => updS('dev_nama', v)} editMode={editMode} /></div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}><EF value={S.dev_jabatan} onChange={v => updS('dev_jabatan', v)} editMode={editMode} /></div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                Tanggal: <EF value={inv.tanggal} onChange={v => upd('tanggal', v)} editMode={editMode} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 6, textAlign: 'center', fontSize: 9, color: '#94a3b8' }}>
        {inv.no} · Redesign &amp; Improvement Portal ALSITS · {S.spk_no} · Konfidensial
      </div>
    </div>
  );
}

export default function InvoiceTagihan() {
  const [active, setActive] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);
  const [shared, setShared] = useState(DEFAULT_SHARED);
  const [devSignature, setDevSignature] = useState(null); // URL gambar tanda tangan developer

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDevSignature(ev.target.result);
    reader.readAsDataURL(file);
  };

  const updateInv = (i, data) => setInvoices(prev => prev.map((inv, idx) => idx === i ? data : inv));

  return (
    <div style={{ background: '#e2e8f0', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body, #root, .min-h-screen { background: #fff !important; }
          .no-print { display: none !important; }
          .invoice-page { width: 100% !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ background: '#0b2d6b', padding: '10px 24px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', borderBottom: '3px solid #D4A017', position: 'sticky', top: 0, zIndex: 50 }}>
        {invoices.map((inv, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ background: active === i ? '#D4A017' : 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
            {i < 3 ? `Termin ${i + 1}` : i === 3 ? 'Operasional 1' : 'Operasional 2'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setEditMode(e => !e)}
            style={{ background: editMode ? '#22c55e' : 'rgba(255,255,255,0.15)', color: '#fff', border: editMode ? 'none' : '1px solid rgba(255,255,255,0.3)', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pencil size={13} /> {editMode ? '✓ Edit Aktif' : 'Edit'}
          </button>
          {editMode && <span style={{ fontSize: 11, color: '#fbbf24', fontStyle: 'italic' }}>Klik field bergaris biru untuk edit</span>}
          <button onClick={() => window.print()} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '7px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>🖨️ Cetak</button>
          <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>← Kembali</button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 16px' }}>
        <div style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)', borderRadius: 4 }}>
          <InvoicePage
            inv={invoices[active]}
            shared={shared}
            onInvChange={(data) => updateInv(active, data)}
            onSharedChange={setShared}
            editMode={editMode}
            devSignature={devSignature}
            onSignatureUpload={handleSignatureUpload}
            onClearSignature={() => setDevSignature(null)}
          />
        </div>
      </div>
    </div>
  );
}