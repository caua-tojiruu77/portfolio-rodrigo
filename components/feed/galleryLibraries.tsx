"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { galleryLibraries } from "@/utils/galleryConfig";
import { useLanguage } from "@/context/languageContext";

export default function GalleryLibraries() {
  const { language } = useLanguage();
  const entries = Object.entries(galleryLibraries);

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 space-y-24">
      {entries.map(([key, lib], index) => {
        const isReversed = index % 2 !== 0;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row ${
              isReversed ? "md:flex-row-reverse" : ""
            } items-center gap-10`}
          >
            {/* Imagem */}
            <Link href={`/gallery/${key}`} className="w-full md:w-1/2">
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                {/* fallback to an existing local image if the library has no image items */}
                <Image
                  src={
                    // prefer explicit cover if provided (local path under /public)
                    (lib as any).cover
                      ? (lib as any).cover
                      : lib.type === "image" && lib.items && lib.items.length > 0
                      ? `${lib.path}/${typeof lib.items[0] === 'string' ? lib.items[0] : (lib.items[0] as any).src}`
                      : "/img/gallery/fotos-artisticas/10.webp"
                  }
                  alt={lib.title[language]}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Texto */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2">{lib.title[language]}</h3>
              {lib.description && (
                <p className="text-sm text-gray-300 mb-4">{lib.description[language]}</p>
              )}

              <Link href={`/gallery/${key}`} className="px-1">
                <motion.p
                  className="inline-flex items-center gap-2 bg-brand-100 transition text-white px-5 py-2 rounded-full shadow-md cursor-pointer relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  {(() => {
                    const btn: Record<string, string> = {
                      en: "View library",
                      it: "Vedi biblioteca",
                      de: "Zur Bibliothek",
                    };
                    return btn[language] || btn.en;
                  })()}

                  <motion.span
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    }}
                  />
                </motion.p>
              </Link>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
