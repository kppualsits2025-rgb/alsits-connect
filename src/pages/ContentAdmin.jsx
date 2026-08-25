import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContentEditor from '@/components/admin/PageContentEditor';
import EventsAdmin from '@/components/admin/EventsAdmin';

const PAGE_SECTIONS = [
  { key: 'sejarah', label: '📜 Sejarah' },
  { key: 'sambutan', label: '🎙️ Sambutan Ketua' },
  { key: 'struktur', label: '🏛️ Struktur Org' },
  { key: 'visi_misi', label: '🎯 Visi & Misi' },
  { key: 'prestasi', label: '🏆 Prestasi & Karya' },
  { key: 'kontribusi', label: '🤝 Kontribusi' },
  { key: 'komunitas_gowes', label: '🚴 Gowes' },
  { key: 'komunitas_golf', label: '⛳ Golf' },
  { key: 'komunitas_jalan_sehat', label: '🏃 Jalan Sehat' },
  { key: 'komunitas_trading', label: '📈 Trading' },
];

export default function ContentAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full py-8 px-4" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 60%, #0a1628 100%)', borderBottom: '3px solid #D4A017' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-2xl font-bold text-white mb-1">⚙️ Admin — Manajemen Konten</h1>
          <p className="text-white/60 text-sm">Kelola halaman statis, event, dan komunitas ALSITS</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="sejarah">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex w-max gap-1 bg-card border border-border p-1 rounded-xl mb-6">
              {PAGE_SECTIONS.map(s => (
                <TabsTrigger key={s.key} value={s.key} className="text-xs whitespace-nowrap">
                  {s.label}
                </TabsTrigger>
              ))}
              <TabsTrigger value="events" className="text-xs whitespace-nowrap">🎉 Events</TabsTrigger>
            </TabsList>
          </div>

          {PAGE_SECTIONS.map(s => (
            <TabsContent key={s.key} value={s.key}>
              <PageContentEditor pageKey={s.key} label={s.label} />
            </TabsContent>
          ))}

          <TabsContent value="events">
            <EventsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}