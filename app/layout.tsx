import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import ScrollAnimation from "@/components/animations/scrollAnimation";
import { Outfit } from "next/font/google";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"], // pesos que você deseja
});


export const metadata: Metadata = {
  title: "Cauã Tavella | Desenvolvedor Web",
  description:
    "Bem-vindo ao meu portfólio! Aqui você vai conhecer mais sobre mim e acompanhar minha trajetória como desenvolvedor web.",
  keywords: ["programador, frontend, react, next, dev, desenvolvedor, dev.web"],
  alternates: {
    canonical: "https://meu-portfolio-v1-chi.vercel.app",
    languages: {
      "pt-BR": "https://meu-portfolio-v1-chi.vercel.app",
    },
  },
  openGraph: {
    title: "Cauã Tavella | Desenvolvedor Web",
    description:
      "Bem-vindo ao meu portfólio! Aqui você vai conhecer mais sobre mim e acompanhar minha trajetória como desenvolvedor web.",
    url: "https://meu-portfolio-v1-chi.vercel.app",
    locale: "pt_BR",
    type: "website",
    siteName: "Portfólio Cauã Tavella",
    images: [
      {
        url: "/img/logo-colorida.png",
        width: 845,
        height: 471,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/img/logo-header.webp",
    shortcut: "/img/logo-header.webp",
    apple: "/img/logo-header.webp",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/img/logo-header.webp",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.className}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/scq2zya.css" />
      </head>
      <body className="bg-brand-400 font-omnes scroll-smooth">
        <Header />
        <ScrollAnimation>{children}</ScrollAnimation>
        <Footer />
      </body>
    </html>
  );
}
