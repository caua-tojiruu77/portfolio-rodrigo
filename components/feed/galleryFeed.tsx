"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";

// Lista com todas as imagens + vídeos
const galleryItems = [
  { type: "video", src: "https://www.youtube.com/embed/DAf2vscAHiY?si=XwmPMhNzFZzCwN_F" }, // exemplo
  { type: "video", src: "https://www.youtube.com/embed/7FUkCa85thY?si=4_GMUi32me7yBHDY" }, // exemplo
  { type: "video", src: "https://www.youtube.com/embed/k4QatTbbGno?si=rgJ1hdn-H1-duLA4" }, // exemplo
  { type: "video", src: "https://www.youtube.com/embed/1TMq6kDOfMo?si=5zAqDwrBMLoVkd58" }, // exemplo
  { type: "image", src: "/img/gallery/1.webp" },
  { type: "image", src: "/img/gallery/2.webp" },
  { type: "image", src: "/img/gallery/21.webp" },
  { type: "image", src: "/img/gallery/23.webp" },
  { type: "image", src: "/img/gallery/5.webp" },
  { type: "image", src: "/img/gallery/6.webp" },
  { type: "image", src: "/img/gallery/7.webp" },
  { type: "image", src: "/img/gallery/8.webp" },
  { type: "image", src: "/img/gallery/9.webp" },
  { type: "image", src: "/img/gallery/10.webp" },
  { type: "image", src: "/img/gallery/11.webp" },
  { type: "image", src: "/img/gallery/12.webp" },
  { type: "image", src: "/img/gallery/13.webp" },
  { type: "image", src: "/img/gallery/14.webp" },
  { type: "image", src: "/img/gallery/15.webp" },
  { type: "image", src: "/img/gallery/16.webp" },
  { type: "image", src: "/img/gallery/17.webp" },
  { type: "image", src: "/img/gallery/18.webp" },
  { type: "image", src: "/img/gallery/19.webp" },
  { type: "image", src: "/img/gallery/20.webp" },
  { type: "image", src: "/img/gallery/24.webp" },
  { type: "image", src: "/img/gallery/3.webp" },
];

const phrases = {
  en: {
    titleBg: "GALLERY",
    title: "Gallery",
  },
  it: {
    titleBg: "GALLERIA",
    title: "Galleria",
  },
  de: {
    titleBg: "GALERIE",
    title: "Galerie",
  },
};

export default function GalleryFeed() {
  const { language } = useLanguage();

  const polyglot = useMemo(
    () =>
      new Polyglot({
        phrases: phrases[language],
        locale: language,
      }),
    [language]
  );

  const [selectedItem, setSelectedItem] = useState<{ type: string; src: string } | null>(null);

  return (
    <section className="flex flex-col items-center min-h-screen">
      <div className="relative lg:py-16 mb-8 w-full flex flex-col items-center">
        <h2
          className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[4rem] xl:text-[6rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10 text-center uppercase"
          aria-hidden="true"
        >
          {polyglot.t("titleBg")}
        </h2>
        <h2 className="relative text-4xl font-bold text-center">
          {polyglot.t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {galleryItems.map((item, idx) => (
          <motion.div
            key={`${item.type}-${item.src}-${idx}`}
            whileHover={{ scale: 1.04 }}
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
            onClick={() => setSelectedItem(item)}
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={`Gallery image ${idx + 1}`}
                width={400}
                height={400}
                className="object-cover w-full h-48 md:h-56 lg:h-60 transition-transform duration-200"
                draggable={false}
              />
            ) : (
              <div className="w-full h-48 md:h-56 lg:h-60 bg-black flex items-center justify-center">
                <iframe
                  src={item.src}
                  title={`Video ${idx + 1}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === "image" ? (
                <Image
                  src={selectedItem.src}
                  alt="Rodrigo Web Gallery Image"
                  title="Web gallery for Rodrigo Tavella"
                  width={1200}
                  height={1200}
                  className="rounded-lg max-h-[100vh] max-w-[100vw] w-auto h-auto object-contain shadow-2xl"
                  draggable={false}
                />
              ) : (
                <iframe
                  src={selectedItem.src}
                  className="rounded-lg max-h-[90vh] max-w-[90vw] w-[80vw] h-[45vw] object-contain shadow-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}

              <button
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
              >
                <svg
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
