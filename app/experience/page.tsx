"use client";
import React from "react";
import HomePageSection from "@/components/feed/homePageFeed";
import CasesFeed from "@/components/feed/casesFeed";
import { createPolyglot } from "@/utils/polyglot";
import { useLanguage } from "@/context/languageContext";
import ExperienceSection from "@/components/feed/experiencePageFeed";

const HomePage = () => {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);

  return (
    <main className="text-white mt-0 scroll-smooth">
      <ExperienceSection />
      <CasesFeed />
    </main>
  );
};

export default HomePage;
