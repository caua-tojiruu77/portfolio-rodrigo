import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/languageContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"], // pesos que você deseja
});

export const metadata: Metadata = {
  title: "Rodrigo Tavella - Professional dancer and choreographer",
  description:
    "dancer, choreographer, and performer with over 10 years of experience in the dance industry. Specializing in contemporary dance, acrobatics, and performance art, I have collaborated with renowned artists and companies worldwide.",
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
      "dancer, choreographer, and performer with over 10 years of experience in the dance industry. Specializing in contemporary dance, acrobatics, and performance art, I have collaborated with renowned artists and companies worldwide.",
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
        <link rel="icon" href="/img/logo-header.png" type="image/x-icon" />
      </head>
      <body className="bg-brand-400 font-omnes scroll-smooth">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
