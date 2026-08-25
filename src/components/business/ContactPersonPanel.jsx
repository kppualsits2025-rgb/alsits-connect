import React, { useState, useEffect } from 'react';
import { X, Phone, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ContactPersonPanel({ onClose }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAngkatan, setActiveAngkatan] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    let unsubscribe;
    const load = async () => {
      setLoading(true);
      const data = await base44.entities.AngkatanContact.filter({ is_active: true }, 'angkatan');
      setContacts(data);
      if (data.length > 0) setActiveAngkatan(data[0].angkatan);
      setLoading(false);
    };
    load();

    unsubscribe = base44.entities.AngkatanContact.subscribe((event) => {
      if (event.type === 'create') {
        setContacts(prev => event.data.is_active ? [...prev, event.data] : prev);
      } else if (event.type === 'update') {
        setContacts(prev => event.data.is_active
          ? prev.map(c => c.id === event.id ? event.data : c)
          : prev.filter(c => c.id !== event.id)
        );
      } else if (event.type === 'delete') {
        setContacts(prev => prev.filter(c => c.id !== event.id));
      }
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const angkatanList = [...new Set(contacts.map(c => c.angkatan))].sort();
  const activeContacts = contacts.filter(c => c.angkatan === activeAngkatan);

  useEffect(() => {
    if (!activeAngkatan && angkatanList.length > 0) {
      setActiveAngkatan(angkatanList[0]);
    }
  }, [angkatanList]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(160deg,#0a1628,#0d1f44)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
          maxHeight: '85vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg,rgba(212,160,23,0.12),transparent)' }}
        >
          <div>
            <h2 className="font-heading font-black text-white text-lg">📋 Kontak Petugas Angkatan</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Hubungi petugas untuk mendaftar &amp; menambahkan data bisnis
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'none', color: '#fff' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navbar angkatan */}
        {angkatanList.length > 0 && (
          <div className="px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Mobile: dropdown */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}
              >
                Angkatan {activeAngkatan}
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute top-full mt-1 w-full rounded-xl overflow-hidden z-10"
                  style={{ background: '#0d1f44', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                >
                  {angkatanList.map(a => (
                    <button
                      key={a}
                      onClick={() => { setActiveAngkatan(a); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: a === activeAngkatan ? '#f59e0b' : 'rgba(255,255,255,0.7)', background: a === activeAngkatan ? 'rgba(245,158,11,0.1)' : 'transparent', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer' }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Desktop: tab bar */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {angkatanList.map(a => (
                <button
                  key={a}
                  onClick={() => setActiveAngkatan(a)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all"
                  style={{
                    background: a === activeAngkatan ? '#1d4ed8' : 'rgba(255,255,255,0.06)',
                    border: a === activeAngkatan ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    color: a === activeAngkatan ? '#fff' : 'rgba(255,255,255,0.55)',
                    fontFamily: 'Montserrat,sans-serif',
                    cursor: 'pointer',
                    boxShadow: a === activeAngkatan ? '0 0 12px rgba(59,130,246,0.35)' : 'none',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Konten */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="text-center py-10 text-white/40 text-sm">Memuat kontak...</div>
          ) : angkatanList.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-white/40 text-sm">Belum ada data kontak petugas.</p>
              <p className="text-white/25 text-xs mt-1">Silakan hubungi pengurus ALSITS pusat.</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider" style={{ color: '#f59e0b', fontFamily: 'Montserrat,sans-serif' }}>Nama</th>
                    <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider hidden sm:table-cell" style={{ color: '#f59e0b', fontFamily: 'Montserrat,sans-serif' }}>Jabatan</th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-wider" style={{ color: '#f59e0b', fontFamily: 'Montserrat,sans-serif' }}>WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {activeContacts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center px-4 py-8 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Belum ada petugas CS untuk angkatan {activeAngkatan}
                      </td>
                    </tr>
                  ) : activeContacts.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: i < activeContacts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    >
                      <td className="px-4 py-3 font-semibold text-white text-sm">{c.full_name}</td>
                      <td className="px-4 py-3 text-xs hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {c.role_label || `Petugas CS ${c.angkatan}`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.telepon ? (
                          <a
                            href={`https://wa.me/${c.telepon.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.35)', textDecoration: 'none' }}
                          >
                            <Phone className="w-3 h-3" /> Hubungi
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-center mt-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Tidak menemukan angkatan Anda? Hubungi pengurus ALSITS pusat.
          </p>
        </div>
      </div>
    </div>
  );
}