import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Newspaper, Briefcase, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ alumni: [], news: [], jobs: [], forum: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults({ alumni: [], news: [], jobs: [], forum: [] }); return; }
    const t = setTimeout(() => doSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  async function doSearch(q) {
    setLoading(true);
    try {
      const ql = q.toLowerCase();
      const [allAlumni, allNews, allJobs, allForum] = await Promise.all([
        base44.entities.Alumni.list('-updated_date', 500),
        base44.entities.News.filter({ is_published: true }),
        base44.entities.JobPosting.filter({ is_active: true }),
        base44.entities.ForumPost.list('-created_date', 100),
      ]);
      setResults({
        alumni: allAlumni.filter(a => a.full_name?.toLowerCase().includes(ql) || a.perusahaan?.toLowerCase().includes(ql) || a.angkatan?.toLowerCase().includes(ql)).slice(0, 4),
        news: allNews.filter(n => n.title?.toLowerCase().includes(ql) || n.excerpt?.toLowerCase().includes(ql)).slice(0, 3),
        jobs: allJobs.filter(j => j.title?.toLowerCase().includes(ql) || j.company?.toLowerCase().includes(ql)).slice(0, 3),
        forum: allForum.filter(f => f.title?.toLowerCase().includes(ql) || f.content?.toLowerCase().includes(ql)).slice(0, 3),
      });
    } catch (_) {}
    setLoading(false);
  }

  const total = results.alumni.length + results.news.length + results.jobs.length + results.forum.length;

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 px-4"
      style={{ background: 'rgba(6,13,31,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl" style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari alumni, berita, lowongan, forum..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 16, fontFamily: 'Open Sans, sans-serif' }} />
          {loading && <div style={{ width: 16, height: 16, border: '2px solid rgba(59,130,246,0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '4px 8px', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>ESC</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 480, overflowY: 'auto', padding: query.length >= 2 ? '12px 0' : 0 }}>
          {query.length < 2 && (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: '#475569', fontSize: 14 }}>
              <Search size={32} color="#1e3a8a" style={{ margin: '0 auto 10px' }} />
              <p style={{ margin: 0 }}>Ketik minimal 2 karakter untuk mencari</p>
            </div>
          )}

          {query.length >= 2 && !loading && total === 0 && (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: '#475569', fontSize: 14 }}>
              Tidak ditemukan hasil untuk <strong style={{ color: '#94a3b8' }}>"{query}"</strong>
            </div>
          )}

          {results.alumni.length > 0 && (
            <ResultSection icon={<Users size={13} />} label="Alumni" color="#3b82f6">
              {results.alumni.map(a => (
                <ResultItem key={a.id} onClick={() => go('/alumni')}
                  title={a.full_name} sub={[a.angkatan, a.perusahaan, a.domisili_kota].filter(Boolean).join(' · ')} color="#3b82f6" />
              ))}
            </ResultSection>
          )}
          {results.news.length > 0 && (
            <ResultSection icon={<Newspaper size={13} />} label="Berita" color="#10b981">
              {results.news.map(n => (
                <ResultItem key={n.id} onClick={() => go('/berita')}
                  title={n.title} sub={n.category} color="#10b981" />
              ))}
            </ResultSection>
          )}
          {results.jobs.length > 0 && (
            <ResultSection icon={<Briefcase size={13} />} label="Lowongan" color="#f59e0b">
              {results.jobs.map(j => (
                <ResultItem key={j.id} onClick={() => go('/lowongan')}
                  title={j.title} sub={[j.type, j.company].filter(Boolean).join(' · ')} color="#f59e0b" />
              ))}
            </ResultSection>
          )}
          {results.forum.length > 0 && (
            <ResultSection icon={<MessageSquare size={13} />} label="Forum" color="#8b5cf6">
              {results.forum.map(f => (
                <ResultItem key={f.id} onClick={() => go('/forum')}
                  title={f.title} sub={f.category} color="#8b5cf6" />
              ))}
            </ResultSection>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16, fontSize: 11, color: '#334155' }}>
          <span>↑↓ navigasi</span><span>↵ pilih</span><span>ESC tutup</span>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResultSection({ icon, label, color, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 20px', color, fontSize: 11, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function ResultItem({ title, sub, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px', cursor: 'pointer', background: hov ? 'rgba(59,130,246,0.08)' : 'transparent', transition: 'background 0.15s' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 13.5, color: '#e2e8f0', fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: '#475569', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}