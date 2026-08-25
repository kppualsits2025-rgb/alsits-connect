import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

const CATEGORIES = ['Berita', 'Reuni', 'Webinar', 'Pengumuman', 'Kegiatan'];

export default function NewsForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    category: item?.category || 'Berita',
    excerpt: item?.excerpt || '',
    content: item?.content || '',
    cover_image: item?.cover_image || '',
    author: item?.author || '',
    published_date: item?.published_date || '',
    is_published: item?.is_published ?? false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: () => item
      ? base44.entities.News.update(item.id, form)
      : base44.entities.News.create(form),
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-heading font-bold text-lg">{item ? 'Edit Berita' : 'Tambah Berita'}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul *</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul berita" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Kategori</label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tanggal Publish</label>
              <Input type="date" value={form.published_date} onChange={e => set('published_date', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Penulis</label>
            <Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Nama penulis" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">URL Cover Image</label>
            <Input value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Ringkasan (Excerpt)</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Ringkasan singkat..."
              rows={2}
              className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Konten Lengkap</label>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="Isi berita lengkap..."
              rows={5}
              className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="publish" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="rounded" />
            <label htmlFor="publish" className="text-sm font-medium">Langsung publish</label>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}>
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
}