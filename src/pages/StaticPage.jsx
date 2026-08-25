import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAGE_META = {
  sejarah: { title: 'Sejarah ALSITS', icon: '📜', subtitle: 'Perjalanan panjang Alumni Sipil ITS' },
  sambutan: { title: 'Sambutan Ketua Umum', icon: '🎙️', subtitle: 'PP Komjur ALSITS 2025 – 2030' },
  struktur: { title: 'Struktur Organisasi', icon: '🏛️', subtitle: 'Kepengurusan PP Komjur ALSITS' },
  visi_misi: { title: 'Visi & Misi', icon: '🎯', subtitle: 'Arah dan tujuan ALSITS' },
  prestasi: { title: 'Prestasi & Karya', icon: '🏆', subtitle: 'Pencapaian alumni Sipil ITS' },
  kontribusi: { title: 'Kontribusi & Kepedulian', icon: '🤝', subtitle: 'Peran alumni untuk bangsa dan lingkungan' },
  komunitas_gowes: { title: 'Komunitas Gowes', icon: '🚴', subtitle: 'Bersepeda bersama alumni Sipil ITS' },
  komunitas_golf: { title: 'Komunitas Golf', icon: '⛳', subtitle: 'Golf alumni Sipil ITS' },
  komunitas_jalan_sehat: { title: 'Komunitas Jalan Sehat', icon: '🏃', subtitle: 'Sehat bersama alumni Sipil ITS' },
  komunitas_trading: { title: 'Komunitas Trading & Investasi', icon: '📈', subtitle: 'Diskusi saham & investasi alumni Sipil ITS' },
};

export default function StaticPage({ pageKey }) {
  const meta = PAGE_META[pageKey] || { title: pageKey, icon: '📄', subtitle: '' };
  const [lightbox, setLightbox] = useState(null); // index of opened image

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: () => base44.entities.PageContent.filter({ page_key: pageKey }),
    retry: 2,
  });

  const page = pages[0];

  // Bersihkan HTML dari Angular attributes (_ngcontent-*, etc.)
  const cleanHtml = (html) => {
    if (!html) return html;
    return html.replace(/ _ng[a-z-]+-[a-z0-9]+=""/gi, '').replace(/ _ng[a-z-]+-[a-z0-9]+/gi, '');
  };

  let gallery = [];
  try { gallery = page?.gallery ? JSON.parse(page.gallery) : []; } catch {}

  let extraData = {};
  try { extraData = page?.extra_data ? JSON.parse(page.extra_data) : {}; } catch {}

  return (
    <div className="min-h-screen bg-background">
      {/* Mini Navbar */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderBottom: '3px solid #D4A017' }}>
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
      {/* Hero */}
      <div
        className="relative w-full py-16 px-4 text-center"
        style={{
          background: page?.cover_image
            ? `linear-gradient(rgba(10,22,40,0.75), rgba(10,22,40,0.92)), url(${page.cover_image}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)',
          borderBottom: '3px solid #D4A017',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-3">{meta.icon}</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
            {page?.title || meta.title}
          </h1>
          <p className="text-white/60 text-sm md:text-base">{page?.subtitle || meta.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : !page ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏗️</div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Konten Segera Hadir</h2>
            <p className="text-muted-foreground">Halaman ini sedang dalam penyusunan oleh pengurus ALSITS.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Video */}
            {page.video_url && (
              <div className="aspect-video rounded-xl overflow-hidden border border-border">
                <iframe
                  src={page.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={page.title}
                />
              </div>
            )}

            {/* Khusus: Struktur Organisasi */}
            {pageKey === 'struktur' && extraData.struktur_image && (
              <div className="space-y-4">
                <img
                  src={extraData.struktur_image}
                  alt="Struktur Organisasi"
                  className="w-full rounded-xl border border-border shadow-lg"
                />
                {extraData.struktur_keterangan && (
                  <p className="text-sm text-muted-foreground italic text-center">{extraData.struktur_keterangan}</p>
                )}
              </div>
            )}

            {/* Main content */}
            {page.content && (
              <div
                className="prose prose-invert max-w-none text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}
              />
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Galeri Foto</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Galeri ${i + 1}`}
                      onClick={() => setLightbox(i)}
                      className="rounded-xl object-cover w-full aspect-square border border-border hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {lightbox !== null && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
                onClick={() => setLightbox(null)}
              >
                {/* Close */}
                <button
                  className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition"
                  onClick={() => setLightbox(null)}
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Prev */}
                {gallery.length > 1 && (
                  <button
                    className="absolute left-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition"
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>
                )}

                {/* Image */}
                <img
                  src={gallery[lightbox]}
                  alt={`Galeri ${lightbox + 1}`}
                  className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
                  onClick={e => e.stopPropagation()}
                />

                {/* Next */}
                {gallery.length > 1 && (
                  <button
                    className="absolute right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition"
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 text-white/60 text-sm">{lightbox + 1} / {gallery.length}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}