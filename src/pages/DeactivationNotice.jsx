import React, { useEffect, useState } from 'react';

export default function DeactivationNotice() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020818 0%, #040d24 40%, #080c18 70%, #010510 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '1rem',
    }}>

      {/* Grid mesh background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: 'linear-gradient(rgba(0,200,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(255,140,0,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)',
      }} />

      {/* Floating card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,200,255,0.15)',
        borderRadius: '24px',
        padding: 'clamp(2rem, 5vw, 4rem)',
        maxWidth: '780px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 80px rgba(0,200,255,0.08), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
        animation: 'floatCard 6s ease-in-out infinite',
      }}>

        {/* Corner accents */}
        {['topLeft','topRight','bottomLeft','bottomRight'].map((pos) => (
          <div key={pos} style={{
            position: 'absolute',
            width: '20px', height: '20px',
            ...(pos.includes('top') ? { top: '16px' } : { bottom: '16px' }),
            ...(pos.includes('Left') ? { left: '16px', borderLeft: '2px solid rgba(0,200,255,0.6)', borderTop: pos.includes('top') ? '2px solid rgba(0,200,255,0.6)' : 'none', borderBottom: pos.includes('bottom') ? '2px solid rgba(0,200,255,0.6)' : 'none' }
              : { right: '16px', borderRight: '2px solid rgba(0,200,255,0.6)', borderTop: pos.includes('top') ? '2px solid rgba(0,200,255,0.6)' : 'none', borderBottom: pos.includes('bottom') ? '2px solid rgba(0,200,255,0.6)' : 'none' }),
          }} />
        ))}

        {/* BG image overlay inside card */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', zIndex: 0, opacity: 0.18,
        }}>
          <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/8d6e8562d_generated_image.png"
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Lock icon */}
          <div style={{
            width: '90px', height: '90px', margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,60,0,0.1))',
            border: `2px solid ${pulse ? 'rgba(255,140,0,0.8)' : 'rgba(255,140,0,0.3)'}`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: pulse ? '0 0 30px rgba(255,140,0,0.5), 0 0 60px rgba(255,140,0,0.2)' : '0 0 10px rgba(255,140,0,0.2)',
            transition: 'all 1.5s ease',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={pulse ? '#ff8c00' : '#ff6a00'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'stroke 1.5s ease' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)',
            borderRadius: '999px', padding: '4px 16px', marginBottom: '1.5rem',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: pulse ? '#ff8c00' : '#ff4500',
              boxShadow: pulse ? '0 0 8px #ff8c00' : 'none',
              transition: 'all 1.5s ease', display: 'inline-block',
            }} />
            <span style={{ color: '#ffaa40', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Status: Deactivated — Awaiting Validation
            </span>
          </div>

          {/* Error code */}
          <div style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 700, letterSpacing: '6px',
            color: 'rgba(0,200,255,0.5)', textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            403 — ACCESS TEMPORARILY DEACTIVATED
          </div>

          {/* Main heading */}
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight: 800, color: '#ffffff', lineHeight: 1.2,
            marginBottom: '0.75rem', letterSpacing: '-0.5px',
          }}>
            Mohon Maaf,<br />
            <span style={{
              background: 'linear-gradient(90deg, #00c8ff, #0080ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Layanan Portal Sementara Waktu Ditangguhkan.
            </span>
          </h1>

          {/* Divider */}
          <div style={{
            width: '80px', height: '2px', margin: '1.5rem auto',
            background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)',
          }} />

          {/* Description */}
          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(13px, 2vw, 15px)',
            lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem',
          }}>
            Saat ini sistem sedang dalam proses{' '}
            <strong style={{ color: 'rgba(0,200,255,0.85)' }}>
              "Sinkronisasi Administrasi dan Validasi Dokumen Kerja"
            </strong>{' '}
            antara pihak <strong style={{ color: '#fff' }}>Pengembang (Developer)</strong> dengan pihak <strong style={{ color: '#fff' }}>Pengurus</strong>.
            Akses ke seluruh modul platform dinonaktifkan sementara hingga seluruh pemenuhan hak dan kewajiban administratif para pihak
            diselesaikan sesuai ketentuan kesepakatan bersama.
          </p>

          {/* Info panel */}
          <div style={{
            background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.12)',
            borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2.5rem' }}>
              {[
                { label: 'Sistem', value: 'Portal Alumni Sipil ITS (ALSITS)' },
                { label: 'Kondisi', value: 'Under Administrative Validation' },
                { label: 'Estimasi', value: 'Sesuai pemenuhan kewajiban para pihak' },
                { label: 'Referensi', value: 'SPK · BAST · Invoice (terdokumentasi)' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', color: 'rgba(0,200,255,0.5)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact button */}
          <a href="mailto:hazrilf@gmail.com" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,128,255,0.1))',
            border: '1px solid rgba(0,200,255,0.3)',
            color: '#00c8ff', textDecoration: 'none',
            padding: '12px 28px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0,200,255,0.1)',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,200,255,0.2)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,200,255,0.25)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,128,255,0.1))'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,200,255,0.1)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Hubungi Developer Resmi
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '2rem', textAlign: 'center',
        color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '1px',
      }}>
        Untuk informasi lebih lanjut terkait penyelesaian proses ini, silakan menghubungi pihak Developer Resmi.
        <br />
        <span style={{ color: 'rgba(0,200,255,0.3)', marginTop: '4px', display: 'block' }}>
          © 2026 · ALSITS Portal System · All Rights Reserved
        </span>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}