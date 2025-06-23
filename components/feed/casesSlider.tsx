"use client";

import React, { useState } from "react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GalleryButton from "../buttons/galleryButton";

interface CasesSliderProps {
  cases: {
    img: string;
    name: string;
  }[];
}

const CasesSlider = ({ cases }: CasesSliderProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="mt-8 relative">
      <button className="custom-swiper-button-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-20 cursor-pointer disabled:cursor-pointer disabled:opacity-10">
        <FaChevronLeft
          size={34}
          className="text-brand-100 bg-white/80 shadow-md border border-white rounded-full p-2"
        />
      </button>
      <button className="custom-swiper-button-next absolute top-1/2 right-4 transform -translate-y-1/2 z-20 cursor-pointer disabled:cursor-pointer disabled:opacity-10">
        <FaChevronRight
          size={34}
          className="text-brand-100 bg-white/80 shadow-md border border-white rounded-full p-2"
        />
      </button>
      <Swiper
        slidesPerView={3}
        spaceBetween={15}
        grabCursor={true}
        autoplay={{
          delay: 2500,
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
            slidesPerView: 4,
          },
          320: {
            slidesPerView: 2,
          },
        }}
      >
        {cases.map(({ img, name }, i) => (
          <SwiperSlide key={i}>
            <Image
              src={`${img}`}
              width={500}
              height={500}
              title=""
              alt={`${name} Rodrigo Tavella professional dancer`}
              className="cursor-pointer rounded-2xl"
              onClick={() => setSelectedImage(`${img}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="py-12">
        <GalleryButton />
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="An enlarged view of the selected case"
              width={1200}
              height={1200}
              className="rounded-lg max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain shadow-2xl"
              draggable={false}
            />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition"
              onClick={() => setSelectedImage(null)}
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

export default CasesSlider;
