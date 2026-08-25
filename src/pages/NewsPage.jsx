import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import NewsForm from '@/components/admin/NewsForm';

export default function NewsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['all-news'],
    queryFn: () => base44.entities.News.filter({ is_published: true }, '-published_date', 50),
    initialData: [],
  });

  return (
    <>
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Berita</Badge>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">News & Events</h1>
            <p className="text-muted-foreground">Berita terbaru, kegiatan, reuni, dan webinar dari ALSITS.</p>
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0 mt-6">
              <Plus className="h-4 w-4" /> Tambah Berita
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>Belum ada berita.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Card key={item.id} className="group overflow-hidden border border-white/5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all bg-card">
                <div className="flex flex-col md:flex-row">
                  {item.cover_image && (
                    <div className="md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs font-heading">{item.category}</Badge>
                      {item.published_date && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.published_date), 'dd MMM yyyy')}
                        </span>
                      )}
                    </div>
                    <h2 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.excerpt}</p>
                    {item.author && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" /> {item.author}
                      </span>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>

    {showForm && (
      <NewsForm
        onClose={() => setShowForm(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['all-news'] });
          setShowForm(false);
        }}
      />
    )}
  </>
  );
}