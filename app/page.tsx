import React from 'react';
import HomePageSection from '@/components/feed/homePageFeed';
import CasesFeed from '@/components/feed/casesFeed';
import VideosFeed from '@/components/feed/videosFeed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Rodrigo Tavella',
  description:
    'Portfolio of Rodrigo Tavella — professional dancer, choreographer and performer. Explore works, videos and contact information.',
  alternates: {
    canonical: 'https://meu-portfolio-v1-chi.vercel.app',
    languages: { 'pt-BR': 'https://meu-portfolio-v1-chi.vercel.app' },
  },
  openGraph: {
    title: 'Home - Rodrigo Tavella',
    description:
      'Portfolio of Rodrigo Tavella — professional dancer, choreographer and performer. Explore works, videos and contact information.',
    url: 'https://meu-portfolio-v1-chi.vercel.app',
    locale: 'pt-BR',
    type: 'website',
    siteName: 'Portfólio Rodrigo Tavella',
    images: [
      {
        url: '/img/home-photo.webp',
        width: 1200,
        height: 1200,
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="text-white mt-0 scroll-smooth">
      <HomePageSection />
      <VideosFeed />
      <CasesFeed />
    </main>
  );
}