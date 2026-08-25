import React, { useState, useMemo } from 'react';

const toTitleCase = s => s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : '';

const INDUSTRI_COLORS = {
  'Konstruksi': '#f59e0b',
  'Konsultan': '#3b82f6',
  'BUMN': '#8b5cf6',
  'Pemerintahan': '#6366f1',
  'Akademisi': '#10b981',
  'Wiraswasta': '#f97316',
  'Perbankan': '#0ea5e9',
  'Energi': '#eab308',
  'Teknologi': '#06b6d4',
  'Lainnya': '#94a3b8',
};

function BusinessCard({ alumni }) {
  const tags = alumni.business_tags ? alumni.business_tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const color = INDUSTRI_COLORS[alumni.bidang_industri] || '#94a3b8';

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {alumni.photo_url ? (
          <img src={alumni.photo_url} alt={alumni.full_name}
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {alumni.full_name?.charAt(0) || '?'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{toTitleCase(alumni.full_name)}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{alumni.jabatan || '—'}</div>
          <span style={{ background: color + '20', color, padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
            {alumni.bidang_industri || 'Lainnya'}
          </span>
        </div>
      </div>

      {/* Perusahaan */}
      {alumni.perusahaan && (
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>🏢 {alumni.perusahaan}</div>
          {(alumni.company_city || alumni.domisili_kota) && (
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📍 {alumni.company_city || alumni.domisili_kota}</div>
          )}
          {alumni.alamat_perusahaan && (
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{alumni.alamat_perusahaan}</div>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags.map(t => (
            <span key={t} style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{t}</span>
          ))}
        </div>
      )}

      {/* Kontak */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 10, fontSize: 12 }}>
        {alumni.angkatan && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{alumni.angkatan}</span>}
        {alumni.telepon && <a href={`https://wa.me/${alumni.telepon.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>📱 WhatsApp</a>}
        {alumni.email && <a href={`mailto:${alumni.email}`}
          style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>✉️ Email</a>}
        {alumni.linkedin && <a href={alumni.linkedin} target="_blank" rel="noreferrer"
          style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>🔗 LinkedIn</a>}
      </div>
    </div>
  );
}

export default function PublicBusinessHub({ alumni }) {
  const [search, setSearch] = useState('');
  const [filterIndustri, setFilterIndustri] = useState('');
  const [filterKota, setFilterKota] = useState('');

  // Only alumni with company info
  const businesses = useMemo(() => alumni.filter(a => a.perusahaan && a.perusahaan.trim()), [alumni]);

  const industriList = useMemo(() => [...new Set(businesses.map(a => a.bidang_industri).filter(Boolean))].sort(), [businesses]);
  const kotaList = useMemo(() => [...new Set(businesses.map(a => a.company_city || a.domisili_kota).filter(Boolean))].sort(), [businesses]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return businesses.filter(a => {
      if (q && !a.full_name?.toLowerCase().includes(q) && !a.perusahaan?.toLowerCase().includes(q)
        && !a.business_tags?.toLowerCase().includes(q) && !a.jabatan?.toLowerCase().includes(q)) return false;
      if (filterIndustri && a.bidang_industri !== filterIndustri) return false;
      if (filterKota) {
        const kota = a.company_city || a.domisili_kota;
        if (kota !== filterKota) return false;
      }
      return true;
    });
  }, [businesses, search, filterIndustri, filterKota]);

  const selectStyle = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#fff', color: '#1e293b', cursor: 'pointer' };

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari nama, perusahaan, bidang usaha..."
          style={{ ...selectStyle, flex: '1 1 200px', minWidth: 200 }} />
        <select value={filterIndustri} onChange={e => setFilterIndustri(e.target.value)} style={selectStyle}>
          <option value="">Semua Industri</option>
          {industriList.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={filterKota} onChange={e => setFilterKota(e.target.value)} style={selectStyle}>
          <option value="">Semua Kota</option>
          {kotaList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {(search || filterIndustri || filterKota) && (
          <button onClick={() => { setSearch(''); setFilterIndustri(''); setFilterKota(''); }}
            style={{ ...selectStyle, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>✕ Reset</button>
        )}
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} bisnis / usaha</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(a => <BusinessCard key={a.id} alumni={a} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
          <div>Tidak ada data bisnis yang cocok</div>
        </div>
      )}
    </div>
  );
}