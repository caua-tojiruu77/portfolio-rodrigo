"use client";

import React, { useState } from "react";
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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
              className="rounded-2xl aspect-video cursor-pointer overflow-hidden shadow-2xl transition-transform"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative w-full h-full">
                <iframe
                  src={video}
                  title={`${name} video`}
                  className="w-full h-full rounded-xl pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                ></iframe>
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal com vídeo ampliado em tela cheia */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-[90vw] max-w-[1000px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={selectedVideo}
              title="Expanded video"
              className="w-full h-full rounded-xl shadow-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
            <button
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition"
              onClick={() => setSelectedVideo(null)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSlider;
