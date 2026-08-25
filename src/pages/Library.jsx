import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Download, Search, FileText, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LibraryForm from '@/components/forms/LibraryForm';

const CATEGORIES = ['Jurnal', 'Skripsi', 'Thesis', 'Disertasi', 'Standar Teknis', 'Modul', 'Lainnya'];

export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['library-items'],
    queryFn: () => base44.entities.LibraryItem.list('-created_date', 100),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (search) {
        const s = search.toLowerCase();
        if (!(item.title || '').toLowerCase().includes(s) && !(item.author || '').toLowerCase().includes(s)) return false;
      }
      if (category !== 'all' && item.category !== category) return false;
      return true;
    });
  }, [items, search, category]);

  return (
    <>
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Perpustakaan</Badge>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">E-Library</h1>
            <p className="text-muted-foreground">Jurnal, skripsi, thesis, dan standar teknis untuk referensi bersama.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0 mt-6">
            <Plus className="h-4 w-4" /> Tambah Dokumen
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari judul atau penulis..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada dokumen.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <Card key={item.id} className="border border-white/5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all bg-card">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      {item.author && <span className="text-xs text-muted-foreground">{item.author}</span>}
                      {item.year && <span className="text-xs text-muted-foreground">({item.year})</span>}
                    </div>
                    {item.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>}
                  </div>
                  {item.file_url && (
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="gap-1 shrink-0">
                        <Download className="h-3.5 w-3.5" /> Unduh
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>

    {showForm && (
      <LibraryForm
        onClose={() => setShowForm(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['library-items'] });
          setShowForm(false);
        }}
      />
    )}
  </>
  );
}