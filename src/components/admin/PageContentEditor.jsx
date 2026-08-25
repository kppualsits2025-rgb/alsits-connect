import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Save, Upload, Plus, Trash2, Image, FileText, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Superscript, Subscript } from 'lucide-react';

const PAGE_TITLES = {
  sejarah: 'Sejarah ALSITS',
  sambutan: 'Sambutan Ketua Umum PP Komjur ALSITS 2025-2030',
  struktur: 'Struktur Organisasi',
  visi_misi: 'Visi & Misi',
  prestasi: 'Prestasi & Karya',
  kontribusi: 'Kontribusi & Kepedulian',
  komunitas_gowes: 'Komunitas Gowes',
  komunitas_golf: 'Komunitas Golf',
  komunitas_jalan_sehat: 'Komunitas Jalan Sehat',
  komunitas_trading: 'Komunitas Trading & Investasi Saham',
};

// Halaman yang punya upload gambar struktur organisasi khusus
const STRUKTUR_PAGES = ['struktur'];

// Simple Rich Text Editor (menghindari masalah ReactQuill di dark mode)
function SimpleRichEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !initialized) {
      editorRef.current.innerHTML = value || '';
      setInitialized(true);
    }
  }, []);

  // Update konten ketika value berubah dari luar (mis: load data dari server)
  useEffect(() => {
    if (editorRef.current && initialized && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, initialized]);

  const execCmd = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL link:');
    if (url) execCmd('createLink', url);
  };

  const Divider = () => <div className="w-px bg-border self-stretch mx-0.5" />;

  const TB = ({ title, onCmd, children, active }) => (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onCmd(); }}
      className={`p-1.5 rounded transition-colors text-foreground ${active ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-secondary/30">

        {/* Font family */}
        <select
          title="Jenis Font"
          onMouseDown={e => e.stopPropagation()}
          onChange={e => { execCmd('fontName', e.target.value); e.target.value = ''; }}
          defaultValue=""
          className="h-7 text-xs rounded bg-secondary border border-border text-foreground px-1 cursor-pointer"
        >
          <option value="" disabled>Font</option>
          {[
            ['Arial', 'Arial'],
            ['Arial Black', 'Arial Black'],
            ['Berlin Sans FB', 'Berlin Sans FB'],
            ['Berlin Sans FB Demi', 'Berlin Sans FB Demi'],
            ['Comic Sans MS', 'Comic Sans MS'],
            ['Courier New', 'Courier New'],
            ['Georgia', 'Georgia'],
            ['Impact', 'Impact'],
            ['Montserrat', 'Montserrat'],
            ['Open Sans', 'Open Sans'],
            ['Showcard Gothic', 'Showcard Gothic'],
            ['Tahoma', 'Tahoma'],
            ['Times New Roman', 'Times New Roman'],
            ['Trebuchet MS', 'Trebuchet MS'],
            ['Verdana', 'Verdana'],
          ].map(([val, label]) => (
            <option key={val} value={val} style={{ fontFamily: val }}>{label}</option>
          ))}
        </select>

        {/* Font size */}
        <select
          title="Ukuran Font"
          onMouseDown={e => e.stopPropagation()}
          onChange={e => { execCmd('fontSize', e.target.value); e.target.value = ''; }}
          defaultValue=""
          className="h-7 text-xs rounded bg-secondary border border-border text-foreground px-1 cursor-pointer"
        >
          <option value="" disabled>Ukuran</option>
          {[1,2,3,4,5,6,7].map(s => <option key={s} value={s}>{[8,10,12,14,18,24,36][s-1]}px</option>)}
        </select>

        <Divider />

        {/* Text style */}
        <TB title="Bold (Ctrl+B)" onCmd={() => execCmd('bold')}><Bold className="w-3.5 h-3.5" /></TB>
        <TB title="Italic (Ctrl+I)" onCmd={() => execCmd('italic')}><Italic className="w-3.5 h-3.5" /></TB>
        <TB title="Underline (Ctrl+U)" onCmd={() => execCmd('underline')}><Underline className="w-3.5 h-3.5" /></TB>
        <TB title="Strikethrough" onCmd={() => execCmd('strikeThrough')}><Strikethrough className="w-3.5 h-3.5" /></TB>
        <TB title="Superscript" onCmd={() => execCmd('superscript')}><Superscript className="w-3.5 h-3.5" /></TB>
        <TB title="Subscript" onCmd={() => execCmd('subscript')}><Subscript className="w-3.5 h-3.5" /></TB>

        <Divider />

        {/* Alignment */}
        <TB title="Rata Kiri" onCmd={() => execCmd('justifyLeft')}><AlignLeft className="w-3.5 h-3.5" /></TB>
        <TB title="Rata Tengah" onCmd={() => execCmd('justifyCenter')}><AlignCenter className="w-3.5 h-3.5" /></TB>
        <TB title="Rata Kanan" onCmd={() => execCmd('justifyRight')}><AlignRight className="w-3.5 h-3.5" /></TB>
        <TB title="Rata Penuh" onCmd={() => execCmd('justifyFull')}><AlignJustify className="w-3.5 h-3.5" /></TB>

        <Divider />

        {/* Lists */}
        <TB title="Bullet List" onCmd={() => execCmd('insertUnorderedList')}><List className="w-3.5 h-3.5" /></TB>
        <TB title="Numbered List" onCmd={() => execCmd('insertOrderedList')}><ListOrdered className="w-3.5 h-3.5" /></TB>
        <TB title="Indent" onCmd={() => execCmd('indent')}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><polyline points="3 9 6 12 3 15"/></svg>
        </TB>
        <TB title="Outdent" onCmd={() => execCmd('outdent')}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><polyline points="7 9 4 12 7 15"/></svg>
        </TB>

        <Divider />

        {/* Link */}
        <TB title="Insert Link" onCmd={insertLink}><LinkIcon className="w-3.5 h-3.5" /></TB>
        <TB title="Hapus Format" onCmd={() => execCmd('removeFormat')}>
          <span className="text-xs font-bold px-0.5">Tx</span>
        </TB>

        <Divider />

        {/* Heading blocks */}
        {[['H2','H2'],['H3','H3'],['P','¶']].map(([tag, label]) => (
          <button key={tag} title={tag} onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', tag); }}
            className="px-2 py-1 rounded hover:bg-secondary text-foreground text-xs font-bold transition-colors">
            {label}
          </button>
        ))}

        <Divider />

        {/* Text color */}
        <label title="Warna Teks" className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-secondary">
          <span className="text-xs font-bold text-foreground">A</span>
          <input type="color" defaultValue="#ffffff"
            onChange={e => execCmd('foreColor', e.target.value)}
            className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0 bg-transparent"
            style={{ appearance: 'none' }}
          />
        </label>

        {/* Highlight color */}
        <label title="Warna Background" className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-secondary">
          <span className="text-xs font-bold text-foreground" style={{ textDecoration: 'underline', textDecorationColor: '#ffff00', textDecorationThickness: '3px' }}>A</span>
          <input type="color" defaultValue="#ffff00"
            onChange={e => execCmd('hiliteColor', e.target.value)}
            className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0 bg-transparent"
            style={{ appearance: 'none' }}
          />
        </label>

      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onBlur={triggerChange}
        data-placeholder={placeholder || 'Tulis konten di sini...'}
        className="min-h-[200px] p-4 outline-none text-foreground bg-background text-sm leading-relaxed"
        style={{
          fontFamily: 'Open Sans, sans-serif',
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 1.25rem; font-weight: 700; margin: 0.75rem 0 0.5rem; }
        [contenteditable] h3 { font-size: 1rem; font-weight: 700; margin: 0.5rem 0 0.25rem; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] a { color: hsl(var(--primary)); text-decoration: underline; }
        [contenteditable] p { margin: 0.25rem 0; }
      `}</style>
    </div>
  );
}

// Upload image helper component
function ImageUploader({ label, value, onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="flex gap-3 items-start flex-wrap">
        {value && (
          <div className="relative group">
            <img src={value} alt={label} className="h-28 w-auto rounded-lg border border-border object-contain bg-secondary/20" />
            <button onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              ×
            </button>
          </div>
        )}
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
            <Image className="w-4 h-4" />
            {uploading ? 'Mengunggah...' : (value ? 'Ganti Gambar' : 'Upload Gambar')}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

export default function PageContentEditor({ pageKey, label }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: PAGE_TITLES[pageKey] || '',
    subtitle: '',
    content: '',
    cover_image: '',
    video_url: '',
    gallery: '[]',
    extra_data: '{}',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const { data: pages = [] } = useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: () => base44.entities.PageContent.filter({ page_key: pageKey }),
  });

  const existing = pages[0];

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || PAGE_TITLES[pageKey] || '',
        subtitle: existing.subtitle || '',
        content: existing.content || '',
        cover_image: existing.cover_image || '',
        video_url: existing.video_url || '',
        gallery: existing.gallery || '[]',
        extra_data: existing.extra_data || '{}',
      });
    }
  }, [existing]);

  let gallery = [];
  try { gallery = JSON.parse(form.gallery); } catch {}

  let extraData = {};
  try { extraData = JSON.parse(form.extra_data); } catch {}

  const updateExtra = (key, val) => {
    const updated = { ...extraData, [key]: val };
    setForm(f => ({ ...f, extra_data: JSON.stringify(updated) }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, page_key: pageKey };
    if (existing) {
      await base44.entities.PageContent.update(existing.id, data);
    } else {
      await base44.entities.PageContent.create(data);
    }
    qc.invalidateQueries({ queryKey: ['page-content', pageKey] });
    toast({ title: 'Tersimpan!', description: `Konten "${label}" berhasil disimpan.` });
    setSaving(false);
  };

  const uploadGalleryImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingGallery(true);
    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    const updated = [...gallery, ...urls];
    setForm(f => ({ ...f, gallery: JSON.stringify(updated) }));
    setUploadingGallery(false);
  };

  const removeGalleryImage = (idx) => {
    const updated = gallery.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, gallery: JSON.stringify(updated) }));
  };

  const isStruktur = STRUKTUR_PAGES.includes(pageKey);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {label} — Editor Konten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Judul & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Judul Halaman</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Judul..." />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle / Tagline</Label>
              <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Tagline singkat..." />
            </div>
          </div>

          {/* Cover Image */}
          <ImageUploader
            label="Gambar Cover"
            value={form.cover_image}
            onChange={url => setForm(f => ({ ...f, cover_image: url }))}
            hint="Gambar banner/header halaman ini"
          />

          {/* Khusus: Struktur Organisasi */}
          {isStruktur && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
              <p className="text-sm font-bold text-primary font-heading flex items-center gap-2">
                <Image className="w-4 h-4" /> Upload Bagan Struktur Organisasi
              </p>
              <ImageUploader
                label="Gambar Struktur Organisasi"
                value={extraData.struktur_image || ''}
                onChange={url => updateExtra('struktur_image', url)}
                hint="Upload bagan/chart struktur organisasi (PNG, JPG). Akan ditampilkan besar di halaman."
              />
              <div className="space-y-1.5">
                <Label>Keterangan / Deskripsi Struktur</Label>
                <Textarea
                  value={extraData.struktur_keterangan || ''}
                  onChange={e => updateExtra('struktur_keterangan', e.target.value)}
                  placeholder="Tuliskan keterangan struktur organisasi, misalnya: Susunan Pengurus PP ALSITS 2025-2030..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {/* Video URL */}
          <div className="space-y-1.5">
            <Label>URL Video (YouTube embed / link)</Label>
            <Input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          {/* Main content — Simple Rich Editor */}
          <div className="space-y-1.5">
            <Label>Konten Utama</Label>
            <p className="text-xs text-muted-foreground">
              {isStruktur
                ? 'Tuliskan narasi/uraian tambahan tentang organisasi, tugas, dll.'
                : 'Tulis konten utama halaman ini. Gunakan toolbar untuk format teks.'}
            </p>
            <SimpleRichEditor
              value={form.content}
              onChange={val => setForm(f => ({ ...f, content: val }))}
              placeholder={isStruktur ? 'Narasi tambahan tentang organisasi...' : 'Tulis konten di sini...'}
            />
          </div>

          {/* Galeri Foto */}
          <div className="space-y-2">
            <Label>Galeri Foto</Label>
            <p className="text-xs text-muted-foreground">Upload foto-foto pendukung (bisa lebih dari satu)</p>
            <label className="cursor-pointer inline-block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                <Plus className="w-4 h-4" />
                {uploadingGallery ? 'Mengunggah...' : 'Tambah Foto Galeri'}
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={uploadGalleryImage} disabled={uploadingGallery} />
            </label>
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                {gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`gallery ${i}`} className="w-full aspect-square object-cover rounded-lg border border-border" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Konten'}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}