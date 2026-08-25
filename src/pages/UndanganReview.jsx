import React, { useState } from 'react';

export default function UndanganReview() {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState({
    hari_tanggal: 'Selasa, 16 Juni 2026',
    waktu: '13.00 WIB',
    media: 'Google Meet',
    link: 'https://calendar.app.google/ZvScXDiV4EmSxuUBA',
    tempat_ttd: 'Bekasi',
    tgl_ttd: '15 Juni 2026',
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const EF = ({ k, style = {} }) => editMode
    ? <input value={data[k]} onChange={e => set(k, e.target.value)}
        style={{ border: '1.5px dashed #6366f1', borderRadius: 3, background: '#eff6ff', padding: '1px 5px', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', ...style }} />
    : <span style={style}>{data[k]}</span>;

  return (
    <div style={{ background: '#d1d5db', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          html, body { margin: 0 !important; padding: 0 !important; }
          #root, .min-h-screen { background: #fff !important; }
          .no-print { display: none !important; }
          .print-wrapper { padding: 0 !important; }
          .doc-page {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ background: '#1e1b4b', padding: '10px 24px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '3px solid #6366f1', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginRight: 8 }}>✉️ Undangan Review & Demo Live Portal ALSITS</span>
        <button onClick={() => setEditMode(e => !e)}
          style={{ background: editMode ? '#22c55e' : 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          ✏️ {editMode ? 'Edit Aktif' : 'Edit'}
        </button>
        <button onClick={() => { alert('Saat dialog print muncul:\n• Margins → pilih "None"\n• Scale → "Fit to page width" atau 100%\nLalu klik Save/Print.'); window.print(); }}
          style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          🖨️ Cetak / PDF
        </button>
        <button onClick={() => window.history.back()}
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          ← Kembali
        </button>
        {editMode && <span style={{ color: '#a5b4fc', fontSize: 11, fontStyle: 'italic' }}>Klik field untuk edit</span>}
      </div>

      {/* Document */}
      <div className="print-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '28px 16px' }}>
        <div className="doc-page" style={{
          background: '#fff',
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
          fontFamily: "'Georgia', serif",
          fontSize: 10.5,
          color: '#1a1a1a',
          lineHeight: 1.5,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Top accent bar */}
          <div style={{ height: 6, background: 'linear-gradient(90deg, #1e1b4b 0%, #6366f1 60%, #a5b4fc 100%)', flexShrink: 0 }} />

          {/* Content area */}
          <div style={{ padding: '9mm 16mm 8mm 16mm', flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Header personal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 7, paddingBottom: 6, borderBottom: '1.5px solid #e0e7ff' }}>
              <div>
                <div style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 14, color: '#1e1b4b', letterSpacing: 0.3 }}>
                  Hazril <span style={{ fontStyle: 'italic', color: '#6366f1' }}>"abu_thariq"</span> Firdhanni
                </div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, fontFamily: 'Arial, sans-serif' }}>
                  Developer Portal ALSITS &nbsp;·&nbsp; Bekasi, Jawa Barat
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af', fontFamily: 'Arial, sans-serif', textAlign: 'right' }}>
                <div>alsits.id</div>
                <div>VI/2026</div>
              </div>
            </div>

            {/* Nomor surat */}
            <table style={{ marginBottom: 7, fontSize: 10.5, fontFamily: 'Arial, sans-serif' }}>
              <tbody>
                {[
                  ['Nomor', '001/UND-DEV-ALSITS/VI/2026'],
                  ['Sifat', 'Penting'],
                  ['Perihal', <strong>Undangan Review dan Demo Live Portal ALSITS</strong>],
                ].map(([l, v]) => (
                  <tr key={l}>
                    <td style={{ width: 70, color: '#374151', fontWeight: 600, verticalAlign: 'top', paddingBottom: 2 }}>{l}</td>
                    <td style={{ width: 14, verticalAlign: 'top', paddingBottom: 2 }}>:</td>
                    <td style={{ verticalAlign: 'top', paddingBottom: 2 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Kepada */}
            <div style={{ marginBottom: 7, fontFamily: 'Arial, sans-serif', fontSize: 10.5 }}>
              <div style={{ fontWeight: 700, marginBottom: 3 }}>Kepada Yth.</div>
              <div style={{ paddingLeft: 14 }}>
                <div>1. Cak <strong>Harum Akhmad Zuhdi</strong> <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: 10.5 }}>(Ketua Komjur ALSITS)</span></div>
                <div>2. Cak <strong>Gunawan Wibisono</strong> <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: 10.5 }}>(Sekjen Komjur ALSITS)</span></div>
                <div style={{ marginTop: 3, fontStyle: 'italic', color: '#374151' }}>di Tempat</div>
              </div>
            </div>

            {/* Salam */}
            <div style={{ marginBottom: 5, fontFamily: 'Arial, sans-serif', fontSize: 10.5 }}>Dengan hormat,</div>

            {/* Paragraf */}
            <p style={{ marginBottom: 5, textAlign: 'justify', fontFamily: 'Arial, sans-serif', fontSize: 10.5 }}>
              Sehubungan dengan telah selesainya pekerjaan <strong>Phase 2 (Core Development)</strong> dan telah beroperasinya (<em>live</em>) sistem portal <strong>alsits.id</strong> beserta integrasi <strong>s32its.id</strong> dan <strong>s51its.id</strong>, saya bermaksud mengundang Bapak untuk hadir dalam sesi tinjauan (<em>review</em>) dan demonstrasi fitur secara langsung.
            </p>
            <p style={{ marginBottom: 7, textAlign: 'justify', fontFamily: 'Arial, sans-serif', fontSize: 10.5 }}>
              Pertemuan ini bertujuan untuk mendapatkan masukan dari pihak pengurus selaku pengguna utama, sekaligus sebagai dasar evaluasi untuk penandatanganan <strong>Berita Acara Serah Terima Sementara (BAST-1)</strong> sesuai dengan ketentuan <strong>SPK No. 001/SPK-KOMJUR-ALSITS/VI/2026</strong>.
            </p>

            {/* Detail pertemuan — kotak highlight */}
            <div style={{ background: '#f5f3ff', border: '1.5px solid #c7d2fe', borderRadius: 6, padding: '7px 14px', marginBottom: 7 }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 9.5, color: '#4338ca', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Detail Pertemuan</div>
              <table style={{ fontSize: 10.5, fontFamily: 'Arial, sans-serif', width: '100%' }}>
                <tbody>
                  {[
                    ['Hari, Tanggal', 'hari_tanggal'],
                    ['Waktu', 'waktu'],
                    ['Media', 'media'],
                    ['Tautan (Link)', 'link'],
                  ].map(([label, k]) => (
                    <tr key={k}>
                      <td style={{ width: 110, fontWeight: 600, color: '#374151', paddingBottom: 2, verticalAlign: 'top' }}>{label}</td>
                      <td style={{ width: 14, verticalAlign: 'top', paddingBottom: 2 }}>:</td>
                      <td style={{ verticalAlign: 'top', paddingBottom: 2, color: k === 'link' ? '#4f46e5' : '#111827', fontWeight: k === 'link' ? 600 : 400 }}>
                        <EF k={k} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agenda */}
            <div style={{ marginBottom: 7 }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10.5, fontWeight: 700, marginBottom: 4 }}>Agenda Pembahasan:</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10.5 }}>
                {[
                  'Laporan penyelesaian pekerjaan Phase 2 (Core Development).',
                  'Demonstrasi live fitur utama portal (Profil Mandiri, Integrasi API S32 & S51, Business Hub, Voting OMOV, Forum, Lowongan, dan Admin Panel).',
                  'Sesi diskusi dan pengumpulan feedback dari pengurus selaku pengguna.',
                  'Kesepakatan persetujuan hasil kerja dan penandatanganan Berita Acara Serah Terima Sementara (BAST-1).',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 3, alignItems: 'flex-start' }}>
                    <div style={{ color: '#6366f1', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</div>
                    <div style={{ textAlign: 'justify' }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Penutup */}
            <p style={{ marginBottom: 8, fontFamily: 'Arial, sans-serif', fontSize: 10.5, textAlign: 'justify' }}>
              Demikian undangan ini saya sampaikan. Atas perhatian dan kesediaan waktu Bapak, saya ucapkan terima kasih.
            </p>

            {/* TTD */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <div style={{ textAlign: 'center', minWidth: 180, fontFamily: 'Arial, sans-serif', fontSize: 11 }}>
                <div style={{ marginBottom: 2 }}>
                  <EF k="tempat_ttd" style={{ maxWidth: 80 }} />, <EF k="tgl_ttd" style={{ maxWidth: 110 }} />
                </div>
                <div style={{ color: '#4b5563' }}>Hormat saya,</div>
                <div style={{ height: 40 }} />
                <div style={{ fontWeight: 700, fontSize: 12, borderTop: '1.5px solid #374151', paddingTop: 4 }}>
                  Hazril <em>"abu_thariq"</em> Firdhanni
                </div>
                <div style={{ fontSize: 10.5, color: '#6b7280', marginTop: 2 }}>Developer Portal ALSITS</div>
              </div>
            </div>

          </div>

          {/* Bottom accent bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #1e1b4b 0%, #6366f1 60%, #a5b4fc 100%)', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}