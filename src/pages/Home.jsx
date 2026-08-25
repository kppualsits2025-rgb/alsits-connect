import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import LatestNews from '../components/home/LatestNews';

export default function Home() {
  const { data: alumni } = useQuery({
    queryKey: ['alumni-count'],
    queryFn: () => base44.entities.Alumni.list('-created_date', 1),
    initialData: [],
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: news } = useQuery({
    queryKey: ['latest-news'],
    queryFn: () => base44.entities.News.filter({ is_published: true }, '-published_date', 3),
    initialData: [],
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Estimasi total alumni ITS Teknik Sipil (S1~100/angkatan x 60+ angkatan + S2/S3)
  // Data di DB hanya sebagian, estimasi sesungguhnya ~5000+
  const alumniCount = '5,000+';

  return (
    <div>
      <HeroSection alumniCount={alumniCount} />
      <FeaturesSection />
      <LatestNews news={news} />
    </div>
  );
}