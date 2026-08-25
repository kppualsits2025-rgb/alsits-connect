import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload, CheckCircle2, Clock, Send } from 'lucide-react';

export default function VotingVoterManager({ event }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [nrp, setNrp] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifResult, setNotifResult] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const { data: voters = [], isLoading } = useQuery({
    queryKey: ['admin-voters', event.id],
    queryFn: () => base44.entities.VoterRegistry.filter({ event_id: event.id }),
    staleTime: 30000,
  });

  const filtered = voters
    .filter(v =>
      !searchQ ||
      v.full_name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      v.nrp?.includes(searchQ) ||
      v.email?.toLowerCase().includes(searchQ.toLowerCase())
    )
    .sort((a, b) => (a.nrp || '').localeCompare(b.nrp || ''));

  const sudahMemilih = voters.filter(v => v.sudah_memilih).length;
  const pct = voters.length > 0 ? Math.round(sudahMemilih / voters.length * 100) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nrp.trim() || !email.trim()) return;
    setSaving(true);
    const exists = voters.find(v => v.nrp === nrp.trim() || v.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      alert('NRP atau email sudah terdaftar di event ini');
      setSaving(false);
      return;
    }
    await base44.entities.VoterRegistry.create({
      event_id: event.id,
      nrp: nrp.trim(),
      email: email.trim().toLowerCase(),
      full_name: fullName.trim(),
      sudah_memilih: false,
      otp_verified: false,
    });
    queryClient.invalidateQueries({ queryKey: ['admin-voters', event.id] });
    setNrp(''); setEmail(''); setFullName('');
    setShowAdd(false);
    setSaving(false);
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setBulkLoading(true);
    setBulkResult('');
    const lines = bulkText.trim().split('\n').filter(l => l.trim());
    let ok = 0, skip = 0;
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) { skip++; continue; }
      const [bNrp, bEmail, bName] = parts;
      if (!bNrp || !bEmail) { skip++; continue; }
      const exists = voters.find(v => v.nrp === bNrp || v.email.toLowerCase() === bEmail.toLowerCase());
      if (exists) { skip++; continue; }
      await base44.entities.VoterRegistry.create({
        event_id: event.id,
        nrp: bNrp,
        email: bEmail.toLowerCase(),
        full_name: bName || '',
        sudah_memilih: false,
        otp_verified: false,
      });
      ok++;
    }
    queryClient.invalidateQueries({ queryKey: ['admin-voters', event.id] });
    setBulkResult(`✓ ${ok} pemilih berhasil ditambahkan, ${skip} dilewati`);
    setBulkLoading(false);
    setBulkText('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pemilih ini?')) return;
    await base44.entities.VoterRegistry.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-voters', event.id] });
  };

  const handleResetVote = async (voter) => {
    if (!confirm(`Reset status voting ${voter.full_name || voter.nrp}? HANYA untuk koreksi data.`)) return;
    await base44.entities.VoterRegistry.update(voter.id, { sudah_memilih: false, voted_at: null, otp_code: null });
    queryClient.invalidateQueries({ queryKey: ['admin-voters', event.id] });
  };

  const handleNotifyDPT = async () => {
    if (!confirm(`Kirim email undangan voting ke ${voters.length} pemilih terdaftar? Proses ini tidak bisa dibatalkan.`)) return;
    setNotifLoading(true);
    setNotifResult('');
    try {
      const res = await base44.functions.invoke('omovNotifyDPT', { event_id: event.id });
      const data = res.data;
      if (data.success) {
        setNotifResult(`✓ ${data.sent} email terkirim${data.failed > 0 ? `, ${data.failed} gagal` : ''}`);
      } else if (res.status === 429) {
        setNotifResult(`⚠️ Kuota Resend habis — coba lagi besok`);
      } else {
        setNotifResult(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setNotifResult(`✗ Error: ${error.message || 'Gagal mengirim notifikasi'}`);
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-secondary/30 border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{voters.length}</p>
          <p className="text-xs text-muted-foreground">Total DPT</p>
        </div>
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{sudahMemilih}</p>
          <p className="text-xs text-muted-foreground">Sudah Memilih</p>
        </div>
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{pct}%</p>
          <p className="text-xs text-muted-foreground">Partisipasi</p>
        </div>
      </div>

      <div className="w-full bg-secondary rounded-full h-2 mb-4">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Cari nama/NRP/email..." className="bg-input max-w-xs text-sm" />
        <Button size="sm" variant="outline" onClick={() => { setShowAdd(!showAdd); setShowBulk(false); }}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setShowBulk(!showBulk); setShowAdd(false); }}>
          <Upload className="w-3 h-3 mr-1" /> Import CSV
        </Button>
      </div>

      {/* Notify DPT Button */}
      {voters.length > 0 && (
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleNotifyDPT}
            disabled={notifLoading}
          >
            <Send className="w-3 h-3 mr-1" />
            {notifLoading ? 'Mengirim notifikasi...' : `Kirim Notifikasi ke ${voters.length} Pemilih`}
          </Button>
          {notifResult && (
            <span className={`text-sm ${notifResult.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {notifResult}
            </span>
          )}
        </div>
      )}

      {/* Single Add */}
      {showAdd && (
        <form onSubmit={handleAdd} className="mb-4 p-4 rounded-xl border border-border bg-secondary/20 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input value={nrp} onChange={e => setNrp(e.target.value)} placeholder="NRP *" required className="bg-input" />
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" required className="bg-input" type="email" />
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama Lengkap" className="bg-input" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>{saving ? 'Menyimpan...' : 'Tambah'}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Batal</Button>
          </div>
        </form>
      )}

      {/* Bulk Import */}
      {showBulk && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-secondary/20 space-y-2">
          <p className="text-xs text-muted-foreground">Format CSV: <code className="bg-secondary px-1 rounded">NRP, Email, Nama Lengkap</code> (satu baris per pemilih)</p>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            placeholder={"3114100001, budi@email.com, Budi Santoso\n3114100002, sari@email.com, Sari Dewi"}
            rows={5}
            className="w-full rounded-lg border border-border bg-input p-2 text-sm text-foreground font-mono resize-none"
          />
          {bulkResult && <p className="text-sm text-green-400">{bulkResult}</p>}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleBulkImport} disabled={bulkLoading}>{bulkLoading ? 'Memproses...' : 'Import'}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowBulk(false); setBulkText(''); setBulkResult(''); }}>Tutup</Button>
          </div>
        </div>
      )}

      {/* Voter List */}
      <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
        {isLoading && <p className="text-sm text-muted-foreground py-4 text-center">Memuat...</p>}
        {filtered.map(v => (
          <div key={v.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card text-sm">
            {v.sudah_memilih
              ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              : <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
            }
            <span className="font-medium text-foreground w-28 shrink-0 truncate">{v.nrp}</span>
            <span className="text-muted-foreground flex-1 truncate text-xs">{v.full_name || v.email}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${v.sudah_memilih ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {v.sudah_memilih ? 'Sudah' : 'Belum'}
            </span>
            <div className="flex gap-1 shrink-0">
              {v.sudah_memilih && (
                <button onClick={() => handleResetVote(v)} className="text-xs text-muted-foreground hover:text-destructive px-1">↺</button>
              )}
              <button onClick={() => handleDelete(v.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground py-6">
            {searchQ ? 'Tidak ditemukan' : 'Belum ada pemilih terdaftar'}
          </p>
        )}
      </div>
    </div>
  );
}