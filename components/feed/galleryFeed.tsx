"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";

const galleryImages = [
  "/img/gallery/1.webp",
  "/img/gallery/2.webp",
  "/img/gallery/21.webp",
  "/img/gallery/23.webp",
  "/img/gallery/5.webp",
  "/img/gallery/6.webp",
  "/img/gallery/7.webp",
  "/img/gallery/8.webp",
  "/img/gallery/9.webp",
  "/img/gallery/10.webp",
  "/img/gallery/11.webp",
  "/img/gallery/12.webp",
  "/img/gallery/13.webp",
  "/img/gallery/14.webp",
  "/img/gallery/15.webp",
  "/img/gallery/16.webp",
  "/img/gallery/17.webp",
  "/img/gallery/18.webp",
  "/img/gallery/19.webp",
  "/img/gallery/20.webp",
  "/img/gallery/24.webp",
  "/img/gallery/3.webp",
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

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="flex flex-col items-center min-h-screen">
      {/* Título com estilo igual aos outros componentes */}
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
        {galleryImages.map((src, idx) => (
          <motion.div
            key={src}
            whileHover={{ scale: 1.04 }}
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
            onClick={() => setSelectedImg(src)}
          >
            <Image
              src={src}
              alt={`Gallery image ${idx + 1}`}
              width={400}
              height={400}
              className="object-cover w-full h-48 md:h-56 lg:h-60 transition-transform duration-200"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Modal de imagem ampliada */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImg}
                alt="Rodrigo Web Gallery Image"
                title="Web gallery for Rodrigo Tavella"
                width={1200}
                height={1200}
                className="rounded-lg max-h-[100vh] max-w-[100vw] w-auto h-auto object-contain shadow-2xl"
                draggable={false}
              />
              <button
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition"
                onClick={() => setSelectedImg(null)}
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
