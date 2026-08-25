import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const toTitleCase = s => s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : '';

// City coordinates (Indonesia focus)
const CITY_COORDS = {
  'Jakarta': [-6.2088, 106.8456], 'Surabaya': [-7.2575, 112.7521], 'Bandung': [-6.9175, 107.6191],
  'Medan': [3.5952, 98.6722], 'Semarang': [-6.9932, 110.4203], 'Makassar': [-5.1477, 119.4327],
  'Palembang': [-2.9761, 104.7754], 'Tangerang': [-6.1781, 106.6297], 'Bekasi': [-6.2349, 107.0003],
  'Depok': [-6.4025, 106.7942], 'Bogor': [-6.5971, 106.8060], 'Yogyakarta': [-7.7956, 110.3695],
  'Malang': [-7.9666, 112.6326], 'Denpasar': [-8.6705, 115.2126], 'Balikpapan': [-1.2675, 116.8285],
  'Samarinda': [-0.5022, 117.1536], 'Banjarmasin': [-3.3194, 114.5908], 'Pontianak': [-0.0263, 109.3425],
  'Manado': [1.4748, 124.8421], 'Pekanbaru': [0.5333, 101.4500], 'Batam': [1.0456, 104.0305],
  'Padang': [-0.9471, 100.4172], 'Jambi': [-1.6101, 103.6131], 'Lampung': [-5.4502, 105.2674],
  'Kupang': [-10.1772, 123.6070], 'Ambon': [-3.6954, 128.1814], 'Jayapura': [-2.5337, 140.7181],
  'Aceh': [5.5483, 95.3238], 'Bengkulu': [-3.7928, 102.2608], 'Solo': [-7.5755, 110.8243],
  'Kediri': [-7.8166, 112.0114], 'Jember': [-8.1845, 113.6681], 'Probolinggo': [-7.7543, 113.2159],
  'Tasikmalaya': [-7.3274, 108.2207], 'Cirebon': [-6.7320, 108.5523], 'Sukabumi': [-6.9210, 106.9300],
  'Cilegon': [-6.0022, 106.0004], 'Serang': [-6.1201, 106.1503], 'Tangerang Selatan': [-6.2942, 106.7141],
  'Bontang': [0.1322, 117.4768], 'Tarakan': [3.3249, 117.5784], 'Sorong': [-0.8762, 131.2553],
  'Singapore': [1.3521, 103.8198], 'Kuala Lumpur': [3.1390, 101.6869], 'Australia': [-25.2744, 133.7751],
  'Amerika Serikat': [37.0902, -95.7129], 'Belanda': [52.1326, 5.2913],
};

function normalizeCity(raw) {
  if (!raw) return null;
  let city = raw.trim().replace(/^(Kota|Kabupaten)\s+/i, '').trim();
  city = city.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  return city;
}

function getCoords(city) {
  if (!city) return null;
  const norm = normalizeCity(city);
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (norm?.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(norm?.toLowerCase() || '')) {
      return { city: key, coords };
    }
  }
  return null;
}

export default function PublicAlumniMap({ alumni }) {
  const [mapType, setMapType] = useState('domisili');
  const [selectedCity, setSelectedCity] = useState(null);

  const cityGroups = useMemo(() => {
    const groups = {};
    alumni.forEach(a => {
      const rawCity = mapType === 'domisili' ? (a.domisili_kota) : (a.company_city || a.domisili_kota);
      const result = getCoords(rawCity);
      if (!result) return;
      const key = result.city;
      if (!groups[key]) groups[key] = { city: key, coords: result.coords, members: [] };
      groups[key].members.push(a);
    });
    return Object.values(groups).sort((a, b) => b.members.length - a.members.length);
  }, [alumni, mapType]);

  const maxCount = useMemo(() => Math.max(...cityGroups.map(g => g.members.length), 1), [cityGroups]);

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ id: 'domisili', label: '🏠 Domisili' }, { id: 'bisnis', label: '🏢 Usaha/Kantor' }].map(t => (
          <button key={t.id} onClick={() => { setMapType(t.id); setSelectedCity(null); }}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: mapType === t.id ? '#0b2d6b' : '#e2e8f0',
              color: mapType === t.id ? '#fff' : '#475569',
            }}>
            {t.label}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#94a3b8', alignSelf: 'center', marginLeft: 8 }}>
          {cityGroups.length} kota terpetakan dari {alumni.length} alumni
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCity ? '1fr 360px' : '1fr', gap: 16 }}>
        {/* Map */}
        <div style={{ height: 520, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap'
            />
            {cityGroups.map(group => {
              const radius = 8 + (group.members.length / maxCount) * 22;
              return (
                <CircleMarker
                  key={group.city}
                  center={group.coords}
                  radius={radius}
                  pathOptions={{
                    fillColor: selectedCity?.city === group.city ? '#D4A017' : '#0b2d6b',
                    fillOpacity: 0.8,
                    color: '#fff',
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setSelectedCity(selectedCity?.city === group.city ? null : group) }}
                >
                  <Tooltip permanent={group.members.length >= 5} direction="top">
                    <strong>{group.city}</strong>: {group.members.length} alumni
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Side panel */}
        {selectedCity && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0b2d6b', color: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>📍 {selectedCity.city}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{selectedCity.members.length} alumni</div>
              </div>
              <button onClick={() => setSelectedCity(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <div style={{ overflow: 'auto', flex: 1, maxHeight: 460 }}>
              {selectedCity.members.map(a => (
                <div key={a.id} style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'center' }}>
                  {a.photo_url
                    ? <img src={a.photo_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0b2d6b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{a.full_name?.charAt(0)}</div>
                  }
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{toTitleCase(a.full_name)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {a.angkatan && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0 5px', borderRadius: 3, fontWeight: 600, marginRight: 4 }}>{a.angkatan}</span>}
                      {a.perusahaan || a.jabatan || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top cities */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 10 }}>Top Kota ({mapType === 'domisili' ? 'Domisili' : 'Usaha'})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cityGroups.slice(0, 15).map(g => (
            <button key={g.city} onClick={() => setSelectedCity(selectedCity?.city === g.city ? null : g)}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                border: '1px solid', transition: 'all 0.15s',
                background: selectedCity?.city === g.city ? '#0b2d6b' : '#fff',
                color: selectedCity?.city === g.city ? '#fff' : '#475569',
                borderColor: selectedCity?.city === g.city ? '#0b2d6b' : '#e2e8f0',
              }}>
              {g.city} <span style={{ opacity: 0.7 }}>({g.members.length})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}