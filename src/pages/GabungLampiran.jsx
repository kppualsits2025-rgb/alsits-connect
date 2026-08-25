import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Download, CloudUpload, CheckCircle, Loader } from 'lucide-react';

const LAMPIRAN_LIST = [
  { title: 'SPK — Surat Perintah Kerja', path: '/spk', nomor: 'SPK/ALSITS/001/2026' },
  { title: 'Notulen Kick-off Meeting', path: '/notulen-kickoff', nomor: 'NKO/ALSITS/001/2026' },
  { title: 'Lampiran 1 — Proposal Biaya', path: '/lampiran-1', nomor: 'L1/ALSITS/001/2026' },
  { title: 'Lampiran 2 — Scope of Work', path: '/lampiran-2', nomor: 'L2/ALSITS/001/2026' },
  { title: 'Lampiran 3 — Jadwal & Milestone', path: '/lampiran-3', nomor: 'L3/ALSITS/001/2026' },
  { title: 'Lampiran 4 — Format BAST', path: '/lampiran-4', nomor: 'L4/ALSITS/001/2026' },
  { title: 'Lampiran 5 — Daftar Aset Serah Terima', path: '/lampiran-5', nomor: 'L5/ALSITS/001/2026' },
  { title: 'UX Research Report', path: '/ux-research', nomor: 'UXR/ALSITS/001/2026' },
  { title: 'Competitive Analysis Report', path: '/competitive-analysis', nomor: 'CAR/ALSITS/001/2026' },
  { title: 'Wireframe & Prototype', path: '/wireframe-prototype', nomor: 'WFP/ALSITS/001/2026' },
  { title: 'Design System Documentation', path: '/design-system', nomor: 'DSD/ALSITS/001/2026' },
  { title: 'BAST-1 — Phase 1 & 2', path: '/bast-1', nomor: 'BAST-1/ALSITS/001/2026' },
  { title: 'BAST Akhir — Phase 3', path: '/bast-akhir', nomor: 'BAST-A/ALSITS/001/2026' },
  { title: 'Laporan Phase 2 — Core Development', path: '/docs-phase-2', nomor: 'RPT-P2/ALSITS/001/2026' },
  { title: 'Laporan Phase 3 — Go-Live', path: '/docs-phase-3', nomor: 'RPT-P3/ALSITS/001/2026' },
  { title: 'Invoice & Tagihan', path: '/invoice', nomor: 'INV/ALSITS/001/2026' },
];

export default function GabungLampiran() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selected, setSelected] = useState(LAMPIRAN_LIST.map(() => true));

  const toggleAll = (val) => setSelected(LAMPIRAN_LIST.map(() => val));
  const selectedCount = selected.filter(Boolean).length;
  const selectedDocs = LAMPIRAN_LIST.filter((_, i) => selected[i]);

  const handlePrintAll = () => {
    // Buka semua dokumen terpilih di tab baru untuk di-print satu per satu
    selectedDocs.forEach((doc, i) => {
      setTimeout(() => window.open(doc.path, '_blank'), i * 400);
    });
  };

  const handleUploadToDrive = async () => {
    setUploading(true);
    setUploadResult(null);
    setUploadError(null);

    // Buat daftar dokumen terpilih sebagai HTML ringkasan untuk di-upload ke Drive
    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Daftar Lampiran Proyek ALSITS 2026</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 32px; color: #1a1a1a; }
    h1 { color: #0b2d6b; border-bottom: 3px solid #D4A017; padding-bottom: 12px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #0b2d6b; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; }
    td { padding: 9px 14px; border: 1px solid #ddd; font-size: 12px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .status { color: #16a34a; font-weight: bold; }
    .footer { margin-top: 32px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
  </style>
</head>
<body>
  <h1>📦 Daftar Lampiran Proyek ALSITS</h1>
  <div class="meta">
    Nomor SPK: SPK/ALSITS/DIGITAL/001/2026 &nbsp;·&nbsp; Tanggal Generate: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} &nbsp;·&nbsp; Total Dokumen: ${selectedDocs.length}
  </div>
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Judul Dokumen</th>
        <th>Nomor Referensi</th>
        <th>URL Akses</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${selectedDocs.map((doc, i) => `
        <tr>
          <td style="text-align:center">${i + 1}</td>
          <td>${doc.title}</td>
          <td style="font-family:monospace;font-size:11px">${doc.nomor}</td>
          <td style="color:#2563eb">alsits.id${doc.path}</td>
          <td class="status">✅ Tersedia</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="footer">Dokumen ini bersifat konfidensial · Portal ALSITS · alsits.id · 2026</div>
</body>
</html>`;

    // Encode sebagai base64
    const base64 = btoa(unescape(encodeURIComponent(htmlContent)));
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `ALSITS_Daftar_Lampiran_${dateStr}.html`;

    try {
      const res = await base44.functions.invoke('uploadToDrive', {
        fileName,
        fileContentBase64: base64,
        mimeType: 'text/html',
        folderName: 'ALSITS - Dokumen Proyek 2026',
      });
      setUploadResult(res.data);
    } catch (err) {
      setUploadError(err.message || 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 50%,#060d1f 100%)', fontFamily: 'Open Sans, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0b1f4a,#060d1f)', borderBottom: '3px solid #D4A017', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" style={{ height: 40 }} />
        <div>
          <div style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17 }}>Paket Lampiran Proyek ALSITS</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Kumpulkan, cetak, dan simpan semua dokumen ke Google Drive</div>
        </div>
        <Link to="/dokumen" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}>← Kembali ke Dokumen Hub</Link>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px' }}>

        {/* Instruksi */}
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: '#60a5fa' }}>📋 Cara Penggunaan:</strong><br />
            1. Centang dokumen yang ingin disertakan dalam paket<br />
            2. <strong>Cetak / Buka Semua</strong> → buka tiap dokumen di tab baru untuk di-print atau save as PDF secara individual<br />
            3. <strong>Simpan Daftar ke Drive</strong> → upload indeks dokumen HTML ke Google Drive folder "ALSITS - Dokumen Proyek 2026"
          </p>
        </div>

        {/* Select all / deselect */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{selectedCount} dari {LAMPIRAN_LIST.length} dokumen dipilih</span>
          <button onClick={() => toggleAll(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer' }}>Pilih Semua</button>
          <button onClick={() => toggleAll(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Hapus Pilihan</button>
        </div>

        {/* Daftar dokumen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {LAMPIRAN_LIST.map((doc, i) => (
            <div key={doc.path} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, background: selected[i] ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected[i] ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.15s', cursor: 'pointer' }}
              onClick={() => setSelected(s => s.map((v, j) => j === i ? !v : v))}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected[i] ? '#3b82f6' : 'rgba(255,255,255,0.3)'}`, background: selected[i] ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selected[i] && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 13, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{doc.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace' }}>{doc.nomor}</div>
              </div>
              <Link to={doc.path} target="_blank" onClick={e => e.stopPropagation()}
                style={{ color: '#60a5fa', fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <ExternalLink size={12} /> Buka
              </Link>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={handlePrintAll} disabled={selectedCount === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0b2d6b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: selectedCount === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, opacity: selectedCount === 0 ? 0.5 : 1 }}>
            <Download size={15} /> Cetak / Buka Semua ({selectedCount})
          </button>

          <button onClick={handleUploadToDrive} disabled={uploading || selectedCount === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: uploading ? '#374151' : '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: (uploading || selectedCount === 0) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, opacity: selectedCount === 0 ? 0.5 : 1, transition: 'background 0.2s' }}>
            {uploading ? <Loader size={15} className="animate-spin" /> : <CloudUpload size={15} />}
            {uploading ? 'Menyimpan ke Drive...' : 'Simpan Daftar ke Google Drive'}
          </button>
        </div>

        {/* Upload result */}
        {uploadResult && (
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle size={16} color="#10b981" />
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>Berhasil disimpan ke Google Drive!</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 8px' }}>
              📁 Folder: <strong style={{ color: '#fff' }}>ALSITS - Dokumen Proyek 2026</strong><br />
              📄 File: <strong style={{ color: '#fff' }}>{uploadResult.fileName}</strong>
            </p>
            {uploadResult.webViewLink && (
              <a href={uploadResult.webViewLink} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                <ExternalLink size={12} /> Buka di Google Drive
              </a>
            )}
          </div>
        )}

        {uploadError && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: 12 }}>
            ⚠️ {uploadError}
          </div>
        )}
      </div>
    </div>
  );
}