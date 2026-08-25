import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

function getBirthdayDelta(birthdayStr, today) {
  if (!birthdayStr) return null;
  let month = null, day = null;

  const isoMatch = birthdayStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) { month = parseInt(isoMatch[2]); day = parseInt(isoMatch[3]); }

  if (!month) {
    const dmyMatch = birthdayStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (dmyMatch) { day = parseInt(dmyMatch[1]); month = parseInt(dmyMatch[2]); }
  }
  if (!month) {
    const dmySlash = birthdayStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmySlash) { day = parseInt(dmySlash[1]); month = parseInt(dmySlash[2]); }
  }

  if (!month || !day) return null;

  const thisYear = today.getFullYear();
  const bday = new Date(thisYear, month - 1, day);
  let delta = Math.round((bday - today) / 86400000);
  if (delta < -3) {
    const nextYear = new Date(thisYear + 1, month - 1, day);
    delta = Math.round((nextYear - today) / 86400000);
  }
  return delta;
}

function getBirthdayDateLabel(birthdayStr) {
  if (!birthdayStr) return '';
  let month = null, day = null;
  const isoMatch = birthdayStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) { month = parseInt(isoMatch[2]); day = parseInt(isoMatch[3]); }
  if (!month) {
    const dmyMatch = birthdayStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (dmyMatch) { day = parseInt(dmyMatch[1]); month = parseInt(dmyMatch[2]); }
  }
  if (!month) {
    const dmySlash = birthdayStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmySlash) { day = parseInt(dmySlash[1]); month = parseInt(dmySlash[2]); }
  }
  if (!month || !day) return '';
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${day} ${months[month - 1]}`;
}

function getDeltaLabel(delta) {
  if (delta === 0) return { text: 'Hari ini', color: '#f59e0b' };
  if (delta === 1) return { text: 'Besok', color: '#f59e0b' };
  if (delta > 1) return { text: `${delta} hari lagi`, color: 'rgba(255,255,255,0.35)' };
  if (delta === -1) return { text: '1 hari lalu', color: 'rgba(255,255,255,0.35)' };
  return { text: `${Math.abs(delta)} hari lalu`, color: 'rgba(255,255,255,0.35)' };
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// Deterministic color from name
const AVATAR_COLORS = [
  ['#1e3a5f','#2563eb'],
  ['#1a3a2a','#16a34a'],
  ['#3b1f5e','#7c3aed'],
  ['#5e1f1f','#dc2626'],
  ['#1f3d5e','#0891b2'],
  ['#3d2e00','#d97706'],
];
function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export default function BirthdayNotifBar() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    base44.entities.Alumni.list('-full_name', 2000).then(all => {
      const result = [];
      for (const a of all) {
        if (!a.tanggal_lahir) continue;
        const delta = getBirthdayDelta(a.tanggal_lahir, today);
        if (delta === null) continue;
        if (delta >= -3 && delta <= 7) result.push({ alumni: a, delta });
      }
      result.sort((a, b) => {
        const rank = d => d === 0 ? 0 : d > 0 ? 1 : 2;
        if (rank(a.delta) !== rank(b.delta)) return rank(a.delta) - rank(b.delta);
        // Dalam grup upcoming: terdekat dulu (delta kecil); dalam grup lewat: terbaru dulu (delta terbesar/paling mendekati 0)
        if (a.delta > 0) return a.delta - b.delta;
        return b.delta - a.delta;
      });
      setList(result);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || list.length === 0 || dismissed) return null;

  const todayCount = list.filter(x => x.delta === 0).length;
  const upcomingCount = list.filter(x => x.delta > 0 && x.delta <= 7).length;
  const badge = todayCount > 0 ? `${todayCount} hari ini` : `+${upcomingCount} dalam 7 hari`;

  return (
    <div style={{
      background: '#2a0a0a',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      fontFamily: 'Open Sans, sans-serif',
    }}>
      {/* Header row — seluruh area klik untuk toggle */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 16px',
          minHeight: 36,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Gift icon */}
        <span style={{ fontSize: 14, flexShrink: 0 }}>🎁</span>

        {/* Badge pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: '2px 10px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'Montserrat, sans-serif',
        }}>
          {badge}
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Dismiss — stopPropagation agar tidak toggle */}
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '0 2px', lineHeight: 1 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Expanded list */}
      {expanded && (
        <div style={{ paddingBottom: 8 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 1.5,
            fontFamily: 'Montserrat, sans-serif',
            padding: '2px 16px 8px',
            textTransform: 'uppercase',
          }}>
            7 Hari Terdekat
          </div>

          {list.map(({ alumni, delta }) => {
            const { text, color } = getDeltaLabel(delta);
            const isAlmarhum = ['Almarhum', 'Almarhumah'].includes(alumni.status);
            const [bg1, bg2] = isAlmarhum ? ['#374151','#6b7280'] : avatarColor(alumni.full_name);
            const dateLabel = getBirthdayDateLabel(alumni.tanggal_lahir);

            return (
              <div
                key={alumni.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '7px 16px',
                  borderLeft: delta === 0 ? '2px solid #f59e0b' : '2px solid transparent',
                  background: delta === 0 ? 'rgba(245,158,11,0.04)' : 'none',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {alumni.photo_url
                    ? <img src={alumni.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials(alumni.full_name)
                  }
                </div>

                {/* Name + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {isAlmarhum && <span style={{ fontSize: 11, color: '#9ca3af', marginRight: 4 }}>Alm.</span>}
                    {alumni.full_name ? alumni.full_name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : ''}
                    {alumni.angkatan && (
                      <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginLeft: 6 }}>
                        ({alumni.angkatan.replace(/^S(\d+)$/, 'S-$1')})
                      </span>
                    )}
                  </div>
                  {dateLabel && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{dateLabel}</div>
                  )}
                </div>

                {/* Delta label */}
                <span style={{ fontSize: 12, color, fontWeight: delta <= 1 ? 700 : 400, flexShrink: 0, fontFamily: 'Montserrat, sans-serif' }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}