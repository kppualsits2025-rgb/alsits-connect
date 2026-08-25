import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Home, Briefcase } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AlumniDetailModal from '@/components/alumni/AlumniDetailModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Daftar nama kota/kabupaten Indonesia yang dikenali — untuk matching
// Kalau ketemu di dalam string alamat, langsung return itu
const KOTA_LIST = [
  'Jakarta','DKI Jakarta','Jakarta Selatan','Jakarta Pusat','Jakarta Barat','Jakarta Timur','Jakarta Utara',
  'Surabaya','Bandung','Medan','Bekasi','Depok','Tangerang','Semarang','Makassar','Palembang',
  'Batam','Pekanbaru','Banjarmasin','Padang','Malang','Yogyakarta','Bogor','Denpasar','Balikpapan',
  'Samarinda','Manado','Kupang','Ambon','Jayapura','Pontianak','Kendari','Mataram','Palu',
  'Banda Aceh','Lhokseumawe','Langsa','Binjai','Pematangsiantar','Tebing Tinggi','Sibolga',
  'Bukittinggi','Padang Panjang','Solok','Payakumbuh','Dumai','Tanjungpinang','Jambi',
  'Bengkulu','Pangkalpinang','Lubuklinggau','Pagar Alam','Pagaralam','Prabumulih',
  'Bandar Lampung','Metro','Serang','Cilegon','Tangerang Selatan','Tangerang Kota',
  'Cimahi','Tasikmalaya','Cirebon','Sukabumi','Bogor Kota','Banjar','Purwokerto',
  'Magelang','Salatiga','Pekalongan','Tegal','Surakarta','Solo','Klaten','Kudus',
  'Blitar','Kediri','Madiun','Mojokerto','Pasuruan','Probolinggo','Batu','Jember',
  'Banyuwangi','Situbondo','Bondowoso','Lumajang','Jombang','Nganjuk','Tulungagung',
  'Trenggalek','Pacitan','Ponorogo','Magetan','Ngawi','Bojonegoro','Tuban','Lamongan',
  'Gresik','Sidoarjo','Bangkalan','Sampang','Pamekasan','Sumenep',
  'Singaraja','Gianyar','Tabanan','Negara','Sumbawa','Bima','Dompu',
  'Maumere','Ende','Waingapu','Waikabubak','Ruteng','Labuan Bajo',
  'Atambua','Kefamenanu','Soe','Oelamasi',
  'Palu','Poso','Luwuk','Kolaka','Bau-Bau','Raha',
  'Gorontalo','Kotamobagu','Bitung','Tomohon',
  'Ternate','Tidore','Sofifi','Tobelo',
  'Sorong','Manokwari','Fakfak','Biak','Nabire','Timika','Wamena','Merauke',
  'Palangkaraya','Banjarbaru','Kotabaru','Tanjung','Barabai',
  'Tarakan','Nunukan','Tanjung Selor','Berau','Bontang','Sangatta',
  'Sintang','Sanggau','Singkawang','Ketapang','Putussibau',
  'Pangkalan Bun','Sampit','Muara Teweh','Kuala Kapuas',
  'Muaro Jambi','Bungo','Merangin','Sarolangun','Tanjab','Kerinci',
  'Musi Banyuasin','Muara Enim','Lahat','OKU','OKI','Ogan Ilir',
  'Pringsewu','Bandar Lampung','Tulang Bawang','Way Kanan','Pesawaran',
  'Cianjur','Garut','Sumedang','Subang','Karawang','Purwakarta',
  'Indramayu','Kuningan','Majalengka','Ciamis',
  'Banyumas','Cilacap','Kebumen','Purbalingga','Banjarnegara',
  'Wonosobo','Temanggung','Kendal','Batang','Rembang','Pati','Demak','Jepara','Blora',
  'Sragen','Karanganyar','Wonogiri','Boyolali','Klaten',
  'Tuban','Lamongan','Gresik','Mojokerto','Jombang',
  'Lombok Tengah','Lombok Barat','Lombok Timur','Lombok Utara','Sumbawa Besar',
  'Mamuju','Majene','Polewali','Pare-Pare','Pinrang','Wajo','Bone','Bulukumba','Selayar',
  'Lhokseumawe','Aceh Besar','Bireuen','Pidie','Sabang',
  'Deli Serdang','Serdang Bedagai','Asahan','Labuhanbatu','Toba Samosir','Tapanuli',
  'Nias','Nias Selatan',
  'Muara Bungo','Tebo','Batang Hari','Tanjung Jabung',
  'Karimun','Bintan','Natuna','Anambas','Lingga',
  'Bangka','Belitung','Bangka Tengah','Bangka Barat','Bangka Selatan',
  'Aceh',
];

// Mapping substring alamat → nama kota bersih
const ALIAS_KOTA = {
  'jakarta': 'DKI Jakarta',
  'jakarta selatan': 'DKI Jakarta',
  'jakarta pusat': 'DKI Jakarta',
  'jakarta barat': 'DKI Jakarta',
  'jakarta timur': 'DKI Jakarta',
  'jakarta utara': 'DKI Jakarta',
  'kebayoran': 'DKI Jakarta',
  'lapangan banteng': 'DKI Jakarta',
  'sudirman': 'DKI Jakarta',
  'gatot subroto': 'DKI Jakarta',
  'tb simatupang': 'DKI Jakarta',
  'soekarno hatta intl': 'Tangerang',
  'bandara soekarno': 'Tangerang',
  'soetta': 'Tangerang',
  'sukolilo': 'Surabaya',
  'kertajaya': 'Surabaya',
  'gubeng': 'Surabaya',
  'rungkut': 'Surabaya',
  'darmo': 'Surabaya',
  'wonokromo': 'Surabaya',
  'puri indah': 'Surabaya',
  'politeknik kampus baru ui': 'Depok',
  'porsea': 'Toba Samosir',
  'tobasa': 'Toba Samosir',
  'north sumatra': 'Sumatera Utara',
  'west java': 'Jawa Barat',
  'east java': 'Jawa Timur',
  'central java': 'Jawa Tengah',
  'ghana': 'Ghana',
  'accra': 'Ghana',
  'bsd': 'Tangerang Selatan',
  'serpong': 'Tangerang Selatan',
  'gop': 'Tangerang Selatan',
  'adhi 15': 'Jakarta',
  'kebon cau': 'Cimahi',
  'aloon-aloon utara': 'Ponorogo',
  'slamet riyadi': 'Surakarta',
  'slamet riyadi 62': 'Surakarta',
};

// Parse nama kota bersih dari string alamat
function parseCityFromAddress(address) {
  if (!address) return null;
  const lower = address.toLowerCase();

  // 1. Cek alias/pattern khusus dulu
  for (const [pattern, kota] of Object.entries(ALIAS_KOTA)) {
    if (lower.includes(pattern)) return kota;
  }

  // 2. Cek daftar nama kota (case-insensitive)
  for (const kota of KOTA_LIST) {
    if (lower.includes(kota.toLowerCase())) return kota;
  }

  // 3. Fallback: ambil token terakhir dari split koma/titik koma yang bukan angka/noise
  const NOISE = /^(\d+|jl|jalan|no|blok|lt|lantai|rt|rw|kel|kec|desa|kav|ext|indonesia|suite|floor|tower|gedung|graha|plaza|komplek)\.?$/i;
  const parts = address.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const words = parts[i].split(/\s+/).filter(w => !NOISE.test(w));
    const clean = words.join(' ').replace(/\d{4,}/g, '').trim();
    if (clean.length >= 3 && clean.length <= 40 && !/^\d/.test(clean)) {
      return clean;
    }
  }
  return null;
}

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Ekstrak kota domisili alumni — normalize title case agar konsisten antar sumber
function getAlumniDomisiliCity(alumni) {
  if (alumni.domisili_kota) return toTitleCase(alumni.domisili_kota);
  return null;
}

// Ekstrak kota usaha/perusahaan alumni — hanya pakai field kota bersih, bukan parse alamat panjang
function getAlumniUsahaCity(alumni) {
  // 1. company_city (field kota bersih dari S32 sync)
  if (alumni.company_city) return toTitleCase(alumni.company_city);

  // 2. alamat_perusahaan dari S51 — diisi dengan ap_kota (sudah berupa kota bersih, pendek)
  //    Hanya pakai jika pendek (<=40 char), artinya memang berupa nama kota bukan alamat lengkap
  if (alumni.alamat_perusahaan && alumni.alamat_perusahaan.length <= 40) {
    return toTitleCase(alumni.alamat_perusahaan);
  }

  return null;
}

// Untuk peta: gabungkan keduanya (domisili prioritas utama)
function getAlumniCity(alumni) {
  return getAlumniDomisiliCity(alumni) || getAlumniUsahaCity(alumni);
}


// Koordinat kota-kota utama untuk marker peta (fallback jika alumni tak punya lat/lng)
const KOTA_COORDS = {
  'DKI Jakarta': [-6.2088, 106.8456],
  'Surabaya': [-7.2575, 112.7521],
  'Bandung': [-6.9175, 107.6191],
  'Medan': [3.5952, 98.6722],
  'Semarang': [-6.9667, 110.4167],
  'Makassar': [-5.1477, 119.4327],
  'Bekasi': [-6.2383, 106.9756],
  'Depok': [-6.4025, 106.7942],
  'Tangerang': [-6.1783, 106.63],
  'Tangerang Selatan': [-6.2894, 106.7766],
  'Bogor': [-6.5971, 106.806],
  'Yogyakarta': [-7.7956, 110.3695],
  'Malang': [-7.9666, 112.6326],
  'Palembang': [-2.9761, 104.7754],
  'Balikpapan': [-1.2654, 116.8313],
  'Samarinda': [-0.5022, 117.1536],
  'Pekanbaru': [0.5071, 101.4478],
  'Batam': [1.0456, 104.0305],
  'Padang': [-0.9492, 100.3543],
  'Denpasar': [-8.6705, 115.2126],
  'Pontianak': [-0.0263, 109.3425],
  'Banjarmasin': [-3.3194, 114.5908],
  'Manado': [1.4748, 124.8421],
  'Palu': [-0.8917, 119.8707],
  'Kupang': [-10.1772, 123.6071],
  'Ambon': [-3.6954, 128.1814],
  'Jayapura': [-2.5337, 140.7181],
  'Cimahi': [-6.8721, 107.5424],
  'Sidoarjo': [-7.4457, 112.7181],
  'Ponorogo': [-7.8739, 111.4635],
  'Surakarta': [-7.5755, 110.8243],
  'Jember': [-8.1669, 113.7006],
  'Toba Samosir': [2.6, 99.0],
  'Sumatera Utara': [2.1154, 99.5451],
  'Ghana': [7.9465, -1.0232],
  'Accra': [5.6037, -0.1870],
  'Dubai': [25.2048, 55.2708],
  'Pasuruan': [-7.6458, 112.9075],
  'Probolinggo': [-7.7543, 113.2159],
  'Mojokerto': [-7.4714, 112.4344],
  'Jombang': [-7.5500, 112.2300],
  'Klaten': [-7.7068, 110.6010],
  'Madiun': [-7.6298, 111.5239],
  'Tasikmalaya': [-7.3274, 108.2207],
  'Gresik': [-7.1563, 112.6527],
  'Banyuwangi': [-8.2192, 114.3691],
  'Jepara': [-6.5897, 110.6718],
  'Solo': [-7.5755, 110.8243],
  'Karawang': [-6.3219, 107.3381],
  'Purwokerto': [-7.4214, 109.2347],
  'Mataram': [-8.5833, 116.1167],
  'Kendari': [-3.9985, 122.5127],
  'Pekalongan': [-6.8886, 109.6753],
  'Kudus': [-6.8042, 110.8384],
  'Blitar': [-8.0953, 112.1608],
  'Kediri': [-7.8170, 112.0114],
  'Magelang': [-7.4797, 110.2177],
  'Salatiga': [-7.3305, 110.4981],
  'Tegal': [-6.8694, 109.1402],
  'Cilacap': [-7.7174, 109.0153],
  'Kebumen': [-7.6654, 109.6523],
  'Wonosobo': [-7.3610, 109.9039],
  'Temanggung': [-7.3168, 110.1721],
  'Purbalingga': [-7.3892, 109.3614],
  'Banjarnegara': [-7.3870, 109.6952],
  'Banyumas': [-7.5277, 109.2947],
  'Brebes': [-6.8706, 108.9225],
  'Demak': [-6.8943, 110.6386],
  'Pati': [-6.7502, 111.0390],
  'Rembang': [-6.7068, 111.3436],
  'Blora': [-6.9681, 111.4142],
  'Sragen': [-7.4255, 110.9900],
  'Karanganyar': [-7.6063, 110.9979],
  'Wonogiri': [-7.8176, 110.9238],
  'Boyolali': [-7.5316, 110.5987],
  'Sukoharjo': [-7.6817, 110.8360],
  'Ngawi': [-7.4052, 111.4477],
  'Bojonegoro': [-7.1530, 111.8817],
  'Tuban': [-6.8972, 112.0492],
  'Lamongan': [-7.1174, 112.4136],
  'Bangkalan': [-7.0457, 112.7311],
  'Sampang': [-7.1856, 113.2457],
  'Pamekasan': [-7.1572, 113.4694],
  'Sumenep': [-6.9971, 113.8678],
  'Lumajang': [-8.1319, 113.2228],
  'Bondowoso': [-7.9178, 113.8218],
  'Situbondo': [-7.7060, 114.0096],
  'Tulungagung': [-8.0656, 111.9021],
  'Trenggalek': [-8.0529, 111.7078],
  'Pacitan': [-8.1987, 111.1014],
  'Ponorogo': [-7.8739, 111.4635],
  'Magetan': [-7.6500, 111.3396],
  'Nganjuk': [-7.6042, 111.9047],
  'Jombang': [-7.5500, 112.2300],
  'Badung': [-8.6380, 115.1793],
  'Gianyar': [-8.5436, 115.3313],
  'Tabanan': [-8.5432, 115.1244],
  'Buleleng': [-8.1196, 115.0893],
  'Singaraja': [-8.1196, 115.0893],
};

function getCityCoords(city, alumniList) {
  // Cari alumni di kota ini yang punya koordinat
  const withCoords = alumniList.filter(a => a.latitude && a.longitude);
  if (withCoords.length > 0) {
    const lat = withCoords.reduce((s, a) => s + a.latitude, 0) / withCoords.length;
    const lng = withCoords.reduce((s, a) => s + a.longitude, 0) / withCoords.length;
    return [lat, lng];
  }
  // Coba langsung
  if (KOTA_COORDS[city]) return KOTA_COORDS[city];
  // Strip prefix "Kota " / "Kabupaten " / "Kota Administrasi " lalu coba lagi
  const stripped = city
    .replace(/^Kota Administrasi /i, '')
    .replace(/^Kabupaten /i, '')
    .replace(/^Kota /i, '')
    .trim();
  return KOTA_COORDS[stripped] || null;
}

// Custom icon untuk cluster kota
function createCityIcon(count) {
  const size = count >= 10 ? 44 : count >= 5 ? 38 : 32;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:linear-gradient(135deg,#3b82f6,#1d4ed8);
      border:2px solid #fff;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:700;font-size:${count >= 10 ? 13 : 12}px;
      box-shadow:0 2px 8px rgba(59,130,246,0.6);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function AlumniMap() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [cityModalData, setCityModalData] = useState(null); // { city, list, mode }
  const [activeTab, setActiveTab] = useState('domisili'); // 'domisili' | 'usaha'

  const { data: alumni } = useQuery({
    queryKey: ['alumni-map'],
    queryFn: () => base44.entities.Alumni.list('-created_date', 2000),
    initialData: [],
  });

  // Sebaran kota DOMISILI
  const domisiliStats = useMemo(() => {
    const cities = {};
    alumni.forEach(a => {
      const city = getAlumniDomisiliCity(a);
      if (city) {
        if (!cities[city]) cities[city] = [];
        cities[city].push(a);
      }
    });
    return Object.entries(cities)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 30);
  }, [alumni]);

  // Sebaran kota USAHA/PERUSAHAAN
  const usahaStats = useMemo(() => {
    const cities = {};
    alumni.forEach(a => {
      if (!a.perusahaan && !a.kegiatan_usaha && !a.alamat_perusahaan) return;
      const city = getAlumniUsahaCity(a);
      if (city) {
        if (!cities[city]) cities[city] = [];
        cities[city].push(a);
      }
    });
    return Object.entries(cities)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 30);
  }, [alumni]);

  // Untuk peta tetap pakai gabungan
  const cityStats = useMemo(() => {
    const cities = {};
    alumni.forEach(a => {
      const city = getAlumniCity(a);
      if (city) {
        if (!cities[city]) cities[city] = [];
        cities[city].push(a);
      }
    });
    return Object.entries(cities)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 30);
  }, [alumni]);

  // Markers peta: per kota (grouped), pakai koordinat avg atau fallback
  const cityMarkers = useMemo(() => {
    return cityStats
      .map(([city, list]) => {
        const coords = getCityCoords(city, list);
        if (!coords) return null;
        return { city, list, coords };
      })
      .filter(Boolean);
  }, [cityStats]);

  const handleCityClick = (city, list) => {
    if (list.length === 1) {
      setSelectedAlumni(list[0]);
    } else {
      setCityModalData({ city, list });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Peta</Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">Peta Persebaran Alumni</h1>
          <p className="text-muted-foreground">Visualisasi alumni Teknik Sipil ITS di seluruh dunia.</p>
        </div>

        {/* Map */}
        <div className="bg-card rounded-2xl border border-white/10 overflow-hidden shadow-sm mb-8">
          <div className="h-[500px] md:h-[600px]">
            <MapContainer
              center={[-7.28, 112.75]}
              zoom={5}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {cityMarkers.map(({ city, list, coords }) => (
                <Marker
                  key={city}
                  position={coords}
                  icon={createCityIcon(list.length)}
                  eventHandlers={{ click: () => handleCityClick(city, list) }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                    <div className="text-sm">
                      <p className="font-semibold">{city}</p>
                      <p className="text-gray-500">{list.length} alumni · klik untuk lihat profil</p>
                    </div>
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Sebaran Kota — 2 Tab */}
        <div className="bg-card rounded-2xl border border-white/10 p-6 shadow-sm">
          {/* Tab Header */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <button
              onClick={() => setActiveTab('domisili')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'domisili'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              Sebaran Domisili
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === 'domisili' ? 'bg-white/20' : 'bg-white/10'}`}>
                {domisiliStats.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('usaha')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'usaha'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Sebaran Usaha / Perusahaan
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === 'usaha' ? 'bg-black/15' : 'bg-white/10'}`}>
                {usahaStats.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'domisili' && (
            <>
              <p className="text-xs text-muted-foreground mb-4">Kota tempat tinggal/domisili alumni · Klik untuk melihat profil</p>
              {domisiliStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data domisili.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {domisiliStats.map(([city, list]) => (
                    <button
                      key={city}
                      onClick={() => handleCityClick(city, list)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left group overflow-hidden"
                    >
                      <Home className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug break-words">{city}</p>
                        <p className="text-xs text-muted-foreground">{list.length} alumni</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'usaha' && (
            <>
              <p className="text-xs text-muted-foreground mb-4">Kota tempat usaha/perusahaan alumni beroperasi · Klik untuk melihat profil</p>
              {usahaStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data usaha/perusahaan.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {usahaStats.map(([city, list]) => (
                    <button
                      key={city}
                      onClick={() => handleCityClick(city, list)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/60 hover:bg-accent/5 transition-colors text-left group overflow-hidden"
                    >
                      <Briefcase className="h-4 w-4 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug break-words">{city}</p>
                        <p className="text-xs text-muted-foreground">{list.length} alumni</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>


      </div>{/* end max-w-7xl */}

      {/* Modals */}
      <AlumniDetailModal
        alumni={selectedAlumni}
        open={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
      />

      {/* Modal list alumni per kota */}
      <Dialog open={!!cityModalData} onOpenChange={() => setCityModalData(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" style={{ zIndex: 99999 }}>
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Alumni di {cityModalData?.city}
              <Badge className="bg-primary/10 text-primary border-0 text-xs">{cityModalData?.list?.length}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {cityModalData?.list?.map(a => (
              <button
              key={a.id}
              onClick={() => { setCityModalData(null); setSelectedAlumni(a); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
              >
              {a.photo_url ? (
                <img src={a.photo_url} alt={toTitleCase(a.full_name)} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary text-sm">{a.full_name?.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{toTitleCase(a.full_name)}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.angkatan}{a.perusahaan ? ` — ${a.perusahaan}` : ''}</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}