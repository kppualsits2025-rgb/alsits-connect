import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, CheckCircle, AlertCircle, Clock, Play, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const ANGKATAN_OPTIONS = ['all', 'S32', 'S51'];

export default function BulkInvitePanel() {
  const [filterAngkatan, setFilterAngkatan] = useState('all');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [allInvited, setAllInvited] = useState([]);
  const [allErrors, setAllErrors] = useState([]);
  const [totalAlreadyExists, setTotalAlreadyExists] = useState(0);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const runBatch = async (offset = 0, isFirst = false) => {
    if (isFirst) {
      if (!confirm(`Kirim invite ke semua alumni${filterAngkatan !== 'all' ? ` angkatan ${filterAngkatan}` : ''} yang punya email valid di database?\n\nProses dilakukan per batch 8 alumni. Alumni yang sudah diundang akan dilewati otomatis.`)) return;
      setResult(null);
      setAllInvited([]);
      setAllErrors([]);
      setTotalAlreadyExists(0);
      setError(null);
    }

    setIsRunning(true);

    try {
      const res = await base44.functions.invoke('bulkInviteFromAlumniDB', {
        angkatan: filterAngkatan === 'all' ? null : filterAngkatan,
        offset,
      });
      const data = res.data;
      setResult(data);
      setAllInvited(prev => [...prev, ...(data.details?.invited || [])]);
      setAllErrors(prev => [...prev, ...(data.details?.errors || [])]);
      setTotalAlreadyExists(prev => prev + (data.summary?.already_exists || 0));
      setCurrentOffset(data.next_offset || 0);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Terjadi kesalahan');
    } finally {
      setIsRunning(false);
    }
  };

  const handleInvite = () => runBatch(0, true);
  const handleContinue = () => runBatch(currentOffset, false);

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const now = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const pageW = 210;
    const margin = 14;
    const colW = pageW - margin * 2;

    // Header
    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Laporan Bulk Invite Alumni ALSITS', margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Dicetak: ${now}  ·  Filter: ${result.filter === 'all' ? 'Semua Angkatan' : result.filter}`, margin, 20);
    doc.setTextColor(212, 160, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('alsits.id  ·  Dokumen internal', pageW - margin, 20, { align: 'right' });

    let y = 36;

    // Ringkasan statistik
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Ringkasan Eksekusi', margin, y);
    y += 6;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 5;

    const stats = [
      ['Total Alumni di Database', String(result.summary.total_alumni_in_db)],
      ['Memiliki Email Valid', String(result.summary.total_with_email)],
      ['Berhasil Diundang (sesi ini)', String(allInvited.length)],
      ['Sudah Terdaftar (dilewati)', String(totalAlreadyExists)],
      ['Dilewati (tanpa email)', String(result.summary.skipped_no_email)],
      ['Error', String(allErrors.length)],
      ['Status', result.has_more ? `Belum selesai — sisa ${result.summary.remaining} alumni` : '✓ Semua batch selesai'],
    ];

    doc.setFontSize(9);
    stats.forEach(([label, val]) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(label, margin, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(val, margin + 90, y);
      y += 6;
    });

    y += 4;

    // Daftar berhasil diundang
    if (allInvited.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(16, 100, 50);
      doc.text(`Berhasil Diundang (${allInvited.length})`, margin, y);
      y += 5;
      doc.setDrawColor(180, 220, 180);
      doc.line(margin, y, pageW - margin, y);
      y += 4;

      // Table header
      doc.setFillColor(230, 250, 235);
      doc.rect(margin, y - 3, colW, 6, 'F');
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('No', margin + 1, y + 1);
      doc.text('Angkatan', margin + 10, y + 1);
      doc.text('Nama', margin + 28, y + 1);
      doc.text('Email', margin + 100, y + 1);
      y += 7;

      doc.setFont('helvetica', 'normal');
      allInvited.forEach((r, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        if (i % 2 === 0) { doc.setFillColor(248, 255, 250); doc.rect(margin, y - 3, colW, 5.5, 'F'); }
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(7.5);
        doc.text(String(i + 1), margin + 1, y);
        doc.text(r.angkatan || '-', margin + 10, y);
        const name = (r.name || '').length > 35 ? r.name.substring(0, 33) + '…' : (r.name || '-');
        doc.text(name, margin + 28, y);
        const email = (r.email || '').length > 42 ? r.email.substring(0, 40) + '…' : (r.email || '-');
        doc.text(email, margin + 100, y);
        y += 5.5;
      });
      y += 5;
    }

    // Daftar error
    if (allErrors.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(180, 30, 30);
      doc.text(`Error / Gagal (${allErrors.length})`, margin, y);
      y += 5;
      doc.setDrawColor(220, 180, 180);
      doc.line(margin, y, pageW - margin, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      allErrors.forEach((r, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        if (i % 2 === 0) { doc.setFillColor(255, 248, 248); doc.rect(margin, y - 3, colW, 5.5, 'F'); }
        doc.setTextColor(80, 30, 30);
        doc.setFontSize(7.5);
        const name = (r.name || '').length > 30 ? r.name.substring(0, 28) + '…' : (r.name || '-');
        doc.text(`${i + 1}. ${name}`, margin + 1, y);
        doc.text(r.angkatan || '-', margin + 85, y);
        const reason = (r.reason || '').length > 38 ? r.reason.substring(0, 36) + '…' : (r.reason || '-');
        doc.text(reason, margin + 100, y);
        y += 5.5;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`ALSITS – Alumni Teknik Sipil ITS  ·  alsits.id  ·  Halaman ${p} dari ${pageCount}`, pageW / 2, 290, { align: 'center' });
    }

    const filename = `BulkInvite_${result.filter === 'all' ? 'Semua' : result.filter}_${now.replace(/ /g, '_')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Bulk Invite Alumni</h3>
            <p className="text-xs text-muted-foreground">Kirim undangan login ke semua alumni yang punya email valid di database ALSITS</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-5 text-sm text-amber-200">
          <p className="font-semibold mb-1">ℹ️ Cara kerja:</p>
          <ul className="space-y-1 text-xs text-amber-200/80 list-disc list-inside">
            <li>Sistem membaca semua alumni di database yang punya email valid</li>
            <li>Mengirim email undangan ke masing-masing alumni</li>
            <li>Alumni yang sudah pernah diundang / sudah terdaftar akan dilewati otomatis</li>
            <li>Alumni tanpa email atau email "belum ada" akan dilewati</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Filter Angkatan</label>
            <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Angkatan (S32 + S51)</SelectItem>
                <SelectItem value="S32">S32 saja</SelectItem>
                <SelectItem value="S51">S51 saja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleInvite}
              disabled={isRunning}
              className="gap-2 min-w-[160px]"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Mulai Batch Pertama
                </>
              )}
            </Button>
            {result?.has_more && !isRunning && (
              <Button
                onClick={handleContinue}
                variant="outline"
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Lanjutkan Batch Berikutnya ({result.summary?.remaining} tersisa)
              </Button>
            )}
          </div>
        </div>

        {isRunning && (
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary/80">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Sedang mengirim undangan... Proses ini bisa memakan waktu beberapa menit tergantung jumlah alumni. Jangan tutup halaman ini.
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Hasil */}
      {result && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading font-semibold text-foreground">Hasil Bulk Invite</h3>
            <Badge className="bg-secondary text-muted-foreground border-0 text-xs">
              Filter: {result.filter === 'all' ? 'Semua Angkatan' : result.filter}
            </Badge>
            <div className="ml-auto">
              <Button onClick={downloadPDF} variant="outline" size="sm" className="gap-2 text-xs">
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox icon={Users} label="Total di DB" value={result.summary.total_alumni_in_db} color="text-foreground" />
            <StatBox icon={Mail} label="Punya Email" value={result.summary.total_with_email} color="text-blue-400" />
            <StatBox icon={CheckCircle} label="Terundang (sesi ini)" value={allInvited.length} color="text-emerald-400" />
            <StatBox icon={Users} label="Sudah Ada" value={totalAlreadyExists} color="text-amber-400" />
          </div>

          <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
            <span>⏭️ Dilewati (no email): <strong className="text-foreground">{result.summary.skipped_no_email}</strong></span>
            <span>⚠️ Error: <strong className="text-destructive">{allErrors.length}</strong></span>
            {result.has_more && <span className="text-amber-400 font-semibold">▶ Masih ada {result.summary.remaining} alumni tersisa — klik "Lanjutkan"</span>}
            {!result.has_more && <span className="text-emerald-400 font-semibold">✅ Semua batch selesai</span>}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-primary hover:underline"
          >
            {showDetails ? 'Sembunyikan' : 'Tampilkan'} detail lengkap
          </button>

          {showDetails && (
            <div className="space-y-3 text-xs">
              {allInvited.length > 0 && (
                <div>
                  <p className="font-semibold text-emerald-400 mb-1">✅ Berhasil diundang ({allInvited.length}):</p>
                  <div className="max-h-48 overflow-y-auto space-y-1 bg-secondary/30 rounded-lg p-3">
                    {allInvited.map((r, i) => (
                      <div key={i} className="flex gap-2 text-muted-foreground">
                        <span className="text-emerald-400 shrink-0">{r.angkatan}</span>
                        <span>{r.name}</span>
                        <span className="text-muted-foreground/50">— {r.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {allErrors.length > 0 && (
                <div>
                  <p className="font-semibold text-destructive mb-1">❌ Error ({allErrors.length}) — coba lanjutkan batch berikutnya:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-destructive/5 rounded-lg p-3">
                    {allErrors.map((r, i) => (
                      <div key={i} className="text-muted-foreground">
                        <span>{r.name}</span> — <span className="text-destructive/70">{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-secondary/40 rounded-xl p-4 text-center">
      <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
      <p className={`font-heading font-bold text-xl ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}