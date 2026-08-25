import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, Play, ChevronDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import EventDetailModal from '@/components/events/EventDetailModal';

// Generate angkatan S1 - S60
const ANGKATAN_LIST = Array.from({ length: 60 }, (_, i) => `S${i + 1}`);

const KOMUNITAS_LIST = [
  { label: 'Gowes', path: '/komunitas/gowes', icon: '🚴' },
  { label: 'Golf', path: '/komunitas/golf', icon: '⛳' },
  { label: 'Jalan Sehat', path: '/komunitas/jalan-sehat', icon: '🏃' },
  { label: 'Trading & Saham', path: '/komunitas/trading', icon: '📈' },
];

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua');
  const [angkatanOpen, setAngkatanOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['alsits-events'],
    queryFn: () => base44.entities.AlsitsEvent.filter({ is_published: true }, '-event_date'),
  });

  const filtered = useMemo(() => events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location || '').toLowerCase().includes(search.toLowerCase());

    let matchCat = true;
    if (category === 'ALSITS') matchCat = e.category === 'ALSITS';
    else if (category === 'Angkatan') matchCat = e.category === 'Angkatan';
    else if (category === 'Komunitas') matchCat = e.category === 'Komunitas';

    const matchAngkatan = (category !== 'Angkatan') || selectedAngkatan === 'Semua' || e.angkatan === selectedAngkatan;

    return matchSearch && matchCat && matchAngkatan;
  }), [events, search, category, selectedAngkatan]);

  const catColors = {
    ALSITS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Angkatan: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Komunitas: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  // Angkatan yang benar-benar ada eventnya
  const availableAngkatan = useMemo(() => {
    const set = new Set(events.filter(e => e.category === 'Angkatan' && e.angkatan).map(e => e.angkatan));
    return ANGKATAN_LIST.filter(a => set.has(a));
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full py-12 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderBottom: '3px solid #D4A017' }}>
        <div className="text-4xl mb-3">🎉</div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Kegiatan & Event</h1>
        <p className="text-white/60 text-sm">Dokumentasi kegiatan ALSITS, angkatan, dan komunitas alumni Sipil ITS</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kegiatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {/* Semua */}
            <Button size="sm" variant={category === 'Semua' ? 'default' : 'outline'} onClick={() => setCategory('Semua')}>
              Semua
            </Button>
            {/* ALSITS */}
            <Button size="sm" variant={category === 'ALSITS' ? 'default' : 'outline'} onClick={() => setCategory('ALSITS')}>
              ALSITS
            </Button>

            {/* Angkatan + dropdown */}
            <div className="relative">
              <Button
                size="sm"
                variant={category === 'Angkatan' ? 'default' : 'outline'}
                className="gap-1.5"
                onClick={() => { setCategory('Angkatan'); setAngkatanOpen(o => !o); }}
              >
                {category === 'Angkatan' && selectedAngkatan !== 'Semua' ? selectedAngkatan : 'Angkatan'}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              {angkatanOpen && category === 'Angkatan' && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-40">
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      className={`w-full text-left text-sm px-4 py-2 hover:bg-secondary transition-colors ${selectedAngkatan === 'Semua' ? 'text-primary font-bold bg-primary/10' : 'text-foreground'}`}
                      onClick={() => { setSelectedAngkatan('Semua'); setAngkatanOpen(false); }}
                    >
                      Semua Angkatan
                    </button>
                    {availableAngkatan.length > 0 ? availableAngkatan.map(a => (
                      <button
                        key={a}
                        className={`w-full text-left text-sm px-4 py-2 hover:bg-secondary transition-colors ${selectedAngkatan === a ? 'text-primary font-bold bg-primary/10' : 'text-foreground'}`}
                        onClick={() => { setSelectedAngkatan(a); setAngkatanOpen(false); }}
                      >
                        {a}
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-xs text-muted-foreground">Belum ada event angkatan</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Komunitas */}
            <Button size="sm" variant={category === 'Komunitas' ? 'default' : 'outline'} onClick={() => setCategory('Komunitas')}>
              Komunitas
            </Button>
          </div>
        </div>

        {/* Komunitas panel — link ke halaman komunitas */}
        {category === 'Komunitas' && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm text-green-300 font-semibold mb-3 font-heading">Komunitas ALSITS — Klik untuk melihat halaman komunitas:</p>
            <div className="flex flex-wrap gap-3">
              {KOMUNITAS_LIST.map(k => (
                <Link
                  key={k.path}
                  to={k.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', textDecoration: 'none' }}
                >
                  <span>{k.icon}</span>
                  {k.label}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-muted-foreground">
              {category === 'Komunitas'
                ? 'Belum ada event komunitas. Kunjungi halaman komunitas di atas.'
                : 'Belum ada kegiatan yang dipublikasikan.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {event.cover_image ? (
                    <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎉</div>
                  )}
                  {event.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${catColors[event.category] || ''}`}>
                      {event.category}{event.angkatan ? ` ${event.angkatan}` : ''}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {event.event_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(event.event_date), 'd MMMM yyyy', { locale: id })}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Click di luar untuk tutup dropdown */}
        {angkatanOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setAngkatanOpen(false)} />
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}