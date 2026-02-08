import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/languageContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"], // pesos que você deseja
  display: "swap",
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
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo Tavella - Professional dancer and choreographer",
    description:
      "Dancer, choreographer and performer. Portfolio of Rodrigo Tavella.",
    site: "@Rodrigotavella",
    creator: "@Rodrigotavella",
    images: ["/img/logo-header.png"],
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://meu-portfolio-v1-chi.vercel.app/#website",
      "url": "https://meu-portfolio-v1-chi.vercel.app",
      "name": "Rodrigo Tavella - Portfólio",
      "description": "Portfolio of Rodrigo Tavella, dancer and choreographer.",
      "publisher": {
        "@type": "Person",
        "name": "Rodrigo Tavella"
      }
    },
    {
      "@type": "Person",
      "@id": "https://meu-portfolio-v1-chi.vercel.app/#person",
      "name": "Rodrigo Tavella",
      "url": "https://meu-portfolio-v1-chi.vercel.app",
      "sameAs": [
        "https://www.instagram.com/rodrigo.tavella/",
        "https://www.youtube.com/@Rodrigotavella"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={outfit.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metadata.alternates?.canonical} />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/scq2zya.css" />
        <link rel="preload" as="image" href="/img/home-photo.webp" />
        <link rel="icon" href="/img/logo-header.png" type="image/x-icon" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
