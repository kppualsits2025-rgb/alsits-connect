import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { Loader2, ShieldCheck, Mail, KeyRound, CheckCircle2, UserCog } from 'lucide-react';
import AlumniSelfEditModal from './AlumniSelfEditModal';

/**
 * AlumniClaimModal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onVerified: (alumni) => void  — dipanggil saat OTP berhasil, bawa data alumni
 */
export default function AlumniClaimModal({ open, onClose, onVerified }) {
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'success'
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claimInfo, setClaimInfo] = useState(null); // { alumni_id, alumni_name, angkatan, masked_email }
  const [verifiedAlumni, setVerifiedAlumni] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const reset = () => {
    setStep('input');
    setIdentifier('');
    setOtpCode('');
    setError('');
    setClaimInfo(null);
    setVerifiedAlumni(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRequestOtp = async () => {
    if (!identifier.trim()) { setError('Masukkan email atau nomor HP Anda.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('claimAlumni', { identifier: identifier.trim() });
      // Hanya lanjut ke OTP jika sukses dan tidak ada flag already_claimed
      if (res.data?.already_claimed) {
        setError('⚠️ ' + res.data.error);
      } else {
        setClaimInfo(res.data);
        setStep('otp');
      }
    } catch (e) {
      const errData = e.response?.data;
      if (errData?.already_claimed) {
        setError('⚠️ ' + errData.error);
      } else {
        setError(errData?.error || e.message || 'Terjadi kesalahan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.trim().length !== 6) { setError('Masukkan 6 digit kode OTP.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('claimVerifyOtp', { alumni_id: claimInfo.alumni_id, otp_code: otpCode.trim() });
      setVerifiedAlumni(res.data.alumni);
      setStep('success');
      if (onVerified) onVerified(res.data.alumni);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Kode OTP salah atau sudah kadaluarsa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showEdit} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verifikasi Profil Alumni
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Klaim profil Anda di database ALSITS untuk bisa mengedit data diri sendiri.
            </p>
          </DialogHeader>

          {/* ── Step 1: Input email/HP ── */}
          {step === 'input' && (
            <div className="space-y-4 pt-2">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-sm text-foreground/80">
                <p className="font-semibold text-foreground mb-1">Bagaimana cara kerja ini?</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Masukkan email atau nomor HP yang sudah terdaftar di database alumni ALSITS</li>
                  <li>Sistem akan kirim kode OTP ke email Anda</li>
                  <li>Masukkan kode OTP → profil Anda terverifikasi & bisa diedit</li>
                </ol>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                  Email atau Nomor HP Terdaftar
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="email@domain.com atau 08xxxxxxxxxx"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleRequestOtp()}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={handleClose} className="flex-1">Batal</Button>
                <Button onClick={handleRequestOtp} disabled={loading} className="flex-1 gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {loading ? 'Memeriksa...' : 'Kirim OTP'}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Input OTP ── */}
          {step === 'otp' && claimInfo && (
            <div className="space-y-4 pt-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm">
                <p className="font-semibold text-foreground mb-1">✅ Alumni Ditemukan!</p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{claimInfo.alumni_name}</span>
                  {claimInfo.angkatan && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{claimInfo.angkatan}</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Kode OTP telah dikirim ke: <span className="font-mono text-foreground">{claimInfo.masked_email}</span>
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                  Kode OTP (6 digit)
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 text-center text-xl font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Kode berlaku selama 10 menit. Periksa folder Spam jika tidak masuk.</p>
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => { setStep('input'); setError(''); setOtpCode(''); }} className="flex-1">Kembali</Button>
                <Button onClick={handleVerifyOtp} disabled={loading} className="flex-1 gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  {loading ? 'Verifikasi...' : 'Verifikasi OTP'}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && verifiedAlumni && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Verifikasi Berhasil!</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Selamat datang, <span className="font-semibold text-foreground">{verifiedAlumni.full_name}</span>!
                </p>
                {verifiedAlumni.angkatan && (
                  <span className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{verifiedAlumni.angkatan}</span>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">Tutup</Button>
                <Button onClick={() => { setShowEdit(true); }} className="flex-1 gap-2">
                  <UserCog className="h-4 w-4" />
                  Edit Profil Saya
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit profil setelah verifikasi */}
      {verifiedAlumni && (
        <AlumniSelfEditModal
          alumni={verifiedAlumni}
          open={showEdit}
          onClose={() => { setShowEdit(false); handleClose(); }}
        />
      )}
    </>
  );
}