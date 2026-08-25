import React, { useState } from 'react';
import { toTitleCase, formatPhone } from '../utils/format';

const BIDANG_COLORS = {
  'Struktur': '#3b82f6', 'Geoteknik': '#8b5cf6', 'Manajemen Konstruksi': '#f59e0b',
  'Transportasi': '#10b981', 'Hidroteknik': '#06b6d4', 'Lingkungan': '#22c55e', 'Lainnya': '#94a3b8',
};

export default function AlumniDirectoryCard({ alumni }) {
  const [expanded, setExpanded] = useState(false);
  const color = BIDANG_COLORS[alumni.bidang_keahlian] || '#94a3b8';
  const phone = formatPhone(alumni.telepon);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
      overflow: 'hidden', cursor: 'pointer',
      boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
    }} onClick={() => setExpanded(e => !e)}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {alumni.photo_url ? (
          <img src={alumni.photo_url} alt={alumni.full_name}
            style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0b2d6b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {alumni.full_name?.charAt(0) || '?'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{toTitleCase(alumni.full_name)}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {alumni.angkatan && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{alumni.angkatan}</span>}
            {alumni.domisili_kota && <span style={{ fontSize: 12, color: '#64748b' }}>📍 {alumni.domisili_kota}</span>}
          </div>
          {alumni.perusahaan && (
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>🏢 {alumni.perusahaan}{alumni.jabatan ? ` — ${alumni.jabatan}` : ''}</div>
          )}
          {alumni.bidang_keahlian && (
            <span style={{ display: 'inline-block', marginTop: 4, background: color + '20', color, padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
              {alumni.bidang_keahlian}
            </span>
          )}
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 16px', fontSize: 12, color: '#475569' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {alumni.email && <a href={`mailto:${alumni.email}`} style={{ color: '#2563eb', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>✉️ {alumni.email}</a>}
            {phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" style={{ color: '#16a34a', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>📱 {alumni.telepon}</a>}
            {alumni.bidang_industri && <div>🏭 {alumni.bidang_industri}</div>}
            {alumni.linkedin && <a href={alumni.linkedin} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }} onClick={e => e.stopPropagation()}>🔗 LinkedIn</a>}
          </div>
          {alumni.bio && <div style={{ marginTop: 8, fontStyle: 'italic', color: '#64748b' }}>{alumni.bio}</div>}
        </div>
      )}
    </div>
  );
}