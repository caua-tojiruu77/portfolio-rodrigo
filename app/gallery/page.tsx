import GalleryLibraries from "@/components/feed/galleryLibraries";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery - Rodrigo Tavella',
  description: 'Gallery — photos and visual work by Rodrigo Tavella.',
  alternates: {
    canonical: 'https://meu-portfolio-v1-chi.vercel.app/gallery',
    languages: { 'pt-BR': 'https://meu-portfolio-v1-chi.vercel.app/gallery' },
  },
  openGraph: {
    title: 'Gallery - Rodrigo Tavella',
    description: 'Gallery — photos and visual work by Rodrigo Tavella.',
    url: 'https://meu-portfolio-v1-chi.vercel.app/gallery',
    locale: 'pt-BR',
    type: 'website',
    siteName: 'Portfólio Rodrigo Tavella',
    images: [
      {
        url: '/img/logo-header.png',
        width: 845,
        height: 471,
      },
    ],
  },
};

export default function GalleryPage() {
  return (
    <main className="text-white">
      <GalleryLibraries />
    </main>
  );
}
