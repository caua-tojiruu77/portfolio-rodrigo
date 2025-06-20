import React from 'react';
import CasesFeed from '@/components/feed/casesFeed';
import AboutPageFeed from '@/components/feed/aboutPageFeed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About me - Rodrigo Tavella",
  description:
    "Explore my professional journey as a dancer, choreographer, and performer with over 10 years of experience in the dance industry. Discover my expertise in contemporary dance, acrobatics, and performance art through this portfolio.",
  keywords: ["dancer", "choreographer", "performer", "dance portfolio", "contemporary dance", "acrobatics", "performance art"],
  alternates: {
    canonical: "https://meu-portfolio-v1-chi.vercel.app",
    languages: {
      "pt-BR": "https://meu-portfolio-v1-chi.vercel.app",
    },
  },
  openGraph: {
    title: "About me - Rodrigo Tavella",
    description:
      "Explore my professional journey as a dancer, choreographer, and performer with over 10 years of experience in the dance industry. Discover my expertise in contemporary dance, acrobatics, and performance art through this portfolio.",
    url: "https://meu-portfolio-v1-chi.vercel.app",
    locale: "pt_BR",
    type: "website",
    siteName: "Portfólio Rdorigo Tavella",
    images: [
      {
        url: "/img/logo-header.png",
        width: 845,
        height: 471,
      },
    ],
  },
};

const AboutPage = () => {
  return (
    <main className="text-white mt-0 scroll-smooth">
      <AboutPageFeed />
      <CasesFeed />
    </main>
  );
};

export default AboutPage;