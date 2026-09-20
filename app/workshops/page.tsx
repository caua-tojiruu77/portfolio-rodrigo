import type { Metadata } from "next";
import WorkshopsFeed from "@/components/feed/workshopsFeed";

export const metadata: Metadata = {
  title: "Workshops - Rodrigo Tavella",
  description:
    "Explore workshops de dança, performance e desenvolvimento técnico com Rodrigo Tavella.",
  alternates: {
    canonical: "https://meu-portfolio-v1-chi.vercel.app/workshops",
    languages: { "pt-BR": "https://meu-portfolio-v1-chi.vercel.app/workshops" },
  },
  openGraph: {
    title: "Workshops - Rodrigo Tavella",
    description:
      "Explore workshops de dança, performance e desenvolvimento técnico com Rodrigo Tavella.",
    url: "https://meu-portfolio-v1-chi.vercel.app/workshops",
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

export default function WorkshopsPage() {
  return (
    <main className="text-white mt-0 scroll-smooth">
      <WorkshopsFeed />
    </main>
  );
}
