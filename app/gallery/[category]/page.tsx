"use client";

import GalleryFeed from "@/components/feed/galleryFeed";
import { useParams } from "next/navigation";

export default function GalleryByCategory() {
  const { category } = useParams() as { category: string };

  return (
    <main className="text-white">
      <GalleryFeed category={category} />
    </main>
  );
}
