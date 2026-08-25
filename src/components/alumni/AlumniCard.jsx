import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, GraduationCap, Mail, Linkedin } from 'lucide-react';
import AlumniDetailModal from './AlumniDetailModal';

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function AlumniCard({ alumni }) {
  const [open, setOpen] = useState(false);
  const displayName = toTitleCase(alumni.full_name);

  return (
    <>
      <Card
        className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:border-primary/20 hover:bg-primary/[0.02]"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="shrink-0">
              {alumni.photo_url ? (
                <img src={alumni.photo_url} alt={displayName} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" />
                ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-lg">
                  {displayName?.charAt(0)?.toUpperCase() || '?'}
                </span>
                </div>
                )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                <div>
                <h3 className="font-heading font-semibold text-foreground truncate group-hover:text-primary transition-colors">{displayName}</h3>
                  {alumni.jabatan && (
                    <p className="text-sm text-muted-foreground truncate">{alumni.jabatan}</p>
                  )}
                </div>
                <Badge className="shrink-0 bg-primary/10 text-primary border-0 font-heading text-xs">
                  {alumni.angkatan}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {alumni.perusahaan && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {alumni.perusahaan}
                  </span>
                )}
                {alumni.domisili_kota && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {alumni.domisili_kota}
                  </span>
                )}
                {alumni.bidang_keahlian && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> {alumni.bidang_keahlian}
                  </span>
                )}
              </div>

              {/* Contact links */}
              <div className="mt-3 flex gap-2" onClick={e => e.stopPropagation()}>
                {alumni.email && (
                  <a href={`mailto:${alumni.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {alumni.linkedin && (
                  <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlumniDetailModal alumni={alumni} open={open} onClose={() => setOpen(false)} />
    </>
  );
}