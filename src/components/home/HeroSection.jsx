import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MapPin, BookOpen, Handshake, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ alumniCount }) {
  return (
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
              <Link to="/alumni"
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}>
                Jelajahi Database <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/peta"
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-semibold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.35)', color: '#22d3ee' }}>
                <MapPin className="h-4 w-4" /> Lihat Peta Alumni
              </Link>
              <Link to="/business-hub"
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-semibold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.35)', color: '#fbbf24' }}>
                <Handshake className="h-4 w-4" /> Business Hub
              </Link>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4">
            {[
              { value: '5,000+', label: 'Total Alumni', color: '#6366f1', icon: <Users className="h-5 w-5" /> },
              { value: '60+', label: 'Angkatan', color: '#06b6d4', icon: <MapPin className="h-5 w-5" /> },
              { value: '7', label: 'Bidang Keahlian', color: '#10b981', icon: <BookOpen className="h-5 w-5" /> },
              { value: '100%', label: 'Terhubung', color: '#f59e0b', icon: <BarChart3 className="h-5 w-5" /> },
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
                <div className="mb-3" style={{ color: s.color }}>{s.icon}</div>
                <p className="font-heading font-black text-3xl md:text-4xl text-white mb-1"
                  style={{ textShadow: `0 0 20px ${s.color}60` }}>{s.value}</p>
                <p className="text-sm font-body" style={{ color: `${s.color}cc` }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}