import React, { useState, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, Pencil, ShieldCheck, ShieldOff, Phone, Mail,
  CheckCircle2, XCircle, Save, X, Printer
} from 'lucide-react';

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Filter out deceased alumni — used consistently for ALL stats & lists
function isActive(a) {
  const s = (a.status || '').toLowerCase();
  return s !== 'almarhum' && s !== 'almarhumah';
}

export default function AlumniClaimVerifier() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editTarget, setEditTarget] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const printRef = useRef();

  const { data: alumni = [], isLoading } = useQuery({
    queryKey: ['admin-alumni-claim-list'],
    queryFn: () => base44.entities.Alumni.list('full_name', 500),
  });

  // Active alumni only — base for all stats and lists
  const activeAlumni = useMemo(() => alumni.filter(isActive), [alumni]);

  const stats = useMemo(() => ({
    total: activeAlumni.length,
    verified: activeAlumni.filter(a => a.is_verified).length,
    hasEmail: activeAlumni.filter(a => a.email).length,
    hasPhone: activeAlumni.filter(a => a.telepon).length,
  }), [activeAlumni]);

  const filtered = useMemo(() => {
    return activeAlumni
      .filter(a => {
        if (filterStatus === 'verified' && !a.is_verified) return false;
        if (filterStatus === 'unverified' && a.is_verified) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            (a.full_name || '').toLowerCase().includes(q) ||
            (a.email || '').toLowerCase().includes(q) ||
            (a.telepon || '').includes(q) ||
            (a.angkatan || '').toLowerCase().includes(q) ||
            (a.nrm_nrp || '').includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const nA = parseInt((a.angkatan || '').replace(/\D/g, '')) || 999;
        const nB = parseInt((b.angkatan || '').replace(/\D/g, '')) || 999;
        if (nA !== nB) return nA - nB;
        return (a.full_name || '').localeCompare(b.full_name || '', 'id');
      });
  }, [activeAlumni, search, filterStatus]);

  const openEdit = (a) => {
    setEditTarget(a);
    setEditData({
      email: a.email || '',
      email2: a.email2 || '',
      telepon: a.telepon || '',
      telepon2: a.telepon2 || '',
      is_verified: a.is_verified || false,
    });
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    await base44.entities.Alumni.update(editTarget.id, editData);
    qc.invalidateQueries(['admin-alumni-claim-list']);
    setSaving(false);
    setEditTarget(null);
  };

  const toggleVerify = async (a) => {
    await base44.entities.Alumni.update(a.id, { is_verified: !a.is_verified });
    qc.invalidateQueries(['admin-alumni-claim-list']);
  };

  const handlePrint = () => {
    const printData = filtered; // print whatever is currently filtered
    const rows = printData.map((a, i) => `
      <tr style="page-break-inside: avoid;">
        <td style="padding:5px 8px; border:1px solid #ccc; text-align:center; font-size:11px;">${i + 1}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; font-size:11px;">${toTitleCase(a.full_name) || '-'}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; text-align:center; font-size:11px;">${a.angkatan || '-'}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; font-size:10px; color:${a.nrm_nrp ? '#111' : '#999'};">${a.nrm_nrp || '-'}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; font-size:10px; color:${a.email ? '#111' : '#cc3300'};">${a.email || '(belum ada)'}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; font-size:10px; color:${a.telepon ? '#111' : '#cc3300'};">${a.telepon || '(belum ada)'}</td>
        <td style="padding:5px 8px; border:1px solid #ccc; text-align:center; font-size:10px; color:${a.is_verified ? '#166534' : '#6b7280'};">${a.is_verified ? '✓' : '-'}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Daftar Kontak Alumni ALSITS</title>
        <style>
          @page { size: A4 landscape; margin: 15mm 12mm; }
          body { font-family: Arial, sans-serif; color: #111; background: white; }
          h2 { font-size: 15px; margin: 0 0 2px 0; }
          p { font-size: 11px; margin: 0 0 10px 0; color: #555; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #1e3a5f; color: white; padding: 6px 8px; font-size: 11px; border: 1px solid #ccc; text-align: left; }
          tr:nth-child(even) { background: #f5f8ff; }
          .note { font-size: 10px; color: #cc3300; margin-top: 10px; }
          .footer { font-size: 9px; color: #aaa; margin-top: 14px; border-top: 1px solid #eee; padding-top: 6px; }
        </style>
      </head>
      <body>
        <h2>Daftar Kontak Alumni – Dasar Klaim Profil ALSITS</h2>
        <p>Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · Total: ${printData.length} alumni · Filter: ${filterStatus === 'all' ? 'Semua' : filterStatus === 'verified' ? 'Terverifikasi' : 'Belum Klaim'}</p>
        <table>
          <thead>
            <tr>
              <th style="width:32px; text-align:center;">No</th>
              <th style="width:180px;">Nama Lengkap</th>
              <th style="width:50px; text-align:center;">Angk.</th>
              <th style="width:90px;">NRP/NRM</th>
              <th style="width:200px;">Alamat Email</th>
              <th style="width:130px;">No. Telepon/HP</th>
              <th style="width:50px; text-align:center;">Verif.</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="note">⚠ Data merah = belum tersedia, perlu di-update agar member dapat melakukan klaim profil.</p>
        <p class="footer">ALSITS – Alumni Teknik Sipil ITS · alsits.id · Dokumen ini bersifat internal dan rahasia.</p>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div>
      {/* Stats — all computed from activeAlumni only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Alumni', value: stats.total, color: 'text-foreground' },
          { label: 'Terverifikasi', value: stats.verified, color: 'text-emerald-400' },
          { label: 'Punya Email', value: stats.hasEmail, color: 'text-blue-400' },
          { label: 'Punya Telepon', value: stats.hasPhone, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Print Button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari nama, email, telepon, NRP, angkatan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'verified', label: '✓ Terverifikasi' },
            { key: 'unverified', label: '✗ Belum' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                filterStatus === f.key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Printer className="h-4 w-4" /> Cetak PDF
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Menampilkan <strong className="text-foreground">{filtered.length}</strong> alumni
      </p>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Memuat data...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => (
            <Card key={a.id} className="border-0 shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {toTitleCase(a.full_name)?.charAt(0) || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-semibold text-sm text-foreground">{toTitleCase(a.full_name)}</span>
                    <Badge variant="secondary" className="text-[10px]">{a.angkatan}</Badge>
                    {a.nrm_nrp && <span className="text-[10px] text-muted-foreground font-mono">{a.nrm_nrp}</span>}
                    {a.is_verified
                      ? <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border">✓ Terverifikasi</Badge>
                      : <Badge className="text-[10px] bg-muted text-muted-foreground border-border border">Belum Klaim</Badge>
                    }
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className={`flex items-center gap-1 text-xs ${a.email ? 'text-muted-foreground' : 'text-destructive/70 italic'}`}>
                      <Mail className="h-3 w-3 shrink-0" />
                      {a.email || 'belum ada email'}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${a.telepon ? 'text-muted-foreground' : 'text-destructive/70 italic'}`}>
                      <Phone className="h-3 w-3 shrink-0" />
                      {a.telepon || 'belum ada telepon'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleVerify(a)}
                    title={a.is_verified ? 'Batalkan Verifikasi' : 'Tandai Terverifikasi'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      a.is_verified
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                        : 'text-muted-foreground border-border hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10'
                    }`}
                  >
                    {a.is_verified ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Edit email & telepon"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Tidak ada alumni sesuai filter</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-base flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Edit Kontak — {toTitleCase(editTarget?.full_name)}
              <Badge variant="secondary" className="text-xs ml-1">{editTarget?.angkatan}</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-xs text-muted-foreground">
              ⚠️ Data email & telepon ini digunakan sebagai <strong className="text-foreground">dasar verifikasi klaim profil</strong> oleh member. Pastikan data akurat sebelum disimpan.
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Email Utama *</Label>
                <Input type="email" placeholder="email@domain.com"
                  value={editData.email || ''}
                  onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Email Kedua</Label>
                <Input type="email" placeholder="email2@domain.com (opsional)"
                  value={editData.email2 || ''}
                  onChange={e => setEditData(d => ({ ...d, email2: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Telepon / HP Utama *</Label>
                <Input type="tel" placeholder="08xxxxxxxxxx"
                  value={editData.telepon || ''}
                  onChange={e => setEditData(d => ({ ...d, telepon: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Telepon Kedua</Label>
                <Input type="tel" placeholder="08xxxxxxxxxx (opsional)"
                  value={editData.telepon2 || ''}
                  onChange={e => setEditData(d => ({ ...d, telepon2: e.target.value }))} />
              </div>
            </div>

            <button
              onClick={() => setEditData(d => ({ ...d, is_verified: !d.is_verified }))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm ${
                editData.is_verified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-secondary/40 border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {editData.is_verified ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
              <span>{editData.is_verified ? 'Profil Terverifikasi oleh Admin' : 'Belum Diverifikasi'}</span>
              <span className="ml-auto text-xs opacity-60">klik untuk toggle</span>
            </button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditTarget(null)} className="flex-1" disabled={saving}>
                <X className="h-4 w-4 mr-1" /> Batal
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                <Save className="h-4 w-4 mr-1" />
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}