"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galleryLibraries } from "@/utils/galleryConfig";
import { useLanguage } from "@/context/languageContext";

interface GalleryFeedProps {
  category: string;
}

export default function GalleryFeed({ category }: GalleryFeedProps) {
  const lib = galleryLibraries[category as keyof typeof galleryLibraries];
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  type RenderItem = {
    type: "image" | "video";
    src: string;
    title?: { en: string; it: string; de: string } | undefined;
  };

  const items = useMemo<RenderItem[]>(() => {
  if (!lib) return [];

  if (lib.type === "image") {
    return lib.items.map((item) => {
      if (typeof item === "string") {
        return {
          type: "image",
          src: `${lib.path}/${item}`,
          title: undefined as undefined,
        };
      }

      // item is object with src and optional title
      return {
        type: "image",
        src: `${lib.path}/${item.src}`,
        title: item.title,
      };
    });
  }

  // video
  return lib.items.map((item) => ({
    type: "video",
    src: item,
  }));
}, [lib]);

  const selectedItem = items.find((i) => i.src === selected);

  const goToIndex = useCallback((index: number) => {
    const clamped = (index + items.length) % items.length;
    setSelected(items[clamped].src);
  }, [items]);

  const goNext = useCallback(() => {
    if (!selected) return;
    const idx = items.findIndex((i) => i.src === selected);
    if (idx === -1) return;
    goToIndex(idx + 1);
  }, [items, selected, goToIndex]);

  const goPrev = useCallback(() => {
    if (!selected) return;
    const idx = items.findIndex((i) => i.src === selected);
    if (idx === -1) return;
    goToIndex(idx - 1);
  }, [items, selected, goToIndex]);

  useEffect(() => {
    if (!selected) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, goNext, goPrev]);


  if (!lib) {
    return <p className="text-center mt-20">Categoria não encontrada</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
    <h1 className="text-4xl font-bold text-center mb-8">{lib.title[language]}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={() => setSelected(item.src)}
          >
            {item.type === "image" ? (
              <>
                <Image
                  src={item.src}
                  alt={item.title ? item.title[language] : `${lib.title[language]} image ${idx + 1}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-48"
                />
                {/* thumbnails: no titles or descriptions (kept clean as requested) */}
              </>
            ) : (
              <iframe
                src={item.src}
                className="w-full h-48"
                allowFullScreen
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={selected as string}
                    alt={selectedItem?.title ? selectedItem.title[language] : `${lib.title[language]} image`}
                    width={1200}
                    height={1200}
                    className="max-h-[70vh] max-w-[80vw] object-contain"
                  />

                  {/* Nav buttons */}
                  <button
                    aria-label="Anterior"
                    onClick={goPrev}
                    className="absolute left-[-48px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ‹
                  </button>

                  <button
                    aria-label="Próximo"
                    onClick={goNext}
                    className="absolute right-[-48px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
