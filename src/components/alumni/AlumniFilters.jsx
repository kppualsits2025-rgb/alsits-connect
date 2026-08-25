import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';

const ANGKATAN_OPTIONS = Array.from({ length: 60 }, (_, i) => ({
  value: `S${i + 1}`,
  label: `S${i + 1}`,
}));

const BIDANG_OPTIONS = [
  'Struktur', 'Geoteknik', 'Manajemen Konstruksi', 'Transportasi', 'Hidroteknik', 'Lingkungan', 'Lainnya'
];

const INDUSTRI_OPTIONS = [
  'Konstruksi', 'Konsultan', 'BUMN', 'Pemerintahan', 'Akademisi', 'Wiraswasta', 'Perbankan', 'Energi', 'Teknologi', 'Lainnya'
];

export default function AlumniFilters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', angkatan: '', bidang_keahlian: '', bidang_industri: '', domisili_kota: '' });
  };

  const hasFilters = Object.values(filters).some(v => v && v !== '');

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-sm text-foreground">Filter & Pencarian</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
            <X className="h-3 w-3" /> Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, perusahaan..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Angkatan */}
        <Select value={filters.angkatan} onValueChange={(v) => updateFilter('angkatan', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Angkatan" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">Semua Angkatan</SelectItem>
            {ANGKATAN_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bidang Keahlian */}
        <Select value={filters.bidang_keahlian} onValueChange={(v) => updateFilter('bidang_keahlian', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Bidang Keahlian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bidang</SelectItem>
            {BIDANG_OPTIONS.map(opt => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bidang Industri */}
        <Select value={filters.bidang_industri} onValueChange={(v) => updateFilter('bidang_industri', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Industri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Industri</SelectItem>
            {INDUSTRI_OPTIONS.map(opt => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Domisili */}
        <Input
          placeholder="Kota domisili..."
          value={filters.domisili_kota}
          onChange={(e) => updateFilter('domisili_kota', e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );
}