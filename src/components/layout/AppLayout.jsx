import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BirthdayNotifBar from './BirthdayNotifBar';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { useAuth } from '@/lib/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem('alsits_onboarding_done')) {
      const t = setTimeout(() => setShowOnboarding(true), 1500);
      return () => clearTimeout(t);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <BirthdayNotifBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}