"use client";

import React, { useState } from "react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GalleryButton from "../buttons/galleryButton";
import ImageLightbox from "../gallery/ImageLightbox";

interface CasesSliderProps {
  cases: {
    img: string;
    name: string;
  }[];
}

const CasesSlider = ({ cases }: CasesSliderProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
              onClick={() => setSelectedIndex(i)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="py-12">
        <GalleryButton />
      </div>
      <ImageLightbox
        images={cases.map(({ img }) => img)}
        selectedIndex={selectedIndex}
        title="Professional gallery"
        closeLabel="Close gallery"
        previousLabel="Previous image"
        nextLabel="Next image"
        onClose={() => setSelectedIndex(null)}
        onIndexChange={setSelectedIndex}
      />
    </div>
  );
};

export default CasesSlider;
