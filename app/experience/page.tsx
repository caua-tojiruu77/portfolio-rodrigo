
import React from "react";
import CasesFeed from "@/components/feed/casesFeed";
import ExperienceSection from "@/components/feed/experiencePageFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Experience - Rodrigo Tavella",
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
    title: "Rodrigo Tavella - Professional dancer and choreographer",
    description:
      "Explore my professional journey as a dancer, choreographer, and performer with over 10 years of experience in the dance industry. Discover my expertise in contemporary dance, acrobatics, and performance art through this portfolio.",
    url: "https://meu-portfolio-v1-chi.vercel.app",
    locale: "pt-BR",
    type: "website",
    siteName: "Portfólio Rodrigo Tavella",
    images: [
      {
        url: "/img/logo-header.png",
        width: 845,
        height: 471,
      },
    ],
  },
};

const ExperiencePage = () => {
  return (
    <main className="text-white mt-0 scroll-smooth">
      <ExperienceSection />
      <CasesFeed />
    </main>
  );
};

export default ExperiencePage;
