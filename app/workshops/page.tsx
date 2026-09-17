import type { Metadata } from "next";
import WorkshopsFeed from "@/components/feed/workshopsFeed";
import Link from "next/link";

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
      <div className="row px-5 pb-12 lg:px-0">
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-gray-200">
          <span className="font-semibold text-brand-200">Sandbox:</span> o pagamento é testado em ambiente de testes do PayPal e as vagas são controladas pelo backend.
          <Link href="/admin/workshops" className="ml-3 underline text-white hover:text-brand-200">
            Ver painel administrativo
          </Link>
        </div>
      </div>
    </main>
  );
}
