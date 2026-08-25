import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

const CATEGORIES = ['Struktur', 'Geoteknik', 'Manajemen Konstruksi', 'Transportasi', 'Hidroteknik', 'Lingkungan', 'Umum'];

export default function ForumForm({ onClose, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Umum',
    author_name: user?.full_name || '',
    author_angkatan: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.ForumPost.create({ ...form, reply_count: 0, is_pinned: false }),
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-heading font-bold text-lg">Buat Topik Diskusi Baru</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul Diskusi *</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Topik yang ingin didiskusikan" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Kategori</label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Isi Diskusi *</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Tuliskan pertanyaan atau sharing Anda..." rows={5} className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Anda</label>
              <Input value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nama" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Angkatan</label>
              <Input value={form.author_angkatan} onChange={e => set('author_angkatan', e.target.value)} placeholder="S32" />
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.content || saveMutation.isPending}>
            {saveMutation.isPending ? 'Memposting...' : 'Posting Diskusi'}
          </Button>
        </div>
      </div>
    </div>
  );
}