import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Pin, User, Clock, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import ForumForm from '@/components/forms/ForumForm';

const CATEGORIES = ['Semua', 'Struktur', 'Geoteknik', 'Manajemen Konstruksi', 'Transportasi', 'Hidroteknik', 'Lingkungan', 'Umum'];

export default function Forum() {
  const [category, setCategory] = useState('Semua');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date', 100),
    initialData: [],
  });

  const filtered = category === 'Semua' ? posts : posts.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Forum</Badge>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">Forum Diskusi</h1>
            <p className="text-muted-foreground">Diskusi per bidang keahlian, berbagi ilmu dan pengalaman.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0 mt-6">
            <Plus className="h-4 w-4" /> Buat Diskusi
          </Button>
        </div>

        {/* Category tabs */}
        <div className="mb-6 overflow-x-auto">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-card border border-white/10 h-auto flex-wrap">
              {CATEGORIES.map(c => (
                <TabsTrigger key={c} value={c} className="text-xs font-heading">{c}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada diskusi di kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <Card key={post.id} className="border border-white/5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {post.is_pinned && <Pin className="h-4 w-4 text-accent mt-1 shrink-0" />}
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-foreground mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        {post.author_name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {post.author_name}
                            {post.author_angkatan && ` (${post.author_angkatan})`}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {post.reply_count || 0} balasan
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {format(new Date(post.created_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ForumForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}