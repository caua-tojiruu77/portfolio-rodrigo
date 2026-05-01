"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
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

  const slideIframes = useRef<Record<number, HTMLIFrameElement | null>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const addParams = (url: string, params: Record<string, string | number | boolean>) => {
    const [base, query] = url.split("?");
    const q = new URLSearchParams(query || "");
    const allParams = { ...params } as Record<string, string | number | boolean>;
    try {
      if (typeof window !== "undefined") {
        allParams.origin = (window as any).location?.origin || allParams.origin || "";
      }
    } catch (e) {}
    Object.entries(allParams).forEach(([k, v]) => q.set(k, String(v)));
    return `${base}?${q.toString()}`;
  };

  const postCommand = (iframe: HTMLIFrameElement | null, command: string) => {
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
    } catch (e) {}
  };

  const pauseAllIframes = (except?: HTMLIFrameElement | null) => {
    Object.values(slideIframes.current).forEach((f) => {
      if (f && f !== except) postCommand(f, "pauseVideo");
    });
  };

  const playWithRetry = (iframe: HTMLIFrameElement | null) => {
    if (!iframe) return;
    postCommand(iframe, "playVideo");
    setTimeout(() => postCommand(iframe, "playVideo"), 500);
    setTimeout(() => postCommand(iframe, "playVideo"), 1500);
  };

  const toWatchUrl = (url: string) => {
    try {
      // embed URL: https://www.youtube.com/embed/VIDEOID
      const u = new URL(url);
      const p = u.pathname;
      // /embed/VIDEO or /shorts/VIDEO
      const parts = p.split("/").filter(Boolean);
      const id = parts.length ? parts[parts.length - 1] : null;
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    } catch (e) {}
    return url;
  };

  useEffect(() => {
    const onFsChange = () => {
      const el = document.fullscreenElement as HTMLElement | null;
      if (!el) {
        // exited fullscreen
        setFullscreenIndex(null);
        Object.values(slideIframes.current).forEach((f) => {
          if (f) f.style.pointerEvents = "none";
        });
        return;
      }

      // find which iframe is now fullscreen (it may be the iframe itself)
      const idx = Object.entries(slideIframes.current).find(([k, v]) => {
        return v === el || (v && v.contains && el && v.contains(el));
      });
      if (idx) {
        const index = Number(idx[0]);
        setFullscreenIndex(index);
        const f = slideIframes.current[index];
        if (f) f.style.pointerEvents = "auto";
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange as any);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange as any);
    };
  }, []);

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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`rounded-lg overflow-hidden shadow-lg relative transition-transform duration-200 ${hoveredIndex === idx ? 'scale-105' : 'scale-100'}`}
            onClick={() => {
              if (item.type === "video") {
                const iframe = slideIframes.current[idx];
                pauseAllIframes(iframe || undefined);

                if (iframe) {
                  const req: any = (iframe as any).requestFullscreen || (iframe as any).webkitRequestFullscreen || (iframe as any).mozRequestFullScreen || (iframe as any).msRequestFullscreen;
                  try {
                    if (req) req.call(iframe);
                  } catch (e) {}

                  playWithRetry(iframe);

                  // fallback: if fullscreen wasn't entered, open watch URL in new tab
                  setTimeout(() => {
                    if (!document.fullscreenElement) {
                      const watch = toWatchUrl(item.src);
                      window.open(watch, "_blank");
                    }
                  }, 700);
                } else {
                  // no iframe element available, open directly
                  window.open(toWatchUrl(item.src), "_blank");
                }
                return;
              }

              setSelected(item.src);
            }}
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
              <>
                <iframe
                  ref={(el) => { slideIframes.current[idx] = el; }}
                  src={addParams(item.src, { enablejsapi: 1 })}
                  className="w-full h-48 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
                <div
                  className={`absolute inset-0 z-10 cursor-pointer ${fullscreenIndex === idx ? 'hidden' : ''}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && selectedItem?.type === "image" && (
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
                    width={900}
                    height={900}
                    className="max-h-[50vh] max-w-[60vw] object-contain"
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
