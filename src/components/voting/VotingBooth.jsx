import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle, User } from 'lucide-react';

export default function VotingBooth({ event, voterData, onVoted }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['voting-candidates', event.id],
    queryFn: () => base44.entities.VotingCandidate.filter({ event_id: event.id }),
  });

  const sorted = [...candidates].sort((a, b) => a.nomor_urut - b.nomor_urut);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await base44.functions.invoke('omovSubmitVote', {
        event_id: event.id,
        nrp: voterData.nrp,
        email: voterData.email,
        otp_code: voterData.otp_code,
        candidate_id: selectedCandidate.id,
      });
      onVoted();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Gagal mengirim suara');
      setConfirming(false);
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">🗳️ Bilik Suara</h2>
        <p className="text-muted-foreground text-sm mt-1">Pilih satu kandidat Ketua Konjur ALSITS. Suara tidak dapat diubah setelah dikonfirmasi.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Candidate Cards */}
      <div className="space-y-3 mb-6">
        {sorted.map((c) => {
          const isSelected = selectedCandidate?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => { if (!confirming) setSelectedCandidate(c); }}
              disabled={confirming}
              className={`w-full text-left rounded-xl border-2 transition-all p-4 flex items-center gap-4
                ${isSelected
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                }`}
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-accent border-2 border-accent/30">
                {c.nomor_urut}
              </div>
              {c.photo_url ? (
                <img src={c.photo_url} alt={c.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-border shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-lg">{c.full_name}</p>
                {c.angkatan && <p className="text-sm text-muted-foreground">Angkatan {c.angkatan}</p>}
                {c.visi && <p className="text-sm text-muted-foreground line-clamp-2 mt-1 italic">"{c.visi}"</p>}
              </div>
              {isSelected && <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Confirm Step */}
      {!confirming ? (
        <Button
          className="w-full h-12 text-base font-bold"
          disabled={!selectedCandidate}
          onClick={() => setConfirming(true)}
        >
          Pilih {selectedCandidate ? `Kandidat No. ${selectedCandidate.nomor_urut}` : 'Kandidat'}
        </Button>
      ) : (
        <div className="rounded-xl border-2 border-accent/50 bg-accent/5 p-5 space-y-4">
          <h3 className="font-heading font-bold text-foreground text-center">Konfirmasi Pilihan Anda</h3>
          <div className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-accent text-lg">
              {selectedCandidate.nomor_urut}
            </div>
            <div>
              <p className="font-bold text-foreground">{selectedCandidate.full_name}</p>
              {selectedCandidate.angkatan && <p className="text-xs text-muted-foreground">Angkatan {selectedCandidate.angkatan}</p>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">Suara <strong className="text-destructive">tidak dapat diubah</strong> setelah dikonfirmasi.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)} disabled={loading}>
              Batal
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={handleSubmit} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Mengirim...</> : '✓ Konfirmasi & Kirim Suara'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}