"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { enabledWorkshops, getWorkshopContent } from "@/utils/workshops";

export default function WorkshopsPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!enabledWorkshops.length) {
      return;
    }

    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !enabledWorkshops.length) {
    return null;
  }

  const featuredWorkshop = enabledWorkshops[0];
  const content = getWorkshopContent(featuredWorkshop, "en");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050123]/80 p-4 backdrop-blur-sm">
      <div className="relative w-[min(92vw,calc(100dvh-19rem),920px)] overflow-hidden rounded-[1.5rem] border-0 bg-transparent shadow-none md:rounded-[2rem] md:border md:border-white/10 md:bg-[#120d2d] md:shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
        <div className="relative w-full overflow-hidden bg-[#120d2d]">
          <button
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition hover:bg-black/50"
          >
            <X size={18} />
          </button>

          <div className="relative block w-full bg-[#120d2d]">
            <Image
              src={featuredWorkshop.image}
              alt={content.name}
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 92vw, 920px"
              className="block h-auto w-full object-contain md:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d2d] via-[#120d2d]/20 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3 px-4 sm:bottom-6">
            <button
              onClick={handleClose}
              className="rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-brand-200 hover:text-brand-200 sm:px-5 sm:py-3"
            >
              Close
            </button>

            <Link
              href="/workshops"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-200 px-4 py-2.5 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d] sm:px-5 sm:py-3"
            >
              See workshops
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="space-y-5 bg-[#120d2d] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
            New workshops
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Discover new movement and performance experiences
          </h2>
          <p className="text-sm leading-7 text-gray-300 sm:text-base">
            Explore the available opportunities and sign up for the next dance, technique and body expression sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
