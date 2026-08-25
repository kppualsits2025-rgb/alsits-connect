// ⚠️ GANTI dengan URL function getPublicAlumniData dari app ALSITS utama
// Ambil dari: Dashboard ALSITS → Code → Functions → getPublicAlumniData → copy URL
const ALSITS_API_URL = 'https://app.base44.com/api/apps/69fb35c6f6284d7276918adb/functions/getPublicAlumniData';

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

export async function fetchAlumni() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  const res = await fetch(ALSITS_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
  if (!res.ok) throw new Error('Gagal mengambil data alumni');
  const json = await res.json();
  _cache = json.data || [];
  _cacheTime = now;
  return _cache;
}