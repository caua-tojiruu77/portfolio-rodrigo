"use client";
import React from 'react';
import HomePageSection from '@/components/feed/homePageFeed';
import CasesFeed from '@/components/feed/casesFeed';
import { createPolyglot } from '@/utils/polyglot';
import { useLanguage } from '@/context/languageContext';

const HomePage = () => {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);

  return (
    <main className="text-white mt-0 scroll-smooth">
      <HomePageSection />
      <CasesFeed />
    </main>
  );
};

export default HomePage;