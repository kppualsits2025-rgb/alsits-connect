import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, Tag, Save, Loader2, Linkedin, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SelectWithCustom from '@/components/ui/SelectWithCustom';
import { useAuth } from '@/lib/AuthContext';

const GELAR_OPTIONS = ['S1', 'S2', 'S3', 'D3', 'D4', 'Sp1', 'Sp2', 'Prof. Dr.'];
const BIDANG_KEAHLIAN = ['Struktur', 'Geoteknik', 'Manajemen Konstruksi', 'Transportasi', 'Hidroteknik', 'Lingkungan', 'Lainnya'];
const BIDANG_INDUSTRI = ['Konstruksi', 'Konsultan', 'BUMN', 'Pemerintahan', 'Akademisi', 'Wiraswasta', 'Perbankan', 'Energi', 'Teknologi', 'Lainnya'];

export default function AlumniSelfEditModal({ alumni, open, onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null); // { count, fields[] }

  const parseGelar = (g) => {
    if (!g) return ['S1'];
    if (Array.isArray(g)) return g;
    return g.split(',').map(s => s.trim()).filter(Boolean);
  };

  const buildForm = (a) => ({
    jabatan: a?.jabatan || '',
    perusahaan: a?.perusahaan || '',
    domisili_kota: a?.domisili_kota || '',
    bidang_keahlian: a?.bidang_keahlian || '',
    bidang_industri: a?.bidang_industri || '',
    business_tags: a?.business_tags || '',
    linkedin: a?.linkedin || '',
    bio: a?.bio || '',
    gelar_list: parseGelar(a?.gelar),
  });

  const [form, setForm] = useState(() => buildForm(alumni));

  // Sync form setiap kali modal dibuka dengan data alumni terbaru
  useEffect(() => {
    if (open && alumni) {
      setForm(buildForm(alumni));
      setImportResult(null);
    }
  }, [open, alumni?.id]);

  const handleImportLinkedIn = async () => {
    const url = form.linkedin?.trim();
    if (!url || !url.includes('linkedin.com')) {
      toast({ title: 'URL LinkedIn tidak valid', description: 'Isi dulu URL LinkedIn yang benar di field di bawah.', variant: 'destructive' });
      return;
    }
    setImporting(true);
    setImportResult(null);
    try {
      const existing = {
        jabatan: form.jabatan, perusahaan: form.perusahaan,
        domisili_kota: form.domisili_kota, domisili_negara: '',
        bidang_industri: form.bidang_industri, bio: form.bio,
        business_tags: form.business_tags,
      };
      const res = await base44.functions.invoke('importFromLinkedIn', { linkedin_url: url, existing_data: existing });
      const merged = res.data?.merged || {};

      // Map field LinkedIn → form field
      const fieldMap = {
        jabatan: 'jabatan', perusahaan: 'perusahaan',
        domisili_kota: 'domisili_kota', bidang_industri: 'bidang_industri',
        bio: 'bio', business_tags: 'business_tags',
      };
      const filled = [];
      const updates = {};
      for (const [liKey, formKey] of Object.entries(fieldMap)) {
        if (merged[liKey]) {
          updates[formKey] = merged[liKey];
          filled.push(formKey);
        }
      }

      if (filled.length > 0) {
        setForm(f => ({ ...f, ...updates }));
        setImportResult({ count: filled.length, fields: filled });
        toast({ title: `✅ ${filled.length} field diisi dari LinkedIn`, description: 'Field yang sudah berisi data tidak ditimpa.' });
      } else {
        setImportResult({ count: 0, fields: [] });
        toast({ title: 'Semua data sudah lengkap', description: 'Tidak ada field kosong yang perlu diisi dari LinkedIn.' });
      }
    } catch (e) {
      toast({ title: 'Gagal import LinkedIn', description: e.message || 'Coba lagi beberapa saat.', variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const toggleGelar = (g) => {
    setForm(f => {
      const has = f.gelar_list.includes(g);
      if (has && f.gelar_list.length === 1) return f; // minimal 1
      return {
        ...f,
        gelar_list: has ? f.gelar_list.filter(x => x !== g) : [...f.gelar_list, g],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simpan gelar sebagai string utama (gelar pertama) dan tambahan di bio/notes
      const gelarStr = form.gelar_list.join(', ');
      await base44.entities.Alumni.update(alumni.id, {
        jabatan: form.jabatan,
        perusahaan: form.perusahaan,
        domisili_kota: form.domisili_kota,
        bidang_keahlian: form.bidang_keahlian,
        bidang_industri: form.bidang_industri,
        business_tags: form.business_tags,
        linkedin: form.linkedin,
        bio: form.bio,
        gelar: gelarStr,
      });
      queryClient.invalidateQueries({ queryKey: ['all-alumni'] });
      queryClient.invalidateQueries({ queryKey: ['alumni-dpt'] });
      toast({ title: 'Profil berhasil diperbarui ✅', description: 'Data kamu sudah tersimpan.' });
      onClose();
    } catch (e) {
      toast({ title: 'Gagal menyimpan', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!open || !alumni) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            ✏️ Edit Profil Saya
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Perbarui data profil alumni kamu di ALSITS</p>
        </DialogHeader>

        <div className="space-y-5">

          {/* ── GELAR ── */}
          <div>
            <Label className="flex items-center gap-1.5 mb-2 font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" />
              Jenjang Pendidikan
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Pilih semua jenjang yang kamu miliki dari Teknik Sipil ITS</p>
            <div className="flex flex-wrap gap-2">
              {GELAR_OPTIONS.map(g => {
                const active = form.gelar_list.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGelar(g)}
                    className="px-3 py-1.5 rounded-full text-sm font-bold transition-all border"
                    style={{
                      background: active ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
                      borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {g}
                    {active && <span className="ml-1 opacity-70">✓</span>}
                  </button>
                );
              })}
            </div>
            {form.gelar_list.length > 1 && (
              <p className="text-xs text-primary mt-1.5">
                Terpilih: {form.gelar_list.join(' + ')}
              </p>
            )}
          </div>

          {/* ── IMPORT DARI LINKEDIN ── */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-400" />
              <span className="font-heading font-semibold text-sm text-foreground">Sync dari LinkedIn</span>
              <span className="text-xs text-muted-foreground ml-1">— auto-isi field yang masih kosong</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={form.linkedin}
                onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/username-anda"
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImportLinkedIn}
                disabled={importing}
                className="shrink-0 gap-1.5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {importing ? 'Mengambil...' : 'Import'}
              </Button>
            </div>
            {importResult !== null && (
              <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${importResult.count > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                {importResult.count > 0
                  ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  : <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                {importResult.count > 0
                  ? `${importResult.count} field diisi: ${importResult.fields.join(', ')}. Field yang sudah ada tidak diubah.`
                  : 'Tidak ada field baru yang bisa ditambahkan — semua sudah terisi.'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Data yang sudah kamu isi <strong>tidak akan ditimpa</strong>. LinkedIn hanya mengisi field yang masih kosong.
            </p>
          </div>

          {/* ── JABATAN & PERUSAHAAN ── */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Jabatan Saat Ini</Label>
              <Input value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} placeholder="contoh: Senior Engineer" />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Perusahaan / Instansi</Label>
              <Input value={form.perusahaan} onChange={e => setForm(f => ({ ...f, perusahaan: e.target.value }))} placeholder="contoh: PT Waskita Karya" />
            </div>
          </div>

          {/* ── BIDANG ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Bidang Keahlian</Label>
              <SelectWithCustom
                options={BIDANG_KEAHLIAN}
                value={form.bidang_keahlian}
                onChange={v => setForm(f => ({ ...f, bidang_keahlian: v }))}
                placeholder="-- Pilih --"
                isAdmin={isAdmin}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Bidang Industri</Label>
              <SelectWithCustom
                options={BIDANG_INDUSTRI}
                value={form.bidang_industri}
                onChange={v => setForm(f => ({ ...f, bidang_industri: v }))}
                placeholder="-- Pilih --"
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* ── DOMISILI ── */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kota Domisili</Label>
            <Input value={form.domisili_kota} onChange={e => setForm(f => ({ ...f, domisili_kota: e.target.value }))} placeholder="contoh: Surabaya" />
          </div>

          {/* ── BUSINESS TAGS ── */}
          <div>
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5">
              <Tag className="h-3.5 w-3.5 text-yellow-500" />
              Keyword Bisnis / Produk / Layanan
            </Label>
            <Input
              value={form.business_tags}
              onChange={e => setForm(f => ({ ...f, business_tags: e.target.value }))}
              placeholder="contoh: HSD B40, Solar B35, Kontraktor sipil, Material beton"
            />
            <p className="text-xs text-muted-foreground mt-1">Pisahkan dengan koma. Ini membuat profil Anda mudah ditemukan di <strong>Business Hub</strong>.</p>
          </div>

          {/* ── BIO ── */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">Bio / Ringkasan Profil</Label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Ceritakan sedikit tentang dirimu..."
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}