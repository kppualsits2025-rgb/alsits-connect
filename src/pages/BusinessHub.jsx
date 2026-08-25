import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Briefcase, MapPin, Phone, Mail, ExternalLink, Zap, X, Building2, Tag } from 'lucide-react';

// Map angkatan code → URL web angkatan (tambah sesuai kebutuhan)
const ANGKATAN_WEB = {
  S32: 'https://s32its.id',
  S51: 'https://s51its.id',
  // tambahkan angkatan lain di sini jika sudah ada webnya
};
import BusinessDetailView from '@/components/business/BusinessDetailView';
import ContactPersonPanel from '@/components/business/ContactPersonPanel';

// ── KATEGORI BISNIS ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: '🔍' },
  { id: 'energi', label: 'Energi & BBM', icon: '⛽' },
  { id: 'konstruksi', label: 'Konstruksi', icon: '🏗️' },
  { id: 'konsultan', label: 'Konsultan', icon: '📐' },
  { id: 'properti', label: 'Properti', icon: '🏠' },
  { id: 'material', label: 'Material Bangunan', icon: '🧱' },
  { id: 'teknologi', label: 'Teknologi & IT', icon: '💻' },
  { id: 'keuangan', label: 'Keuangan & Perbankan', icon: '💰' },
  { id: 'logistik', label: 'Logistik & Transportasi', icon: '🚛' },
  { id: 'agribisnis', label: 'Agribisnis', icon: '🌾' },
  { id: 'manufaktur', label: 'Manufaktur', icon: '🏭' },
  { id: 'lainnya', label: 'Lainnya', icon: '📦' },
];

// Keyword yang mencerminkan tiap kategori (untuk matching otomatis dari bidang_industri + kegiatan_usaha + business_tags)
const CATEGORY_KEYWORDS = {
  energi: ['bbm', 'bahan bakar', 'hsd', 'solar', 'pertamina', 'minyak', 'gas', 'energi', 'fuel', 'petrokimia', 'lng', 'lpg', 'b40', 'b35'],
  konstruksi: ['konstruksi', 'kontraktor', 'contractor', 'sipil', 'jasa konstruksi', 'proyek', 'gedung', 'jembatan', 'jalan'],
  konsultan: ['konsultan', 'consultant', 'perencana', 'pengawas', 'supervisi', 'manajemen proyek', 'desain'],
  properti: ['properti', 'property', 'real estate', 'developer', 'perumahan', 'apartemen', 'kos'],
  material: ['material', 'bangunan', 'beton', 'besi', 'baja', 'pasir', 'semen', 'cat', 'kayu', 'keramik', 'granit'],
  teknologi: ['teknologi', 'software', 'it ', 'digital', 'aplikasi', 'sistem', 'komputer', 'tech', 'startup'],
  keuangan: ['keuangan', 'bank', 'asuransi', 'investasi', 'finansial', 'fintech', 'kredit', 'leasing'],
  logistik: ['logistik', 'transportasi', 'ekspedisi', 'pengiriman', 'shipping', 'cargo', 'trucking', 'fleet'],
  agribisnis: ['pertanian', 'agri', 'pupuk', 'sawit', 'kebun', 'perkebunan', 'pangan', 'food'],
  manufaktur: ['manufaktur', 'pabrik', 'produksi', 'industri', 'fabrikasi', 'workshop'],
};

function matchCategory(alumni, catId) {
  if (catId === 'all') return true;
  const keywords = CATEGORY_KEYWORDS[catId] || [];
  const haystack = [
    alumni.bidang_industri || '',
    alumni.perusahaan || '',
    alumni.jabatan || '',
    alumni.kegiatan_usaha || '',
    alumni.business_tags || '',
    alumni.bio || '',
  ].join(' ').toLowerCase();
  return keywords.some(kw => haystack.includes(kw));
}

// Parse kegiatan_usaha JSON safely
function parseBusinesses(alumni) {
  if (!alumni.kegiatan_usaha) return [];
  try {
    const parsed = JSON.parse(alumni.kegiatan_usaha);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// Semua tag bisnis alumni (dari business_tags, bisnis, bidang)
function getAlumniTags(alumni) {
  const tags = [];
  if (alumni.business_tags) tags.push(...alumni.business_tags.split(',').map(t => t.trim()).filter(Boolean));
  if (alumni.bidang_industri) tags.push(alumni.bidang_industri);
  return [...new Set(tags)];
}

// ── CARD KOMPONEN ────────────────────────────────────────────────────────────
function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function BusinessCard({ alumni, query, onViewDetail }) {
  const businesses = parseBusinesses(alumni);
  const tags = getAlumniTags(alumni);
  const displayName = toTitleCase(alumni.full_name);

  const initials = (displayName || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // Highlight keyword pencarian
  const highlight = (text) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:#fde68a;color:#0f172a;border-radius:2px;padding:0 2px">$1</mark>');
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01] cursor-pointer"
      onClick={onViewDetail}
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>

      {/* Top strip */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#1d4ed8,#f59e0b)' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {alumni.photo_url ? (
            <img src={alumni.photo_url} alt={alumni.full_name} className="w-14 h-14 rounded-2xl object-cover shrink-0" style={{ border: '2px solid rgba(255,255,255,0.15)' }} />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-heading font-black text-lg text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', border: '2px solid rgba(59,130,246,0.3)' }}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-base leading-tight mb-0.5 truncate"
              dangerouslySetInnerHTML={{ __html: highlight(displayName) }} />
            <p className="text-xs mb-1" style={{ color: '#f59e0b' }}
              dangerouslySetInnerHTML={{ __html: highlight(alumni.jabatan || '') }} />
            <p className="text-xs text-white/50 truncate flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: highlight(alumni.perusahaan || '-') }} />
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontFamily: 'Montserrat,sans-serif' }}>
              {alumni.angkatan}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'Montserrat,sans-serif' }}>
                <Tag className="h-2.5 w-2.5" />
                <span dangerouslySetInnerHTML={{ __html: highlight(t) }} />
              </span>
            ))}
          </div>
        )}

        {/* Lokasi */}
        {(alumni.domisili_kota || alumni.domisili_negara) && (
          <p className="flex items-center gap-1.5 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
            {[alumni.domisili_kota, alumni.domisili_negara !== 'Indonesia' ? alumni.domisili_negara : ''].filter(Boolean).join(', ')}
          </p>
        )}

        {/* Bio */}
        {alumni.bio && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}
            dangerouslySetInnerHTML={{ __html: highlight(alumni.bio) }} />
        )}

        {/* Bisnis dari kegiatan_usaha */}
        {businesses.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-2"
              style={{ color: '#10b981', fontFamily: 'Montserrat,sans-serif' }}>
              <Briefcase className="h-3.5 w-3.5" />
              {businesses.length} Portofolio Bisnis
            </div>
            <div className="space-y-1.5">
              {businesses.slice(0, 2).map((b, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="font-bold text-white truncate"
                    dangerouslySetInnerHTML={{ __html: highlight(b.name || b.company_name || b.nama || '') }} />
                  {(b.description || b.deskripsi) && (
                    <p className="truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}
                      dangerouslySetInnerHTML={{ __html: highlight(b.description || b.deskripsi || '') }} />
                  )}
                </div>
              ))}
              {businesses.length > 2 && (
                <p className="text-xs pl-1" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Montserrat,sans-serif' }}>
                  +{businesses.length - 2} usaha lainnya...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Kontak + Lihat Detail */}
        <div className="flex gap-2 flex-wrap items-center">
          {alumni.telepon && (
            <a href={`https://wa.me/62${alumni.telepon.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.35)' }}>
              <Phone className="h-3 w-3" /> WhatsApp
            </a>
          )}
          {alumni.email && (
            <a href={`mailto:${alumni.email}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
              <Mail className="h-3 w-3" /> Email
            </a>
          )}
          <button
            onClick={e => { e.stopPropagation(); onViewDetail(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer' }}>
            Lihat Detail →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── POPULAR SEARCHES ─────────────────────────────────────────────────────────
const POPULAR = ['HSD B40', 'Solar B35', 'Kontraktor sipil', 'Konsultan struktur', 'Material beton', 'Developer properti', 'Jasa pengiriman', 'Software engineering', 'Konsultan geoteknik', 'Jasa fabrikasi'];

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function BusinessHub() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [domisili, setDomisili] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [myAlumni, setMyAlumni] = useState(null); // record Alumni dari DB yang cocok dengan user login

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        setCurrentUser(user);
        // Cari record alumni berdasarkan email user login
        base44.entities.Alumni.filter({ email: user.email }).then(results => {
          if (results && results.length > 0) setMyAlumni(results[0]);
          else setMyAlumni(null);
        }).catch(() => setMyAlumni(null));
      }
    }).catch(() => {});
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    base44.auth.isAuthenticated().then(v => setIsAuthenticated(v)).catch(() => {});
  }, []);

  const { data: alumni = [], isLoading } = useQuery({
    queryKey: ['alumni-bizHub', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated) {
        // User login → ambil semua data langsung dari entity
        let all = [];
        let page = 0;
        while (true) {
          const batch = await base44.entities.Alumni.list('-updated_date', 500, page * 500);
          if (!batch || batch.length === 0) break;
          all = all.concat(batch);
          if (batch.length < 500) break;
          page++;
        }
        return all.filter(a => a.status !== 'Almarhum' && a.status !== 'Almarhumah');
      }
      // Guest → pakai public function (service role di backend)
      try {
        const res = await base44.functions.invoke('getPublicAlumniData', {});
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  // Bersihkan tanda kutip ekstra dari field perusahaan
  const cleanedAlumni = useMemo(() => alumni.map(a => ({
    ...a,
    perusahaan: a.perusahaan ? a.perusahaan.replace(/^["']+|["']+$/g, '').trim() : a.perusahaan,
  })), [alumni]);

  // Hanya alumni yang punya bisnis / info karir
  const bizAlumni = useMemo(() => cleanedAlumni.filter(a =>
    a.perusahaan || a.jabatan || a.kegiatan_usaha || a.business_tags || a.bidang_industri
  ), [cleanedAlumni]);

  const filtered = useMemo(() => {
    return bizAlumni.filter(a => {
      // Filter kategori
      if (!matchCategory(a, activeCategory)) return false;
      // Filter kota
      if (domisili && !(a.domisili_kota || '').toLowerCase().includes(domisili.toLowerCase())) return false;
      // Search query
      if (query) {
        const q = query.toLowerCase();
        const haystack = [
          a.full_name, a.perusahaan, a.jabatan, a.bidang_industri,
          a.kegiatan_usaha, a.business_tags, a.bio, a.domisili_kota,
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [bizAlumni, query, activeCategory, domisili]);

  const kota = useMemo(() => {
    const set = new Set(bizAlumni.map(a => a.domisili_kota).filter(Boolean));
    return Array.from(set).sort();
  }, [bizAlumni]);

  if (selectedAlumni) {
    return <BusinessDetailView alumni={selectedAlumni} onBack={() => setSelectedAlumni(null)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 40%,#060d1f 100%)' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#060d1f 0%,#0b1f4a 60%,#060d1f 100%)', borderBottom: '3px solid #D4A017' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)' }}>
            <Zap className="h-3.5 w-3.5" style={{ color: '#f59e0b' }} />
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#f59e0b', fontFamily: 'Montserrat,sans-serif' }}>
              Business Connection Hub
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4 leading-tight">
            Temukan Mitra Bisnis<br /><span style={{ color: '#f59e0b' }}>dari Keluarga ALSITS</span>
          </h1>
          <p className="text-white/55 text-base max-w-xl mx-auto mb-8 font-body">
            Cari vendor, supplier, kontraktor, atau konsultan dari jaringan alumni Teknik Sipil ITS. Satu kata kunci, terhubung langsung.
          </p>

          {/* Search Bar Utama */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#f59e0b' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Cari bisnis, produk, atau layanan... (misal: "HSD B40", "kontraktor jalan")'
              className="w-full pl-14 pr-14 py-4 rounded-2xl text-white text-sm outline-none focus:ring-2"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '2px solid rgba(245,158,11,0.4)',
                fontFamily: 'Open Sans,sans-serif',
                fontSize: 14,
                '::placeholder': { color: 'rgba(255,255,255,0.3)' }
              }}
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-xs text-white/30 self-center mr-1" style={{ fontFamily: 'Montserrat,sans-serif' }}>Populer:</span>
            {POPULAR.map(p => (
              <button key={p} onClick={() => setQuery(p)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                style={{
                  background: query === p ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)',
                  border: query === p ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.12)',
                  color: query === p ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'Montserrat,sans-serif',
                  cursor: 'pointer',
                }}>
                {p}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="font-heading font-black text-2xl" style={{ color: '#f59e0b' }}>{bizAlumni.length}</p>
              <p className="text-white/40 text-xs">Alumni Berbisnis</p>
            </div>
            <div className="w-px h-8 bg-white/10 self-center" />
            <div className="text-center">
              <p className="font-heading font-black text-2xl text-white">{kota.length}</p>
              <p className="text-white/40 text-xs">Kota</p>
            </div>
            <div className="w-px h-8 bg-white/10 self-center" />
            <div className="text-center">
              <p className="font-heading font-black text-2xl" style={{ color: '#10b981' }}>{filtered.length}</p>
              <p className="text-white/40 text-xs">Hasil Pencarian</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER ── */}
      <div className="sticky top-[72px] z-30" style={{ background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Kategori scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: activeCategory === cat.id ? '#1d4ed8' : 'rgba(255,255,255,0.06)',
                    border: activeCategory === cat.id ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'Montserrat,sans-serif',
                    cursor: 'pointer',
                    boxShadow: activeCategory === cat.id ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                  }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Filter kota */}
            <div className="relative shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                value={domisili}
                onChange={e => setDomisili(e.target.value)}
                placeholder="Filter kota..."
                className="pl-8 pr-3 py-1.5 rounded-full text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  width: 130,
                  fontFamily: 'Open Sans,sans-serif',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Result counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'Montserrat,sans-serif' }}>
              {isLoading ? 'Memuat...' : `${filtered.length} alumni ditemukan`}
              {query && <span style={{ color: '#f59e0b' }}> untuk "{query}"</span>}
            </p>
            {(activeCategory !== 'all' || domisili) && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {activeCategory !== 'all' && `Kategori: ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
                {domisili && ` · Kota: ${domisili}`}
              </p>
            )}
          </div>
          {(query || activeCategory !== 'all' || domisili) && (
            <button onClick={() => { setQuery(''); setActiveCategory('all'); setDomisili(''); }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer' }}>
              <X className="h-3 w-3" /> Reset Filter
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-5 animate-pulse h-52"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-heading font-bold text-xl text-white mb-2">Tidak ada hasil ditemukan</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Coba kata kunci lain atau tambahkan keyword bisnis ke profil Anda
            </p>
            <button onClick={() => { setQuery(''); setActiveCategory('all'); setDomisili(''); }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
              Tampilkan Semua
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => (
              <BusinessCard key={a.id} alumni={a} query={query} onViewDetail={() => setSelectedAlumni(a)} />
            ))}
          </div>
        )}
      </div>

      {/* ── CTA: Daftarkan / Perbarui Bisnis ── */}
      <CtaPanel myAlumni={myAlumni} currentUser={currentUser} />
    </div>
  );
}



function CtaPanel({ myAlumni, currentUser }) {
  const [showContact, setShowContact] = useState(false);

  // Tentukan angkatan & URL web angkatan
  const angkatan = myAlumni?.angkatan || null;
  const webUrl = angkatan ? ANGKATAN_WEB[angkatan] : null;

  // Sudah terdaftar di DB alumni DAN angkatannya punya web → tombol "Perbarui Profil"
  const canUpdate = myAlumni && webUrl;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0b1f4a,#1e3a8a)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg,#D4A017,#f59e0b,#D4A017)' }} />
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="font-heading font-black text-xl text-white mb-2">Punya Bisnis? Daftarkan Sekarang!</h3>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 460, margin: '0 auto 20px' }}>
            Lengkapi profil Anda dengan informasi bisnis, keyword produk/layanan, dan kontak agar mudah ditemukan oleh sesama alumni ALSITS.
          </p>

          {/* Tombol dinamis sesuai kondisi user */}
          {canUpdate ? (
            // Sudah klaim profil di web angkatan → langsung ke web angkatan
            <a href={webUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#D4A017,#f59e0b)', color: '#0f172a', textDecoration: 'none' }}>
              Perbarui Profil di {webUrl.replace('https://', '')} →
            </a>
          ) : (
            // Belum klaim / belum ada di DB / angkatan belum punya web → tampilkan kontak petugas
            <button
              onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.45)', color: '#f59e0b', cursor: 'pointer' }}>
              📢 Silahkan Daftar pada website masing-masing angkatan
            </button>
          )}

          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Data bisnis & profil personal dikelola di web angkatan masing-masing, kemudian disinkronisasi ke ALSITS secara otomatis.
          </p>
        </div>
      </div>

      {showContact && <ContactPersonPanel onClose={() => setShowContact(false)} currentUser={currentUser} />}
    </>
  );
}