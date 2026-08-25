import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Users, Globe, GraduationCap, Building2, TrendingUp, MapPin, Search, X,
  ExternalLink, ShieldCheck, Menu, ChevronDown, LogIn
} from 'lucide-react';
import AlumniClaimModal from '@/components/alumni/AlumniClaimModal';
import PublicAlumniDetailModal from '@/components/alumni/PublicAlumniDetailModal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import FuturisticStatsDashboard from '@/components/stats/FuturisticStatsDashboard';
import PublicHome from '@/components/public/PublicHome';

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const publicNavLinks = [
  {
    label: 'Beranda',
    path: '/public-view',
    tab: 'beranda',
  },
  {
    label: 'Tentang ALSITS',
    children: [
      { label: '📜 Sejarah', path: '/tentang/sejarah' },
      { label: '🎙️ Sambutan Ketua Umum', path: '/tentang/sambutan' },
      { label: '🏛️ Struktur Organisasi', path: '/tentang/struktur' },
      { label: '🎯 Visi & Misi', path: '/tentang/visi-misi' },
    ]
  },
  {
    label: 'Database Alumni',
    path: '/public-view',
    tab: 'database',
  },
  {
    label: 'Statistik',
    path: '/public-view',
    tab: 'dashboard',
  },
  {
    label: 'Business Hub',
    path: '/business-hub',
  },
];

const ANGKATAN_OPTIONS = Array.from({ length: 60 }, (_, i) => `S${i + 1}`);
const PALETTE_INDUSTRI = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#818cf8','#4f46e5','#7c3aed','#9333ea','#a855f7','#c026d3','#db2777','#e11d48'];
const PALETTE_BIDANG   = ['#0ea5e9','#38bdf8','#7dd3fc','#06b6d4','#22d3ee','#67e8f9','#2dd4bf','#34d399','#6ee7b7','#a7f3d0'];
const PALETTE_GELAR    = ['#f59e0b','#fbbf24','#fcd34d','#fde68a'];
const PALETTE_COMPANY  = ['#10b981','#34d399','#6ee7b7','#059669','#047857','#065f46','#0d9488','#0f766e','#0e7490','#155e75'];
const BIDANG_OPTIONS = ['Struktur','Geoteknik','Manajemen Konstruksi','Transportasi','Hidroteknik','Lingkungan','Lainnya'];
const INDUSTRI_OPTIONS = ['Konstruksi','Konsultan','BUMN','Pemerintahan','Akademisi','Wiraswasta','Perbankan','Energi','Teknologi','Lainnya'];

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PublicView() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [filterAngkatan, setFilterAngkatan] = useState('all');
  const [filters, setFilters] = useState({ search: '', angkatan: '', bidang_keahlian: '', bidang_industri: '', domisili_kota: '' });
  const [showClaim, setShowClaim] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [privateAlumniData, setPrivateAlumniData] = useState({});
  const { isAuthenticated, user } = useAuth();

  // Cek apakah user yang login sudah punya profil alumni yang terverifikasi
  const { data: claimedAlumni } = useQuery({
    queryKey: ['my-alumni-claim', user?.email, user?.id],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        // Cari berdasarkan email alumni yang terdaftar
        const byEmail = await base44.entities.Alumni.filter({ email: user.email });
        const found = byEmail.find(a => a.is_verified);
        if (found) return found;
        // Fallback: cari by email2
        const byEmail2 = await base44.entities.Alumni.filter({ email2: user.email });
        const found2 = byEmail2.find(a => a.is_verified);
        if (found2) return found2;
      } catch (e) {}
      return null;
    },
    enabled: !!user?.email && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: alumniRaw, isLoading } = useQuery({
    queryKey: ['public-alumni', isAuthenticated],
    queryFn: async () => {
      // Selalu gunakan backend function getPublicAlumniData (pakai asServiceRole, tidak butuh auth)
      // Jika user sudah login, ambil data lebih lengkap langsung dari entity
      if (isAuthenticated) {
        let all = [];
        let page = 0;
        while (true) {
          const batch = await base44.entities.Alumni.list('-angkatan', 500, page * 500);
          if (!batch || batch.length === 0) break;
          all = all.concat(batch);
          if (batch.length < 500) break;
          page++;
        }
        return all.filter(a => a.status !== 'Almarhum' && a.status !== 'Almarhumah');
      }
      // Guest → pakai public function via invoke (service role di backend, tidak perlu HP/email)
      try {
        const res = await base44.functions.invoke('getPublicAlumniData', {});
        return res.data?.data || [];
      } catch (e) {
        // Fallback: jika invoke gagal karena auth, tetap return array kosong
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true,
  });
  const alumni = alumniRaw || [];

  const dashFiltered = useMemo(() => {
    if (filterAngkatan === 'all') return alumni;
    return alumni.filter(a => a.angkatan === filterAngkatan);
  }, [alumni, filterAngkatan]);

  const totalAlumni = dashFiltered.length;
  const luarNegeri = dashFiltered.filter(a => a.domisili_negara && a.domisili_negara !== 'Indonesia').length;
  const luarNegeriPct = totalAlumni > 0 ? ((luarNegeri / totalAlumni) * 100).toFixed(1) : 0;

  const bidangData = useMemo(() => {
    const map = {};
    dashFiltered.forEach(a => { if (a.bidang_keahlian) map[a.bidang_keahlian] = (map[a.bidang_keahlian] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [dashFiltered]);

  const industriData = useMemo(() => {
    const map = {};
    dashFiltered.forEach(a => { if (a.bidang_industri) map[a.bidang_industri] = (map[a.bidang_industri] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [dashFiltered]);

  const angkatanData = useMemo(() => {
    const map = {};
    alumni.forEach(a => { if (a.angkatan) map[a.angkatan] = (map[a.angkatan] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) =>
      parseInt(a.name.replace('S', '')) - parseInt(b.name.replace('S', ''))
    );
  }, [alumni]);

  const gelarData = useMemo(() => {
    const map = {};
    dashFiltered.forEach(a => { const g = a.gelar || 'S1'; map[g] = (map[g] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [dashFiltered]);

  const companyData = useMemo(() => {
    const map = {};
    dashFiltered.forEach(a => { if (a.perusahaan) map[a.perusahaan] = (map[a.perusahaan] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [dashFiltered]);

  const topIndustri = industriData.length > 0 ? industriData[0].name : '-';

  // Fetch data kontak private (telepon, email) saat user terverifikasi dan klik alumni
  const fetchPrivateContact = async (alumniId) => {
    if (!isAuthenticated || !claimedAlumni) return;
    if (privateAlumniData[alumniId]) return; // sudah di-cache
    try {
      const results = await base44.entities.Alumni.filter({ id: alumniId });
      if (results.length > 0) {
        setPrivateAlumniData(prev => ({ ...prev, [alumniId]: results[0] }));
      }
    } catch (e) {}
  };

  const handleAlumniClick = (a) => {
    setSelectedAlumni(a);
    fetchPrivateContact(a.id);
  };

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      const status = (a.status || '').toLowerCase();
      if (status === 'almarhum' || status === 'almarhumah') return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!(a.full_name || '').toLowerCase().includes(s) &&
            !(a.perusahaan || '').toLowerCase().includes(s) &&
            !(a.jabatan || '').toLowerCase().includes(s)) return false;
      }
      if (filters.angkatan && filters.angkatan !== 'all' && a.angkatan !== filters.angkatan) return false;
      if (filters.bidang_keahlian && filters.bidang_keahlian !== 'all' && a.bidang_keahlian !== filters.bidang_keahlian) return false;
      if (filters.bidang_industri && filters.bidang_industri !== 'all' && a.bidang_industri !== filters.bidang_industri) return false;
      if (filters.domisili_kota && !(a.domisili_kota || '').toLowerCase().includes(filters.domisili_kota.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const numA = parseInt((a.angkatan || '').replace(/\D/g, '')) || 0;
      const numB = parseInt((b.angkatan || '').replace(/\D/g, '')) || 0;
      if (numA !== numB) return numA - numB;
      return (a.full_name || '').localeCompare(b.full_name || '', 'id');
    });
  }, [alumni, filters]);

  const hasFilters = Object.values(filters).some(v => v && v !== '');
  const clearFilters = () => setFilters({ search: '', angkatan: '', bidang_keahlian: '', bidang_industri: '', domisili_kota: '' });

  // ─── NAVBAR ───────────────────────────────────────────────────────────────
  // NOTE: rendered as JSX below, not as a component, to avoid remount loop
  const navbarJSX = (
    <nav className="sticky top-0 z-50 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderTop: '3px solid #D4A017', borderBottom: '3px solid #D4A017' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png"
              alt="ALSITS" className="h-10 w-auto" />
            <div className="hidden sm:flex items-center gap-2">
              <div>
                <h1 className="font-heading font-bold text-lg leading-tight text-white">ALSITS</h1>
                <p className="text-[10px] leading-tight text-white/60">Alumni Sipil ITS</p>
              </div>
              <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png"
                alt="TS" className="h-9 w-auto" />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {publicNavLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors">
                      {link.label} <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-52">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.path} asChild>
                        <Link to={child.path} className="w-full font-body text-sm">{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : link.tab ? (
                <button
                  key={link.label}
                  onClick={() => { setActiveTab(link.tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === link.tab
                      ? 'bg-primary text-white shadow'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link key={link.path} to={link.path}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Tampilkan Klaim Profil HANYA jika belum login */}
            {!isAuthenticated && (
              <button onClick={() => setShowClaim(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 transition-colors">
                <ShieldCheck className="h-3.5 w-3.5" /> Klaim Profil
              </button>
            )}
            {/* Badge terverifikasi jika sudah login & punya profil alumni */}
            {isAuthenticated && claimedAlumni && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-400/30 bg-emerald-400/10">
                <ShieldCheck className="h-3.5 w-3.5" /> Profil Terverifikasi
              </span>
            )}
            {/* Tombol Login / Masuk Portal */}
            {isAuthenticated ? (
              <Link to="/beranda"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-300 border border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 transition-colors">
                <LogIn className="h-3.5 w-3.5" /> Masuk Portal
              </Link>
            ) : (
              <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-300 border border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 transition-colors">
                <LogIn className="h-3.5 w-3.5" /> Login Member
              </button>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button className="p-2 rounded-lg hover:bg-white/10 text-white">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6" style={{ background: '#0a1628', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3 mb-6">
                <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" className="h-10" />
                <div>
                  <h2 className="font-heading font-bold text-white">ALSITS</h2>
                  <p className="text-xs text-white/50">Alumni Sipil ITS</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {publicNavLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="space-y-1 mb-2">
                      <p className="px-3 py-1 text-xs font-heading font-semibold text-white/40 uppercase tracking-wider">{link.label}</p>
                      {link.children.map((child) => (
                        <Link key={child.path} to={child.path} onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : link.tab ? (
                    <button
                      key={link.label}
                      onClick={() => { setActiveTab(link.tab); setMobileOpen(false); }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                        activeTab === link.tab
                          ? 'bg-primary text-white'
                          : 'text-white/90 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {/* Klaim Profil: hanya jika belum login */}
                {!isAuthenticated && (
                  <button onClick={() => { setMobileOpen(false); setShowClaim(true); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-amber-300 font-medium hover:bg-amber-400/10 transition-colors border border-amber-400/20">
                    <ShieldCheck className="w-4 h-4" /> Klaim Profil Saya
                  </button>
                )}
                {/* Badge terverifikasi di mobile */}
                {isAuthenticated && claimedAlumni && (
                  <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-emerald-300 font-medium border border-emerald-400/20 bg-emerald-400/5">
                    <ShieldCheck className="w-4 h-4" /> Profil Terverifikasi
                  </div>
                )}
                {/* Login / Masuk Portal */}
                {isAuthenticated ? (
                  <Link to="/beranda" onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-blue-300 font-medium hover:bg-blue-400/10 transition-colors border border-blue-400/20">
                    <LogIn className="w-4 h-4" /> Masuk Portal ALSITS
                  </Link>
                ) : (
                  <button onClick={() => { setMobileOpen(false); base44.auth.redirectToLogin(window.location.href); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-blue-300 font-medium hover:bg-blue-400/10 transition-colors border border-blue-400/20">
                    <LogIn className="w-4 h-4" /> Login Member
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #060a18 0%, #0a0f22 100%)' }}>
      {navbarJSX}

      {/* ── BERANDA TAB — render langsung tanpa tunggu alumni data ── */}
      {activeTab === 'beranda' && (
        <PublicHome
          setActiveTab={setActiveTab}
          onShowClaim={() => setShowClaim(true)}
          isAuthenticated={isAuthenticated}
          claimedAlumni={claimedAlumni}
        />
      )}

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <FuturisticStatsDashboard
            totalAlumni={totalAlumni}
            luarNegeriPct={luarNegeriPct}
            luarNegeri={luarNegeri}
            bidangData={bidangData}
            industriData={industriData}
            angkatanData={angkatanData}
            gelarData={gelarData}
            companyData={companyData}
            topIndustri={topIndustri}
            totalAll={alumni.length}
            filterAngkatan={filterAngkatan}
            setFilterAngkatan={setFilterAngkatan}
          />
        )
      )}

      {/* ── DATABASE TAB ── */}
      {activeTab === 'database' && (
        <div className="relative min-h-screen">
          {/* Grid bg */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
          {/* Orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-6 rounded-full bg-indigo-500" style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }} />
                <span className="text-[11px] font-heading font-bold tracking-[0.3em] uppercase text-indigo-400">Direktori Alumni</span>
              </div>
              <h1 className="font-heading font-black text-4xl text-white mb-2" style={{ textShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                Database <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #22d3ee)' }}>Alumni</span>
              </h1>
              <p className="text-white/40 text-sm">Temukan alumni Teknik Sipil ITS dari berbagai angkatan dan bidang keahlian.</p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-white/40 text-sm font-heading">Memuat data alumni...</span>
              </div>
            ) : (
              <>
                {/* Filter Panel */}
                <div className="rounded-2xl p-5 mb-8"
                  style={{ background: 'rgba(13,18,38,0.95)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 30px rgba(99,102,241,0.08)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-indigo-400" />
                      <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Filter & Pencarian</h3>
                    </div>
                    {hasFilters && (
                      <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors"
                        style={{ color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                        <X className="h-3 w-3" /> Reset Filter
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input placeholder="Cari nama, perusahaan..." value={filters.search}
                        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                        className="pl-9 h-10 text-white placeholder:text-white/30"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }} />
                    </div>
                    <Select value={filters.angkatan} onValueChange={v => setFilters(f => ({ ...f, angkatan: v }))}>
                      <SelectTrigger className="h-10 text-white/80" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
                        <SelectValue placeholder="Angkatan" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-[#0d1229] border-indigo-500/30">
                        <SelectItem value="all">Semua Angkatan</SelectItem>
                        {ANGKATAN_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={filters.bidang_keahlian} onValueChange={v => setFilters(f => ({ ...f, bidang_keahlian: v }))}>
                      <SelectTrigger className="h-10 text-white/80" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
                        <SelectValue placeholder="Bidang Keahlian" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1229] border-indigo-500/30">
                        <SelectItem value="all">Semua Bidang</SelectItem>
                        {BIDANG_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={filters.bidang_industri} onValueChange={v => setFilters(f => ({ ...f, bidang_industri: v }))}>
                      <SelectTrigger className="h-10 text-white/80" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
                        <SelectValue placeholder="Industri" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1229] border-indigo-500/30">
                        <SelectItem value="all">Semua Industri</SelectItem>
                        {INDUSTRI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Kota domisili..." value={filters.domisili_kota}
                      onChange={e => setFilters(f => ({ ...f, domisili_kota: e.target.value }))}
                      className="h-10 text-white placeholder:text-white/30"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }} />
                  </div>
                </div>

                {/* Count */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-sm text-white/40 font-heading">
                    Menampilkan <strong className="text-indigo-300">{filteredAlumni.length}</strong> alumni
                  </span>
                </div>

                {filteredAlumni.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <Users className="h-7 w-7 text-indigo-400/40" />
                    </div>
                    <p className="text-white/30 text-sm">
                      {alumni.length === 0 ? 'Gagal memuat data. Coba refresh halaman.' : 'Tidak ada alumni yang sesuai filter.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAlumni.map(a => <PublicAlumniCard key={a.id} alumni={a} onClick={() => handleAlumniClick(a)} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <footer className="mt-16 py-8 text-center text-xs"
        style={{ borderTop: '1px solid rgba(99,102,241,0.15)', color: 'rgba(255,255,255,0.2)' }}>
        Portal Alumni Teknik Sipil ITS — ALSITS ·{' '}
        <a href="https://alsits.id" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors" style={{ color: '#818cf8' }}>alsits.id</a>
      </footer>

      <AlumniClaimModal open={showClaim} onClose={() => setShowClaim(false)} />
      <PublicAlumniDetailModal
        alumni={selectedAlumni
          ? { ...selectedAlumni, ...(privateAlumniData[selectedAlumni?.id] || {}) }
          : null}
        open={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        isAuthenticated={isAuthenticated}
        claimedAlumni={claimedAlumni || null}
        fullClaimedAlumni={claimedAlumni || null}
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, grad }) {
  return (
    <div className={`bg-gradient-to-br ${grad} rounded-2xl p-5 text-white shadow-lg shadow-black/10`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-white/50" />
      </div>
      <div className="font-heading font-bold text-2xl text-white truncate">{value}</div>
      <div className="text-white/90 text-sm font-medium mt-1">{label}</div>
      {sub && <div className="text-white/60 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function ChartCard({ title, count, children }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">{title}</h3>
        <span className="text-xs font-medium bg-secondary text-muted-foreground px-3 py-1 rounded-full border border-border">{count}</span>
      </div>
      {children}
    </div>
  );
}

function PubPieChart({ data, palette, total }) {
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData = rest.length > 0
    ? [...top, { name: 'Lainnya', value: rest.reduce((s, d) => s + d.value, 0) }]
    : top;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card rounded-xl shadow-xl px-4 py-3 border border-border text-sm">
        <div className="font-semibold text-foreground">{d.name}</div>
        <div className="text-primary font-bold text-lg">{d.value}</div>
        <div className="text-muted-foreground text-xs">{total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%</div>
      </div>
    );
  };

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">{(percent * 100).toFixed(0)}%</text>;
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel}>
            {chartData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="w-full flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {chartData.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: palette[i % palette.length] }} />
            <span className="truncate max-w-[90px]">{d.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PubBarChart({ data, palette }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card rounded-xl shadow-xl px-4 py-3 border border-border text-sm">
        <div className="font-semibold text-foreground max-w-[180px] break-words">{payload[0].payload.name}</div>
        <div className="text-primary font-bold text-lg">{payload[0].value} alumni</div>
      </div>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} width={110} tickFormatter={v => v.length > 16 ? v.slice(0, 16) + '…' : v} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Alumni">
          {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PublicAlumniCard({ alumni, onClick }) {
  const displayName = toTitleCase(alumni.full_name);
  let hasBusinessData = false;
  try { hasBusinessData = alumni.kegiatan_usaha && JSON.parse(alumni.kegiatan_usaha).length > 0; } catch {}

  const AVATAR_COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#8b5cf6','#ec4899'];
  let ci = 0;
  if (alumni.full_name) for (let i = 0; i < alumni.full_name.length; i++) ci = (ci * 31 + alumni.full_name.charCodeAt(i)) % AVATAR_COLORS.length;
  const accentColor = AVATAR_COLORS[ci];

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(145deg, rgba(13,18,38,0.98), rgba(20,28,55,0.9))',
        border: `1px solid ${accentColor}20`,
        boxShadow: `0 0 20px ${accentColor}08`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 35px ${accentColor}30`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}08`}
      onClick={onClick}
    >
      {/* Corner glow */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: accentColor }} />

      <div className="relative z-10 p-5">
        <div className="flex gap-4">
          <div className="shrink-0">
            {alumni.photo_url
              ? <img src={alumni.photo_url} alt={displayName} className="w-14 h-14 rounded-full object-cover"
                  style={{ border: `2px solid ${accentColor}40`, boxShadow: `0 0 12px ${accentColor}30` }} />
              : <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${accentColor}15`, border: `2px solid ${accentColor}40`, boxShadow: `0 0 12px ${accentColor}20` }}>
                  <span className="font-heading font-bold text-lg" style={{ color: accentColor }}>
                    {displayName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-white truncate text-sm">{displayName}</h3>
                {alumni.jabatan && <p className="text-xs text-white/50 truncate mt-0.5">{alumni.jabatan}</p>}
              </div>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold"
                style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                {alumni.angkatan}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {alumni.perusahaan && <span className="flex items-center gap-1.5 truncate"><Building2 className="h-3 w-3 shrink-0" />{alumni.perusahaan}</span>}
              {alumni.domisili_kota && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" />{alumni.domisili_kota}</span>}
              {alumni.bidang_keahlian && <span className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3 shrink-0" />{alumni.bidang_keahlian}</span>}
            </div>
            {hasBusinessData && (
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Building2 className="h-2.5 w-2.5" /> Ada data bisnis
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground">
      <TrendingUp className="w-10 h-10 text-muted-foreground/20 mb-2" />
      <p className="text-sm">Belum ada data</p>
    </div>
  );
}