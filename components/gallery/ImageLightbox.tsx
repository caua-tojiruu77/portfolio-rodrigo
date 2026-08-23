"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageLightboxProps = {
  images: string[];
  selectedIndex: number | null;
  title: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function ImageLightbox({
  images,
  selectedIndex,
  title,
  closeLabel,
  previousLabel,
  nextLabel,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const isOpen = selectedIndex !== null && images.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((selectedIndex! + 1) % images.length);
      if (event.key === "ArrowLeft") onIndexChange((selectedIndex! - 1 + images.length) % images.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, isOpen, onClose, onIndexChange, selectedIndex]);

  const handleSwipeEnd = (endX: number) => {
    if (swipeStartX === null || selectedIndex === null || images.length < 2) return;
    const distance = endX - swipeStartX;
    if (Math.abs(distance) >= 50) {
      onIndexChange(distance < 0 ? (selectedIndex + 1) % images.length : (selectedIndex - 1 + images.length) % images.length);
    }
    setSwipeStartX(null);
  };

  return (
    <AnimatePresence>
      {isOpen && selectedIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-12 w-full shrink-0 items-center justify-between gap-4 text-white">
              <h3 className="truncate text-lg font-semibold md:text-xl">{title}</h3>
              <button type="button" onClick={onClose} aria-label={closeLabel} className="rounded-full bg-white/10 p-2 transition hover:bg-white/20">
                <X size={24} />
              </button>
            </div>

            <div
              className="relative flex min-h-0 w-full touch-pan-y select-none items-center justify-center"
              onPointerDown={(event) => setSwipeStartX(event.clientX)}
              onPointerUp={(event) => handleSwipeEnd(event.clientX)}
              onPointerCancel={() => setSwipeStartX(null)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={images[selectedIndex]}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="flex max-h-[65vh] w-full items-center justify-center"
                >
                  <Image
                    src={images[selectedIndex]}
                    alt={`${title} ${selectedIndex + 1}`}
                    width={1400}
                    height={1000}
                    className="max-h-[65vh] w-auto max-w-full object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button type="button" aria-label={previousLabel} onClick={() => onIndexChange((selectedIndex - 1 + images.length) % images.length)} className="absolute left-2 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80 md:left-4">
                    <ChevronLeft size={26} />
                  </button>
                  <button type="button" aria-label={nextLabel} onClick={() => onIndexChange((selectedIndex + 1) % images.length)} className="absolute right-2 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80 md:right-4">
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button type="button" key={image} aria-label={`${title} ${index + 1}`} onClick={() => onIndexChange(index)} className={`h-16 w-16 flex-none overflow-hidden rounded border-2 ${index === selectedIndex ? "border-brand-300" : "border-transparent opacity-60"}`}>
                    <Image src={image} alt="" width={80} height={80} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
