import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import AlumniDatabase from './pages/AlumniDatabase';
import AlumniMap from './pages/AlumniMap';
import Dashboard from './pages/Dashboard';
import NewsPage from './pages/NewsPage';
import JobPostings from './pages/JobPostings';
import Library from './pages/Library';
import Forum from './pages/Forum';
import AdminPanel from './pages/AdminPanel';
import VotingPage from './pages/VotingPage';
import VotingAdmin from './pages/VotingAdmin';
import StaticPage from './pages/StaticPage';
import EventsPage from './pages/EventsPage';
import ContentAdmin from './pages/ContentAdmin';
import Presentation from './pages/Presentation';
import PresentationNotes from './pages/PresentationNotes';
import ProposalBiaya from './pages/ProposalBiaya';
import Deliverables from './pages/Deliverables';
import DPT from './pages/DPT';
import BusinessHub from './pages/BusinessHub';
import DraftKontrak from './pages/DraftKontrak';
import DokumenHub from './pages/DokumenHub';
import PanduanAdmin from './pages/PanduanAdmin';
import SPK from './pages/SPK';
import NotulenKickoff from './pages/NotulenKickoff';
import BAST1 from './pages/BAST1';
import BASTAkhir from './pages/BASTAkhir';
import InvoiceTagihan from './pages/InvoiceTagihan';
import Lampiran1Proposal from './pages/Lampiran1Proposal';
import UXResearch from './pages/UXResearch';
import CompetitiveAnalysis from './pages/CompetitiveAnalysis';
import DesignSystem from './pages/DesignSystem';
import WireframePrototype from './pages/WireframePrototype';
import DocsPhase2 from './pages/DocsPhase2';
import DocsPhase3 from './pages/DocsPhase3';
import GabungLampiran from './pages/GabungLampiran';
import Lampiran2Scope from './pages/Lampiran2Scope';
import Lampiran3Jadwal from './pages/Lampiran3Jadwal';
import Lampiran4BAST from './pages/Lampiran4BAST';
import Lampiran5Aset from './pages/Lampiran5Aset';
import PublicPortal from './pages/PublicPortal';
import LampiranBAST1Phase1 from './pages/LampiranBAST1Phase1';
import LampiranBAST1Phase2 from './pages/LampiranBAST1Phase2';
import UndanganReview from './pages/UndanganReview';
import PublicView from './pages/PublicView';
import Inbox from './pages/Inbox';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DeactivationNotice from './pages/DeactivationNotice';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Route "/" — hanya developer owner yang bisa masuk, semua lainnya lihat deaktivasi
const AdminBypassRoute = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  // Kalau masih loading auth, tampilkan DeactivationNotice dulu (bukan spinner)
  // agar pengunjung tidak lihat loading screen kosong
  if (isLoadingAuth && !user) return <DeactivationNotice />;
  if (isAuthenticated && user?.email === 'hazrilf@gmail.com') return <PublicView />;
  return <DeactivationNotice />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-heading">Memuat ALSITS...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      {/* Route "/" — DeactivationNotice, bypass untuk hazrilf */}
      <Route path="/" element={<AdminBypassRoute />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Privacy Policy */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Halaman publik — tanpa auth */}
      <Route path="/public-home" element={<PublicView />} />
      <Route path="/public-view" element={<PublicView />} />
      <Route path="/public" element={<PublicPortal />} />
      <Route path="/business-hub" element={<BusinessHub />} />
      <Route path="/tentang/sejarah" element={<StaticPage pageKey="sejarah" />} />
      <Route path="/tentang/sambutan" element={<StaticPage pageKey="sambutan" />} />
      <Route path="/tentang/struktur" element={<StaticPage pageKey="struktur" />} />
      <Route path="/tentang/visi-misi" element={<StaticPage pageKey="visi_misi" />} />
      <Route path="/alumni/prestasi" element={<StaticPage pageKey="prestasi" />} />
      <Route path="/alumni/kontribusi" element={<StaticPage pageKey="kontribusi" />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/komunitas/gowes" element={<StaticPage pageKey="komunitas_gowes" />} />
      <Route path="/komunitas/golf" element={<StaticPage pageKey="komunitas_golf" />} />
      <Route path="/komunitas/jalan-sehat" element={<StaticPage pageKey="komunitas_jalan_sehat" />} />
      <Route path="/komunitas/trading" element={<StaticPage pageKey="komunitas_trading" />} />

      {/* Dokumen/presentation — tanpa auth */}
      <Route path="/presentation" element={<Presentation />} />
      <Route path="/presentation-notes" element={<PresentationNotes />} />
      <Route path="/proposal-biaya" element={<ProposalBiaya />} />
      <Route path="/deliverables" element={<Deliverables />} />
      <Route path="/draft-kontrak" element={<DraftKontrak />} />
      <Route path="/dokumen" element={<DokumenHub />} />
      <Route path="/spk" element={<SPK />} />
      <Route path="/notulen-kickoff" element={<NotulenKickoff />} />
      <Route path="/bast-1" element={<BAST1 />} />
      <Route path="/bast-1-lampiran-a" element={<LampiranBAST1Phase1 />} />
      <Route path="/bast-1-lampiran-b" element={<LampiranBAST1Phase2 />} />
      <Route path="/bast-akhir" element={<BASTAkhir />} />
      <Route path="/invoice" element={<InvoiceTagihan />} />
      <Route path="/lampiran-1" element={<Lampiran1Proposal />} />
      <Route path="/ux-research" element={<UXResearch />} />
      <Route path="/competitive-analysis" element={<CompetitiveAnalysis />} />
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/wireframe-prototype" element={<WireframePrototype />} />
      <Route path="/docs-phase-2" element={<DocsPhase2 />} />
      <Route path="/docs-phase-3" element={<DocsPhase3 />} />
      <Route path="/gabung-lampiran" element={<GabungLampiran />} />
      <Route path="/lampiran-2" element={<Lampiran2Scope />} />
      <Route path="/lampiran-3" element={<Lampiran3Jadwal />} />
      <Route path="/lampiran-4" element={<Lampiran4BAST />} />
      <Route path="/lampiran-5" element={<Lampiran5Aset />} />
      <Route path="/undangan-review" element={<UndanganReview />} />

      {/* Voting — public, tanpa login */}
      <Route element={<AppLayout />}>
        <Route path="/voting" element={<VotingPage />} />
      </Route>

      {/* Halaman private — wajib login */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Login />} />}>
        <Route element={<AppLayout />}>
          <Route path="/beranda" element={<Home />} />
          <Route path="/alumni" element={<AlumniDatabase />} />
          <Route path="/peta" element={<AlumniMap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/berita" element={<NewsPage />} />
          <Route path="/lowongan" element={<JobPostings />} />
          <Route path="/library" element={<Library />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/voting/admin" element={<VotingAdmin />} />
          <Route path="/content-admin" element={<ContentAdmin />} />
          <Route path="/dpt" element={<DPT />} />
          <Route path="/panduan-admin" element={<PanduanAdmin />} />
          <Route path="/inbox" element={<Inbox />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App