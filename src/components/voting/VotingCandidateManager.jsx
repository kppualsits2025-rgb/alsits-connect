import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, User, Search } from 'lucide-react';

export default function VotingCandidateManager({ event }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [searchAlumni, setSearchAlumni] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [saving, setSaving] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAngkatan, setManualAngkatan] = useState('');

  const { data: candidates = [] } = useQuery({
    queryKey: ['admin-candidates', event.id],
    queryFn: () => base44.entities.VotingCandidate.filter({ event_id: event.id }),
  });

  const { data: searchResult } = useQuery({
    queryKey: ['alumni-search-admin', searchAlumni],
    queryFn: () => base44.functions.invoke('searchAlumniAdmin', { q: searchAlumni }).then(r => r.data),
    enabled: searchAlumni.length >= 2,
  });

  const filteredAlumni = searchResult?.data || [];

  const sorted = [...candidates].sort((a, b) => (a.nomor_urut || 0) - (b.nomor_urut || 0));
  const nextNomor = candidates.length > 0 ? Math.max(...candidates.map(c => c.nomor_urut)) + 1 : 1;

  const handleAddCandidate = async () => {
    if (!selectedAlumni && !manualName.trim()) return;
    setSaving(true);
    await base44.entities.VotingCandidate.create({
      event_id: event.id,
      alumni_id: selectedAlumni?.id || '',
      nomor_urut: nextNomor,
      full_name: selectedAlumni ? selectedAlumni.full_name : manualName.trim(),
      angkatan: selectedAlumni?.angkatan || manualAngkatan.trim(),
      photo_url: selectedAlumni?.photo_url || '',
      visi,
      misi,
      vote_count: 0,
    });
    queryClient.invalidateQueries({ queryKey: ['admin-candidates', event.id] });
    queryClient.invalidateQueries({ queryKey: ['voting-candidates', event.id] });
    queryClient.invalidateQueries({ queryKey: ['voting-candidates-live', event.id] });
    setShowAdd(false);
    setSelectedAlumni(null);
    setSearchAlumni('');
    setManualName(''); setManualAngkatan('');
    setVisi(''); setMisi('');
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kandidat ini?')) return;
    await base44.entities.VotingCandidate.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-candidates', event.id] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{candidates.length} kandidat terdaftar</p>
        {event.status !== 'closed' && (
          <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-3 h-3 mr-1" /> Tambah Kandidat
          </Button>
        )}
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <p className="text-sm font-medium text-foreground">Cari Alumni</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchAlumni}
              onChange={e => { setSearchAlumni(e.target.value); setSelectedAlumni(null); }}
              placeholder="Ketik nama atau NRP alumni..."
              className="pl-9 bg-input"
            />
          </div>
          {searchAlumni.length >= 2 && filteredAlumni.length > 0 && !selectedAlumni && (
            <div className="rounded-lg border border-border bg-card max-h-40 overflow-y-auto">
              {filteredAlumni.slice(0, 8).map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedAlumni(a); setSearchAlumni(a.full_name); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
                >
                  <User className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">{a.full_name}</span>
                  <span className="text-muted-foreground text-xs">{a.angkatan}</span>
                </button>
              ))}
            </div>
          )}
          {selectedAlumni && (
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2">
              ✓ {selectedAlumni.full_name} (Angkatan {selectedAlumni.angkatan})
              <button onClick={() => { setSelectedAlumni(null); setSearchAlumni(''); }} className="ml-auto text-xs text-muted-foreground hover:text-foreground">✕ Ganti</button>
            </div>
          )}
          {!selectedAlumni && (
            <div className="pt-1 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground">Atau input manual jika tidak ada di database alumni:</p>
              <Input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Nama lengkap kandidat *" className="bg-input" />
              <Input value={manualAngkatan} onChange={e => setManualAngkatan(e.target.value)} placeholder="Angkatan (misal: S42)" className="bg-input" />
            </div>
          )}
          <Textarea value={visi} onChange={e => setVisi(e.target.value)} placeholder="Visi kandidat..." rows={2} className="bg-input" />
          <Textarea value={misi} onChange={e => setMisi(e.target.value)} placeholder="Misi kandidat..." rows={3} className="bg-input" />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddCandidate} disabled={(!selectedAlumni && !manualName.trim()) || saving}>
              {saving ? 'Menyimpan...' : 'Simpan Kandidat'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setSelectedAlumni(null); setSearchAlumni(''); setManualName(''); setManualAngkatan(''); }}>Batal</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sorted.map(c => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <span className="text-accent font-bold text-lg w-8 text-center shrink-0">{c.nomor_urut}</span>
            {c.photo_url
              ? <img src={c.photo_url} alt={c.full_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              : <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0"><User className="w-5 h-5 text-muted-foreground" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{c.full_name}</p>
              <p className="text-xs text-muted-foreground">Angkatan {c.angkatan} • {c.vote_count || 0} suara</p>
            </div>
            {event.status !== 'active' && (
              <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
        {candidates.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">Belum ada kandidat</p>}
      </div>
    </div>
  );
}