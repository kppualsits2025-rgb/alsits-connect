import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Shield, Eye, EyeOff, Search, UserPlus, MailCheck, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import NewsForm from '@/components/admin/NewsForm';
import AlumniManualForm from '@/components/admin/AlumniManualForm';
import AlumniClaimVerifier from '@/components/admin/AlumniClaimVerifier';
import BulkInvitePanel from '@/components/admin/BulkInvitePanel';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [alumniSearch, setAlumniSearch] = useState('');
  const [inviteResult, setInviteResult] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  const { data: news } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => base44.entities.News.list('-created_date', 100),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.News.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-news'] }),
  });

  const { data: allAlumni } = useQuery({
    queryKey: ['admin-alumni-manual'],
    queryFn: () => base44.entities.Alumni.filter({ source_web: 'manual-admin' }, 'full_name', 200),
    initialData: [],
  });

  const deleteAlumniMutation = useMutation({
    mutationFn: (id) => base44.entities.Alumni.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-alumni-manual'] }),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, is_published }) => base44.entities.News.update(id, { is_published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-news'] }),
  });

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
  };

  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <Badge className="bg-primary/10 text-primary border-0 font-heading">Admin Panel</Badge>
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Kelola Konten</h1>
            <p className="text-muted-foreground mt-1">Manage berita, event, dan konten platform ALSITS.</p>
          </div>
        </div>

        <Tabs defaultValue="news">
          <TabsList className="mb-6">
            <TabsTrigger value="news" className="font-heading">News & Events</TabsTrigger>
            <TabsTrigger value="alumni-manual" className="font-heading">Input Alumni Manual</TabsTrigger>
            <TabsTrigger value="invite-claimed" className="font-heading">Undang Alumni Klaim</TabsTrigger>
            <TabsTrigger value="bulk-invite" className="font-heading">Bulk Invite</TabsTrigger>
            <TabsTrigger value="verifikasi-klaim" className="font-heading">Verifikasi Klaim</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{news.length} artikel</p>
              <Button onClick={handleNew} className="gap-2">
                <Plus className="h-4 w-4" /> Tambah Berita
              </Button>
            </div>

            <div className="space-y-3">
              {news.map((item) => (
                <Card key={item.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    {item.cover_image && (
                      <img src={item.cover_image} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        <Badge className={`text-xs border-0 ${item.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.published_date ? format(new Date(item.published_date), 'dd MMM yyyy') : '—'} · {item.author || '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="icon" variant="ghost"
                        onClick={() => togglePublish.mutate({ id: item.id, is_published: !item.is_published })}
                        title={item.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm('Hapus berita ini?')) deleteMutation.mutate(item.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* === TAB ALUMNI MANUAL === */}
          <TabsContent value="alumni-manual">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {allAlumni.length} data alumni input manual · untuk angkatan tanpa web/portal angkatan
                </p>
              </div>
              <Button onClick={() => { setEditAlumni(null); setShowAlumniForm(true); }} className="gap-2 shrink-0">
                <UserPlus className="h-4 w-4" /> Tambah Alumni
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Cari nama, angkatan, kota..."
                value={alumniSearch}
                onChange={e => setAlumniSearch(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {allAlumni
                .filter(a => {
                  const q = alumniSearch.toLowerCase();
                  return !q || a.full_name?.toLowerCase().includes(q) || a.angkatan?.toLowerCase().includes(q) || a.domisili_kota?.toLowerCase().includes(q) || a.perusahaan?.toLowerCase().includes(q);
                })
                .map(alumni => (
                  <Card key={alumni.id} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      {alumni.photo_url
                        ? <img src={alumni.photo_url} alt={alumni.full_name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-border" />
                        : <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">{alumni.full_name?.[0]?.toUpperCase()}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-heading font-semibold text-sm text-foreground">{alumni.full_name}</span>
                          <Badge variant="secondary" className="text-xs">{alumni.angkatan}</Badge>
                          {alumni.status && alumni.status !== 'Aktif' && <Badge className="text-xs bg-red-100 text-red-700 border-0">{alumni.status}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {[alumni.jabatan, alumni.perusahaan, alumni.domisili_kota].filter(Boolean).join(' · ') || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{alumni.email || '—'} · {alumni.telepon || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => { setEditAlumni(alumni); setShowAlumniForm(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => { if (confirm(`Hapus data ${alumni.full_name}?`)) deleteAlumniMutation.mutate(alumni.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
              {allAlumni.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-heading font-semibold">Belum ada data alumni manual</p>
                  <p className="text-sm mt-1">Klik "Tambah Alumni" untuk memasukkan data pertama</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* === TAB UNDANG ALUMNI KLAIM === */}
          <TabsContent value="invite-claimed">
            <div className="max-w-2xl">
              <div className="bg-card rounded-2xl border border-border p-6 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <MailCheck className="h-6 w-6 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground">Undang Alumni yang Sudah Klaim Profil</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Fungsi ini akan mengambil semua alumni yang sudah klaim profil di <strong>s32its.id</strong> (10 orang) dan <strong>s51its.id</strong> (4 orang), lalu mengirimkan undangan login ke ALSITS via email. Jalankan secara berkala jika ada member baru yang klaim.
                </p>
                <Button
                  onClick={async () => {
                    setInviteLoading(true);
                    setInviteResult(null);
                    const res = await base44.functions.invoke('inviteClaimedUsers', {});
                    setInviteResult(res.data);
                    setInviteLoading(false);
                  }}
                  disabled={inviteLoading}
                  className="gap-2"
                >
                  {inviteLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
                  {inviteLoading ? 'Memproses...' : 'Jalankan Undangan Sekarang'}
                </Button>
              </div>

              {inviteResult && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <h4 className="font-heading font-semibold text-foreground">Hasil Proses</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                      <div className="text-2xl font-bold text-emerald-400">{inviteResult.summary?.invited_new || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Undangan Terkirim</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-xl p-3 text-center border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">{inviteResult.summary?.already_exists || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Sudah Terdaftar</div>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">{inviteResult.summary?.errors || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Error / Rate Limit</div>
                    </div>
                  </div>
                  {inviteResult.details?.invited?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Berhasil Diundang</p>
                      <div className="space-y-1.5">
                        {inviteResult.details.invited.map((u, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-foreground/80 bg-emerald-500/5 rounded-lg px-3 py-1.5">
                            <MailCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="font-medium">{u.name}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground font-mono text-xs">{u.email}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{u.source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {inviteResult.details?.errors?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Error (coba lagi nanti)</p>
                      <div className="space-y-1.5">
                        {inviteResult.details.errors.map((e, i) => (
                          <div key={i} className="text-xs text-red-400 bg-red-500/5 rounded-lg px-3 py-1.5">
                            {e.member_name} · {e.email} — {e.reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* === TAB BULK INVITE === */}
          <TabsContent value="bulk-invite">
            <BulkInvitePanel />
          </TabsContent>

          {/* === TAB VERIFIKASI KLAIM === */}
          <TabsContent value="verifikasi-klaim">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Daftar seluruh alumni beserta status email & telepon yang menjadi dasar klaim profil. Admin dapat mengedit data kontak dan mengubah status verifikasi.
              </p>
            </div>
            <AlumniClaimVerifier />
          </TabsContent>

        </Tabs>
      </div>

      {showForm && (
        <NewsForm
          item={editItem}
          onClose={handleFormClose}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-news'] });
            queryClient.invalidateQueries({ queryKey: ['all-news'] });
            handleFormClose();
          }}
        />
      )}

      {showAlumniForm && (
        <AlumniManualForm
          item={editAlumni}
          onClose={() => { setShowAlumniForm(false); setEditAlumni(null); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-alumni-manual'] });
            queryClient.invalidateQueries({ queryKey: ['alumni'] });
            setShowAlumniForm(false);
            setEditAlumni(null);
          }}
        />
      )}
    </div>
  );
}