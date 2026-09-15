"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { createPolyglot } from "@/utils/polyglot";
import { enabledWorkshops, getWorkshopContent } from "@/utils/workshops";
import { useLanguage } from "@/context/languageContext";

export default function WorkshopsFeed() {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);

  if (!enabledWorkshops.length) {
    return null;
  }

  return (
    <section className="text-white">
      <div className="row w-full px-5 lg:px-0">
        <div className="mb-10 text-center lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">
            {polyglot.t("workshops.page.title")}
          </p>
          <h2 className="mainTitle text-white">{polyglot.t("workshops.page.subtitle")}</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {enabledWorkshops.map((workshop) => {
            const content = getWorkshopContent(workshop, language);

            return (
              <article
                key={workshop.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-72 w-full overflow-hidden bg-[#0d0a24]">
                  <Image
                    src={workshop.image}
                    alt={content.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="-mt-px space-y-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-brand-200/70 bg-brand-200/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-brand-200">
                      {content.level}
                    </span>
                    <span className="text-sm font-semibold text-brand-200">{content.price}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">{content.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-300">{content.description}</p>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex items-center gap-3">
                      <CalendarDays size={16} className="text-brand-200" />
                      <span>{content.date}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <MapPin size={16} className="text-brand-200" />
                      <span>{content.location}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock3 size={16} className="text-brand-200" />
                      <span>{content.duration}</span>
                    </li>
                  </ul>

                  <Link
                    href={workshop.registrationUrl || "/contact"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition-colors hover:bg-[#f3d54d]"
                  >
                    {content.button}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
