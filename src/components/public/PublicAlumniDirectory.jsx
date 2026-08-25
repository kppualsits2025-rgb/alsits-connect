import React, { useState, useMemo } from 'react';

const toTitleCase = s => s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : '';

const BIDANG_COLORS = {
  'Struktur': '#3b82f6',
  'Geoteknik': '#8b5cf6',
  'Manajemen Konstruksi': '#f59e0b',
  'Transportasi': '#10b981',
  'Hidroteknik': '#06b6d4',
  'Lingkungan': '#22c55e',
  'Lainnya': '#94a3b8',
};

function AlumniCard({ alumni }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
      padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.15s',
      boxShadow: expanded ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
    }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {alumni.photo_url ? (
            <img src={alumni.photo_url} alt={alumni.full_name}
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: '#0b2d6b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 18,
            }}>
              {alumni.full_name?.charAt(0) || '?'}
            </div>
          )}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 2 }}>
            {toTitleCase(alumni.full_name)}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {alumni.angkatan && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>{alumni.angkatan}</span>}
            {alumni.domisili_kota && <span>📍 {alumni.domisili_kota}</span>}
          </div>
          {alumni.perusahaan && (
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
              🏢 {alumni.perusahaan}{alumni.jabatan ? ` — ${alumni.jabatan}` : ''}
            </div>
          )}
          {alumni.bidang_keahlian && (
            <span style={{
              display: 'inline-block', marginTop: 4,
              background: (BIDANG_COLORS[alumni.bidang_keahlian] || '#94a3b8') + '20',
              color: BIDANG_COLORS[alumni.bidang_keahlian] || '#64748b',
              padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
            }}>{alumni.bidang_keahlian}</span>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#475569' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {alumni.email && <div>✉️ <a href={`mailto:${alumni.email}`} style={{ color: '#2563eb' }} onClick={e => e.stopPropagation()}>{alumni.email}</a></div>}
            {alumni.telepon && <div>📱 {alumni.telepon}</div>}
            {alumni.bidang_industri && <div>🏭 {alumni.bidang_industri}</div>}
            {alumni.domisili_negara && alumni.domisili_negara !== 'Indonesia' && <div>🌍 {alumni.domisili_negara}</div>}
            {alumni.linkedin && <div>🔗 <a href={alumni.linkedin} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }} onClick={e => e.stopPropagation()}>LinkedIn</a></div>}
          </div>
          {alumni.bio && <div style={{ marginTop: 8, fontStyle: 'italic', color: '#64748b' }}>{alumni.bio}</div>}
        </div>
      )}
    </div>
  );
}

export default function PublicAlumniDirectory({ alumni }) {
  const [search, setSearch] = useState('');
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const [filterBidang, setFilterBidang] = useState('');
  const [filterKota, setFilterKota] = useState('');

  const angkatanList = useMemo(() => [...new Set(alumni.map(a => a.angkatan).filter(Boolean))].sort(), [alumni]);
  const bidangList = useMemo(() => [...new Set(alumni.map(a => a.bidang_keahlian).filter(Boolean))].sort(), [alumni]);
  const kotaList = useMemo(() => [...new Set(alumni.map(a => a.domisili_kota).filter(Boolean))].sort(), [alumni]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return alumni.filter(a => {
      if (q && !a.full_name?.toLowerCase().includes(q) && !a.perusahaan?.toLowerCase().includes(q) && !a.jabatan?.toLowerCase().includes(q)) return false;
      if (filterAngkatan && a.angkatan !== filterAngkatan) return false;
      if (filterBidang && a.bidang_keahlian !== filterBidang) return false;
      if (filterKota && a.domisili_kota !== filterKota) return false;
      return true;
    });
  }, [alumni, search, filterAngkatan, filterBidang, filterKota]);

  const selectStyle = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#fff', color: '#1e293b', cursor: 'pointer' };

  return (
    <div>
      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari nama, perusahaan, jabatan..."
          style={{ ...selectStyle, flex: '1 1 200px', minWidth: 200 }}
        />
        <select value={filterAngkatan} onChange={e => setFilterAngkatan(e.target.value)} style={selectStyle}>
          <option value="">Semua Angkatan</option>
          {angkatanList.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterBidang} onChange={e => setFilterBidang(e.target.value)} style={selectStyle}>
          <option value="">Semua Bidang</option>
          {bidangList.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterKota} onChange={e => setFilterKota(e.target.value)} style={selectStyle}>
          <option value="">Semua Kota</option>
          {kotaList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {(search || filterAngkatan || filterBidang || filterKota) && (
          <button onClick={() => { setSearch(''); setFilterAngkatan(''); setFilterBidang(''); setFilterKota(''); }}
            style={{ ...selectStyle, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
            ✕ Reset
          </button>
        )}
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} alumni</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {filtered.map(a => <AlumniCard key={a.id} alumni={a} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div>Tidak ada alumni yang cocok dengan filter</div>
        </div>
      )}
    </div>
  );
}