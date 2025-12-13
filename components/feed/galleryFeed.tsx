"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
                  alt={item.title ? item.title[language] : ""}
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
            >
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={selected as string}
                    alt={selectedItem?.title ? selectedItem.title[language] : ""}
                    width={1200}
                    height={1200}
                    className="max-h-[70vh] max-w-[80vw] object-contain"
                  />
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
