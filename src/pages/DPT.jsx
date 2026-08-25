import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Search, Users, ChevronDown, ChevronUp, ChevronsUpDown, Printer, FileDown } from 'lucide-react';

export default function DPT() {
  const [search, setSearch] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua');
  const [selectedGelar, setSelectedGelar] = useState('Semua');
  const [sortCol, setSortCol] = useState('angkatan');
  const [sortDir, setSortDir] = useState('asc');

  const { data: rawAlumni = [], isLoading } = useQuery({
    queryKey: ['alumni-dpt'],
    queryFn: () => base44.entities.Alumni.list('-tahun_masuk', 2000),
  });

  // Exclude almarhum/almarhumah dari DPT
  const alumni = useMemo(() => rawAlumni.filter(a => {
    const s = (a.status || '').toLowerCase();
    return s !== 'almarhum' && s !== 'almarhumah';
  }), [rawAlumni]);

  const angkatanList = useMemo(() => {
    const set = new Set(alumni.map(a => a.angkatan).filter(Boolean));
    return ['Semua', ...Array.from(set).sort()];
  }, [alumni]);

  const gelarList = useMemo(() => {
    const all = alumni.flatMap(a => a.gelar ? a.gelar.split(',').map(g => g.trim()) : []).filter(Boolean);
    const set = new Set(all);
    return ['Semua', ...Array.from(set).sort()];
  }, [alumni]);

  const filtered = useMemo(() => {
    return alumni.filter(a => {
      const matchAngkatan = selectedAngkatan === 'Semua' || a.angkatan === selectedAngkatan;
      const matchGelar = selectedGelar === 'Semua' || (a.gelar || '').split(',').map(g => g.trim()).includes(selectedGelar);
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (a.full_name || '').toLowerCase().includes(q) ||
        (a.nrm_nrp || '').toLowerCase().includes(q) ||
        (a.angkatan || '').toLowerCase().includes(q);
      return matchAngkatan && matchGelar && matchSearch;
    });
  }, [alumni, selectedAngkatan, selectedGelar, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = '', vb = '';
      if (sortCol === 'full_name') { va = a.full_name || ''; vb = b.full_name || ''; }
      else if (sortCol === 'nrm_nrp') { va = a.nrm_nrp || ''; vb = b.nrm_nrp || ''; }
      else if (sortCol === 'angkatan') { va = a.angkatan || ''; vb = b.angkatan || ''; }
      const cmp = va.localeCompare(vb, 'id');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const handlePrint = (angkatan = null) => {
    const dataToPrint = angkatan
      ? sorted.filter(a => a.angkatan === angkatan)
      : sorted;

    const title = angkatan
      ? `DPT ALSITS — Angkatan ${angkatan}`
      : 'Daftar Pemilih Tetap (DPT) ALSITS';

    const rows = dataToPrint.map((a, i) => `
      <tr>
        <td>${String(i + 1).padStart(3, '0')}</td>
        <td>${a.full_name || '-'}</td>
        <td>${a.nrm_nrp || '—'}</td>
        <td>${a.angkatan || '—'}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 14mm 16mm 14mm 16mm; }
    body { font-family: 'Open Sans', sans-serif; background: #fff; color: #1e293b; font-size: 9.5pt; }
    .header { text-align: center; margin-bottom: 16pt; padding-bottom: 10pt; border-bottom: 2.5pt solid #1d4ed8; }
    .logos { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 8pt; }
    .logos img { height: 40px; }
    .badge { display: inline-block; font-family: 'Montserrat',sans-serif; font-size: 7.5pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #d97706; border: 1px solid #fde68a; background: #fffbeb; padding: 3px 12px; border-radius: 20px; margin-bottom: 6pt; }
    h1 { font-family: 'Montserrat',sans-serif; font-size: 17pt; font-weight: 900; color: #0f172a; margin-bottom: 4pt; }
    .subtitle { font-size: 9pt; color: #64748b; margin-bottom: 6pt; }
    .meta { font-size: 8.5pt; color: #94a3b8; }
    .stats { display: flex; justify-content: center; gap: 24px; margin: 8pt 0 14pt; }
    .stat { text-align: center; }
    .stat-num { font-family: 'Montserrat',sans-serif; font-size: 14pt; font-weight: 900; color: #1d4ed8; }
    .stat-lbl { font-size: 7.5pt; color: #94a3b8; margin-top: 1pt; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; }
    thead tr { background: linear-gradient(90deg, #1e3a8a, #1d4ed8); color: #fff; }
    thead th { font-family: 'Montserrat',sans-serif; font-weight: 700; font-size: 8.5pt; letter-spacing: 0.8px; text-transform: uppercase; padding: 7pt 10pt; text-align: left; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody tr { border-bottom: 0.5pt solid #e2e8f0; page-break-inside: avoid; }
    tbody td { padding: 6pt 10pt; vertical-align: middle; }
    .no { font-family: 'Montserrat',sans-serif; font-weight: 700; color: #94a3b8; font-size: 8.5pt; }
    .nama { font-weight: 600; color: #0f172a; }
    .nrp { font-family: monospace; color: #d97706; font-weight: 600; }
    .ang { display: inline-block; background: #eff6ff; color: #1d4ed8; border: 0.5pt solid #bfdbfe; border-radius: 20px; padding: 1.5pt 8pt; font-family: 'Montserrat',sans-serif; font-weight: 700; font-size: 8pt; }
    .footer { margin-top: 16pt; padding-top: 8pt; border-top: 1pt solid #e2e8f0; display: flex; justify-content: space-between; font-size: 8pt; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logos">
      <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/c03cab494_logo_komjur_sipil_3-removebg-preview.png" alt="ALSITS" />
      <img src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/14e8a5bf5_logoTS.png" alt="ITS" />
    </div>
    <div class="badge">Dokumen Resmi ALSITS</div>
    <h1>${title}</h1>
    <p class="subtitle">Alumni Teknik Sipil — Institut Teknologi Sepuluh Nopember Surabaya</p>
    <p class="meta">Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <div class="stats">
      <div class="stat"><div class="stat-num">${dataToPrint.length}</div><div class="stat-lbl">Total Pemilih</div></div>
      ${angkatan ? '' : `<div class="stat"><div class="stat-num">${new Set(dataToPrint.map(a => a.angkatan)).size}</div><div class="stat-lbl">Angkatan</div></div>`}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:44px">No.</th>
        <th>Nama Lengkap</th>
        <th style="width:160px">NRP</th>
        <th style="width:100px">Angkatan</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    <span>ALSITS — Alumni Teknik Sipil ITS · alsits.id</span>
    <span>Dokumen ini dicetak secara resmi dari sistem ALSITS</span>
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
</body>
</html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronsUpDown className="h-3 w-3 opacity-30" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3" style={{ color: '#f59e0b' }} />
      : <ChevronDown className="h-3 w-3" style={{ color: '#f59e0b' }} />;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 100%)' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0b1f4a 60%, #060d1f 100%)', borderBottom: '3px solid #D4A017' }}
        className="px-4 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)' }}>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f59e0b', fontFamily: 'Montserrat,sans-serif' }}>
            Dokumen Resmi ALSITS
          </span>
        </div>
        <h1 className="font-heading font-black text-3xl md:text-4xl text-white mb-2">Daftar Pemilih Tetap</h1>
        <p className="text-white/50 text-sm max-w-lg mx-auto font-body">
          Data resmi alumni Teknik Sipil ITS yang terdaftar sebagai pemilih dalam Pemilihan Ketua Komisariat Jurusan ALSITS
        </p>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="font-heading font-black text-2xl" style={{ color: '#f59e0b' }}>
              {isLoading ? '...' : sorted.length.toLocaleString('id-ID')}
            </p>
            <p className="text-white/40 text-xs">Tampil</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-heading font-black text-2xl text-white">
              {isLoading ? '...' : alumni.length.toLocaleString('id-ID')}
            </p>
            <p className="text-white/40 text-xs">Total Terdaftar</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-heading font-black text-2xl" style={{ color: '#10b981' }}>
              {isLoading ? '...' : (angkatanList.length - 1)}
            </p>
            <p className="text-white/40 text-xs">Angkatan</p>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Cari nama, NRP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-500/50"
            />
          </div>
          <div className="relative">
            <select value={selectedAngkatan} onChange={e => setSelectedAngkatan(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 rounded-lg text-sm font-semibold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: selectedAngkatan !== 'Semua' ? '#f59e0b' : 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat,sans-serif' }}>
              {angkatanList.map(a => <option key={a} value={a} style={{ background: '#0a1628' }}>{a === 'Semua' ? '🎓 Semua Angkatan' : `Angkatan ${a}`}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-white/40" />
          </div>
          <div className="relative">
            <select value={selectedGelar} onChange={e => setSelectedGelar(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 rounded-lg text-sm font-semibold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: selectedGelar !== 'Semua' ? '#10b981' : 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat,sans-serif' }}>
              {gelarList.map(g => <option key={g} value={g} style={{ background: '#0a1628' }}>{g === 'Semua' ? '📜 Semua Gelar' : `Jenjang ${g}`}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-white/40" />
          </div>

          {/* Print buttons */}
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handlePrint(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: 'rgba(29,78,216,0.25)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer' }}>
              <Printer className="h-4 w-4" /> Cetak Semua
            </button>
            {selectedAngkatan !== 'Semua' && (
              <button onClick={() => handlePrint(selectedAngkatan)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b', fontFamily: 'Montserrat,sans-serif', cursor: 'pointer' }}>
                <FileDown className="h-4 w-4" /> Cetak Angkatan {selectedAngkatan}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>

          {/* Header */}
          <div className="grid text-xs font-bold uppercase tracking-widest px-4 py-3"
            style={{
              gridTemplateColumns: '52px 1fr 160px 120px',
              background: 'linear-gradient(90deg, #0b1f4a, #1e3a8a)',
              borderBottom: '2px solid rgba(212,160,23,0.3)',
              fontFamily: 'Montserrat,sans-serif',
            }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>No.</span>
            <button onClick={() => handleSort('full_name')}
              className="flex items-center gap-1 text-left hover:text-white transition-colors"
              style={{ color: sortCol === 'full_name' ? '#f59e0b' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'inherit', textTransform: 'uppercase', letterSpacing: 'inherit' }}>
              Nama Lengkap <SortIcon col="full_name" />
            </button>
            <button onClick={() => handleSort('nrm_nrp')}
              className="flex items-center gap-1 hover:text-white transition-colors"
              style={{ color: sortCol === 'nrm_nrp' ? '#f59e0b' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'inherit', textTransform: 'uppercase', letterSpacing: 'inherit' }}>
              NRP <SortIcon col="nrm_nrp" />
            </button>
            <button onClick={() => handleSort('angkatan')}
              className="flex items-center gap-1 hover:text-white transition-colors"
              style={{ color: sortCol === 'angkatan' ? '#f59e0b' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 'inherit', textTransform: 'uppercase', letterSpacing: 'inherit' }}>
              Angkatan <SortIcon col="angkatan" />
            </button>
          </div>

          {/* Rows */}
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid px-4 py-3.5 animate-pulse"
                style={{ gridTemplateColumns: '52px 1fr 160px 120px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.07)', width: j === 1 ? '75%' : '60%' }} />
                ))}
              </div>
            ))
          ) : sorted.length === 0 ? (
            <div className="py-20 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-heading font-semibold">Tidak ada data ditemukan</p>
            </div>
          ) : (
            sorted.map((a, idx) => (
              <DPTRow key={a.id} no={idx + 1} alumni={a} />
            ))
          )}
        </div>

        {!isLoading && sorted.length > 0 && (
          <p className="text-center mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Montserrat,sans-serif' }}>
            Menampilkan {sorted.length} dari {alumni.length} alumni terdaftar
            {selectedAngkatan !== 'Semua' && ` · Angkatan ${selectedAngkatan}`}
            {selectedGelar !== 'Semua' && ` · Jenjang ${selectedGelar}`}
          </p>
        )}
      </div>
    </div>
  );
}

// ── ROW ─────────────────────────────────────────────────────────────────────

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function DPTRow({ no, alumni: a }) {
  const isEven = no % 2 === 0;
  const displayName = toTitleCase(a.full_name);

  // Inisial avatar
  const initials = (displayName || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div
      className="grid px-4 py-3 items-center transition-all duration-150"
      style={{
        gridTemplateColumns: '52px 1fr 160px 120px',
        background: isEven ? 'rgba(255,255,255,0.02)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = isEven ? 'rgba(255,255,255,0.02)' : 'transparent'}
    >
      {/* No */}
      <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Montserrat,sans-serif' }}>
        {String(no).padStart(3, '0')}
      </span>

      {/* Nama + Avatar */}
      <div className="flex items-center gap-3 min-w-0">
        {a.photo_url ? (
          <img src={a.photo_url} alt={displayName} className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', fontFamily: 'Montserrat,sans-serif' }}>
            {initials}
          </div>
        )}
        <span className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'Montserrat,sans-serif' }}>
          {displayName || '-'}
        </span>
      </div>

      {/* NRP */}
      <span className="text-sm font-mono" style={{ color: a.nrm_nrp ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}>
        {a.nrm_nrp || '—'}
      </span>

      {/* Angkatan */}
      <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block"
        style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontFamily: 'Montserrat,sans-serif' }}>
        {a.angkatan || '—'}
      </span>
    </div>
  );
}