import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center" onClick={onClose}>
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="relative flex items-center justify-center w-full h-full p-4 md:p-16" onClick={e => e.stopPropagation()}>
        {images.length > 1 && (
          <button
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
            onClick={prev}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        <img
          src={images[current]}
          alt={`Galeri ${current + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        />

        {images.length > 1 && (
          <button
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
            onClick={next}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-6 right-6 text-white/50 text-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

export default function EventDetailModal({ event, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!event) return null;

  let gallery = [];
  try { gallery = event.gallery ? JSON.parse(event.gallery) : []; } catch {}

  const catColors = {
    ALSITS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Angkatan: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Komunitas: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl border border-border bg-card" style={{ maxHeight: '92vh' }}>
          {/* Cover image — full width, tidak terpotong */}
          {event.cover_image && (
            <div className="w-full bg-black flex items-center justify-center" style={{ maxHeight: '45vh', overflow: 'hidden' }}>
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '45vh' }}
              />
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: event.cover_image ? 'calc(92vh - 45vh)' : '92vh' }}>
            <div className="p-6 space-y-5">
              {/* Judul & badge */}
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mb-2 inline-block ${catColors[event.category] || ''}`}>
                    {event.category}{event.angkatan ? ` ${event.angkatan}` : ''}
                  </span>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground leading-snug">{event.title}</h2>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {event.event_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(event.event_date), 'd MMMM yyyy', { locale: id })}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                )}
              </div>

              {/* Video */}
              {event.video_url && (
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={event.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={event.title}
                  />
                </div>
              )}

              {/* Deskripsi */}
              {event.description && (
                <div
                  className="prose prose-invert max-w-none text-sm text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              )}

              {/* Galeri — grid penuh, semua gambar tampil, klik untuk lightbox */}
              {gallery.length > 0 && (
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                    Galeri Foto ({gallery.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map((url, i) => (
                      <div
                        key={i}
                        className="relative cursor-pointer rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:scale-[1.02] transition-all group"
                        style={{ aspectRatio: '4/3' }}
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img
                          src={url}
                          alt={`Galeri ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full transition-opacity">
                            Lihat
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {lightboxIndex !== null && (
        <Lightbox
          images={gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}