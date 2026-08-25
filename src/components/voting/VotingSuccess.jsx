import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function VotingSuccess({ event, voterData }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Suara Berhasil Terkirim!</h2>
      <p className="text-muted-foreground mb-1">
        Terima kasih, <strong className="text-foreground">{voterData?.nrp}</strong>. Suara Anda untuk
      </p>
      <p className="text-accent font-bold text-lg mb-4">"{event.title}"</p>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">
        Suara Anda telah tercatat secara anonim dan aman. Hasil pemilihan dapat dipantau secara real-time di panel kanan.
      </p>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-primary max-w-sm">
        🔒 Kerahasiaan pilihan Anda terjamin. Kami hanya mencatat bahwa Anda telah berpartisipasi.
      </div>
      <Button variant="outline" className="mt-8" asChild>
        <Link to="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}