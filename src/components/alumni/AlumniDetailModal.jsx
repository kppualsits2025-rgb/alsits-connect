import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, Phone, Building2, MapPin, Linkedin, Globe, 
  Briefcase, FileText, Image, GraduationCap, ExternalLink, Pencil
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AlumniSelfEditModal from './AlumniSelfEditModal';

function BusinessCard({ biz }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      {/* Cover image */}
      {biz.cover_image_url && (
        <img src={biz.cover_image_url} alt={biz.company_name} className="w-full h-32 object-cover rounded-lg" />
      )}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-foreground">{biz.company_name}</h4>
          {biz.position && <p className="text-sm text-muted-foreground">{biz.position}</p>}
          {biz.business_segment && (
            <Badge className="mt-1 bg-accent/20 text-accent-foreground border-0 text-xs">{biz.business_segment}</Badge>
          )}
        </div>
        {biz.is_primary && (
          <Badge className="bg-primary/10 text-primary border-0 text-xs shrink-0">Utama</Badge>
        )}
      </div>

      {biz.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{biz.description}</p>
      )}

      <div className="space-y-1.5 text-sm">
        {biz.address && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{biz.address}</span>
          </div>
        )}
        {biz.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <a href={`tel:${biz.phone}`} className="hover:text-primary">{biz.phone}</a>
          </div>
        )}
        {biz.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <a href={`mailto:${biz.email}`} className="hover:text-primary">{biz.email}</a>
          </div>
        )}
        {biz.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <a href={biz.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
              {biz.website} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Gallery */}
      {biz.gallery_images && biz.gallery_images.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Image className="h-3.5 w-3.5" /> Galeri
          </p>
          <div className="grid grid-cols-3 gap-2">
            {biz.gallery_images.map((img, idx) => (
              <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-20 object-cover rounded-lg hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {biz.documents && biz.documents.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" /> Dokumen
          </p>
          <div className="space-y-1.5">
            {biz.documents.map((doc, idx) => (
              <a
                key={idx}
                href={typeof doc === 'string' ? doc : doc.url || doc.file_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                {typeof doc === 'string' ? `Dokumen ${idx + 1}` : (doc.name || `Dokumen ${idx + 1}`)}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function AlumniDetailModal({ alumni, open, onClose }) {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  if (!alumni) return null;

  let kegiatanUsaha = [];
  try {
    if (alumni.kegiatan_usaha) kegiatanUsaha = JSON.parse(alumni.kegiatan_usaha);
  } catch (e) { /* ignore */ }

  // Cek apakah ini profil milik user yang login
  const displayName = toTitleCase(alumni.full_name);
  const isOwner = user && (user.email === alumni.email || user.email === alumni.email2);
  const isAdmin = user?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  // Parse gelar (bisa comma-separated untuk multi-gelar)
  const gelarList = alumni.gelar ? alumni.gelar.split(',').map(g => g.trim()).filter(Boolean) : [];

  return (
    <>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 99999 }}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-xl">Profil Alumni</DialogTitle>
            {canEdit && (
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)} className="gap-1.5 text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit Profil
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Header Profil */}
        <div className="flex gap-4 items-start pb-4 border-b border-border">
          <div className="shrink-0">
            {alumni.photo_url ? (
              <img src={alumni.photo_url} alt={displayName} className="w-20 h-20 rounded-full object-cover border-2 border-primary/10" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-2xl">
                  {displayName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading font-bold text-xl text-foreground">{displayName}</h2>
              <Badge className="bg-primary/10 text-primary border-0 font-heading">{alumni.angkatan}</Badge>
              {gelarList.map(g => (
                <Badge key={g} className="bg-accent/20 text-accent border-0 font-heading text-xs">{g}</Badge>
              ))}
            </div>
            {alumni.jabatan && <p className="text-muted-foreground">{alumni.jabatan}</p>}
            {alumni.perusahaan && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building2 className="h-3.5 w-3.5" /> {alumni.perusahaan}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {alumni.bidang_keahlian && (
                <Badge className="bg-secondary text-secondary-foreground border-0 text-xs flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> {alumni.bidang_keahlian}
                </Badge>
              )}
              {alumni.bidang_industri && (
                <Badge className="bg-secondary text-secondary-foreground border-0 text-xs flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {alumni.bidang_industri}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Kontak & Bisnis */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Kontak & Bisnis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {alumni.telepon && (
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`tel:${alumni.telepon}`} className="hover:text-primary">{alumni.telepon}</a>
              </div>
            )}
            {alumni.telepon2 && (
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`tel:${alumni.telepon2}`} className="hover:text-primary">{alumni.telepon2}</a>
              </div>
            )}
            {alumni.email && (
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${alumni.email}`} className="hover:text-primary">{alumni.email}</a>
              </div>
            )}
            {alumni.email2 && (
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${alumni.email2}`} className="hover:text-primary">{alumni.email2}</a>
              </div>
            )}
            {alumni.telepon_kantor && (
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-xs mr-1">Kantor:</span>
                <a href={`tel:${alumni.telepon_kantor}`} className="hover:text-primary">{alumni.telepon_kantor}</a>
              </div>
            )}
            {alumni.alamat_perusahaan && (
              <div className="flex items-start gap-2 text-foreground sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{alumni.alamat_perusahaan}</span>
              </div>
            )}
            {alumni.linkedin && (
              <div className="flex items-center gap-2 text-foreground sm:col-span-2">
                <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Kegiatan Usaha / Perusahaan */}
        {kegiatanUsaha.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Kegiatan Usaha / Perusahaan
            </h3>
            <div className="space-y-3">
              {kegiatanUsaha.map((biz, idx) => (
                <BusinessCard key={biz.id || idx} biz={biz} />
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {alumni.bio && (
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Bio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{alumni.bio}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {canEdit && (
      <AlumniSelfEditModal
        alumni={alumni}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    )}
    </>
  );
}