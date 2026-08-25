import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Briefcase, BookOpen, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Database Alumni',
    description: 'Cari dan temukan alumni berdasar angkatan, bidang keahlian, domisili, dan perusahaan.',
    path: '/alumni',
    color: '#6366f1',
    bg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=60',
  },
  {
    icon: <MapPin className="h-7 w-7" />,
    title: 'Peta Alumni',
    description: 'Visualisasi persebaran alumni Sipil ITS di seluruh dunia.',
    path: '/peta',
    color: '#06b6d4',
    bg: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=60',
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Dashboard Statistik',
    description: 'Data dan chart persebaran alumni per angkatan, bidang industri, dan lokasi.',
    path: '/dashboard',
    color: '#8b5cf6',
    bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
  },
  {
    icon: <Briefcase className="h-7 w-7" />,
    title: 'Lowongan & Proyek',
    description: 'Info lowongan kerja dan proyek internal khusus antar alumni.',
    path: '/lowongan',
    color: '#f59e0b',
    bg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=60',
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: 'E-Library',
    description: 'Jurnal, skripsi, thesis, dan standar teknis sebagai referensi bersama.',
    path: '/library',
    color: '#10b981',
    bg: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=60',
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: 'Forum Diskusi',
    description: 'Ruang diskusi per bidang keahlian agar ilmu teknik tetap berkembang.',
    path: '/forum',
    color: '#ec4899',
    bg: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=60',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(180deg, #0a0f22 0%, #070c1a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-heading font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', color: '#fbbf24' }}>
            Fitur Utama
          </div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
            Satu Platform untuk Semua{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #22d3ee)' }}>Alumni</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-sm">
            Platform digital yang menghubungkan seluruh alumni Teknik Sipil ITS lintas generasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={f.path} className="block group h-full">
                <div className="relative overflow-hidden rounded-2xl h-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: `1px solid ${f.color}25`,
                    boxShadow: `0 0 30px ${f.color}08`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${f.color}30`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 30px ${f.color}08`}
                >
                  {/* Background image with blur overlay */}
                  <div className="absolute inset-0">
                    <img src={f.bg} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-500" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(145deg, rgba(13,18,38,0.97), rgba(20,28,55,0.93))' }} />
                  </div>

                  <div className="relative z-10 p-7">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}40`, color: f.color }}>
                      {f.icon}
                    </div>
                    <h3 className="font-heading font-bold text-base text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{f.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: `${f.color}80` }}>
                      Selengkapnya <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}