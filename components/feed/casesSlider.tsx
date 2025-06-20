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
          className="fixed inset-0 bg-black/80 bg-opacity-70 flex items-center justify-center z-50 transition-all duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <Image
              src={selectedImage}
              alt="An enlarged view of the selected case"
              width={500}
              height={500}
              className="w-full h-auto object-contain rounded-2xl"
            />
            <button
              className="absolute -top-2 right-0 text-white text-3xl cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesSlider;
