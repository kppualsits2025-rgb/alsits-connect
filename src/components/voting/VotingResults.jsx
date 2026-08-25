import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, RefreshCw, Trophy, Crown } from 'lucide-react';

export default function VotingResults({ event, fullWidth = false }) {
  const { data: candidates = [], isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['voting-candidates-live', event.id],
    queryFn: () => base44.entities.VotingCandidate.filter({ event_id: event.id }),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const totalVotes = candidates.reduce((sum, c) => sum + (c.vote_count || 0), 0);
  const lastUpdate = new Date(dataUpdatedAt).toLocaleTimeString('id-ID');

  // fullWidth: sort by nomor_urut FIXED — posisi tidak berubah
  const sortedByNomor = [...candidates].sort((a, b) => (a.nomor_urut || 0) - (b.nomor_urut || 0));
  // compact sidebar: sort by suara terbanyak — posisi berubah dinamis
  const sortedByVote = [...candidates].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  const leadingId = sortedByVote[0]?.id;

  // ── FULL WIDTH (Dashboard bawah) ─────────────────────────────────
  if (fullWidth) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <p className="text-white/60 text-sm">
            Total suara masuk: <span className="text-white font-bold text-base">{totalVotes}</span>
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
          >
            <RefreshCw className="w-3 h-3" /> Refresh • {lastUpdate}
          </button>
        </div>

        {isLoading && <div className="text-center text-sm text-white/50 py-10">Memuat...</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sortedByNomor.map((c) => {
            const pct = totalVotes > 0 ? Math.round((c.vote_count || 0) / totalVotes * 100) : 0;
            const isLeading = c.id === leadingId && (c.vote_count || 0) > 0;

            return (
              <div
                key={c.id}
                style={{
                  background: isLeading
                    ? 'linear-gradient(145deg, #1a2a0a, #2a4a10)'
                    : 'linear-gradient(145deg, #0d1b35, #152545)',
                  border: isLeading ? '1px solid rgba(212,160,23,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isLeading
                    ? '0 8px 32px rgba(212,160,23,0.25), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 8px 24px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transform: isLeading ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 0.5s ease',
                }}
                className="rounded-2xl p-5 relative overflow-hidden"
              >
                {/* 3D top highlight strip */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: isLeading ? 'linear-gradient(90deg, transparent, rgba(212,160,23,0.6), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                />

                {isLeading && (
                  <div className="absolute top-3 right-3">
                    <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                  </div>
                )}

                {/* Nomor urut badge */}
                <div className="mb-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: isLeading ? 'rgba(212,160,23,0.2)' : 'rgba(255,255,255,0.08)',
                      color: isLeading ? '#D4A017' : 'rgba(255,255,255,0.5)',
                      border: isLeading ? '1px solid rgba(212,160,23,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    No. Urut {c.nomor_urut}
                  </span>
                </div>

                {/* Foto + Nama */}
                <div className="flex items-center gap-3 mb-4">
                  {c.photo_url ? (
                    <img
                      src={c.photo_url}
                      alt={c.full_name}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                      style={{
                        border: isLeading ? '2px solid rgba(212,160,23,0.7)' : '2px solid rgba(255,255,255,0.15)',
                        boxShadow: isLeading ? '0 0 16px rgba(212,160,23,0.4)' : '0 4px 12px rgba(0,0,0,0.4)',
                      }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl font-bold"
                      style={{
                        background: isLeading ? 'linear-gradient(135deg, #D4A017, #a07810)' : 'linear-gradient(135deg, #1e3a6e, #152a55)',
                        color: isLeading ? '#000' : 'rgba(255,255,255,0.5)',
                        boxShadow: isLeading ? '0 0 20px rgba(212,160,23,0.5)' : '0 4px 12px rgba(0,0,0,0.4)',
                        border: isLeading ? '2px solid rgba(212,160,23,0.6)' : '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {c.nomor_urut}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p
                      className="font-heading font-bold text-base leading-tight"
                      style={{ color: isLeading ? '#D4A017' : '#fff' }}
                    >
                      {c.full_name}
                    </p>
                    {isLeading && <p className="text-xs text-yellow-400/70 mt-0.5">● Unggul</p>}
                  </div>
                </div>

                {/* Progress bar 3D */}
                <div
                  className="w-full rounded-full h-3 mb-3 overflow-hidden"
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: isLeading
                        ? 'linear-gradient(90deg, #D4A017, #f0c040)'
                        : 'linear-gradient(90deg, #1e5fd4, #3b82f6)',
                      boxShadow: isLeading ? '0 0 8px rgba(212,160,23,0.6)' : '0 0 8px rgba(59,130,246,0.5)',
                    }}
                  />
                </div>

                {/* Suara count */}
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className="font-heading font-black"
                      style={{
                        fontSize: '2rem',
                        color: isLeading ? '#D4A017' : '#fff',
                        textShadow: isLeading ? '0 0 20px rgba(212,160,23,0.6)' : '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {c.vote_count || 0}
                    </span>
                    <span className="text-white/40 text-xs ml-1">suara</span>
                  </div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: isLeading ? '#D4A017' : 'rgba(255,255,255,0.4)' }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {sortedByNomor.length === 0 && !isLoading && (
          <p className="text-center text-sm text-white/40 py-10">Belum ada kandidat terdaftar</p>
        )}
      </div>
    );
  }

  // ── COMPACT SIDEBAR (sort by suara — posisi dinamis) ─────────────
  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-4"
      style={{
        background: 'linear-gradient(145deg, #0b1829, #0f2040)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span className="font-heading text-sm font-bold text-white">Hasil Sementara</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/30">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="px-4 py-1.5">
        <p className="text-xs text-primary font-medium">Total suara masuk: {totalVotes}</p>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {isLoading && <div className="text-center text-sm text-white/40 py-4">Memuat...</div>}
        {sortedByVote.map((c, idx) => {
          const pct = totalVotes > 0 ? Math.round((c.vote_count || 0) / totalVotes * 100) : 0;
          const isLeading = idx === 0 && (c.vote_count || 0) > 0;
          const rank = idx + 1;

          return (
            <div
              key={c.id}
              className="rounded-xl p-3 transition-all duration-500"
              style={{
                background: isLeading
                  ? 'linear-gradient(135deg, rgba(212,160,23,0.12), rgba(212,160,23,0.05))'
                  : 'rgba(255,255,255,0.04)',
                border: isLeading ? '1px solid rgba(212,160,23,0.3)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isLeading
                  ? '0 4px 16px rgba(212,160,23,0.15), inset 0 1px 0 rgba(212,160,23,0.1)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: rank === 1 ? 'rgba(212,160,23,0.2)' : rank === 2 ? 'rgba(180,180,200,0.15)' : 'rgba(150,100,50,0.15)',
                      color: rank === 1 ? '#D4A017' : rank === 2 ? '#c0c0d0' : '#cd7f32',
                      border: rank === 1 ? '1px solid rgba(212,160,23,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isLeading ? 'text-yellow-400' : 'text-white'}`}>
                      {c.full_name}
                    </p>
                    <p className="text-[10px] text-white/30">No. {c.nomor_urut}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className={`font-heading font-black text-lg leading-none ${isLeading ? 'text-yellow-400' : 'text-white'}`}>
                    {c.vote_count || 0}
                  </span>
                </div>
              </div>

              <div
                className="w-full rounded-full h-2 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: isLeading
                      ? 'linear-gradient(90deg, #D4A017, #f0c040)'
                      : 'linear-gradient(90deg, #1e5fd4, #3b82f6)',
                    boxShadow: isLeading ? '0 0 6px rgba(212,160,23,0.5)' : '0 0 6px rgba(59,130,246,0.4)',
                  }}
                />
              </div>
              <p className="text-right text-[10px] text-white/30 mt-1">{pct}%</p>
            </div>
          );
        })}
        {sortedByVote.length === 0 && !isLoading && (
          <p className="text-center text-sm text-white/40 py-4">Belum ada kandidat</p>
        )}
      </div>
    </div>
  );
}