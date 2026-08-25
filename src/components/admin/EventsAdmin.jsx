import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactQuill from 'react-quill';
import { Plus, Pencil, Trash2, Upload, Eye, EyeOff, Save, X } from 'lucide-react';
import { format } from 'date-fns';

const EMPTY_FORM = {
  title: '', category: 'ALSITS', angkatan: '', description: '',
  cover_image: '', gallery: '[]', video_url: '', event_date: '', location: '',
  is_published: true, source_url: '',
};

export default function EventsAdmin() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ['alsits-events-admin'],
    queryFn: () => base44.entities.AlsitsEvent.list('-event_date'),
  });

  let gallery = [];
  try { gallery = JSON.parse(form.gallery); } catch {}

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (ev) => {
    setForm({
      title: ev.title || '', category: ev.category || 'ALSITS', angkatan: ev.angkatan || '',
      description: ev.description || '', cover_image: ev.cover_image || '',
      gallery: ev.gallery || '[]', video_url: ev.video_url || '',
      event_date: ev.event_date || '', location: ev.location || '',
      is_published: ev.is_published !== false, source_url: ev.source_url || '',
    });
    setEditId(ev.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) return toast({ title: 'Judul wajib diisi', variant: 'destructive' });
    setSaving(true);
    if (editId) {
      await base44.entities.AlsitsEvent.update(editId, form);
    } else {
      await base44.entities.AlsitsEvent.create(form);
    }
    qc.invalidateQueries({ queryKey: ['alsits-events-admin'] });
    qc.invalidateQueries({ queryKey: ['alsits-events'] });
    toast({ title: editId ? 'Event diperbarui!' : 'Event ditambahkan!' });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus event ini?')) return;
    await base44.entities.AlsitsEvent.delete(id);
    qc.invalidateQueries({ queryKey: ['alsits-events-admin'] });
    qc.invalidateQueries({ queryKey: ['alsits-events'] });
    toast({ title: 'Event dihapus.' });
  };

  const togglePublish = async (ev) => {
    await base44.entities.AlsitsEvent.update(ev.id, { is_published: !ev.is_published });
    qc.invalidateQueries({ queryKey: ['alsits-events-admin'] });
    qc.invalidateQueries({ queryKey: ['alsits-events'] });
  };

  const uploadCover = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingCover(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, cover_image: file_url }));
    setUploadingCover(false);
  };

  const uploadGallery = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploadingGallery(true);
    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    const updated = [...gallery, ...urls];
    setForm(f => ({ ...f, gallery: JSON.stringify(updated) }));
    setUploadingGallery(false);
  };

  const removeGallery = (idx) => {
    const updated = gallery.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, gallery: JSON.stringify(updated) }));
  };

  const catColors = {
    ALSITS: 'bg-blue-500/20 text-blue-300', Angkatan: 'bg-yellow-500/20 text-yellow-300', Komunitas: 'bg-green-500/20 text-green-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">🎉 Manajemen Events</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Tambah Event</Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-heading text-base">{editId ? 'Edit Event' : 'Tambah Event Baru'}</CardTitle>
            <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Judul Event *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nama kegiatan..." />
              </div>
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALSITS">ALSITS (Organisasi)</SelectItem>
                    <SelectItem value="Angkatan">Angkatan</SelectItem>
                    <SelectItem value="Komunitas">Komunitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.category === 'Angkatan' && (
                <div className="space-y-1.5">
                  <Label>Kode Angkatan</Label>
                  <Input value={form.angkatan} onChange={e => setForm(f => ({ ...f, angkatan: e.target.value }))} placeholder="S32, S33, ..." />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Tanggal Pelaksanaan</Label>
                <Input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Lokasi</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Kota / Venue..." />
              </div>
              <div className="space-y-1.5">
                <Label>URL Video (YouTube)</Label>
                <Input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="space-y-1.5">
                <Label>URL Sumber (web angkatan, dll)</Label>
                <Input value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="https://s32its.id/..." />
              </div>
            </div>

            {/* Cover */}
            <div className="space-y-2">
              <Label>Gambar Cover</Label>
              <div className="flex gap-3 items-start">
                {form.cover_image && <img src={form.cover_image} alt="cover" className="w-28 h-16 object-cover rounded-lg border border-border" />}
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                    <Upload className="w-3.5 h-3.5" />{uploadingCover ? 'Mengunggah...' : 'Upload Cover'}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={uploadingCover} />
                </label>
                {form.cover_image && <Button size="sm" variant="ghost" className="text-destructive h-8 w-8 p-0" onClick={() => setForm(f => ({ ...f, cover_image: '' }))}><Trash2 className="w-3.5 h-3.5" /></Button>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Deskripsi Kegiatan</Label>
              <div className="rounded-lg overflow-hidden border border-border">
                <ReactQuill theme="snow" value={form.description} onChange={val => setForm(f => ({ ...f, description: val }))} style={{ minHeight: 200 }} />
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <Label>Galeri Foto</Label>
              <label className="cursor-pointer inline-block">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                  <Plus className="w-3.5 h-3.5" />{uploadingGallery ? 'Mengunggah...' : 'Tambah Foto Galeri'}
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={uploadGallery} disabled={uploadingGallery} />
              </label>
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                  {gallery.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-border" />
                      <button onClick={() => removeGallery(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />{saving ? 'Menyimpan...' : 'Simpan Event'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Belum ada event. Klik "Tambah Event" untuk memulai.</div>
        )}
        {events.map(ev => (
          <div key={ev.id} className={`flex items-center gap-4 p-4 rounded-xl border ${ev.is_published ? 'border-border bg-card' : 'border-border/50 bg-card/50 opacity-60'}`}>
            {ev.cover_image ? (
              <img src={ev.cover_image} alt={ev.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">🎉</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColors[ev.category] || ''}`}>
                  {ev.category}{ev.angkatan ? ` ${ev.angkatan}` : ''}
                </span>
                {!ev.is_published && <span className="text-xs text-muted-foreground italic">Draft</span>}
              </div>
              <p className="font-heading font-semibold text-sm text-foreground truncate">{ev.title}</p>
              {ev.event_date && (
                <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(ev.event_date), 'd MMM yyyy')}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => togglePublish(ev)} title={ev.is_published ? 'Sembunyikan' : 'Publikasikan'}>
                {ev.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(ev)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(ev.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}