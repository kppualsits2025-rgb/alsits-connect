import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, ExternalLink, Briefcase, FileText, Download, Building2 } from 'lucide-react';

function parseBusinesses(alumni) {
  if (!alumni.kegiatan_usaha) return [];
  try {
    const parsed = JSON.parse(alumni.kegiatan_usaha);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function BusinessCard({ biz, alumni }) {
  const docs = biz.documents || [];
  const cover = biz.cover_image_url || '';
  const name = biz.company_name || '';
  const position = biz.position || '';
  const segment = biz.business_segment || '';
  const desc = biz.description || '';
  const address = biz.address || '';
  const phone = biz.phone || '';
  const email = biz.email || '';
  const website = biz.website || '';

  return (
    <div className="rounded-2xl overflow-hidden mb-6"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>

      {/* Cover Image */}
      {cover ? (
        <div className="relative w-full" style={{ height: 220, background: '#0a1628' }}>
          <img src={cover} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,13,31,0.9) 0%, rgba(6,13,31,0.3) 60%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-heading font-black text-2xl text-white leading-tight drop-shadow-lg">{name}</h3>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-heading font-black text-xl text-white">{name}</h3>
        </div>
      )}

      <div className="p-6">
        {/* Jabatan & Segmen badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {position && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'Montserrat,sans-serif' }}>
              👤 {position}
            </span>
          )}
          {segment && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', fontFamily: 'Montserrat,sans-serif' }}>
              🏷️ {segment}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kiri: deskripsi + dokumen */}
          <div className="space-y-5">
            {desc && (
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{desc}</p>
            )}

            {/* Dokumen Perusahaan */}
            {docs.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat,sans-serif' }}>
                  <FileText className="h-3.5 w-3.5" /> Dokumen Perusahaan
                </p>
                <div className="space-y-2">
                  {docs.map((doc, di) => {
                    const docName = doc.name || `Dokumen ${di + 1}`;
                    const docType = doc.doc_type || 'Lainnya';
                    const docUrl = doc.url || '';
                    return (
                      <div key={di} className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <FileText className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{docName}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{docType}</p>
                          </div>
                        </div>
                        {docUrl && (
                          <a href={docUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 shrink-0 ml-3"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', textDecoration: 'none' }}>
                            <Download className="h-3 w-3" /> Unduh
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {website && (
              <a href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:underline"
                style={{ color: '#f59e0b', textDecoration: 'none' }}>
                <ExternalLink className="h-4 w-4" />
                {website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Kanan: KONTAK */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat,sans-serif' }}>
              KONTAK
            </p>
            {address && (
              <div className="flex gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                <span className="leading-relaxed">{address}</span>
              </div>
            )}
            {(phone || alumni.telepon) && (
              <a href={`https://wa.me/${(phone || alumni.telepon).replace(/^\+/, '').replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: '#4ade80', textDecoration: 'none' }}>
                <Phone className="h-4 w-4 shrink-0" />
                {phone || alumni.telepon}
              </a>
            )}
            {(email || alumni.email) && (
              <a href={`mailto:${email || alumni.email}`}
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: '#60a5fa', textDecoration: 'none' }}>
                <Mail className="h-4 w-4 shrink-0" />
                {email || alumni.email}
              </a>
            )}
            {website && (
              <a href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:underline break-all"
                style={{ color: '#a78bfa', textDecoration: 'none' }}>
                <ExternalLink className="h-4 w-4 shrink-0" />
                {website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function BusinessDetailView({ alumni, onBack }) {
  const businesses = parseBusinesses(alumni);
  const displayName = toTitleCase(alumni.full_name);
  const initials = (displayName || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const primaryBiz = businesses.find(b => b.is_primary) || businesses[0];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#060d1f 0%,#0a1628 40%,#060d1f 100%)' }}>

      {/* Back button */}
      <div className="sticky top-[72px] z-20" style={{ background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
            style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Business Hub
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Alumni Header Card */}
        <div className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {alumni.photo_url ? (
              <img src={alumni.photo_url} alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
                style={{ border: '2px solid rgba(59,130,246,0.4)' }} />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-heading font-black text-xl text-white"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', border: '2px solid rgba(59,130,246,0.3)' }}>
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-black text-xl text-white mb-0.5">{displayName}</h1>
              {primaryBiz?.position && (
                <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'Montserrat,sans-serif' }}>
                  {primaryBiz.position}
                </span>
              )}
              <div className="flex flex-wrap gap-2 text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {alumni.perusahaan && (
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{alumni.perusahaan}</span>
                )}
                {alumni.angkatan && (
                  <span className="px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', fontFamily: 'Montserrat,sans-serif' }}>
                    {alumni.angkatan}
                  </span>
                )}
                {alumni.bio && (
                  <span style={{ color: '#f59e0b' }}>{alumni.bio}</span>
                )}
              </div>
            </div>
          </div>

          {/* Kontak alumni */}
          <div className="flex flex-col gap-2 shrink-0">
            {alumni.telepon && (
              <a href={`https://wa.me/${alumni.telepon.replace(/^\+/, '').replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.35)', textDecoration: 'none' }}>
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
            )}
            {alumni.email && (
              <a href={`mailto:${alumni.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', textDecoration: 'none' }}>
                <Mail className="h-3 w-3" /> Email
              </a>
            )}
          </div>
        </div>

        {/* Portofolio Bisnis */}
        {businesses.length > 0 ? (
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Montserrat,sans-serif' }}>
              <Briefcase className="h-4 w-4" /> Portofolio Bisnis ({businesses.length})
            </p>
            {businesses.map((biz, i) => (
              <BusinessCard key={biz.id || i} biz={biz} alumni={alumni} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-20 text-white" />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Belum ada portofolio bisnis terdaftar.
            </p>
            <a href="https://s32its.id" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold"
              style={{ color: '#f59e0b', textDecoration: 'none' }}>
              Daftar di s32its.id →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}