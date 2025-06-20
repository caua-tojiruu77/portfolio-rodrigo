"use client";
import React from 'react';
import HomePageSection from '@/components/feed/homePageFeed';
import CasesFeed from '@/components/feed/casesFeed';
import { createPolyglot } from '@/utils/polyglot';
import { useLanguage } from '@/context/languageContext';
import AboutPageFeed from '@/components/feed/aboutPageFeed';

const AboutPage = () => {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);

  return (
    <main className="text-white mt-0 scroll-smooth">
      <AboutPageFeed />
      <CasesFeed />
    </main>
  );
};

export default AboutPage;