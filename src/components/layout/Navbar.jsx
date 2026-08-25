import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, LogOut, Shield, ShieldCheck, CheckCircle2, Inbox as InboxIcon, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AlumniClaimModal from '@/components/alumni/AlumniClaimModal';
import GlobalSearch from '@/components/layout/GlobalSearch';

function InboxNavIcon({ userId }) {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['inbox-unread', userId],
    queryFn: async () => {
      const msgs = await base44.entities.Message.filter({ recipient_id: userId, is_read: false });
      return msgs.length;
    },
    enabled: !!userId,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });
  return (
    <Link to="/inbox" className="relative hidden lg:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white mr-1">
      <InboxIcon className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

const navLinks = [
  { label: 'Beranda', path: '/beranda' },
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
    label: 'Alumni',
    children: [
      { label: '🗂️ Database Alumni', path: '/alumni' },
      { label: '🗺️ Peta Sebaran', path: '/peta' },
      { label: '📊 Statistik', path: '/dashboard' },
      { label: '🏆 Prestasi & Karya', path: '/alumni/prestasi' },
      { label: '🤝 Kontribusi & Kepedulian', path: '/alumni/kontribusi' },
      { label: '🎉 Event & Kegiatan', path: '/events' },
      { label: '🗳️ Live Voting OMOV', path: '/voting' },
    ]
  },
  {
    label: 'Komunitas',
    children: [
      { label: '🚴 Gowes', path: '/komunitas/gowes' },
      { label: '⛳ Golf', path: '/komunitas/golf' },
      { label: '🏃 Jalan Sehat', path: '/komunitas/jalan-sehat' },
      { label: '📈 Trading & Investasi Saham', path: '/komunitas/trading' },
    ]
  },
  {
    label: 'Lainnya',
    children: [
      { label: '🤝 Business Hub', path: '/business-hub' },
      { label: 'Berita & Kegiatan', path: '/berita' },
      { label: 'Lowongan & Proyek', path: '/lowongan' },
      { label: 'E-Library', path: '/library' },
      { label: 'Forum Diskusi', path: '/forum' },
      { label: '⚙️ Admin Voting OMOV', path: '/voting/admin', adminOnly: true },
      { label: '📋 DPT Alumni', path: '/dpt' },
    ]
  },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => base44.auth.logout();

  const avatarUrl = user?.picture || user?.avatar_url || user?.profile_picture || user?.photo_url || null;

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // Cek apakah user sudah klaim profil
  // RLS Alumni: user bisa baca record yang email-nya cocok dengan user.email
  // Jika ada record Alumni yang bisa dibaca = email cocok = sudah terhubung
  const { data: hasClaimedProfile, isLoading: isLoadingClaim } = useQuery({
    queryKey: ['user-claim-status', user?.id],
    queryFn: async () => {
      if (!user?.email) return false;
      try {
        const myAlumni = await base44.entities.Alumni.list();
        if (myAlumni.length > 0) return true;
      } catch (_) {}
      return false;
    },
    enabled: !!user?.email,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <nav className="sticky top-0 z-50 shadow-lg" style={{background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderTop: '3px solid #D4A017', borderBottom: '3px solid #D4A017'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/beranda" className="flex items-center gap-3 shrink-0">
            <img
              src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png"
              alt="ALSITS"
              className="h-10 md:h-12 w-auto"
            />
            <div className="hidden sm:flex items-center gap-2">
              <div>
                <h1 className="font-heading font-bold text-lg leading-tight text-white">ALSITS</h1>
                <p className="text-[10px] leading-tight text-white/60">Alumni Sipil ITS</p>
              </div>
              <img
                src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png"
                alt="TS"
                className="h-9 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="font-heading text-sm font-medium gap-1 hover:bg-white/10 text-white/90 hover:text-white">
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {link.children.filter(c => !c.adminOnly || user?.role === 'admin').map((child) => (
                      <DropdownMenuItem key={child.path} asChild>
                        <Link to={child.path} className="w-full font-body text-sm">
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    className={`font-heading text-sm font-medium text-white/90 hover:text-white ${
                      isActive(link.path)
                        ? 'bg-white/15 text-white'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Global Search Button — Desktop */}
          <button onClick={() => setShowSearch(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors mr-1 border border-white/10"
            style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <Search className="h-4 w-4" />
            <span className="text-xs">Cari...</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/30 font-mono">⌘K</span>
          </button>

          {/* Inbox Link — Desktop */}
          {user && (
            <InboxNavIcon userId={user?.id} />
          )}

          {/* Status Klaim Profil — Desktop */}
          {user && !isLoadingClaim && (
            hasClaimedProfile ? (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-400/30 bg-emerald-400/10 mr-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung
              </div>
            ) : (
              <button
                onClick={() => setShowClaim(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 transition-colors mr-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Klaim Profil
              </button>
            )
          )}

          {/* User Avatar - Desktop */}
          {user && (
            <div className="hidden lg:flex items-center ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user.full_name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-400/60" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold border-2 border-blue-400/60">
                        {initials}
                      </div>
                    )}
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-bold leading-tight text-white">{user.full_name}</div>
                      <div className="text-[10px] leading-tight text-white/60">{user.role === 'admin' ? '⚡ Admin' : 'Member'}</div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-white/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-[#0f1e3a] border-white/10 text-white">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      )}
                      {hasClaimedProfile && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Profil Diklaim
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                     <>
                       <DropdownMenuItem asChild>
                         <Link to="/admin" className="cursor-pointer flex items-center gap-2 text-blue-300 font-medium">
                           <Shield className="w-4 h-4" /> Admin Panel
                         </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                          <Link to="/voting" className="cursor-pointer flex items-center gap-2 text-cyan-400 font-medium">
                            👁️ Lihat Halaman Voting
                          </Link>
                        </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                          <Link to="/voting/admin" className="cursor-pointer flex items-center gap-2 text-yellow-400 font-medium">
                            🗳️ Admin Voting OMOV
                          </Link>
                        </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <Link to="/content-admin" className="cursor-pointer flex items-center gap-2 text-green-400 font-medium">
                           📝 Admin Konten
                         </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <Link to="/panduan-admin" className="cursor-pointer flex items-center gap-2 text-amber-400 font-medium">
                           📖 Panduan Admin & CS
                         </Link>
                       </DropdownMenuItem>
                     </>
                   )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6" style={{background: '#0a1628', borderColor: 'rgba(255,255,255,0.1)'}}>
              <div className="flex items-center gap-3 mb-6">
                <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" className="h-10" />
                <div>
                  <h2 className="font-heading font-bold text-white">ALSITS</h2>
                  <p className="text-xs text-white/50">Alumni Sipil ITS</p>
                </div>
                <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="TS" className="h-8 w-auto" />
              </div>
              {user && (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/40" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium mt-0.5">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="space-y-1">
                      <p className="px-3 py-2 text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">
                        {link.label}
                      </p>
                      {link.children.filter(c => !c.adminOnly || user?.role === 'admin').map((child) => (
                        <Link key={child.path} to={child.path} onClick={() => setOpen(false)}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start pl-6 text-sm ${
                              isActive(child.path) ? 'text-primary bg-primary/5' : ''
                            }`}
                          >
                            {child.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={link.path} to={link.path} onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-sm font-medium ${
                          isActive(link.path) ? 'text-primary bg-primary/5' : ''
                        }`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  )
                )}
              </div>

              {/* Inbox mobile */}
              {user && (
                <Link to="/inbox" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium gap-2">
                    <InboxIcon className="w-4 h-4" /> Inbox Pesan
                  </Button>
                </Link>
              )}

              {/* Status Klaim Profil mobile */}
              {user && !isLoadingClaim && (
                hasClaimedProfile ? (
                  <div className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-emerald-300 font-medium bg-emerald-400/10 border border-emerald-400/20">
                    <CheckCircle2 className="w-4 h-4" /> Terhubung
                  </div>
                ) : (
                  <button onClick={() => { setOpen(false); setShowClaim(true); }}
                    className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-amber-300 font-medium hover:bg-amber-400/10 transition-colors border border-amber-400/20">
                    <ShieldCheck className="w-4 h-4" /> Klaim Profil Saya
                  </button>
                )
              )}

              {/* Logout mobile */}
              {user && (
                <button onClick={handleLogout} className="mt-1 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 font-medium hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AlumniClaimModal open={showClaim} onClose={() => setShowClaim(false)} />
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </nav>
  );
}