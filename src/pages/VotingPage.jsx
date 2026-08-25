import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import VotingResults from '@/components/voting/VotingResults';

export default function VotingPage() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['voting-events-active'],
    queryFn: () => base44.entities.VotingEvent.filter({ status: 'active' }),
    staleTime: 60000,
  });

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🗳️</div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Tidak Ada Voting Aktif</h1>
          <p className="text-muted-foreground">Saat ini tidak ada event pemilihan yang sedang berlangsung. Silakan cek kembali nanti.</p>
          {user?.role === 'admin' && (
            <Link to="/voting/admin" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-medium text-sm hover:bg-yellow-500/30 transition-colors">
              ⚙️ Buka Admin Voting OMOV
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full py-8 px-4" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderBottom: '3px solid #D4A017' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-1">ALSITS — Pemilihan Ketua Konjur</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">{selectedEvent.title}</h1>
          {selectedEvent.description && <p className="text-white/60 mt-2 text-sm">{selectedEvent.description}</p>}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Voting Sedang Berlangsung</span>
          </div>
          {user?.role === 'admin' && (
            <div className="mt-4">
              <Link
                to="/voting/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', color: '#D4A017' }}
              >
                ⚙️ Buka Admin Panel OMOV (Kelola DPT & Kandidat)
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Compact sidebar results + info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info panel kiri */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(145deg, #0d1b35, #152545)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <h2 className="font-heading text-lg font-bold text-white mb-2">ℹ️ Informasi Pemilihan</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Halaman ini menampilkan hasil perolehan suara secara <span className="text-primary font-semibold">real-time</span> dan dapat diikuti oleh seluruh member selama durasi pemilihan berlangsung.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/40 mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold text-sm">Sedang Berlangsung</span>
                  </div>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/40 mb-1">Auto Refresh</p>
                  <p className="text-white font-semibold text-sm">Setiap 60 detik</p>
                </div>
              </div>
              {selectedEvent.end_time && (
                <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)' }}>
                  <p className="text-xs text-yellow-400/70 mb-0.5">Cut-off Time (CoT)</p>
                  <p className="text-yellow-400 font-semibold text-sm">
                    {new Date(selectedEvent.end_time).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} WIB
                  </p>
                </div>
              )}
              {user?.role === 'admin' && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/30 mb-2">Admin Actions</p>
                  <div className="flex gap-2 flex-wrap">
                    <Link to="/voting/admin" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', color: '#D4A017' }}>
                      ⚙️ Admin Panel OMOV
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact results kanan */}
          <div className="lg:col-span-1">
            <VotingResults event={selectedEvent} />
          </div>
        </div>

        {/* Full-width Live Dashboard */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #08111f 0%, #0f2040 50%, #08111f 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between flex-wrap gap-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div>
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                📊 Dashboard Hasil Live — <span className="text-primary">{selectedEvent.title}</span>
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Posisi kandidat tetap berdasarkan nomor urut • perolehan suara diperbarui otomatis</p>
            </div>
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="p-6">
            <VotingResults event={selectedEvent} fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
}