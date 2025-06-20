import React from "react";
import CasesFeed from "@/components/feed/casesFeed";
import AcademicFormationFeed from "@/components/feed/academicFormation";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "My Academic Formation - Rodrigo Tavella",
  description:
    "My academic formation as a dancer, choreographer, and performer with over 10 years in the dance industry. Specializing in contemporary dance, acrobatics, and performance art, I have collaborated with renowned artists and companies worldwide.",
  keywords: ["dancer", "choreographer", "performer", "dance portfolio", "contemporary dance", "acrobatics", "performance art"],
  alternates: {
    canonical: "https://meu-portfolio-v1-chi.vercel.app",
    languages: {
      "pt-BR": "https://meu-portfolio-v1-chi.vercel.app",
    },
  },
  openGraph: {
    title: "My Academic Formation - Rodrigo Tavella",
    description:
      "My academic formation as a dancer, choreographer, and performer with over 10 years in the dance industry. Specializing in contemporary dance, acrobatics, and performance art, I have collaborated with renowned artists and companies worldwide.",
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
      <AcademicFormationFeed />
      <CasesFeed />
    </main>
  );
};

export default AboutPage;
