import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Upload, Plus, Trash2, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BIDANG_KEAHLIAN = ['Struktur', 'Geoteknik', 'Manajemen Konstruksi', 'Transportasi', 'Hidroteknik', 'Lingkungan', 'Lainnya'];
const BIDANG_INDUSTRI = ['Konstruksi', 'Konsultan', 'BUMN', 'Pemerintahan', 'Akademisi', 'Wiraswasta', 'Perbankan', 'Energi', 'Teknologi', 'Lainnya'];
const GELAR = ['S1', 'S2', 'S3'];
const STATUS_OPTIONS = ['Aktif', 'Almarhum', 'Almarhumah'];
const KATEGORI_USAHA = ['Perdagangan', 'Manufaktur', 'Konstruksi', 'Konsultan', 'Teknologi', 'Kuliner', 'Properti', 'Pendidikan', 'Kesehatan', 'Transportasi & Logistik', 'Keuangan & Investasi', 'Energi', 'Pertanian & Perkebunan', 'Jasa Profesional', 'Lainnya'];

const EMPTY_USAHA = {
  nama_usaha: '',
  peran_jabatan: '',
  kategori: '',
  deskripsi: '',
  alamat: '',
  kota: '',
  telepon: '',
  email: '',
  website: '',
  foto_url: '',
};

const EMPTY = {
  full_name: '',
  nrm_nrp: '',
  angkatan: '',
  tahun_masuk: '',
  tahun_lulus: '',
  gelar: 'S1',
  bidang_keahlian: '',
  domisili_kota: '',
  domisili_negara: 'Indonesia',
  perusahaan: '',
  jabatan: '',
  company_city: '',
  bidang_industri: '',
  business_tags: '',
  email: '',
  email2: '',
  telepon: '',
  telepon2: '',
  telepon_kantor: '',
  alamat_perusahaan: '',
  linkedin: '',
  photo_url: '',
  bio: '',
  status: 'Aktif',
  tanggal_lahir: '',
  is_verified: false,
  source_web: 'manual-admin',
};

function Field({ label, required, children }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function parseUsaha(raw) {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export default function AlumniManualForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY });
  const [usahaList, setUsahaList] = useState(() => parseUsaha(item?.kegiatan_usaha));
  const [expandedUsaha, setExpandedUsaha] = useState(null);
  const [uploadingUsaha, setUploadingUsaha] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setForm(item ? { ...item } : { ...EMPTY });
    setUsahaList(parseUsaha(item?.kegiatan_usaha));
    setExpandedUsaha(null);
  }, [item]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('photo_url', file_url);
    setUploading(false);
  };

  // Usaha helpers
  const addUsaha = () => {
    const newList = [...usahaList, { ...EMPTY_USAHA }];
    setUsahaList(newList);
    setExpandedUsaha(newList.length - 1);
  };
  const removeUsaha = (i) => {
    setUsahaList(u => u.filter((_, j) => j !== i));
    setExpandedUsaha(null);
  };
  const setUsaha = (i, k, v) => setUsahaList(u => u.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const handleUsahaFotoUpload = async (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingUsaha(i);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUsaha(i, 'foto_url', file_url);
    setUploadingUsaha(null);
  };

  // Sync business_tags & perusahaan from usaha list for BusinessHub compatibility
  const buildPayload = () => {
    const payload = { ...form };
    if (payload.tahun_masuk) payload.tahun_masuk = Number(payload.tahun_masuk);
    if (payload.tahun_lulus) payload.tahun_lulus = Number(payload.tahun_lulus);
    payload.kegiatan_usaha = usahaList.length ? JSON.stringify(usahaList) : '';
    // Auto-populate perusahaan & company_city from first usaha if not set
    if (!payload.perusahaan && usahaList[0]?.nama_usaha) payload.perusahaan = usahaList[0].nama_usaha;
    if (!payload.jabatan && usahaList[0]?.peran_jabatan) payload.jabatan = usahaList[0].peran_jabatan;
    if (!payload.company_city && usahaList[0]?.kota) payload.company_city = usahaList[0].kota;
    if (!payload.bidang_industri && usahaList[0]?.kategori) payload.bidang_industri = usahaList[0].kategori;
    // Merge business_tags from all usaha categories
    const tags = usahaList.map(u => [u.kategori, u.nama_usaha].filter(Boolean).join(', ')).filter(Boolean);
    if (tags.length && !payload.business_tags) payload.business_tags = tags.join(', ');
    return payload;
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) { toast({ title: 'Nama lengkap wajib diisi', variant: 'destructive' }); return; }
    if (!form.angkatan.trim()) { toast({ title: 'Kode angkatan wajib diisi', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = buildPayload();
    if (item?.id) {
      await base44.entities.Alumni.update(item.id, payload);
      toast({ title: 'Data alumni diperbarui' });
    } else {
      await base44.entities.Alumni.create(payload);
      toast({ title: 'Data alumni berhasil ditambahkan' });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-6 px-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10 rounded-t-xl">
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">
              {item ? 'Edit Data Alumni' : 'Tambah Alumni Manual'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Untuk anggota yang tidak memiliki web angkatan</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>

        <div className="p-6 space-y-6">
          {/* === IDENTITAS DASAR === */}
          <section>
            <h3 className="font-heading font-semibold text-sm text-primary mb-3 uppercase tracking-wide">Identitas Dasar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nama Lengkap" required>
                <Input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Contoh: Budi Santoso" />
              </Field>
              <Field label="NRM / NRP">
                <Input value={form.nrm_nrp} onChange={e => set('nrm_nrp', e.target.value)} placeholder="Nomor Registrasi Mahasiswa" />
              </Field>
              <Field label="Kode Angkatan" required>
                <Input value={form.angkatan} onChange={e => set('angkatan', e.target.value)} placeholder="Contoh: S35, S48, S60" />
              </Field>
              <Field label="Gelar">
                <Select value={form.gelar} onValueChange={v => set('gelar', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GELAR.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Tahun Masuk">
                <Input type="number" value={form.tahun_masuk} onChange={e => set('tahun_masuk', e.target.value)} placeholder="Contoh: 2005" />
              </Field>
              <Field label="Tahun Lulus">
                <Input type="number" value={form.tahun_lulus} onChange={e => set('tahun_lulus', e.target.value)} placeholder="Contoh: 2009" />
              </Field>
              <Field label="Bidang Keahlian">
                <Select value={form.bidang_keahlian || ''} onValueChange={v => set('bidang_keahlian', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih bidang..." /></SelectTrigger>
                  <SelectContent>{BIDANG_KEAHLIAN.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select value={form.status || 'Aktif'} onValueChange={v => set('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Tanggal Lahir">
                <Input type="date" value={form.tanggal_lahir || ''} onChange={e => set('tanggal_lahir', e.target.value)} />
              </Field>
            </div>
          </section>

          {/* === DOMISILI === */}
          <section>
            <h3 className="font-heading font-semibold text-sm text-primary mb-3 uppercase tracking-wide">Domisili</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kota Domisili">
                <Input value={form.domisili_kota} onChange={e => set('domisili_kota', e.target.value)} placeholder="Contoh: Surabaya" />
              </Field>
              <Field label="Negara">
                <Input value={form.domisili_negara} onChange={e => set('domisili_negara', e.target.value)} placeholder="Indonesia" />
              </Field>
            </div>
          </section>

          {/* === PEKERJAAN === */}
          <section>
            <h3 className="font-heading font-semibold text-sm text-primary mb-3 uppercase tracking-wide">Pekerjaan & Usaha</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nama Perusahaan / Instansi">
                <Input value={form.perusahaan} onChange={e => set('perusahaan', e.target.value)} placeholder="PT. / CV. / Instansi..." />
              </Field>
              <Field label="Jabatan">
                <Input value={form.jabatan} onChange={e => set('jabatan', e.target.value)} placeholder="Direktur, Manajer, dll." />
              </Field>
              <Field label="Kota Perusahaan">
                <Input value={form.company_city} onChange={e => set('company_city', e.target.value)} placeholder="Kota kantor/usaha" />
              </Field>
              <Field label="Bidang Industri">
                <Select value={form.bidang_industri || ''} onValueChange={v => set('bidang_industri', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih industri..." /></SelectTrigger>
                  <SelectContent>{BIDANG_INDUSTRI.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Alamat Perusahaan">
                  <Textarea value={form.alamat_perusahaan} onChange={e => set('alamat_perusahaan', e.target.value)} rows={2} placeholder="Alamat lengkap kantor/usaha" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Kata Kunci Bisnis (business_tags)">
                  <Input value={form.business_tags} onChange={e => set('business_tags', e.target.value)} placeholder="Contoh: kontraktor, jasa sipil, konsultan (pisah koma)" />
                </Field>
              </div>
            </div>
          </section>

          {/* === KONTAK === */}
          <section>
            <h3 className="font-heading font-semibold text-sm text-primary mb-3 uppercase tracking-wide">Kontak</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Utama">
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@contoh.com" />
              </Field>
              <Field label="Email Kedua">
                <Input type="email" value={form.email2} onChange={e => set('email2', e.target.value)} placeholder="email2@contoh.com" />
              </Field>
              <Field label="HP / WhatsApp Utama">
                <Input value={form.telepon} onChange={e => set('telepon', e.target.value)} placeholder="628xxxxxxxx" />
              </Field>
              <Field label="HP / WhatsApp Kedua">
                <Input value={form.telepon2} onChange={e => set('telepon2', e.target.value)} placeholder="628xxxxxxxx" />
              </Field>
              <Field label="Telepon Kantor">
                <Input value={form.telepon_kantor} onChange={e => set('telepon_kantor', e.target.value)} placeholder="0318xxxxxx" />
              </Field>
              <Field label="LinkedIn">
                <Input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
              </Field>
            </div>
          </section>

          {/* === KEGIATAN USAHA / PERUSAHAAN === */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-sm text-primary uppercase tracking-wide flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Kegiatan Usaha / Perusahaan
              </h3>
              <Button type="button" size="sm" variant="outline" onClick={addUsaha} className="gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Tambah Usaha
              </Button>
            </div>

            {usahaList.length === 0 && (
              <p className="text-xs text-muted-foreground italic border border-dashed border-border rounded-lg p-4 text-center">
                Belum ada kegiatan usaha. Klik "+ Tambah Usaha" untuk menambahkan.
              </p>
            )}

            <div className="space-y-3">
              {usahaList.map((u, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  {/* Usaha header row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-secondary/50 cursor-pointer"
                    onClick={() => setExpandedUsaha(expandedUsaha === i ? null : i)}
                  >
                    {u.foto_url
                      ? <img src={u.foto_url} alt={u.nama_usaha} className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />
                      : <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Building2 className="h-5 w-5 text-primary/50" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{u.nama_usaha || <span className="text-muted-foreground italic">Usaha #{i + 1}</span>}</p>
                      <p className="text-xs text-muted-foreground truncate">{[u.peran_jabatan, u.kategori].filter(Boolean).join(' · ') || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                        onClick={e => { e.stopPropagation(); removeUsaha(i); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      {expandedUsaha === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded form */}
                  {expandedUsaha === i && (
                    <div className="p-4 space-y-4 border-t border-border">
                      {/* Foto/banner usaha */}
                      <Field label="Foto / Banner Usaha">
                        <div className="flex items-center gap-3 flex-wrap">
                          {u.foto_url && <img src={u.foto_url} alt="banner" className="h-16 rounded-lg object-cover border border-border" />}
                          <label className="cursor-pointer flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-3 py-2 rounded-lg text-xs hover:bg-secondary/80">
                            <Upload className="h-3.5 w-3.5" />
                            {uploadingUsaha === i ? 'Mengupload...' : 'Upload Foto'}
                            <input type="file" accept="image/*" onChange={e => handleUsahaFotoUpload(e, i)} className="hidden" disabled={uploadingUsaha === i} />
                          </label>
                          {u.foto_url && <Button type="button" size="sm" variant="ghost" className="text-destructive text-xs" onClick={() => setUsaha(i, 'foto_url', '')}>Hapus</Button>}
                        </div>
                        <Input value={u.foto_url} onChange={e => setUsaha(i, 'foto_url', e.target.value)} placeholder="atau masukkan URL foto/banner" className="mt-2 text-xs" />
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nama Usaha / Perusahaan" required>
                          <Input value={u.nama_usaha} onChange={e => setUsaha(i, 'nama_usaha', e.target.value)} placeholder="PT. / CV. / Nama Toko..." />
                        </Field>
                        <Field label="Jabatan / Peran">
                          <Input value={u.peran_jabatan} onChange={e => setUsaha(i, 'peran_jabatan', e.target.value)} placeholder="Owner, Direktur, Partner..." />
                        </Field>
                        <Field label="Kategori Bisnis">
                          <Select value={u.kategori || ''} onValueChange={v => setUsaha(i, 'kategori', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                            <SelectContent>{KATEGORI_USAHA.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                          </Select>
                        </Field>
                        <Field label="Kota">
                          <Input value={u.kota} onChange={e => setUsaha(i, 'kota', e.target.value)} placeholder="Kota lokasi usaha" />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Deskripsi Singkat Usaha">
                            <Textarea value={u.deskripsi} onChange={e => setUsaha(i, 'deskripsi', e.target.value)} rows={3} placeholder="Deskripsikan produk/layanan/usaha secara singkat..." />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Alamat Lengkap">
                            <Textarea value={u.alamat} onChange={e => setUsaha(i, 'alamat', e.target.value)} rows={2} placeholder="Alamat lengkap usaha/kantor" />
                          </Field>
                        </div>
                        <Field label="Telepon / WhatsApp">
                          <Input value={u.telepon} onChange={e => setUsaha(i, 'telepon', e.target.value)} placeholder="628xxxxxxxx" />
                        </Field>
                        <Field label="Email Usaha">
                          <Input type="email" value={u.email} onChange={e => setUsaha(i, 'email', e.target.value)} placeholder="email@usaha.com" />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Website">
                            <Input value={u.website} onChange={e => setUsaha(i, 'website', e.target.value)} placeholder="https://www.namaperussahaan.com" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* === FOTO & BIO === */}
          <section>
            <h3 className="font-heading font-semibold text-sm text-primary mb-3 uppercase tracking-wide">Foto & Profil</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Foto Profil">
                <div className="flex items-center gap-3">
                  {form.photo_url && (
                    <img src={form.photo_url} alt="foto" className="w-12 h-12 rounded-full object-cover border border-border" />
                  )}
                  <label className="cursor-pointer flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-3 py-2 rounded-lg text-sm hover:bg-secondary/80">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Mengupload...' : 'Upload Foto'}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                  </label>
                  {form.photo_url && (
                    <Button size="sm" variant="ghost" className="text-destructive text-xs" onClick={() => set('photo_url', '')}>Hapus</Button>
                  )}
                </div>
                <Input value={form.photo_url} onChange={e => set('photo_url', e.target.value)} placeholder="atau masukkan URL foto" className="mt-2" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bio / Ringkasan Profil">
                  <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Ringkasan profil singkat alumni..." />
                </Field>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card rounded-b-xl">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Menyimpan...' : item ? 'Simpan Perubahan' : 'Tambah Alumni'}
          </Button>
        </div>
      </div>
    </div>
  );
}