"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GalleryButton from "../buttons/galleryButton";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface VideoSliderProps {
  cases: {
    video: string;
    name: string;
  }[];
}

const VideoSlider = ({ cases }: VideoSliderProps) => {
  const slideIframes = useRef<Record<number, HTMLIFrameElement | null>>({});
  const [hovered, setHovered] = useState<number | null>(null);

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

  const playWithRetry = (iframe: HTMLIFrameElement | null) => {
    if (!iframe) return;
    postCommand(iframe, "playVideo");
    setTimeout(() => postCommand(iframe, "playVideo"), 500);
    setTimeout(() => postCommand(iframe, "playVideo"), 1500);
  };

  const pauseAllIframes = (except?: HTMLIFrameElement | null) => {
    Object.values(slideIframes.current).forEach((f) => {
      if (f && f !== except) postCommand(f, "pauseVideo");
    });
  };

  React.useEffect(() => {
    const onFsChange = () => {
      const el = document.fullscreenElement as HTMLElement | null;
      if (!el) {
        // exited fullscreen
        Object.values(slideIframes.current).forEach((f) => {
          if (f) f.style.pointerEvents = "none";
        });
        return;
      }

      // find which iframe is now fullscreen
      const idx = Object.entries(slideIframes.current).find(([k, v]) => {
        return v === el || (v && v.contains && el && v.contains(el));
      });
      if (idx) {
        const index = Number(idx[0]);
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

  return (
    <div className="mt-8 relative">
      {/* Botões personalizados */}
      {/* <button className="custom-swiper-button-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-20 cursor-pointer disabled:opacity-10">
        <FaChevronLeft
          size={34}
          className="text-brand-100 bg-white/80 shadow-md border border-white rounded-full p-2"
        />
      </button>
      <button className="custom-swiper-button-next absolute top-1/2 right-4 transform -translate-y-1/2 z-20 cursor-pointer disabled:opacity-10">
        <FaChevronRight
          size={34}
          className="text-brand-100 bg-white/80 shadow-md border border-white rounded-full p-2"
        />
      </button> */}

      {/* Swiper com vídeos */}
      <Swiper
        slidesPerView={3}
        spaceBetween={15}
        grabCursor={true}
        autoplay={{
          delay: 9500,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: ".custom-swiper-button-prev",
          nextEl: ".custom-swiper-button-next",
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiperAplicacoes !pb-[40px]"
        breakpoints={{
          760: {
            slidesPerView: 5,
          },
          320: {
            slidesPerView: 1,
          },
        }}
      >
        {cases.map(({ video, name }, i) => (
          <SwiperSlide key={i}>
            <div
              className={`rounded-2xl aspect-video overflow-hidden shadow-2xl transition-transform duration-200 ${hovered === i ? 'scale-105' : 'scale-100'}`}
              onClick={() => {
                // pause any playing videos first
                const iframe = slideIframes.current[i];
                pauseAllIframes(iframe || undefined);

                // request fullscreen on the clicked iframe (must be a user gesture)
                if (iframe) {
                  const req: any = (iframe as any).requestFullscreen || (iframe as any).webkitRequestFullscreen || (iframe as any).mozRequestFullScreen || (iframe as any).msRequestFullscreen;
                  if (req) {
                    try { req.call(iframe); } catch (e) {}
                  }
                  // allow iframe to receive pointer events while in fullscreen
                  try { iframe.style.pointerEvents = "auto"; } catch (e) {}
                  // ask YouTube player to play (retry a couple times)
                  playWithRetry(iframe);
                }
              }}
            >
              <div className="relative w-full h-full">
                <iframe
                  ref={(el) => { slideIframes.current[i] = el; }}
                  src={addParams(video, { enablejsapi: 1 })}
                  title={`${name} video`}
                  className="w-full h-full rounded-xl pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                ></iframe>
                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
};

export default VideoSlider;
