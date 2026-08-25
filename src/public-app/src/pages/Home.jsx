import React, { useState, useEffect, useMemo } from 'react';
import { fetchAlumni } from '../api/alumniApi';
import BusinessCard from '../components/BusinessCard';
import AlumniDirectoryCard from '../components/AlumniDirectoryCard';

const toTitleCase = s => s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : '';

const TABS = [
  { id: 'bisnis', label: '💼 Business Hub', desc: 'Direktori usaha & perusahaan alumni' },
  { id: 'direktori', label: '👥 Direktori Alumni', desc: 'Profil seluruh alumni teknik sipil ITS' },
];

function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ background: '#f1f5f9', borderRadius: 14, height: 140, animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('bisnis');
  const [search, setSearch] = useState('');
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const [filterIndustri, setFilterIndustri] = useState('');
  const [filterKota, setFilterKota] = useState('');

  useEffect(() => {
    fetchAlumni().then(setAlumni).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const businesses = useMemo(() => alumni.filter(a => a.perusahaan?.trim()), [alumni]);

  const angkatanList = useMemo(() => [...new Set(alumni.map(a => a.angkatan).filter(Boolean))].sort(), [alumni]);
  const industriList = useMemo(() => [...new Set(businesses.map(a => a.bidang_industri).filter(Boolean))].sort(), [businesses]);
  const kotaList = useMemo(() => [...new Set(businesses.map(a => a.company_city || a.domisili_kota).filter(Boolean))].sort(), [businesses]);

  const filteredBisnis = useMemo(() => {
    const q = search.toLowerCase();
    return businesses.filter(a => {
      if (q && !a.full_name?.toLowerCase().includes(q) && !a.perusahaan?.toLowerCase().includes(q) && !a.business_tags?.toLowerCase().includes(q)) return false;
      if (filterAngkatan && a.angkatan !== filterAngkatan) return false;
      if (filterIndustri && a.bidang_industri !== filterIndustri) return false;
      if (filterKota && (a.company_city || a.domisili_kota) !== filterKota) return false;
      return true;
    });
  }, [businesses, search, filterAngkatan, filterIndustri, filterKota]);

  const filteredDirektori = useMemo(() => {
    const q = search.toLowerCase();
    return alumni.filter(a => {
      if (q && !a.full_name?.toLowerCase().includes(q) && !a.perusahaan?.toLowerCase().includes(q)) return false;
      if (filterAngkatan && a.angkatan !== filterAngkatan) return false;
      return true;
    });
  }, [alumni, search, filterAngkatan]);

  const selectStyle = {
    padding: '9px 13px', border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 13, background: '#fff', color: '#1e293b', cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0b2d6b 0%, #1a4fa0 100%)', color: '#fff', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: '#D4A017', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff', flexShrink: 0 }}>S</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>Alumni Teknik Sipil ITS</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Direktori Profesional & Bisnis Alumni</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { label: 'Total Alumni', value: alumni.length },
              { label: 'Pemilik Usaha', value: businesses.length },
              { label: 'Angkatan', value: angkatanList.length },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 24 }}>{s.value}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setFilterAngkatan(''); setFilterIndustri(''); setFilterKota(''); }}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13, transition: 'all 0.15s',
                  background: tab === t.id ? '#D4A017' : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>

        {/* Filter bar */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'bisnis' ? '🔍 Cari nama, perusahaan, bidang usaha...' : '🔍 Cari nama alumni...'}
            style={{ ...selectStyle, flex: '1 1 200px', minWidth: 200 }} />

          <select value={filterAngkatan} onChange={e => setFilterAngkatan(e.target.value)} style={selectStyle}>
            <option value="">Semua Angkatan</option>
            {angkatanList.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {tab === 'bisnis' && (
            <>
              <select value={filterIndustri} onChange={e => setFilterIndustri(e.target.value)} style={selectStyle}>
                <option value="">Semua Industri</option>
                {industriList.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={filterKota} onChange={e => setFilterKota(e.target.value)} style={selectStyle}>
                <option value="">Semua Kota</option>
                {kotaList.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </>
          )}

          {(search || filterAngkatan || filterIndustri || filterKota) && (
            <button onClick={() => { setSearch(''); setFilterAngkatan(''); setFilterIndustri(''); setFilterKota(''); }}
              style={{ ...selectStyle, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
              ✕ Reset
            </button>
          )}

          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
            {tab === 'bisnis' ? filteredBisnis.length : filteredDirektori.length} hasil
          </span>
        </div>

        {/* Cards */}
        {loading ? <Skeleton /> : error ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#ef4444' }}>⚠️ {error}</div>
        ) : tab === 'bisnis' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
              {filteredBisnis.map(a => <BusinessCard key={a.id} alumni={a} />)}
            </div>
            {filteredBisnis.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
                <div>Tidak ada data bisnis yang cocok</div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {filteredDirektori.map(a => <AlumniDirectoryCard key={a.id} alumni={a} />)}
            </div>
            {filteredDirektori.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div>Tidak ada alumni yang cocok</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px', fontSize: 12, color: '#94a3b8', borderTop: '1px solid #e2e8f0', marginTop: 32 }}>
        Alumni Teknik Sipil ITS · Data diperbarui secara berkala · © {new Date().getFullYear()}
      </div>
    </div>
  );
}