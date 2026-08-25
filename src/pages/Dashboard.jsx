import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Globe, GraduationCap, Building2, X, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ANGKATAN_OPTIONS = Array.from({ length: 60 }, (_, i) => `S${i + 1}`);

// Palette sets per chart
const PALETTE_INDUSTRI = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#818cf8','#4f46e5','#7c3aed','#9333ea','#a855f7','#c026d3','#db2777','#e11d48'];
const PALETTE_BIDANG   = ['#0ea5e9','#38bdf8','#7dd3fc','#06b6d4','#22d3ee','#67e8f9','#2dd4bf','#34d399','#6ee7b7','#a7f3d0'];
const PALETTE_GELAR    = ['#f59e0b','#fbbf24','#fcd34d','#fde68a'];
const PALETTE_COMPANY  = ['#10b981','#34d399','#6ee7b7','#059669','#047857','#065f46','#0d9488','#0f766e','#0e7490','#155e75'];

export default function Dashboard() {
  const [filterAngkatan, setFilterAngkatan] = useState('all');
  const [drillDown, setDrillDown] = useState(null); // { type, item }

  const { data: alumni, isLoading } = useQuery({
    queryKey: ['alumni-dashboard'],
    queryFn: () => base44.entities.Alumni.list('-created_date', 1000),
    initialData: [],
  });

  const filtered = useMemo(() => {
    if (filterAngkatan === 'all') return alumni;
    return alumni.filter(a => a.angkatan === filterAngkatan);
  }, [alumni, filterAngkatan]);

  const totalAlumni = filtered.length;
  const luarNegeri = filtered.filter(a => a.domisili_negara && a.domisili_negara !== 'Indonesia').length;
  const luarNegeriPct = totalAlumni > 0 ? ((luarNegeri / totalAlumni) * 100).toFixed(1) : 0;

  const gelarData = useMemo(() => {
    const map = {};
    filtered.forEach(a => { const g = a.gelar || 'S1'; map[g] = (map[g] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const bidangData = useMemo(() => {
    const map = {};
    filtered.forEach(a => { if (a.bidang_keahlian) map[a.bidang_keahlian] = (map[a.bidang_keahlian] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const industriData = useMemo(() => {
    const map = {};
    filtered.forEach(a => { if (a.bidang_industri) map[a.bidang_industri] = (map[a.bidang_industri] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const angkatanData = useMemo(() => {
    const map = {};
    alumni.forEach(a => { if (a.angkatan) map[a.angkatan] = (map[a.angkatan] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => {
      return parseInt(a.name.replace('S', '')) - parseInt(b.name.replace('S', ''));
    });
  }, [alumni]);

  const companyData = useMemo(() => {
    const map = {};
    filtered.forEach(a => { if (a.perusahaan) map[a.perusahaan] = (map[a.perusahaan] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [filtered]);

  const topIndustri = industriData.length > 0 ? industriData[0].name : '-';

  // Drill down: alumni in a segment
  const drillAlumni = useMemo(() => {
    if (!drillDown) return [];
    const { type, item } = drillDown;
    return filtered.filter(a => {
      if (type === 'industri') return a.bidang_industri === item;
      if (type === 'bidang') return a.bidang_keahlian === item;
      if (type === 'gelar') return (a.gelar || 'S1') === item;
      if (type === 'company') return a.perusahaan === item;
      return false;
    });
  }, [drillDown, filtered]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-primary font-semibold text-sm mb-1 tracking-widest uppercase">Analytics</p>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Statistik Alumni</h1>
            <p className="text-muted-foreground text-sm mt-1">Data persebaran & analitik komunitas alumni</p>
          </div>
          <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
            <SelectTrigger className="w-44 bg-secondary border-border shadow-sm text-foreground">
              <SelectValue placeholder="Filter Angkatan" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">Semua Angkatan</SelectItem>
              {ANGKATAN_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ModernStatCard icon={Users} label="Total Alumni" value={totalAlumni} sub="dalam filter" grad="from-indigo-500 to-purple-600" />
          <ModernStatCard icon={Globe} label="Luar Negeri" value={`${luarNegeriPct}%`} sub={`${luarNegeri} alumni`} grad="from-cyan-500 to-blue-600" />
          <ModernStatCard icon={GraduationCap} label="Spesialisasi" value={bidangData.length} sub="bidang keahlian" grad="from-emerald-500 to-teal-600" />
          <ModernStatCard icon={Building2} label="Industri #1" value={topIndustri} sub="terbanyak" grad="from-orange-500 to-rose-500" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Industri Pie */}
          <GradientCard
            title="Persebaran Industri"
            count={`${industriData.length} segmen`}
            grad="from-indigo-50 via-purple-50 to-violet-100"
            border="border-indigo-200"
          >
            {industriData.length > 0 ? (
              <ModernPieChart
                data={industriData}
                palette={PALETTE_INDUSTRI}
                total={totalAlumni}
                onSliceClick={(item) => setDrillDown({ type: 'industri', item: item.name })}
              />
            ) : <EmptyChart />}
          </GradientCard>

          {/* Bidang Keahlian Bar */}
          <GradientCard
            title="Bidang Keahlian"
            count={`${bidangData.length} bidang`}
            grad="from-cyan-50 via-sky-50 to-blue-100"
            border="border-sky-200"
          >
            {bidangData.length > 0 ? (
              <ModernBarChart
                data={bidangData}
                palette={PALETTE_BIDANG}
                onBarClick={(item) => setDrillDown({ type: 'bidang', item: item.name })}
              />
            ) : <EmptyChart />}
          </GradientCard>

          {/* Gelar Pie */}
          <GradientCard
            title="Distribusi Gelar"
            count={`${gelarData.length} jenjang`}
            grad="from-amber-50 via-yellow-50 to-orange-100"
            border="border-amber-200"
          >
            {gelarData.length > 0 ? (
              <ModernPieChart
                data={gelarData}
                palette={PALETTE_GELAR}
                total={totalAlumni}
                onSliceClick={(item) => setDrillDown({ type: 'gelar', item: item.name })}
              />
            ) : <EmptyChart />}
          </GradientCard>

          {/* Top Company Bar */}
          <GradientCard
            title="Top 10 Perusahaan"
            count={`${companyData.length} perusahaan`}
            grad="from-emerald-50 via-green-50 to-teal-100"
            border="border-emerald-200"
          >
            {companyData.length > 0 ? (
              <ModernBarChart
                data={companyData}
                palette={PALETTE_COMPANY}
                onBarClick={(item) => setDrillDown({ type: 'company', item: item.name })}
              />
            ) : <EmptyChart />}
          </GradientCard>
        </div>

        {/* Angkatan Chart — full width */}
        <GradientCard
          title="Alumni per Angkatan"
          count={`${alumni.length} total alumni`}
          grad="from-slate-50 via-gray-50 to-zinc-100"
          border="border-gray-200"
          className="mb-6"
        >
          {angkatanData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={angkatanData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-45} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', fontSize: '13px' }} />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Alumni" />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </GradientCard>

      </div>

      {/* Drill Down Modal */}
      {drillDown && (
        <DrillDownModal
          drillDown={drillDown}
          alumni={drillAlumni}
          onClose={() => setDrillDown(null)}
        />
      )}
    </div>
  );
}

/* ── Sub-components ── */

function ModernStatCard({ icon: Icon, label, value, sub, grad }) {
  return (
    <div className={`bg-gradient-to-br ${grad} rounded-2xl p-5 text-white shadow-lg shadow-black/10`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-white/50" />
      </div>
      <div className="font-heading font-bold text-2xl md:text-3xl text-white truncate">{value}</div>
      <div className="text-white/90 text-sm font-medium mt-1">{label}</div>
      {sub && <div className="text-white/60 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function GradientCard({ title, count, grad, border, children, className = '' }) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">{title}</h3>
        <span className="text-xs font-medium bg-secondary text-muted-foreground px-3 py-1 rounded-full border border-border">{count}</span>
      </div>
      {children}
    </div>
  );
}

function ModernPieChart({ data, palette, total, onSliceClick }) {
  const [activeIdx, setActiveIdx] = useState(null);
  // Only show top 8, rest as "Lainnya"
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData = rest.length > 0
    ? [...top, { name: 'Lainnya', value: rest.reduce((s, d) => s + d.value, 0) }]
    : top;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100 text-sm">
        <div className="font-semibold text-gray-800">{d.name}</div>
        <div className="text-indigo-600 font-bold text-lg">{d.value}</div>
        <div className="text-gray-400 text-xs">{total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}% dari total</div>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            onClick={(d) => onSliceClick && onSliceClick(d)}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={palette[i % palette.length]}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.6}
                stroke="white" strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="w-full flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {chartData.map((d, i) => (
          <button
            key={i}
            onClick={() => onSliceClick && onSliceClick(d)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: palette[i % palette.length] }} />
            <span className="truncate max-w-[90px]">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModernBarChart({ data, palette, onBarClick }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100 text-sm">
        <div className="font-semibold text-gray-800 max-w-[180px] break-words">{payload[0].payload.name}</div>
        <div className="text-indigo-600 font-bold text-lg">{payload[0].value} alumni</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: '#64748b' }}
          width={110}
          tickFormatter={(v) => v.length > 16 ? v.slice(0, 16) + '…' : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          onClick={(d) => onBarClick && onBarClick(d)}
          style={{ cursor: 'pointer' }}
          name="Alumni"
        >
          {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DrillDownModal({ drillDown, alumni, onClose }) {
  const labelMap = { industri: 'Industri', bidang: 'Bidang Keahlian', gelar: 'Gelar', company: 'Perusahaan' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{labelMap[drillDown.type]}</p>
            <h2 className="font-heading font-bold text-lg text-gray-800">{drillDown.item}</h2>
            <p className="text-sm text-indigo-600 font-medium">{alumni.length} alumni</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {alumni.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Tidak ada data.</p>
          ) : alumni.map((a, i) => (
            <div key={a.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {a.full_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-800 truncate">{a.full_name}</div>
                <div className="text-xs text-gray-400 truncate">{a.jabatan || ''}{a.jabatan && a.perusahaan ? ' · ' : ''}{a.perusahaan || ''}</div>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium shrink-0">{a.angkatan}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[240px] flex flex-col items-center justify-center text-gray-400">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        <TrendingUp className="w-5 h-5 text-gray-300" />
      </div>
      <p className="text-sm">Belum ada data</p>
    </div>
  );
}