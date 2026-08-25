import React, { useState, useRef } from 'react';
import { Printer, Download, Edit3, Check, X } from 'lucide-react';

const today = new Date();
const formatDate = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// Tanggal dinamis
const tglKontrak = formatDate(today);
const tglKickoff = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
// Phase 1 selesai: +7 minggu dari kickoff
const tglP1 = formatDate(new Date(today.getTime() + (7 + 7 * 7) * 24 * 60 * 60 * 1000));
// Phase 2 selesai: +9 minggu dari P1
const tglP2 = formatDate(new Date(today.getTime() + (7 + 7 * 7 + 9 * 7) * 24 * 60 * 60 * 1000));
// Phase 3 selesai: +8 minggu dari P2
const tglP3 = formatDate(new Date(today.getTime() + (7 + 7 * 7 + 9 * 7 + 8 * 7) * 24 * 60 * 60 * 1000));

const INITIAL_DATA = {
  nomorKontrak: 'PKS-ALSITS/2026/001',
  tglKontrak,
  // Pihak Pertama (Developer)
  p1Nama: 'Hazril Firdhanni',
  p1Jabatan: 'Perancang & Developer Portal ALSITS',
  p1Alamat: '[Alamat Developer — isi sebelum ditandatangani]',
  p1Telp: '[No. HP / WA Developer]',
  p1Email: '[Email Developer]',
  // Pihak Kedua (ALSITS)
  p2Nama: 'Harum Akhmad Zuhdi',
  p2Jabatan: 'Ketua Komisariat Jurusan Alumni Teknik Sipil ITS (ALSITS)',
  p2Alamat: 'Institut Teknologi Sepuluh Nopember, Surabaya',
  p2Telp: '[No. HP / WA Ketua ALSITS]',
  p2Email: '[Email Ketua ALSITS]',
  // Timeline
  tglKickoff,
  tglP1,
  tglP2,
  tglP3,
  // Rekening
  rekeningNama: 'Hazril Firdhanni',
  rekeningBank: '[Nama Bank]',
  rekeningNo: '[Nomor Rekening]',
  // Kota TTD
  kotaTtd: 'Surabaya',
};

function EditableField({ value, onChange, multiline, className }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return multiline ? (
      <span className="inline-block">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className={`border border-blue-400 rounded px-1 py-0.5 text-sm bg-blue-50 text-blue-900 resize-none ${className}`}
          rows={3}
          cols={40}
          autoFocus
        />
        <button onClick={() => { onChange(draft); setEditing(false); }} className="ml-1 text-green-600"><Check size={14}/></button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="ml-1 text-red-500"><X size={14}/></button>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className={`border border-blue-400 rounded px-1 py-0.5 text-sm bg-blue-50 text-blue-900 ${className}`}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') { onChange(draft); setEditing(false); } if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        />
        <button onClick={() => { onChange(draft); setEditing(false); }} className="text-green-600"><Check size={14}/></button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="text-red-500"><X size={14}/></button>
      </span>
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className="cursor-pointer hover:bg-yellow-100 rounded px-0.5 border-b border-dashed border-gray-400 inline-flex items-center gap-1 group"
      title="Klik untuk edit"
    >
      {value}
      <Edit3 size={11} className="opacity-0 group-hover:opacity-50 text-blue-500 shrink-0" />
    </span>
  );
}

export default function DraftKontrak() {
  const [data, setData] = useState(INITIAL_DATA);
  const printRef = useRef();

  const set = (key) => (val) => setData(prev => ({ ...prev, [key]: val }));

  const E = ({ k, multiline, className }) => (
    <EditableField value={data[k]} onChange={set(k)} multiline={multiline} className={className} />
  );

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar — hidden saat print */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800 text-lg">📄 Draft Kontrak Kerja</h1>
            <p className="text-xs text-gray-500">Klik field bergaris bawah putus-putus untuk mengedit · Sesuaikan sebelum ditandatangani</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              <Printer size={16} /> Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Dokumen */}
      <div ref={printRef} className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none">
        <div className="px-14 py-12 print:px-12 print:py-10" style={{ fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.7, color: '#1a1a1a' }}>

          {/* KOP */}
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-1">Perjanjian Kerja Sama</p>
            <h1 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>KONTRAK JASA PENGEMBANGAN PERANGKAT LUNAK</h1>
            <h2 className="text-base font-bold mt-1">Portal ALSITS — Alumni Teknik Sipil Institut Teknologi Sepuluh Nopember</h2>
            <p className="text-sm mt-2 text-gray-600">Nomor: <E k="nomorKontrak" /></p>
          </div>

          {/* MUKADIMAH */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center italic text-sm text-gray-600">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>

          <p className="mb-6 text-justify">
            Kontrak ini dibuat dan ditandatangani pada tanggal <strong><E k="tglKontrak" /></strong>, di <E k="kotaTtd" />, oleh dan antara pihak-pihak berikut:
          </p>

          {/* PARA PIHAK */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 1 — PARA PIHAK</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Pihak I */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="font-bold text-sm mb-2 text-blue-700">PIHAK PERTAMA (Developer)</p>
                <table className="text-sm w-full" style={{ tableLayout: 'fixed' }}>
                  <colgroup><col style={{ width: 64 }} /><col style={{ width: 10 }} /><col /></colgroup>
                  <tbody>
                    <tr><td className="text-gray-500 align-top py-0.5">Nama</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p1Nama" /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Jabatan</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p1Jabatan" multiline /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Alamat</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p1Alamat" multiline /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Telepon</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p1Telp" /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Email</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p1Email" /></td></tr>
                  </tbody>
                </table>
              </div>
              {/* Pihak II */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="font-bold text-sm mb-2 text-green-700">PIHAK KEDUA (Klien / ALSITS)</p>
                <table className="text-sm w-full" style={{ tableLayout: 'fixed' }}>
                  <colgroup><col style={{ width: 64 }} /><col style={{ width: 10 }} /><col /></colgroup>
                  <tbody>
                    <tr><td className="text-gray-500 align-top py-0.5">Nama</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p2Nama" /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Jabatan</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p2Jabatan" multiline /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Alamat</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p2Alamat" multiline /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Telepon</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p2Telp" /></td></tr>
                    <tr><td className="text-gray-500 align-top py-0.5">Email</td><td className="align-top py-0.5 text-center">:</td><td className="align-top py-0.5"><E k="p2Email" /></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-4 text-justify text-sm">
              Selanjutnya Pihak Pertama disebut <strong>"Developer"</strong> dan Pihak Kedua disebut <strong>"Klien"</strong>. Developer dan Klien secara bersama-sama disebut <strong>"Para Pihak"</strong>.
            </p>
          </section>

          {/* PASAL 2 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 2 — LINGKUP PEKERJAAN</h3>
            <p className="mb-3 text-justify">Developer setuju untuk memberikan jasa pengembangan perangkat lunak berupa <em>Redesign & Improvement Portal ALSITS</em> (alsits.id), yang mencakup tiga fase sebagai berikut:</p>

            <div className="space-y-4">
              {/* Phase 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold">Phase 1: Foundation <span className="font-normal text-gray-500 text-sm">(±7 minggu)</span></p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-gray-700">
                  <li>UX Research & User Interview (5–10 alumni)</li>
                  <li>Competitive Analysis & Benchmark</li>
                  <li>Wireframe & UX Flow (10+ halaman)</li>
                  <li>UI Design High-Fidelity + Design System</li>
                  <li>Interactive Prototype (Figma) + User Testing</li>
                </ul>
                <p className="text-xs mt-1.5 italic text-gray-500">Deliverable: Laporan UX Research, Figma Design System, Prototype Interaktif</p>
              </div>

              {/* Phase 2 */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-bold">Phase 2: Core Development <span className="font-normal text-gray-500 text-sm">(±9 minggu)</span></p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-gray-700">
                  <li>Implementasi design system baru ke seluruh halaman</li>
                  <li>Redesign navigasi: flat IA, mega-menu, breadcrumb</li>
                  <li>Mobile-first responsive redesign semua halaman</li>
                  <li>Global Search bar (alumni, berita, lowongan, forum)</li>
                  <li>Halaman Profil Mandiri alumni (self-service update)</li>
                  <li>Sistem notifikasi in-app + Activity feed</li>
                  <li>Onboarding flow anggota baru (3-langkah)</li>
                </ul>
                <p className="text-xs mt-1.5 italic text-gray-500">Deliverable: Platform baru live di staging, siap review klien</p>
              </div>

              {/* Phase 3 */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-bold">Phase 3: Intelligence & Launch <span className="font-normal text-gray-500 text-sm">(±8 minggu)</span></p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-gray-700">
                  <li>Dashboard analitik dinamis dengan filter waktu & segmen</li>
                  <li>Progressive Web App (PWA) — install di homescreen</li>
                  <li>AI-powered rekomendasi konten & job matching</li>
                  <li>Performance optimization & SEO on-page</li>
                  <li>Testing menyeluruh: functional, responsive, cross-browser</li>
                  <li>Deployment production + monitoring setup</li>
                  <li>Training admin ALSITS (2 sesi) + Dokumentasi lengkap</li>
                </ul>
                <p className="text-xs mt-1.5 italic text-gray-500">Deliverable: Platform live di production, training selesai, semua dokumentasi diserahkan</p>
              </div>
            </div>
          </section>

          {/* PASAL 3 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 3 — NILAI KONTRAK & SKEMA PEMBAYARAN</h3>
            <p className="mb-3 text-justify">Total nilai jasa yang disepakati adalah <strong>Rp 10.000.000,- (Sepuluh Juta Rupiah)</strong>, belum termasuk biaya server/hosting tahunan. Pembayaran dilakukan dalam 3 (tiga) termin sebagai berikut:</p>

            <table className="w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-3 py-2 border-b border-gray-300">Termin</th>
                  <th className="text-left px-3 py-2 border-b border-gray-300">Persentase</th>
                  <th className="text-left px-3 py-2 border-b border-gray-300">Jumlah</th>
                  <th className="text-left px-3 py-2 border-b border-gray-300">Syarat Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold">DP (Termin 1)</td>
                  <td className="px-3 py-2">30%</td>
                  <td className="px-3 py-2 font-bold text-blue-700">Rp 3.000.000</td>
                  <td className="px-3 py-2">Saat penandatanganan kontrak ini</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold">Termin 2</td>
                  <td className="px-3 py-2">40%</td>
                  <td className="px-3 py-2 font-bold text-yellow-700">Rp 4.000.000</td>
                  <td className="px-3 py-2">Setelah staging Phase 2 disetujui oleh Klien</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold">Pelunasan (Termin 3)</td>
                  <td className="px-3 py-2">30%</td>
                  <td className="px-3 py-2 font-bold text-green-700">Rp 3.000.000</td>
                  <td className="px-3 py-2">Setelah go-live production & training selesai</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-3 py-2 font-black">TOTAL</td>
                  <td colSpan={2} className="px-3 py-2 font-black text-gray-800">Rp 10.000.000,-</td>
                </tr>
              </tfoot>
            </table>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <p className="font-semibold mb-1">Rekening Pembayaran:</p>
              <p>Atas Nama: <E k="rekeningNama" /></p>
              <p>Bank: <E k="rekeningBank" /></p>
              <p>Nomor Rekening: <E k="rekeningNo" /></p>
              <p className="text-xs text-gray-500 mt-1">Konfirmasi pembayaran dilakukan via WhatsApp/Email kepada Developer.</p>
            </div>
          </section>

          {/* PASAL 4 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 4 — JADWAL PELAKSANAAN</h3>
            <table className="w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-3 py-2 border-b border-gray-300">Milestone</th>
                  <th className="text-left px-3 py-2 border-b border-gray-300">Target Tanggal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="px-3 py-2 flex items-center gap-2"><span className="text-green-600 font-bold">✅</span> Kick-off Meeting & Mulai Phase 1</td>
                  <td className="px-3 py-2 text-green-700 font-semibold">Selesai</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="px-3 py-2"><span className="text-green-600 font-bold">✅</span> Selesai Phase 1 (Deliverable & Review)</td>
                  <td className="px-3 py-2 text-green-700 font-semibold">Selesai</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="px-3 py-2"><span className="text-green-600 font-bold">✅</span> Selesai Phase 2 (Staging Live → Production Live)</td>
                  <td className="px-3 py-2 text-green-700 font-semibold">Selesai — Platform Live</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="px-3 py-2"><span className="text-yellow-600 font-bold">🔄</span> Selesai Phase 3 (Training & Serah Terima Akhir)</td>
                  <td className="px-3 py-2 text-yellow-700 font-semibold"><E k="tglP3" /> <span className="text-xs font-normal text-gray-500">(estimasi)</span></td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs mt-2 text-gray-500 italic">* Jadwal bersifat estimasi. Keterlambatan akibat force majeure atau keterlambatan feedback dari Klien tidak menjadi tanggung jawab Developer.</p>
          </section>

          {/* PASAL 5 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 5 — HAK DAN KEWAJIBAN PARA PIHAK</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">Kewajiban Developer:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Melaksanakan pekerjaan sesuai lingkup yang disepakati</li>
                  <li>Menyerahkan deliverable setiap fase sesuai jadwal</li>
                  <li>Memberikan laporan progres minimal 1x per minggu</li>
                  <li>Menyediakan support teknis gratis 3 bulan pasca-launch</li>
                  <li>Melaksanakan training admin ALSITS (2 sesi)</li>
                  <li>Menjaga kerahasiaan data dan informasi milik Klien</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Kewajiban Klien:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Melakukan pembayaran sesuai skema yang disepakati</li>
                  <li>Menyediakan akses, konten, dan aset yang diperlukan</li>
                  <li>Memberikan feedback/approval dalam 7 hari kerja</li>
                  <li>Menunjuk PIC (Person in Charge) untuk koordinasi</li>
                  <li>Berpartisipasi aktif dalam sesi user interview & testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PASAL 6 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 6 — KEPEMILIKAN HASIL KERJA</h3>
            <p className="text-justify text-sm mb-2">
              Setelah seluruh pembayaran terlunasi, seluruh hasil kerja termasuk source code, desain (Figma), dokumentasi teknis, dan aset digital lainnya menjadi <strong>hak milik penuh Klien (ALSITS)</strong>.
            </p>
            <p className="text-justify text-sm">
              Sebelum pelunasan, Developer berhak menahan serah terima source code dan/atau membatasi akses ke environment production.
            </p>
          </section>

          {/* PASAL 7 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 7 — REVISI DAN PERUBAHAN LINGKUP</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Revisi desain tidak dibatasi selama fase Phase 1 (design).</li>
              <li>Revisi minor (tanpa penambahan fitur baru) gratis selama fase development.</li>
              <li>Penambahan fitur di luar lingkup yang disepakati dapat dinegosiasikan dan dikenakan biaya tambahan yang disetujui kedua belah pihak secara tertulis.</li>
              <li>Perubahan lingkup harus didokumentasikan dalam addendum kontrak yang ditandatangani Para Pihak.</li>
            </ul>
          </section>

          {/* PASAL 8 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 8 — KETERLAMBATAN DAN PENALTI</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Jika Developer terlambat melewati target tanggal milestone lebih dari 14 hari kalender tanpa alasan yang sah, Developer memberikan perpanjangan support gratis selama 1 bulan tambahan.</li>
              <li>Jika Klien terlambat melakukan pembayaran lebih dari 14 hari dari jatuh tempo, Developer berhak menghentikan sementara pekerjaan hingga pembayaran diterima.</li>
              <li>Keterlambatan akibat lambatnya feedback/approval dari Klien tidak dihitung sebagai keterlambatan Developer.</li>
            </ul>
          </section>

          {/* PASAL 9 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 9 — KERAHASIAAN (CONFIDENTIALITY)</h3>
            <p className="text-justify text-sm">
              Kedua belah pihak setuju untuk menjaga kerahasiaan seluruh informasi, data alumni, dan materi internal ALSITS yang diterima selama masa kontrak dan setelahnya. Developer tidak akan mengungkapkan data tersebut kepada pihak ketiga tanpa persetujuan tertulis dari Klien, kecuali diwajibkan oleh hukum yang berlaku.
            </p>
          </section>

          {/* PASAL 10 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 10 — PENYELESAIAN SENGKETA</h3>
            <p className="text-justify text-sm">
              Segala perselisihan yang timbul dari kontrak ini diselesaikan secara musyawarah mufakat. Apabila tidak tercapai kesepakatan dalam 30 hari, Para Pihak sepakat menyelesaikan sengketa melalui mekanisme yang disepakati bersama sesuai hukum yang berlaku di Indonesia, dengan itikad baik dan semangat kekeluargaan.
            </p>
          </section>

          {/* PASAL 11 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 11 — FORCE MAJEURE</h3>
            <p className="text-justify text-sm">
              Tidak ada pihak yang bertanggung jawab atas keterlambatan atau kegagalan pelaksanaan akibat kejadian di luar kendali wajar, termasuk bencana alam, keadaan darurat nasional, pemadaman listrik berkepanjangan, atau keadaan lain yang tidak dapat diantisipasi. Para Pihak wajib segera memberitahukan kejadian tersebut secara tertulis.
            </p>
          </section>

          {/* PASAL 12 */}
          <section className="mb-6">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 12 — PEMUTUSAN KONTRAK</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Klien dapat membatalkan kontrak sewaktu-waktu dengan pemberitahuan tertulis 14 hari sebelumnya. Pembayaran termin yang sudah dibayarkan tidak dapat dikembalikan.</li>
              <li>Developer dapat mengakhiri kontrak jika Klien tidak melakukan pembayaran dalam 30 hari setelah jatuh tempo, dengan mengembalikan source code dan aset yang telah selesai dikerjakan hingga termin terakhir yang dibayar.</li>
            </ul>
          </section>

          {/* PASAL 13 */}
          <section className="mb-8">
            <h3 className="font-bold text-base mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>PASAL 13 — KETENTUAN LAIN</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Kontrak ini merupakan keseluruhan kesepakatan antara Para Pihak dan menggantikan seluruh komunikasi lisan maupun tertulis sebelumnya mengenai hal yang sama.</li>
              <li>Perubahan terhadap kontrak ini hanya sah jika dibuat secara tertulis dan ditandatangani oleh Para Pihak.</li>
              <li>Jika ada ketentuan yang tidak sah secara hukum, ketentuan lainnya tetap berlaku.</li>
            </ul>
          </section>

          {/* PENUTUP */}
          <div className="border-t-2 border-gray-300 pt-6">
            <p className="text-sm mb-6 text-justify text-gray-600 italic">
              "Dan bahwa seorang manusia tidak memperoleh selain apa yang telah diusahakannya." — QS. An-Najm: 39
            </p>
            <p className="text-sm mb-8 text-justify">
              Demikian kontrak ini dibuat dalam 2 (dua) rangkap bermaterai cukup, masing-masing mempunyai kekuatan hukum yang sama, dan ditandatangani oleh Para Pihak dengan penuh kesadaran dan tanpa paksaan.
            </p>

            <div className="grid grid-cols-2 gap-16 mt-4">
              <div className="text-center text-sm">
                <p className="font-semibold mb-1">PIHAK PERTAMA</p>
                <p className="text-gray-500 mb-16 text-xs">(Developer)</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="font-bold"><E k="p1Nama" /></p>
                  <p className="text-xs text-gray-500"><E k="p1Jabatan" /></p>
                </div>
              </div>
              <div className="text-center text-sm">
                <p className="font-semibold mb-1">PIHAK KEDUA</p>
                <p className="text-gray-500 mb-16 text-xs">(Klien / ALSITS)</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="font-bold"><E k="p2Nama" /></p>
                  <p className="text-xs text-gray-500"><E k="p2Jabatan" /></p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Dokumen ini bersifat konfidensial · Dibuat untuk keperluan kerjasama ALSITS & Developer Portal alsits.id · 2026
            </p>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:my-0 { margin: 0 !important; }
          .print\\:px-12 { padding-left: 3rem !important; padding-right: 3rem !important; }
          .print\\:py-10 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}