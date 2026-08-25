import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VotingAuth({ event, onAuthenticated }) {
  const [step, setStep] = useState('identity'); // identity | otp
  const [nrp, setNrp] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [voterName, setVoterName] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!nrp.trim() || !email.trim()) { setError('NRP dan Email wajib diisi'); return; }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('omovSendOtp', {
        event_id: event.id,
        nrp: nrp.trim(),
        email: email.trim().toLowerCase(),
      });
      setMaskedEmail(res.data.message || '');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.trim().length !== 6) { setError('Kode OTP harus 6 digit'); return; }
    setLoading(true);
    try {
      // PERBAIKAN: Verifikasi OTP ke backend DULU sebelum masuk bilik suara
      const res = await base44.functions.invoke('omovVerifyOtp', {
        event_id: event.id,
        nrp: nrp.trim(),
        email: email.trim().toLowerCase(),
        otp_code: otp.trim(),
      });
      setVoterName(res.data.voter_name || '');
      // Baru pass ke parent setelah backend konfirmasi OTP valid
      onAuthenticated({
        nrp: nrp.trim(),
        email: email.trim().toLowerCase(),
        otp_code: otp.trim(),
        voter_name: res.data.voter_name,
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Kode OTP tidak valid atau sudah kadaluarsa');
    }
    setLoading(false);
  };

  const handleResendOtp = () => {
    setStep('identity');
    setOtp('');
    setError('');
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="font-heading flex items-center gap-2 text-foreground">
          <Shield className="w-5 h-5 text-primary" />
          Verifikasi Identitas Pemilih
        </CardTitle>
        <p className="text-sm text-muted-foreground">Masukkan NRP dan email terdaftar Anda untuk mendapatkan kode OTP</p>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === 'identity' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">NRP / Nomor Registrasi</label>
              <Input
                value={nrp}
                onChange={e => setNrp(e.target.value)}
                placeholder="Contoh: 3114100001"
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Terdaftar di DPT</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="pl-9 bg-input"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Memverifikasi...</> : '📧 Kirim Kode OTP ke Email'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {maskedEmail}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Kode OTP (6 digit)</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="pl-9 bg-input text-center text-2xl tracking-widest font-bold"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Kode berlaku 10 menit. Periksa folder <strong>Spam/Junk</strong> jika tidak ada di inbox.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleResendOtp} className="flex-1" disabled={loading}>
                Kirim Ulang
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || otp.trim().length !== 6}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Memverifikasi...</> : '🗳️ Masuk Bilik Suara'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}