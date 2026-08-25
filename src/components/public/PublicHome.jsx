import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MapPin, BarChart3, Handshake, Calendar, BookOpen, ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

const features = [
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Database Alumni',
    description: 'Cari dan temukan alumni berdasar angkatan, bidang keahlian, domisili, dan perusahaan.',
    tab: 'database',
    color: '#6366f1',
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Statistik Alumni',
    description: 'Data dan chart persebaran alumni per angkatan, bidang industri, dan lokasi.',
    tab: 'dashboard',
    color: '#06b6d4',
  },
  {
    icon: <Handshake className="h-7 w-7" />,
    title: 'Business Hub',
    description: 'Temukan mitra bisnis, produk, dan layanan dari alumni Teknik Sipil ITS.',
    href: '/business-hub',
    color: '#f59e0b',
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: 'Berita & Event',
    description: 'Info terkini kegiatan, reuni, webinar, dan pengumuman komunitas ALSITS.',
    tab: 'berita',
    color: '#10b981',
  },
];

export default function PublicHome({ setActiveTab, onShowClaim, isAuthenticated, claimedAlumni }) {
  const { data: news } = useQuery({
    queryKey: ['public-latest-news'],
    queryFn: () => base44.entities.News.filter({ is_published: true }, '-published_date', 3),
    initialData: [],
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #060a18 0%, #0a0f22 100%)' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%),
            linear-gradient(180deg, #07091a 0%, #0a0f22 100%)
          `,
        }}>
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        {/* Orb */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        {/* Gold top bar */}
        <div className="absolute top-0 left-0 w-full h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-heading font-medium"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Alumni Teknik Sipil ITS
              </div>

              <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl text-white leading-[1.1] mb-6">
                <span style={{ color: '#D4A017', textShadow: '0 0 30px rgba(212,160,23,0.4)' }}>Vivat!</span>
                <br />
                Dari SIPIL ITS
                <br />
                <span className="text-white/70">untuk Indonesia</span>
              </h1>

              <p className="text-white/60 text-lg max-w-lg mb-10 font-body leading-relaxed">
                Menghubungkan alumni Teknik Sipil ITS dari berbagai angkatan di seluruh penjuru dunia. Bersama membangun bangsa.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <button onClick={() => setActiveTab('database')}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-bold text-sm text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}>
                  Jelajahi Database <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-semibold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.35)', color: '#22d3ee' }}>
                  <BarChart3 className="h-4 w-4" /> Lihat Statistik
                </button>
                {!isAuthenticated && (
                  <button onClick={onShowClaim}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-semibold text-sm transition-all hover:scale-105"
                    style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.35)', color: '#fbbf24' }}>
                    <ShieldCheck className="h-4 w-4" /> Klaim Profil
                  </button>
                )}
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4">
              {[
                { value: '5,000+', label: 'Total Alumni', color: '#6366f1' },
                { value: '60+', label: 'Angkatan', color: '#06b6d4' },
                { value: '7', label: 'Bidang Keahlian', color: '#10b981' },
                { value: '100%', label: 'Terhubung', color: '#f59e0b' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: `rgba(${i % 2 === 0 ? '99,102,241' : '6,182,212'},0.07)`,
                    border: `1px solid ${s.color}30`,
                    boxShadow: `0 0 20px ${s.color}10`,
                  }}>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30"
                    style={{ background: s.color }} />
                  <p className="font-heading font-black text-3xl md:text-4xl text-white mb-1"
                    style={{ textShadow: `0 0 20px ${s.color}60` }}>{s.value}</p>
                  <p className="text-sm font-body" style={{ color: `${s.color}cc` }}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FITUR ── */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #0a0f22 0%, #070c1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-heading font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', color: '#fbbf24' }}>
              Fitur Utama
            </div>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              Satu Platform untuk Semua <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #22d3ee)' }}>Alumni</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-sm">
              Platform digital yang menghubungkan seluruh alumni Teknik Sipil ITS lintas generasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <button
                  onClick={() => f.tab ? setActiveTab(f.tab) : window.open(f.href, '_self')}
                  className="w-full text-left group p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(145deg, rgba(13,18,38,0.98), rgba(20,28,55,0.9))',
                    border: `1px solid ${f.color}25`,
                    boxShadow: `0 0 30px ${f.color}08`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${f.color}30`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 30px ${f.color}08`}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}40`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-heading font-bold text-base text-white mb-2 group-hover:text-white">{f.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: `${f.color}80` }}>
                    Selengkapnya <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BERITA TERBARU ── */}
      <section className="py-20" style={{ background: '#070c1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 text-xs font-heading font-bold tracking-widest uppercase"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                Berita Terbaru
              </div>
              <h2 className="font-heading font-black text-2xl md:text-3xl text-white">News & Events</h2>
            </div>
            <button onClick={() => setActiveTab('berita')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-heading font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
              Semua Berita <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Belum ada berita terbaru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {news.slice(0, 3).map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    style={{
                      background: 'linear-gradient(145deg, rgba(13,18,38,0.98), rgba(20,28,55,0.9))',
                      border: '1px solid rgba(99,102,241,0.15)',
                      boxShadow: '0 0 25px rgba(99,102,241,0.05)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(99,102,241,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(99,102,241,0.05)'}
                  >
                    {item.cover_image && (
                      <div className="h-44 overflow-hidden">
                        <img src={item.cover_image} alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                          {item.category}
                        </span>
                        {item.published_date && (
                          <span className="flex items-center gap-1 text-xs text-white/30">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(item.published_date), 'dd MMM yyyy')}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}