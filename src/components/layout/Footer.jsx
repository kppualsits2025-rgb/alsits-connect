import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0f2a5e 0%, #1a3a7a 50%, #0f2a5e 100%)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/eea169ab0_logo_komjur_sipil_3-removebg-preview.png"
                alt="Logo Komjur Sipil"
                className="h-14 w-auto"
              />
              <img
                src="https://media.base44.com/images/public/69fb35c6f6284d7276918adb/06741a91a_logoTS.png"
                alt="Logo TS"
                className="h-12 w-auto"
              />
              <div className="ml-1">
                <h2 className="font-heading font-bold text-lg text-white leading-tight">ALSITS</h2>
                <p className="text-xs text-white/60 leading-tight">Alumni Sipil ITS</p>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Dari SIPIL ITS untuk Indonesia. Menyatukan alumni Teknik Sipil ITS di seluruh dunia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Navigasi</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Beranda</Link></li>
              <li><Link to="/alumni" className="hover:opacity-100 transition-opacity">Database Alumni</Link></li>
              <li><Link to="/peta" className="hover:opacity-100 transition-opacity">Peta Alumni</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-100 transition-opacity">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Fitur</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/berita" className="hover:opacity-100 transition-opacity">Berita & Kegiatan</Link></li>
              <li><Link to="/lowongan" className="hover:opacity-100 transition-opacity">Lowongan & Proyek</Link></li>
              <li><Link to="/library" className="hover:opacity-100 transition-opacity">E-Library</Link></li>
              <li><Link to="/forum" className="hover:opacity-100 transition-opacity">Forum Diskusi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Kontak</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Departemen Teknik Sipil</li>
              <li>Institut Teknologi Sepuluh Nopember</li>
              <li>Kampus ITS Sukolilo, Surabaya</li>
              <li>Jawa Timur 60111</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs opacity-60">© {new Date().getFullYear()} ALSITS — Alumni Sipil ITS. All rights reserved.</p>
            <p className="text-[10px] mt-0.5 opacity-80">Powered by <span className="italic font-bold" style={{ color: '#ffd700' }}>abu_thariq</span></p>
          </div>
          <p className="text-xs opacity-60">Vivat Teknik Sipil ITS!</p>
        </div>
      </div>
    </footer>
  );
}