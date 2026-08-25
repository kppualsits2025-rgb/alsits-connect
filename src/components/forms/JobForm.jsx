import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

const TYPES = ['Lowongan Kerja', 'Proyek', 'Magang', 'Freelance'];

export default function JobForm({ item, onClose, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: item?.title || '',
    type: item?.type || 'Lowongan Kerja',
    company: item?.company || '',
    location: item?.location || '',
    description: item?.description || '',
    requirements: item?.requirements || '',
    salary_range: item?.salary_range || '',
    contact_email: item?.contact_email || '',
    deadline: item?.deadline || '',
    posted_by_name: item?.posted_by_name || user?.full_name || '',
    posted_by_angkatan: item?.posted_by_angkatan || '',
    is_active: item?.is_active ?? true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: () => item
      ? base44.entities.JobPosting.update(item.id, form)
      : base44.entities.JobPosting.create(form),
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-heading font-bold text-lg">{item ? 'Edit Posting' : 'Tambah Lowongan / Proyek'}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul *</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul posisi / proyek" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tipe</label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Deadline</label>
              <Input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Perusahaan</label>
            <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nama perusahaan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Lokasi</label>
              <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Kota" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Rentang Gaji</label>
              <Input value={form.salary_range} onChange={e => set('salary_range', e.target.value)} placeholder="Rp 10-15 juta" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Deskripsi</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi pekerjaan/proyek..." rows={3} className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Persyaratan</label>
            <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="Persyaratan..." rows={2} className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Diposting oleh</label>
              <Input value={form.posted_by_name} onChange={e => set('posted_by_name', e.target.value)} placeholder="Nama Anda" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Angkatan</label>
              <Input value={form.posted_by_angkatan} onChange={e => set('posted_by_angkatan', e.target.value)} placeholder="S32" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Kontak</label>
            <Input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="email@example.com" />
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}>
            {saveMutation.isPending ? 'Menyimpan...' : 'Posting'}
          </Button>
        </div>
      </div>
    </div>
  );
}