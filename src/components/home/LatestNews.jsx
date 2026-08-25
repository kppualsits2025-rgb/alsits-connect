import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function LatestNews({ news }) {
  return (
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
          <Link to="/berita"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-heading font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
            Semua Berita <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!news || news.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Belum ada berita terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {news.slice(0, 3).map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
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
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.published_date), 'dd MMM yyyy')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}