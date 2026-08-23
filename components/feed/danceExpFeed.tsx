"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTheaterMasks } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import FadeInSection from "../animations/fadeAnimation";
import Image from "next/image";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import ContactButton from "../buttons/contactButton";
import CvDownoladButton from "../buttons/cvDowloadButton";
import { danceExperienceGalleries } from "@/utils/danceExperienceGallery";

export default function DanceExperienceFeed() {
  const { language } = useLanguage();
  const [selectedGallery, setSelectedGallery] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedGallery) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedGallery(null);
      if (event.key === "ArrowRight") {
        setSelectedGallery((current) => current ? { ...current, index: (current.index + 1) % current.images.length } : current);
      }
      if (event.key === "ArrowLeft") {
        setSelectedGallery((current) => current ? { ...current, index: (current.index - 1 + current.images.length) % current.images.length } : current);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGallery]);

  const countryFlags: Record<string, string> = {
    germany: "/img/flags/flag-germany.webp",
    italy: "/img/flags/flag-italy.webp",
    israel: "/img/flags/flag-israel.webp",
    turkey: "/img/flags/flag-turkey.webp",
    china: "/img/flags/flag-china.webp",
    americana: "/img/flags/flag-brasil.webp",
  };

  function getCountryFlag(
    company: string,
    countryFlags: Record<string, string>
  ) {
    const c = company.toLowerCase();
    if (
      c.includes("germany") ||
      c.includes("germania") ||
      c.includes("deutschland")
    )
      return countryFlags.germany;
    if (c.includes("italy") || c.includes("italia") || c.includes("italien"))
      return countryFlags.italy;
    if (c.includes("israel") || c.includes("israele"))
      return countryFlags.israel;
    if (c.includes("turkey") || c.includes("turchia") || c.includes("türkei"))
      return countryFlags.turkey;
    if (c.includes("china") || c.includes("cina")) return countryFlags.china;
    if (c.includes("americana") || c.includes("americana"))
      return countryFlags.americana;
    return null;
  }

  const phrases = {
    en: {
      titleBg: "PROFESSIONAL EXPERIENCE",
      title: "Professional Experience",
      viewGallery: "View event photos",
      closeGallery: "Close gallery",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
      items: [
        {
          title: "Exploria Party",
          company:
            "It's an event for the 20th year party, with my choreographies Elegante Emotion and ChairDance / Bottrop-Germany",
          subtitle: "Dancer with 2024 to 2025",
          date: "2024 - 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Dancer of musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germany",
          subtitle: "Dancer 3 months (April to June 2025)",
          date: "Apr - Jun 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Dancer",
          company: "Movie Park / Bottrop-Germany",
          subtitle: "Dancer 7 months (March to September 2025)",
          date: "Mar - Sep 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Dancer of musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germany",
          subtitle:
            "6 months(first season in Düsseldorf April to July 2024 and second season in Duisburg October to December 2024)",
          date: "Apr - Dec 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Aerial hoop, handbalance and poledance numbers",
          company: "Circus Harryson / Italy",
          subtitle: "7 months (April 2023 until October 2023)",
          date: "Apr - Oct 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Dancer and handbalance number",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 months (November 2021 until October 2022)",
          date: "Nov 2021 - Oct 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Dancer and aerial hoop and handbalance numbers",
          company: "EZGI Events / Alanya-Turkey.",
          subtitle: "7 months 2021",
          date: "2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Dancer and acrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "In the year 2019 to 2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Dancer in Ballet-Art Show Sandra Godoy",
          company:
            "Ballet-art performance with the Moana theme / Americana-São Paulo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Dancer in Ballet-Art Show Sandra Godoy",
          company:
            "Performance with the theme The Hunchback of Notre Dame / Americana-São Paulo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/10.webp",
        },
      ],
    },

    it: {
      titleBg: "ESPERIENZA PROFESSINALE",
      title: "Esperienza Professionale",
      viewGallery: "Vedi foto dell'evento",
      closeGallery: "Chiudi galleria",
      previousPhoto: "Foto precedente",
      nextPhoto: "Foto successiva",
      items: [
        {
          title: "Exploria Party",
          company:
            "È un evento per la festa del 20º anniversario, con le mie coreografie Elegante Emotion e ChairDance / Bottrop-Germania",
          subtitle: "Ballerino dal 2024 al 2025",
          date: "2024 - 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Ballerino del musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germania",
          subtitle: "Ballerino per 3 mesi (aprile - giugno 2025)",
          date: "Apr - Giu 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Ballerino",
          company: "Movie Park / Bottrop-Germania",
          subtitle: "Ballerino per 7 mesi (marzo - settembre 2025)",
          date: "Mar - Set 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Ballerino del musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germania",
          subtitle:
            "6 mesi (prima stagione a Düsseldorf da aprile a luglio 2024 e seconda stagione a Duisburg da ottobre a dicembre 2024)",
          date: "Apr - Dic 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Numeri con cerchio aereo, equilibrio sulle mani e pole dance",
          company: "Circus Harryson / Italia",
          subtitle: "7 mesi (aprile - ottobre 2023)",
          date: "Apr - Ott 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Ballerino e numero di equilibrio sulle mani",
          company: "Studio LDI, Intershow Ltd / Eilat-Israele",
          subtitle: "11 mesi (novembre 2021 - ottobre 2022)",
          date: "Nov 2021 - Ott 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title:
            "Ballerino e numeri con cerchio aereo ed equilibrio sulle mani",
          company: "EZGI Events / Alanya-Turchia",
          subtitle: "7 mesi nel 2021",
          date: "2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Ballerino e acrobata",
          company: "Parker Taihu Longemont Paradise / Cina",
          subtitle: "Nell'anno 2019-2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Ballerino nello spettacolo Ballet-Art di Sandra Godoy",
          company:
            "Spettacolo di balletto con il tema di Moana / Americana-San Paolo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Ballerino nello spettacolo Ballet-Art di Sandra Godoy",
          company:
            "Spettacolo con il tema Il gobbo di Notre Dame / Americana-San Paolo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/10.webp",
        },
      ],
    },

    de: {
      titleBg: "BERUFSERFAHRUNG",
      title: "Berufserfahrung",
      viewGallery: "Eventfotos ansehen",
      closeGallery: "Galerie schließen",
      previousPhoto: "Vorheriges Foto",
      nextPhoto: "Nächstes Foto",
      items: [
        {
          title: "Exploria Party",
          company:
            "Eine Veranstaltung zur Feier des 20-jährigen Jubiläums, mit meinen Choreografien Elegante Emotion und ChairDance / Bottrop-Deutschland",
          subtitle: "Tänzer von 2024 bis 2025",
          date: "2024 - 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Tänzer des Musicals Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Deutschland",
          subtitle: "Tänzer 3 Monate (April bis Juni 2025)",
          date: "Apr - Jun 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Tänzer",
          company: "Movie Park / Bottrop-Deutschland",
          subtitle: "Tänzer 7 Monate (März bis September 2025)",
          date: "Mär - Sep 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Tänzer des Musicals Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Deutschland",
          subtitle:
            "6 Monate (erste Saison in Düsseldorf April bis Juli 2024 und zweite Saison in Duisburg Oktober bis Dezember 2024)",
          date: "Apr - Dez 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Luftring-, Handbalance- und Poledance-Nummern",
          company: "Circus Harryson / Italien",
          subtitle: "7 Monate (April bis Oktober 2023)",
          date: "Apr - Okt 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Tänzer und Handbalance-Nummer",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 Monate (November 2021 bis Oktober 2022)",
          date: "Nov 2021 - Okt 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Tänzer und Luftring- und Handbalance-Nummern",
          company: "EZGI Events / Alanya-Türkei",
          subtitle: "7 Monate 2021",
          date: "2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Tänzer und Akrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "Im Jahr 2019 bis 2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Tänzer in der Ballett-Show von Sandra Godoy",
          company:
            "Ballettaufführung mit dem Thema Vaiana / Americana-São Paulo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Tänzer in der Ballett-Show von Sandra Godoy",
          company:
            "Aufführung mit dem Thema Der Glöckner von Notre Dame / Americana-São Paulo",
          subtitle: "2018",
          date: "2018",
          img: "/img/danceExperience/10.webp",
        },
      ],
    },
  };
  const polyglot = new Polyglot({
    phrases: phrases[language],
    locale: language,
  });

  const getGalleryImages = (cover: string) => {
    const filename = cover.split("/").pop() ?? cover;
    const gallery = danceExperienceGalleries[filename];
    return gallery?.items.length ? gallery.items.map((item) => `${gallery.path}/${item}`) : [cover];
  };

  const handleSwipeEnd = (endX: number) => {
    if (swipeStartX === null || !selectedGallery || selectedGallery.images.length < 2) return;

    const distance = endX - swipeStartX;
    if (Math.abs(distance) >= 50) {
      setSelectedGallery((current) => current ? {
        ...current,
        index: distance < 0
          ? (current.index + 1) % current.images.length
          : (current.index - 1 + current.images.length) % current.images.length,
      } : current);
    }
    setSwipeStartX(null);
  };

  return (
    <section id="dance-experience">
      <div className="row">
        <div className="container">
          {/* Título da Seção */}
          <div className="relative lg:py-16 mb-6">
            {/* Texto grande de fundo */}
            <h2
              className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[4rem] xl:text-[5rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10 text-center uppercase"
              aria-hidden="true"
            >
              {polyglot.t("titleBg")}
            </h2>

            {/* Texto principal */}
            <FadeInSection>
              <h2 className="relative text-4xl font-bold text-center">
                {polyglot.t("title")}
              </h2>
            </FadeInSection>
          </div>

          <VerticalTimeline lineColor="#e1bd08">
            {phrases[language].items.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                contentStyle={{
                  background: "rgba(68, 66, 66, 0.412)",
                  color: "#fff",
                  boxShadow: "0 0 10px #ffd70b",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid #ffd70b",
                }}
                iconStyle={{
                  background: "#ffd70b",
                  color: "#fff",
                }}
                icon={<FaTheaterMasks />}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  {/* Informações */}
                  <div className="flex-1 w-full md:w-auto">
                    {/* Bandeira abaixo do título */}
                    {getCountryFlag(item.company, countryFlags) && (
                      <div className="my-2">
                        <Image
                          src={getCountryFlag(item.company, countryFlags)!}
                          alt="Country Flag"
                          width={50}
                          height={50}
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-brand-600 text-sm mb-2 mt-0!">
                      {item.company}
                    </p>
                    <h4 className="text-sm text-gray-300">{item.subtitle}</h4>
                  </div>
                  {/* Imagem do lado oposto da seta */}
                  <button
                    type="button"
                    className="flex-shrink-0 w-full md:w-52 text-left"
                    aria-label={`${polyglot.t("viewGallery")}: ${item.title}`}
                    onClick={() => setSelectedGallery({ images: getGalleryImages(item.img), index: 0, title: item.title })}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover shadow-md w-full h-48 md:w-52 md:h-52 max-w-xs mx-auto transition-transform duration-200 hover:scale-105"
                    />
                  </button>
                </motion.div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          <AnimatePresence>
            {selectedGallery && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={selectedGallery.title}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedGallery(null)}
              >
                <motion.div
                  className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.96 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex min-h-12 w-full shrink-0 items-center justify-between gap-4 self-stretch text-white">
                    <h3 className="truncate text-lg font-semibold md:text-xl">{selectedGallery.title}</h3>
                    <button type="button" onClick={() => setSelectedGallery(null)} aria-label={polyglot.t("closeGallery")} className="rounded-full bg-white/10 p-2 transition hover:bg-white/20">
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
                        key={selectedGallery.images[selectedGallery.index]}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="flex max-h-[65vh] w-full items-center justify-center"
                      >
                        <Image
                          src={selectedGallery.images[selectedGallery.index]}
                          alt={`${selectedGallery.title} ${selectedGallery.index + 1}`}
                          width={1400}
                          height={1000}
                          className="max-h-[65vh] w-auto max-w-full object-contain"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                    {selectedGallery.images.length > 1 && (
                      <>
                        <button type="button" aria-label={polyglot.t("previousPhoto")} onClick={() => setSelectedGallery((current) => current ? { ...current, index: (current.index - 1 + current.images.length) % current.images.length } : current)} className="absolute left-2 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80 md:left-4">
                          <ChevronLeft size={26} />
                        </button>
                        <button type="button" aria-label={polyglot.t("nextPhoto")} onClick={() => setSelectedGallery((current) => current ? { ...current, index: (current.index + 1) % current.images.length } : current)} className="absolute right-2 rounded-full bg-black/60 p-3 text-white transition hover:bg-black/80 md:right-4">
                          <ChevronRight size={26} />
                        </button>
                      </>
                    )}
                  </div>

                  {selectedGallery.images.length > 1 && (
                    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                      {selectedGallery.images.map((image, index) => (
                        <button type="button" key={image} aria-label={`${selectedGallery.title} ${index + 1}`} onClick={() => setSelectedGallery((current) => current ? { ...current, index } : current)} className={`h-16 w-16 flex-none overflow-hidden rounded border-2 ${index === selectedGallery.index ? "border-brand-300" : "border-transparent opacity-60"}`}>
                          <Image src={image} alt="" width={80} height={80} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="pt-8 md:flex-rol flex-col flex gap-4 md:justify-center md:items-center">
            <ContactButton />
            <CvDownoladButton />
          </div>
        </div>
      </div>
    </section>
  );
}
