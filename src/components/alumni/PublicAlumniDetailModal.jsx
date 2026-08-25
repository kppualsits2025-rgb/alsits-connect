import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail, Phone, Building2, MapPin, Linkedin, Globe,
  Briefcase, FileText, Image, GraduationCap, ExternalLink,
  Lock, ShieldCheck, LogIn, Pencil
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AlumniSelfEditModal from '@/components/alumni/AlumniSelfEditModal';

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function BusinessCard({ biz, isPrivate }) {
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)' }}>
      {biz.cover_image_url && (
        <img src={biz.cover_image_url} alt={biz.company_name} className="w-full h-36 object-cover rounded-lg" />
      )}
      <div className="flex items-start gap-3">
        {biz.logo_url && (
          <img src={biz.logo_url} alt={biz.company_name} className="w-12 h-12 rounded-lg object-contain border border-border shrink-0 bg-white p-1" />
        )}
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-foreground">{biz.company_name}</h4>
          {biz.position && <p className="text-sm text-muted-foreground">{biz.position}</p>}
          <div className="flex flex-wrap gap-1 mt-1">
            {biz.business_segment && (
              <Badge className="bg-accent/20 text-accent border-0 text-xs">{biz.business_segment}</Badge>
            )}
            {biz.is_primary && (
              <Badge className="bg-primary/10 text-primary border-0 text-xs">Utama</Badge>
            )}
          </div>
        </div>
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
        {isPrivate && biz.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <a href={`https://wa.me/${biz.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{biz.phone}</a>
          </div>
        )}
        {isPrivate && biz.email && (
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

export default function PublicAlumniDetailModal({ alumni, open, onClose, isAuthenticated, claimedAlumni, fullClaimedAlumni }) {
  const [showEdit, setShowEdit] = useState(false);

  const displayName = toTitleCase(alumni?.full_name);
  const gelarLabel = { S1: 'Strata-1 (S1)', S2: 'Strata-2 (S2)', S3: 'Strata-3 (S3)' };
  const gelarList = alumni?.gelar ? alumni.gelar.split(',').map(g => g.trim()).filter(Boolean) : [];

  let kegiatanUsaha = [];
  try {
    if (alumni?.kegiatan_usaha) kegiatanUsaha = JSON.parse(alumni.kegiatan_usaha);
  } catch (e) {}

  const isPrivate = isAuthenticated && !!claimedAlumni;
  // isOwn: bandingkan ID alumni yang dibuka dengan ID profil yang diklaim user
  const isOwn = !!(claimedAlumni && alumni && claimedAlumni.id === alumni.id);
  // Data lengkap untuk edit modal: pakai fullClaimedAlumni (dengan telepon/email) jika tersedia
  const editData = fullClaimedAlumni && isOwn ? fullClaimedAlumni : (isOwn ? alumni : null);

  const handleEditClose = () => setShowEdit(false);
  const handleEditOpen = (e) => {
    e.stopPropagation();
    setShowEdit(true);
  };

  return (
    <>
      <AlumniSelfEditModal alumni={editData} open={showEdit && isOwn} onClose={handleEditClose} />

      <Dialog open={open && !showEdit} onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" style={{ zIndex: 99999, background: 'linear-gradient(145deg, #0a0f22, #0d1229)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20 }}>
          {!alumni ? null : (
            <div className="relative overflow-hidden">
              {/* Decorative corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, #6366f1, transparent 70%)' }} />

              <div className="relative z-10 p-6 space-y-5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-indigo-500" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
                    <span className="font-heading font-bold text-sm tracking-widest uppercase text-indigo-400">Profil Alumni</span>
                  </div>
                  {isOwn && (
                    <button onClick={handleEditOpen}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                      <Pencil className="h-3 w-3" /> Edit Profil
                    </button>
                  )}
                </div>

                {/* Profile header */}
                <div className="flex gap-5 items-start pb-5" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="shrink-0">
                    {alumni.photo_url ? (
                      <img src={alumni.photo_url} alt={displayName} className="w-20 h-20 rounded-full object-cover"
                        style={{ border: '2px solid rgba(99,102,241,0.4)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }} />
                    ) : (
                      <div className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.35)', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
                        <span className="font-heading font-black text-2xl text-indigo-400">
                          {displayName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-heading font-black text-xl text-white">{displayName}</h2>
                      <span className="px-2 py-0.5 rounded-full text-xs font-heading font-bold"
                        style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                        {alumni.angkatan}
                      </span>
                      {alumni.is_verified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                          <ShieldCheck className="h-3 w-3" /> Terverifikasi
                        </span>
                      )}
                      {isOwn && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)' }}>
                          Profil Saya
                        </span>
                      )}
                    </div>
                    {alumni.jabatan && <p className="text-white/60 text-sm mt-0.5">{alumni.jabatan}</p>}
                    {alumni.perusahaan && (
                      <p className="text-sm text-white/50 flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-indigo-400" /> {alumni.perusahaan}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {gelarList.map(g => (
                        <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                          {gelarLabel[g] || g}
                        </span>
                      ))}
                      {alumni.bidang_keahlian && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
                          {alumni.bidang_keahlian}
                        </span>
                      )}
                      {alumni.bidang_industri && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {alumni.bidang_industri}
                        </span>
                      )}
                      {alumni.domisili_kota && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <MapPin className="h-2.5 w-2.5" /> {alumni.domisili_kota}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* KONTAK */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isPrivate ? <Phone className="h-4 w-4 text-indigo-400" /> : <Lock className="h-4 w-4 text-indigo-400" />}
                    <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-indigo-400">Kontak & Bisnis</h3>
                  </div>
                  {isPrivate ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {alumni.telepon ? (
                        <a href={`tel:${alumni.telepon}`} className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />{alumni.telepon}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/25 italic text-xs"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Phone className="h-3.5 w-3.5 shrink-0" /> Belum ada nomor HP
                        </div>
                      )}
                      {alumni.email ? (
                        <a href={`mailto:${alumni.email}`} className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white transition-colors truncate"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />{alumni.email}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/25 italic text-xs"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Mail className="h-3.5 w-3.5 shrink-0" /> Belum ada email
                        </div>
                      )}
                      {alumni.linkedin && (
                        <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white transition-colors sm:col-span-2"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <Linkedin className="h-3.5 w-3.5 text-blue-400 shrink-0" /> LinkedIn <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
                      style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <Lock className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-heading font-semibold text-white text-sm">
                          {!isAuthenticated ? 'Login untuk melihat kontak alumni' : 'Klaim & verifikasi profil untuk akses kontak'}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">Data HP & email hanya untuk alumni ALSITS terverifikasi.</p>
                      </div>
                      {!isAuthenticated ? (
                        <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
                          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#818cf8' }}>
                          <LogIn className="h-3.5 w-3.5" /> Login
                        </button>
                      ) : (
                        <button onClick={onClose}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
                          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                          Klaim Profil
                        </button>
                      )}
                    </div>
                  )}
                  {!isPrivate && alumni.linkedin && (
                    <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white transition-colors text-sm"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <Linkedin className="h-4 w-4 text-blue-400 shrink-0" /> LinkedIn <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                    </a>
                  )}
                </div>

                {/* Kegiatan Usaha */}
                {kegiatanUsaha.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-amber-400" />
                      <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-amber-400">
                        Portofolio Bisnis ({kegiatanUsaha.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {kegiatanUsaha.map((biz, idx) => (
                        <BusinessCard key={biz.id || idx} biz={biz} isPrivate={isPrivate} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {alumni.bio && (
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white/40">Bio</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{alumni.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}