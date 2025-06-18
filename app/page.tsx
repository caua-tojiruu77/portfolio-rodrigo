import CasesFeed from '@/components/feed/casesFeed';
import HomePageSection from '@/components/feed/homePageFeed';
import React from 'react';

const HomePage = () => {
  return (
    <main className="text-white mt-0 scroll-smooth">
      <HomePageSection/>
      <CasesFeed/>
    </main>
  );
};

export default HomePage;
