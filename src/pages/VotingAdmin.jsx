import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Play, StopCircle, Trash2, Users, BarChart2, Download } from 'lucide-react';
import VotingCandidateManager from '@/components/voting/VotingCandidateManager';
import VotingVoterManager from '@/components/voting/VotingVoterManager';
import VotingResults from '@/components/voting/VotingResults';

export default function VotingAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['voting-events-all'],
    queryFn: () => base44.entities.VotingEvent.list('-created_date'),
    staleTime: 30000,
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Akses ditolak. Halaman ini hanya untuk admin.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>Kembali</Button>
        </div>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    await base44.entities.VotingEvent.create({ title: newTitle.trim(), description: newDesc.trim(), status: 'draft' });
    queryClient.invalidateQueries({ queryKey: ['voting-events-all'] });
    setNewTitle(''); setNewDesc(''); setShowCreate(false);
    setCreating(false);
  };

  const handleStatusChange = async (event, newStatus) => {
    await base44.entities.VotingEvent.update(event.id, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['voting-events-all'] });
    queryClient.invalidateQueries({ queryKey: ['voting-events-active'] });
    // Auto-kirim notifikasi ke semua pemilih saat event diaktifkan
    if (newStatus === 'active') {
      base44.functions.invoke('omovNotifyDPT', { event_id: event.id });
    }
  };

  const handleExportCSV = async (event) => {
    const voters = await base44.entities.VoterRegistry.filter({ event_id: event.id });
    const rows = [['NRP', 'Nama', 'Email', 'Sudah Memilih', 'Waktu Memilih']];
    voters
      .sort((a, b) => (a.nrp || '').localeCompare(b.nrp || ''))
      .forEach(v => rows.push([v.nrp, v.full_name || '', v.email, v.sudah_memilih ? 'Ya' : 'Tidak', v.voted_at || '']));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `DPT_${event.title}_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (event) => {
    if (!confirm(`Hapus event "${event.title}"? Data tidak dapat dikembalikan.`)) return;
    await base44.entities.VotingEvent.delete(event.id);
    queryClient.invalidateQueries({ queryKey: ['voting-events-all'] });
  };

  const statusBadge = {
    draft: <Badge variant="secondary">Draft</Badge>,
    active: <Badge className="bg-green-500/20 text-green-400 border-green-500/30">● Aktif</Badge>,
    closed: <Badge variant="outline">Ditutup</Badge>,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">⚙️ Admin Panel OMOV</h1>
            <p className="text-muted-foreground text-sm">Kelola event voting, kandidat, dan daftar pemilih</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/voting">Lihat Halaman Voting</Link>
            </Button>
            <Button onClick={() => setShowCreate(!showCreate)}>
              <Plus className="w-4 h-4 mr-1" /> Buat Event Baru
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {showCreate && (
          <Card className="mb-6 border-primary/30 bg-card">
            <CardContent className="pt-5">
              <form onSubmit={handleCreate} className="space-y-3">
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Nama Event Voting" className="bg-input" required />
                <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Deskripsi (opsional)" className="bg-input" />
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>{creating ? 'Menyimpan...' : 'Simpan'}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-6">
          {isLoading && <p className="text-muted-foreground text-sm">Memuat...</p>}
          {events.map(ev => (
            <Card key={ev.id} className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="font-heading text-foreground">{ev.title}</CardTitle>
                      {statusBadge[ev.status]}
                    </div>
                    {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ev.status === 'draft' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(ev, 'active')}>
                        <Play className="w-3 h-3 mr-1" /> Mulai Voting
                      </Button>
                    )}
                    {ev.status === 'active' && (
                      <Button size="sm" variant="destructive" onClick={() => handleStatusChange(ev, 'closed')}>
                        <StopCircle className="w-3 h-3 mr-1" /> Tutup Voting
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleExportCSV(ev)}>
                      <Download className="w-3 h-3 mr-1" /> Export CSV
                    </Button>
                    {ev.status !== 'active' && (
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(ev)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs defaultValue="candidates">
                  <TabsList className="mb-4">
                    <TabsTrigger value="candidates"><BarChart2 className="w-3 h-3 mr-1" />Kandidat</TabsTrigger>
                    <TabsTrigger value="voters"><Users className="w-3 h-3 mr-1" />Pemilih</TabsTrigger>
                    <TabsTrigger value="results">📊 Hasil Live</TabsTrigger>
                  </TabsList>
                  <TabsContent value="candidates">
                    <VotingCandidateManager event={ev} />
                  </TabsContent>
                  <TabsContent value="voters">
                    <VotingVoterManager event={ev} />
                  </TabsContent>
                  <TabsContent value="results">
                    <VotingResults event={ev} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && !isLoading && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">🗳️</p>
              <p>Belum ada event voting. Buat event baru untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}