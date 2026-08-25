import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import PublicAlumniDirectory from '@/components/public/PublicAlumniDirectory';
import PublicBusinessHub from '@/components/public/PublicBusinessHub';
import PublicAlumniMap from '@/components/public/PublicAlumniMap';

const TABS = [
  { id: 'direktori', label: '🎓 Direktori Alumni' },
  { id: 'bisnis', label: '💼 Business Hub' },
  { id: 'peta', label: '🗺️ Peta Sebaran' },
];

export default function PublicPortal() {
  const [activeTab, setActiveTab] = useState('direktori');
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Alumni.filter({ status: 'Aktif' }, 'full_name', 500)
      .then(data => {
        // Filter out deceased
        const active = data.filter(a => a.status !== 'Almarhum' && a.status !== 'Almarhumah');
        setAlumni(active);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0b2d6b 0%, #1a4a9e 100%)', color: '#fff', padding: '0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <img
              src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png"
              alt="ALSITS"
              style={{ height: 52, filter: 'brightness(0) invert(1)' }}
            />
            <div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>ALSITS</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Alumni Teknik Sipil ITS — Portal Publik</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7, textAlign: 'right' }}>
              <div>Data alumni Teknik Sipil ITS</div>
              <div style={{ marginTop: 2 }}>
                <a href="/" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>
                  → Login Alumni
                </a>
              </div>
            </div>
          </div>

          {/* Hero stats */}
          {!loading && (
            <div style={{ display: 'flex', gap: 24, marginBottom: 0, flexWrap: 'wrap' }}>
              {[
                { label: 'Total Alumni', value: alumni.length },
                { label: 'Angkatan', value: [...new Set(alumni.map(a => a.angkatan).filter(Boolean))].length },
                { label: 'Kota', value: [...new Set(alumni.map(a => a.domisili_kota || a.company_city).filter(Boolean))].length },
                { label: 'Perusahaan', value: [...new Set(alumni.map(a => a.perusahaan).filter(Boolean))].length },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px 8px 0 0' }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 28, color: '#fbbf24' }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  borderRadius: '8px 8px 0 0',
                  background: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: activeTab === tab.id ? '#0b2d6b' : '#fff',
                  transition: 'all 0.15s',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div>Memuat data alumni...</div>
          </div>
        ) : (
          <>
            {activeTab === 'direktori' && <PublicAlumniDirectory alumni={alumni} />}
            {activeTab === 'bisnis' && <PublicBusinessHub alumni={alumni} />}
            {activeTab === 'peta' && <PublicAlumniMap alumni={alumni} />}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #e2e8f0', color: '#888', fontSize: 12, marginTop: 40 }}>
        © 2026 ALSITS — Komisariat Jurusan Alumni Teknik Sipil Institut Teknologi Sepuluh Nopember · <a href="/" style={{ color: '#0b2d6b' }}>alsits.id</a>
      </div>
    </div>
  );
}