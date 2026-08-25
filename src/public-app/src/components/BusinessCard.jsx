import React, { useState } from 'react';
import { toTitleCase, formatPhone } from '../utils/format';

const INDUSTRI_COLORS = {
  'Konstruksi': '#f59e0b', 'Konsultan': '#3b82f6', 'BUMN': '#8b5cf6',
  'Pemerintahan': '#6366f1', 'Akademisi': '#10b981', 'Wiraswasta': '#f97316',
  'Perbankan': '#0ea5e9', 'Energi': '#eab308', 'Teknologi': '#06b6d4', 'Lainnya': '#94a3b8',
};

function KegiatanUsaha({ raw }) {
  let items = [];
  try { items = JSON.parse(raw); } catch { return null; }
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#475569', marginBottom: 8 }}>🏪 Kegiatan Usaha / Perusahaan</div>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
          {item.logo_url && (
            <img src={item.logo_url} alt={item.name}
              style={{ height: 40, maxWidth: 120, objectFit: 'contain', marginBottom: 8, display: 'block' }} />
          )}
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{item.name || item.title}</div>
          {item.category && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>📂 {item.category}</div>}
          {item.address && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>📍 {item.address}</div>}
          {item.description && <div style={{ fontSize: 11, color: '#475569', marginTop: 6, lineHeight: 1.5 }}>{item.description}</div>}
          {item.website && (
            <a href={item.website.startsWith('http') ? item.website : 'https://' + item.website}
              target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 6, fontSize: 11, color: '#2563eb', textDecoration: 'none' }}>
              🌐 {item.website}
            </a>
          )}
          {item.instagram && (
            <a href={`https://instagram.com/${item.instagram.replace('@','')}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 4, marginLeft: item.website ? 10 : 0, fontSize: 11, color: '#e1306c', textDecoration: 'none' }}>
              📸 {item.instagram}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BusinessCard({ alumni }) {
  const [expanded, setExpanded] = useState(false);
  const tags = alumni.business_tags ? alumni.business_tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const color = INDUSTRI_COLORS[alumni.bidang_industri] || '#94a3b8';
  const phone = formatPhone(alumni.telepon);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Header — selalu tampil */}
      <div style={{ padding: '18px 18px 14px', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Avatar */}
          {alumni.photo_url ? (
            <img src={alumni.photo_url} alt={alumni.full_name}
              style={{ width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
              {alumni.full_name?.charAt(0) || '?'}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{toTitleCase(alumni.full_name)}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{alumni.jabatan || '—'}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {alumni.angkatan && (
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700 }}>{alumni.angkatan}</span>
              )}
              {alumni.bidang_industri && (
                <span style={{ background: color + '20', color, padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>{alumni.bidang_industri}</span>
              )}
              {alumni.bidang_keahlian && (
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 5, fontSize: 11 }}>{alumni.bidang_keahlian}</span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#94a3b8', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
        </div>

        {/* Perusahaan ringkas */}
        {alumni.perusahaan && (
          <div style={{ marginTop: 10, background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>🏢 {alumni.perusahaan}</div>
            {(alumni.company_city || alumni.domisili_kota) && (
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📍 {alumni.company_city || alumni.domisili_kota}</div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {tags.map(t => (
              <span key={t} style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '14px 18px 18px' }}>

          {/* Kontak */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {alumni.email && (
              <a href={`mailto:${alumni.email}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', borderRadius: 8, padding: '8px 12px', textDecoration: 'none', fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                ✉️ {alumni.email}
              </a>
            )}
            {phone && (
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dcfce7', borderRadius: 8, padding: '8px 12px', textDecoration: 'none', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                📱 WhatsApp
              </a>
            )}
            {alumni.linkedin && (
              <a href={alumni.linkedin} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dbeafe', borderRadius: 8, padding: '8px 12px', textDecoration: 'none', fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>
                🔗 LinkedIn
              </a>
            )}
            {(alumni.domisili_kota || alumni.domisili_negara) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#475569' }}>
                🏠 {[alumni.domisili_kota, alumni.domisili_negara !== 'Indonesia' ? alumni.domisili_negara : null].filter(Boolean).join(', ')}
              </div>
            )}
          </div>

          {/* Alamat perusahaan */}
          {alumni.alamat_perusahaan && (
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#475569', marginBottom: 12 }}>
              📮 {alumni.alamat_perusahaan}
            </div>
          )}

          {/* Bio */}
          {alumni.bio && (
            <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 12, padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
              "{alumni.bio}"
            </div>
          )}

          {/* Kegiatan Usaha dari S32 */}
          {alumni.kegiatan_usaha && <KegiatanUsaha raw={alumni.kegiatan_usaha} />}
        </div>
      )}
    </div>
  );
}