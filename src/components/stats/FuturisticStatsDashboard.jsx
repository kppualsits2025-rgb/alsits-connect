import React, { useState, useEffect, useRef } from 'react';
import { Users, Globe, GraduationCap, Building2, TrendingUp, Award, Zap, BarChart3, Activity } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend,
  AreaChart, Area
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PALETTE_INDUSTRI = ['#6366f1','#8b5cf6','#a78bfa','#06b6d4','#22d3ee','#4f46e5','#7c3aed','#9333ea','#a855f7','#c026d3','#db2777','#e11d48'];
const PALETTE_BIDANG   = ['#0ea5e9','#38bdf8','#06b6d4','#22d3ee','#2dd4bf','#34d399','#6ee7b7','#a7f3d0','#67e8f9','#7dd3fc'];
const PALETTE_COMPANY  = ['#10b981','#34d399','#6ee7b7','#059669','#047857','#0d9488','#0f766e','#0e7490','#155e75','#14b8a6'];
const ANGKATAN_OPTIONS = Array.from({ length: 60 }, (_, i) => `S${i + 1}`);

// ── Animated Counter ──
function AnimatedNumber({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const strVal = String(value);

  // Jika nilai bukan numerik (misal: nama industri), tampilkan langsung tanpa animasi
  const isNumeric = /^[\d.%+,]+$/.test(strVal.replace(/\s/g, ''));
  const numVal = isNumeric ? parseFloat(strVal.replace(/[^0-9.]/g, '')) || 0 : 0;
  const suffix = isNumeric ? strVal.replace(/[0-9.]/g, '') : '';

  useEffect(() => {
    if (!isNumeric) return;
    let raf;
    startRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * numVal * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [numVal, duration, isNumeric]);

  if (!isNumeric) return <span className="text-xl leading-tight break-words">{strVal}</span>;
  return <span>{Number.isInteger(numVal) ? Math.round(display) : display.toFixed(1)}{suffix}</span>;
}

// ── Glowing Stat Card ──
function GlowStatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const colorMap = {
    indigo:  { glow: 'rgba(99,102,241,0.4)',   border: '#6366f1', bg: 'rgba(99,102,241,0.08)',   text: '#818cf8', accent: '#6366f1' },
    cyan:    { glow: 'rgba(6,182,212,0.4)',     border: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   text: '#22d3ee', accent: '#06b6d4' },
    emerald: { glow: 'rgba(16,185,129,0.4)',    border: '#10b981', bg: 'rgba(16,185,129,0.08)',  text: '#34d399', accent: '#10b981' },
    amber:   { glow: 'rgba(245,158,11,0.4)',    border: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', accent: '#f59e0b' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 cursor-default group transition-transform hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, rgba(15,20,40,0.95) 0%, ${c.bg} 100%)`,
        border: `1px solid ${c.border}40`,
        boxShadow: `0 0 30px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Animated bg orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${c.accent}, transparent)` }} />

      {/* Grid lines decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `linear-gradient(${c.border} 1px, transparent 1px), linear-gradient(90deg, ${c.border} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${c.bg}`, border: `1px solid ${c.border}50`, boxShadow: `0 0 15px ${c.glow}` }}>
            <Icon className="w-5 h-5" style={{ color: c.accent }} />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold tracking-widest"
            style={{ color: c.text, background: `${c.bg}`, border: `1px solid ${c.border}30` }}>
            <Zap className="w-2.5 h-2.5" /> LIVE
          </div>
        </div>

        <div className="font-heading font-black text-white mb-1 tabular-nums leading-tight"
          style={{ fontSize: typeof value === 'string' && value.length > 8 ? '1.25rem' : '1.875rem' }}>
          <AnimatedNumber value={value} />
        </div>
        <div className="font-heading font-semibold text-sm mb-0.5" style={{ color: c.text }}>{label}</div>
        {sub && <div className="text-xs text-white/40">{sub}</div>}

        {/* Progress bar */}
        <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: `rgba(255,255,255,0.05)` }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: '70%', background: `linear-gradient(90deg, ${c.border}, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

// ── Futuristic Chart Card ──
function FuturisticCard({ title, subtitle, icon: Icon, accentColor = '#6366f1', children, colSpan = 1 }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${colSpan === 2 ? 'lg:col-span-2' : ''}`}
      style={{
        background: 'linear-gradient(145deg, rgba(13,18,38,0.98) 0%, rgba(20,28,55,0.95) 100%)',
        border: `1px solid ${accentColor}30`,
        boxShadow: `0 0 40px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{ background: `radial-gradient(circle at top right, ${accentColor}, transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 w-20 h-20 opacity-5"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }} />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)' }} />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
                <Icon className="w-4 h-4" style={{ color: accentColor }} />
              </div>
            )}
            <div>
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-widest">{title}</h3>
              {subtitle && <p className="text-[10px] text-white/40 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
            <span className="text-[10px] font-bold tracking-wider" style={{ color: accentColor }}>ACTIVE</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Custom Tooltip ──
function FuturisticTooltip({ active, payload, label, accentColor = '#6366f1' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,15,35,0.97)',
      border: `1px solid ${accentColor}50`,
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: `0 0 20px ${accentColor}30`,
    }}>
      <div className="text-xs text-white/50 mb-1 font-heading">{label || payload[0]?.payload?.name}</div>
      <div className="font-heading font-bold text-lg" style={{ color: accentColor }}>{payload[0]?.value}</div>
      {payload[0]?.payload?.name && label !== payload[0]?.payload?.name && (
        <div className="text-xs text-white/40 mt-0.5 max-w-[150px] break-words">{payload[0]?.payload?.name}</div>
      )}
    </div>
  );
}

// ── Pie Chart ──
function FuturisticPie({ data, palette, total }) {
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData = rest.length > 0
    ? [...top, { name: 'Lainnya', value: rest.reduce((s, d) => s + d.value, 0) }]
    : top;

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight="800" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const CustomTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const color = palette[chartData.indexOf(d) % palette.length];
    return (
      <div style={{ background: 'rgba(10,15,35,0.97)', border: `1px solid ${color}60`, borderRadius: 12, padding: '10px 14px', boxShadow: `0 0 20px ${color}30` }}>
        <div className="text-xs text-white/50 mb-1">{d.name}</div>
        <div className="font-heading font-bold text-xl" style={{ color }}>{d.value}</div>
        <div className="text-xs text-white/40">{total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}% dari total</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <defs>
            {chartData.map((_, i) => (
              <filter key={i} id={`glow-pie-${i}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={88}
            paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]}
                stroke={palette[i % palette.length]} strokeWidth={0.5}
                style={{ filter: `drop-shadow(0 0 6px ${palette[i % palette.length]}80)` }} />
            ))}
          </Pie>
          <Tooltip content={<CustomTip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2">
        {chartData.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: palette[i % palette.length], boxShadow: `0 0 6px ${palette[i % palette.length]}` }} />
            <span className="truncate max-w-[80px]">{d.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal Bar Chart ──
function FuturisticHBar({ data, palette }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 30, top: 4, bottom: 4 }}>
        <defs>
          {data.map((_, i) => (
            <linearGradient key={i} id={`hbar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette[i % palette.length]} stopOpacity="1" />
              <stop offset="100%" stopColor={palette[i % palette.length]} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} width={115}
          tickFormatter={v => v.length > 16 ? v.slice(0, 16) + '…' : v} axisLine={false} tickLine={false} />
        <Tooltip content={<FuturisticTooltip accentColor={palette[0]} />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Alumni" background={{ fill: 'rgba(255,255,255,0.02)', radius: [0, 6, 6, 0] }}>
          {data.map((_, i) => (
            <Cell key={i} fill={`url(#hbar-grad-${i})`}
              style={{ filter: `drop-shadow(0 0 4px ${palette[i % palette.length]}60)` }} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Area / Column Angkatan ──
function AngkatanAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
          <filter id="areaGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }}
          interval={0} angle={-45} textAnchor="end" height={55} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<FuturisticTooltip accentColor="#6366f1" />} />
        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5}
          fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#818cf8', stroke: '#6366f1', strokeWidth: 2 }}
          style={{ filter: 'url(#areaGlow)' }} name="Alumni" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Radial Gelar Chart ──
function GelarRadialChart({ data, total }) {
  const palette = ['#f59e0b', '#6366f1', '#06b6d4', '#10b981'];
  const chartData = data.map((d, i) => ({
    ...d,
    fill: palette[i % palette.length],
    pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%"
          data={chartData} startAngle={90} endAngle={-270}>
          <defs>
            {chartData.map((d, i) => (
              <radialGradient key={i} id={`rgrad-${i}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={d.fill} stopOpacity="1" />
                <stop offset="100%" stopColor={d.fill} stopOpacity="0.4" />
              </radialGradient>
            ))}
          </defs>
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.03)' }}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={`url(#rgrad-${i})`}
                style={{ filter: `drop-shadow(0 0 6px ${d.fill}80)` }} />
            ))}
          </RadialBar>
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: 'rgba(10,15,35,0.97)', border: `1px solid ${d.fill}50`, borderRadius: 12, padding: '10px 14px', boxShadow: `0 0 20px ${d.fill}30` }}>
                <div className="text-xs text-white/50 mb-1">{d.name}</div>
                <div className="font-heading font-bold text-xl" style={{ color: d.fill }}>{d.value}</div>
                <div className="text-xs text-white/40">{d.pct}%</div>
              </div>
            );
          }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill, boxShadow: `0 0 6px ${d.fill}` }} />
            <span className="text-white/60">{d.name}</span>
            <span className="font-bold" style={{ color: d.fill }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──────────────────────────────────────────────────────────────
export default function FuturisticStatsDashboard({
  totalAlumni, luarNegeriPct, luarNegeri, bidangData, industriData,
  angkatanData, gelarData, companyData, topIndustri, totalAll,
  filterAngkatan, setFilterAngkatan,
}) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%),
          linear-gradient(180deg, #060a18 0%, #0a0f22 40%, #070c1a 100%)
        `,
      }}
    >
      {/* Animated grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute top-60 right-1/4 w-56 h-56 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 rounded-full bg-indigo-500" style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }} />
              <span className="text-[11px] font-heading font-bold tracking-[0.3em] uppercase text-indigo-400">Analytics · Real-time Data</span>
            </div>
            <h1 className="font-heading font-black text-4xl text-white leading-tight"
              style={{ textShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              Statistik <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #06b6d4)' }}>Alumni</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 font-body">
              Data persebaran & analitik komunitas alumni Teknik Sipil ITS
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {totalAll} Alumni Terdaftar
            </div>
            <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
              <SelectTrigger className="w-44 text-white text-sm h-9"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }}>
                <SelectValue placeholder="Filter Angkatan" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-[#0d1229] border-indigo-500/30">
                <SelectItem value="all">Semua Angkatan</SelectItem>
                {ANGKATAN_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlowStatCard icon={Users} label="Total Alumni" value={totalAlumni} sub="dalam filter aktif" color="indigo" delay={0} />
          <GlowStatCard icon={Globe} label="Luar Negeri" value={`${luarNegeriPct}%`} sub={`${luarNegeri} alumni`} color="cyan" delay={100} />
          <GlowStatCard icon={GraduationCap} label="Spesialisasi" value={bidangData.length} sub="bidang keahlian" color="emerald" delay={200} />
          <GlowStatCard icon={Building2} label="Industri #1" value={topIndustri} sub="terbanyak" color="amber" delay={300} />
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <FuturisticCard title="Persebaran Industri" subtitle={`${industriData.length} segmen`} icon={BarChart3} accentColor="#6366f1">
            {industriData.length > 0
              ? <FuturisticPie data={industriData} palette={PALETTE_INDUSTRI} total={totalAlumni} />
              : <EmptyState />}
          </FuturisticCard>

          <FuturisticCard title="Bidang Keahlian" subtitle={`${bidangData.length} bidang`} icon={GraduationCap} accentColor="#06b6d4">
            {bidangData.length > 0
              ? <FuturisticHBar data={bidangData} palette={PALETTE_BIDANG} />
              : <EmptyState />}
          </FuturisticCard>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <FuturisticCard title="Distribusi Gelar" subtitle={`${gelarData.length} jenjang`} icon={Award} accentColor="#f59e0b">
            {gelarData.length > 0
              ? <GelarRadialChart data={gelarData} total={totalAlumni} />
              : <EmptyState />}
          </FuturisticCard>

          <FuturisticCard title="Top 10 Perusahaan" subtitle={`${companyData.length} perusahaan`} icon={Building2} accentColor="#10b981">
            {companyData.length > 0
              ? <FuturisticHBar data={companyData} palette={PALETTE_COMPANY} />
              : <EmptyState />}
          </FuturisticCard>
        </div>

        {/* ── Angkatan full-width ── */}
        <FuturisticCard title="Alumni per Angkatan" subtitle={`${totalAll} total alumni · tren lintas generasi`} icon={TrendingUp} accentColor="#6366f1">
          {angkatanData.length > 0
            ? <AngkatanAreaChart data={angkatanData} />
            : <EmptyState />}
        </FuturisticCard>

        {/* Footer line */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between text-xs text-white/20"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span>ALSITS · Alumni Teknik Sipil ITS</span>
          <span>Data diperbarui secara otomatis</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <TrendingUp className="w-5 h-5 text-indigo-400/40" />
      </div>
      <p className="text-sm text-white/20">Belum ada data</p>
    </div>
  );
}