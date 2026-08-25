import React, { useState, useEffect } from 'react';
import { CheckCircle2, Users, MapPin, Briefcase, Newspaper, Bell, ChevronRight, X, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: '🎓',
    title: 'Selamat Datang di ALSITS!',
    subtitle: 'Portal resmi Alumni Teknik Sipil ITS',
    desc: 'Anda kini terhubung dengan ribuan alumni Teknik Sipil ITS dari seluruh Indonesia dan mancanegara. Mari kenali fitur-fitur unggulan portal ini.',
    color: '#3b82f6',
    features: [
      { icon: <Users size={14}/>, text: 'Database 5.000+ alumni terverifikasi' },
      { icon: <MapPin size={14}/>, text: 'Peta sebaran alumni seluruh dunia' },
      { icon: <Briefcase size={14}/>, text: 'Business Hub & jaringan profesional' },
    ]
  },
  {
    icon: '👤',
    title: 'Klaim & Lengkapi Profil Anda',
    subtitle: 'Jadikan profilmu terlihat oleh sesama alumni',
    desc: 'Gunakan fitur "Klaim Profil" di navbar untuk menghubungkan akun Anda dengan data alumni yang telah tersync dari database S32 & S51 ITS.',
    color: '#10b981',
    features: [
      { icon: <CheckCircle2 size={14}/>, text: 'Verifikasi identitas via OTP email' },
      { icon: <CheckCircle2 size={14}/>, text: 'Update foto, jabatan, perusahaan secara mandiri' },
      { icon: <CheckCircle2 size={14}/>, text: 'Kontak hanya terlihat oleh sesama alumni login' },
    ]
  },
  {
    icon: '🚀',
    title: 'Jelajahi Semua Fitur',
    subtitle: 'Ekosistem digital alumni terlengkap',
    desc: 'ALSITS menyediakan berbagai fitur untuk mendukung karir, bisnis, dan kegiatan komunitas alumni ITS.',
    color: '#f59e0b',
    features: [
      { icon: <Newspaper size={14}/>, text: 'Berita, event & kegiatan terkini' },
      { icon: <Briefcase size={14}/>, text: 'Lowongan kerja & proyek dari sesama alumni' },
      { icon: <Bell size={14}/>, text: 'Notifikasi ulang tahun & event otomatis via email' },
    ]
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const handleClose = () => {
    localStorage.setItem('alsits_onboarding_done', '1');
    onClose();
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleClose();
  };

  const s = STEPS[step];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(6,13,31,0.9)', backdropFilter: 'blur(10px)' }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'linear-gradient(160deg, #0d1f3c 0%, #081426 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${s.color}18`, position: 'relative' }}>

        {/* Glow top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`, transition: 'background 0.5s' }} />

        {/* Close */}
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '5px 8px', color: '#64748b', cursor: 'pointer', lineHeight: 0 }}>
          <X size={14} />
        </button>

        {/* Content */}
        <div style={{ padding: '40px 36px 28px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? s.color : 'rgba(255,255,255,0.1)', transition: 'background 0.4s' }} />
            ))}
          </div>

          {/* Icon */}
          <div style={{ width: 64, height: 64, borderRadius: 16, background: `${s.color}18`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 20 }}>
            {s.icon}
          </div>

          {/* Text */}
          <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontFamily: 'Montserrat, sans-serif' }}>
            Langkah {step + 1} dari {STEPS.length}
          </div>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22, color: '#fff', margin: '0 0 4px', lineHeight: 1.25 }}>{s.title}</h2>
          <p style={{ fontSize: 13, color: s.color, margin: '0 0 14px', fontWeight: 600 }}>{s.subtitle}</p>
          <p style={{ fontSize: 13.5, color: '#94a3b8', margin: '0 0 22px', lineHeight: 1.7 }}>{s.desc}</p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {s.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, background: `${s.color}0d`, border: `1px solid ${s.color}22` }}>
                <span style={{ color: s.color, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={next} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, boxShadow: `0 4px 20px ${s.color}44` }}>
              {step < STEPS.length - 1 ? <>Lanjut <ChevronRight size={16} /></> : <><Sparkles size={16} /> Mulai Jelajahi!</>}
            </button>
            {step < STEPS.length - 1 && (
              <button onClick={handleClose} style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>
                Lewati
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}