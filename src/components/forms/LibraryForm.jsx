import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

const CATEGORIES = ['Jurnal', 'Skripsi', 'Thesis', 'Disertasi', 'Standar Teknis', 'Modul', 'Lainnya'];

export default function LibraryForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    category: item?.category || 'Jurnal',
    author: item?.author || '',
    year: item?.year || new Date().getFullYear(),
    description: item?.description || '',
    file_url: item?.file_url || '',
    tags: item?.tags || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: () => item
      ? base44.entities.LibraryItem.update(item.id, form)
      : base44.entities.LibraryItem.create(form),
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-heading font-bold text-lg">{item ? 'Edit Dokumen' : 'Tambah Dokumen'}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul *</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul dokumen" />
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
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tahun</label>
              <Input type="number" value={form.year} onChange={e => set('year', parseInt(e.target.value))} placeholder="2024" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Penulis / Pengarang</label>
            <Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Nama penulis" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Deskripsi</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat..." rows={3} className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">URL File / Link Download</label>
            <Input value={form.file_url} onChange={e => set('file_url', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tags (pisah dengan koma)</label>
            <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="struktur, beton, SNI" />
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