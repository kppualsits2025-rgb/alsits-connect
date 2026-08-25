import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import AlumniFilters from '../components/alumni/AlumniFilters';
import AlumniCard from '../components/alumni/AlumniCard';

export default function AlumniDatabase() {
  const [filters, setFilters] = useState({
    search: '',
    angkatan: '',
    bidang_keahlian: '',
    bidang_industri: '',
    domisili_kota: '',
  });

  const { data: alumni, isLoading } = useQuery({
    queryKey: ['all-alumni'],
    queryFn: () => base44.entities.Alumni.list('-created_date', 500),
    initialData: [],
  });

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      // Sembunyikan almarhum/almarhumah
      const status = (a.status || '').toLowerCase();
      if (status === 'almarhum' || status === 'almarhumah') return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const match = (a.full_name || '').toLowerCase().includes(s) ||
          (a.perusahaan || '').toLowerCase().includes(s) ||
          (a.jabatan || '').toLowerCase().includes(s) ||
          (a.nrm_nrp || '').toLowerCase().includes(s);
        if (!match) return false;
      }
      if (filters.angkatan && filters.angkatan !== 'all' && a.angkatan !== filters.angkatan) return false;
      if (filters.bidang_keahlian && filters.bidang_keahlian !== 'all' && a.bidang_keahlian !== filters.bidang_keahlian) return false;
      if (filters.bidang_industri && filters.bidang_industri !== 'all' && a.bidang_industri !== filters.bidang_industri) return false;
      if (filters.domisili_kota) {
        const d = filters.domisili_kota.toLowerCase();
        if (!(a.domisili_kota || '').toLowerCase().includes(d)) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort by angkatan numerik (S1 → S60+), lalu nama A-Z
      const numA = parseInt((a.angkatan || '').replace(/\D/g, '')) || 0;
      const numB = parseInt((b.angkatan || '').replace(/\D/g, '')) || 0;
      if (numA !== numB) return numA - numB;
      return (a.full_name || '').localeCompare(b.full_name || '', 'id');
    });
  }, [alumni, filters]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Database</Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">Database Alumni</h1>
          <p className="text-muted-foreground">Temukan alumni Teknik Sipil ITS dari berbagai angkatan dan bidang keahlian.</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AlumniFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Menampilkan <strong className="text-foreground">{filteredAlumni.length}</strong> alumni
          </span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada alumni yang sesuai filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map((a) => (
              <AlumniCard key={a.id} alumni={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}