import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Calendar, Mail, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import JobForm from '@/components/forms/JobForm';

export default function JobPostings() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['job-postings'],
    queryFn: () => base44.entities.JobPosting.filter({ is_active: true }, '-created_date', 50),
    initialData: [],
  });

  const typeColors = {
    'Lowongan Kerja': 'bg-primary/20 text-primary',
    'Proyek': 'bg-accent/20 text-accent',
    'Magang': 'bg-emerald-500/20 text-emerald-400',
    'Freelance': 'bg-purple-500/20 text-purple-400',
  };

  return (
    <>
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-0 mb-3 font-heading">Karir</Badge>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">Lowongan & Proyek</h1>
            <p className="text-muted-foreground">Info lowongan kerja, proyek, dan peluang dari sesama alumni.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0 mt-6">
            <Plus className="h-4 w-4" /> Posting Lowongan
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada lowongan atau proyek.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="border border-white/5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge className={`shrink-0 border-0 ${typeColors[job.type] || 'bg-secondary text-secondary-foreground'}`}>
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    {job.location && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                    )}
                    {job.deadline && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline: {format(new Date(job.deadline), 'dd MMM yyyy')}</span>
                    )}
                    {job.posted_by_name && (
                      <span>Diposting oleh: {job.posted_by_name} ({job.posted_by_angkatan})</span>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{job.description}</p>
                  )}
                  {job.salary_range && (
                    <p className="text-sm font-medium text-foreground mb-2">Gaji: {job.salary_range}</p>
                  )}
                  {job.contact_email && (
                    <a href={`mailto:${job.contact_email}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      <Mail className="h-3.5 w-3.5" /> Hubungi
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
      <JobForm
        onClose={() => setShowForm(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['job-postings'] });
          setShowForm(false);
        }}
      />
    )}
  </>
  );
}