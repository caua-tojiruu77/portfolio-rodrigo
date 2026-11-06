"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTheaterMasks } from "react-icons/fa";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { useState } from "react";
import FadeInSection from "../animations/fadeAnimation";
import Image from "next/image";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import ContactButton from "../buttons/contactButton";
import CvDownoladButton from "../buttons/cvDowloadButton";
import ImageLightbox from "../gallery/ImageLightbox";
import { danceExperienceGalleries } from "@/utils/danceExperienceGallery";

export default function DanceExperienceFeed() {
  const { language } = useLanguage();
  const [selectedGallery, setSelectedGallery] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  const countryFlags: Record<string, string> = {
    germany: "/img/flags/flag-germany.webp",
    italy: "/img/flags/flag-italy.webp",
    israel: "/img/flags/flag-israel.webp",
    turkey: "/img/flags/flag-turkey.webp",
    china: "/img/flags/flag-china.webp",
    americana: "/img/flags/flag-brasil.webp",
  };

  function getCountryFlag(company: string, flags: Record<string, string>) {
    const companyName = company.toLowerCase();
    if (companyName.includes("germany") || companyName.includes("germania") || companyName.includes("deutschland")) return flags.germany;
    if (companyName.includes("italy") || companyName.includes("italia") || companyName.includes("italien")) return flags.italy;
    if (companyName.includes("israel") || companyName.includes("israele")) return flags.israel;
    if (companyName.includes("turkey") || companyName.includes("turchia") || companyName.includes("türkei")) return flags.turkey;
    if (companyName.includes("china") || companyName.includes("cina")) return flags.china;
    if (companyName.includes("americana")) return flags.americana;
    return null;
  }

  const phrases = {
    en: {
      titleBg: "PROFESSIONAL EXPERIENCE",
      title: "Professional Experience",
      viewGallery: "View event photos",
      galleryHint: "Open gallery",
      closeGallery: "Close gallery",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
      items: [
        {
          title: "Guest Dancer in John Neumeier’s Ballet “Endstation Sehnsucht”",
          company: "Ballett am Rhein / Deutsche Oper am Rhein – Düsseldorf, Germany",
          subtitle:
            "Part of John Neumeier’s ballet production Endstation Sehnsucht, performing as a dancer in a theatrical work that combines expressive movement, dramatic interpretation and contemporary ballet.",
          date: "From April to July 2026",
          img: "/img/danceExperience/endstation-sehnsucht/4.webp",
        },
        {
          title: "Dancer in the Musical Paul die Laterne",
          company: "Gloria-Theater / Bad Säckingen, Germany",
          subtitle:
            "Part of the dance ensemble in the musical production Paul die Laterne, performing choreographed sequences and contributing to the storytelling through movement, expression and stage performance.",
          date: "From September 2026 to May 2027",
          img: "/img/danceExperience/paul-die-laterne/15.webp",
        },
        {
          title: "Dancer & Acrobat at Movie Park Germany",
          company: "Movie Park/ Bottrop-Germany",
          subtitle:
            "Performing across three seasonal entertainment productions: Dancer and Acrobatic in Summer Season, Dancer in Halloween Horror Festival and Dancer in Hollywood Christmas. Bringing different characters, choreography and theatrical performances to life through dance, physical expression and stage presence.",
          date: "From February 2026 to January 2027",
          img: "/img/danceExperience/movie-park-26/12.webp",
        },
        {
          title: "Exploria Party",
          company: "It's an event for the 20th year party, with my choreographies Elegante Emotion and ChairDance / Bottrop-Germany",
          subtitle: "Dancer",
          date: "From 2024 to 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Dancer of musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germany",
          subtitle: "Dancer for 3 months",
          date: "From April to June 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Dancer & Acrobat at Movie Park Germany",
          company: "Movie Park / Bottrop-Germany",
          subtitle:
            "Performed as a dancer during the Summer Season and as a solo acrobat during the Christmas Season, presenting a unique act and bringing energy, creativity and physical expression to the stage.",
          date: "From March to December 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Dancer of musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germany",
          subtitle:
            "6 months (first season in Düsseldorf and second season in Duisburg)",
          date: "From April to December 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Acrobatic at Circus Harryson",
          company: "Circus Harryson / Italy",
          subtitle:
            "Acrobatic Performance with an AerialHoop, Handbalance and Poledance solo acts.",
          date: "From April to October 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Dancer and handbalance number",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 months",
          date: "From November 2021 to October 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Dancer and aerial hoop and handbalance numbers",
          company: "EZGI Events / Alanya-Turkey.",
          subtitle: "7 months",
          date: "From 2021 to 2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Dancer and acrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "Dancer and acrobat",
          date: "From 2019 to 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Dancer in Ballet-Art Show Sandra Godoy",
          company:
            "Ballet-art performance with the Moana theme / Americana-São Paulo",
          subtitle: "Ballet-Art dancer",
          date: "From 2018 to 2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Dancer in Ballet-Art Show Sandra Godoy",
          company:
            "Performance with the theme The Hunchback of Notre Dame / Americana-São Paulo",
          subtitle: "Ballet-Art dancer",
          date: "From 2018 to 2018",
          img: "/img/danceExperience/10.webp",
        },
      ],
    },

    it: {
      titleBg: "ESPERIENZA PROFESSINALE",
      title: "Esperienza Professionale",
      viewGallery: "Vedi foto dell'evento",
      galleryHint: "Apri galleria",
      closeGallery: "Chiudi galleria",
      previousPhoto: "Foto precedente",
      nextPhoto: "Foto successiva",
      items: [
        {
          title: "Ballerino ospite nel balletto di John Neumeier “Endstation Sehnsucht”",
          company: "Ballett am Rhein / Deutsche Oper am Rhein – Düsseldorf, Germania",
          subtitle:
            "Parte della produzione di balletto Endstation Sehnsucht di John Neumeier, interpretando un ruolo da ballerino in un'opera teatrale che unisce movimento espressivo, interpretazione drammatica e balletto contemporaneo.",
          date: "Da aprile a luglio 2026",
          img: "/img/danceExperience/endstation-sehnsucht/4.webp",
        },
        {
          title: "Ballerino nel musical Paul die Laterne",
          company: "Gloria-Theater / Bad Säckingen, Germania",
          subtitle:
            "Parte dell'ensemble di danza del musical Paul die Laterne, eseguendo sequenze coreografate e contribuendo alla narrazione attraverso il movimento, l'espressione e la performance sul palco.",
          date: "Da settembre 2026 a maggio 2027",
          img: "/img/danceExperience/paul-die-laterne/15.webp",
        },
        {
          title: "Ballerino e acrobata al Movie Park Germany",
          company: "Movie Park/ Bottrop-Germania",
          subtitle:
            "Si esibisce in tre produzioni stagionali: ballerino e acrobata nella stagione estiva, ballerino all'Halloween Horror Festival e ballerino a Hollywood Christmas. Dà vita a personaggi, coreografie e performance teatrali diversi attraverso la danza, l'espressione fisica e la presenza scenica.",
          date: "Da febbraio 2026 a gennaio 2027",
          img: "/img/danceExperience/movie-park-26/12.webp",
        },
        {
          title: "Exploria Party",
          company:
            "È un evento per la festa del 20º anniversario, con le mie coreografie Elegante Emotion e ChairDance / Bottrop-Germania",
          subtitle: "Ballerino",
          date: "Dal 2024 al 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Ballerino del musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germania",
          subtitle: "Ballerino per 3 mesi",
          date: "Da aprile a giugno 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Ballerino e acrobata al Movie Park Germany",
          company: "Movie Park / Bottrop-Germania",
          subtitle:
            "Si è esibito come ballerino durante la stagione estiva e come acrobata solista durante la stagione natalizia, presentando un numero unico e portando energia, creatività ed espressione fisica sul palco.",
          date: "Da marzo a dicembre 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Ballerino del musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germania",
          subtitle:
            "6 mesi (prima stagione a Düsseldorf e seconda stagione a Duisburg)",
          date: "Da aprile a dicembre 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Acrobata al Circus Harryson",
          company: "Circus Harryson / Italia",
          subtitle:
            "Performance acrobatica con numeri solisti di cerchio aereo, equilibrio sulle mani e pole dance.",
          date: "Da aprile a ottobre 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Ballerino e numero di equilibrio sulle mani",
          company: "Studio LDI, Intershow Ltd / Eilat-Israele",
          subtitle: "11 mesi",
          date: "Da novembre 2021 a ottobre 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title:
            "Ballerino e numeri con cerchio aereo ed equilibrio sulle mani",
          company: "EZGI Events / Alanya-Turchia",
          subtitle: "7 mesi",
          date: "Dal 2021 al 2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Ballerino e acrobata",
          company: "Parker Taihu Longemont Paradise / Cina",
          subtitle: "Ballerino e acrobata",
          date: "Dal 2019 al 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Ballerino nello spettacolo Ballet-Art di Sandra Godoy",
          company:
            "Spettacolo di balletto con il tema di Moana / Americana-San Paolo",
          subtitle: "Ballerino Ballet-Art",
          date: "Dal 2018 al 2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Ballerino nello spettacolo Ballet-Art di Sandra Godoy",
          company:
            "Spettacolo con il tema Il gobbo di Notre Dame / Americana-San Paolo",
          subtitle: "Ballerino Ballet-Art",
          date: "Dal 2018 al 2018",
          img: "/img/danceExperience/10.webp",
        },
      ],
    },

    de: {
      titleBg: "BERUFSERFAHRUNG",
      title: "Berufserfahrung",
      viewGallery: "Eventfotos ansehen",
      galleryHint: "Galerie öffnen",
      closeGallery: "Galerie schließen",
      previousPhoto: "Vorheriges Foto",
      nextPhoto: "Nächstes Foto",
      items: [
        {
          title: "Gasttänzer in John Neumeiers Ballett „Endstation Sehnsucht“",
          company: "Ballett am Rhein / Deutsche Oper am Rhein – Düsseldorf, Deutschland",
          subtitle:
            "Teil von John Neumeiers Ballettproduktion Endstation Sehnsucht, als Tänzer in einem Bühnenwerk mit ausdrucksstarker Bewegung, dramatischer Interpretation und zeitgenössischem Ballett.",
          date: "Von April bis Juli 2026",
          img: "/img/danceExperience/endstation-sehnsucht/4.webp",
        },
        {
          title: "Tänzer im Musical Paul die Laterne",
          company: "Gloria-Theater / Bad Säckingen, Deutschland",
          subtitle:
            "Teil des Tanzensembles der Musicalproduktion Paul die Laterne, mit choreografierten Sequenzen und einem Beitrag zur Erzählung durch Bewegung, Ausdruck und Bühnenpräsenz.",
          date: "Von September 2026 bis Mai 2027",
          img: "/img/danceExperience/paul-die-laterne/15.webp",
        },
        {
          title: "Tänzer und Akrobat im Movie Park Germany",
          company: "Movie Park/ Bottrop-Deutschland",
          subtitle:
            "Auftritte in drei saisonalen Unterhaltungsproduktionen: Tänzer und Akrobat in der Sommersaison, Tänzer beim Halloween Horror Festival und Tänzer bei Hollywood Christmas. Verschiedene Figuren, Choreografien und theatralische Darbietungen werden durch Tanz, körperlichen Ausdruck und Bühnenpräsenz zum Leben erweckt.",
          date: "Von Februar 2026 bis Januar 2027",
          img: "/img/danceExperience/movie-park-26/12.webp",
        },
        {
          title: "Exploria Party",
          company:
            "Eine Veranstaltung zur Feier des 20-jährigen Jubiläums, mit meinen Choreografien Elegante Emotion und ChairDance / Bottrop-Deutschland",
          subtitle: "Tänzer",
          date: "Von 2024 bis 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Tänzer des Musicals Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Deutschland",
          subtitle: "Tänzer für 3 Monate",
          date: "Von April bis Juni 2025",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Tänzer und Akrobat im Movie Park Germany",
          company: "Movie Park / Bottrop-Deutschland",
          subtitle:
            "Auftritt als Tänzer während der Sommersaison und als Soloakrobat während der Weihnachtssaison, mit einer einzigartigen Darbietung voller Energie, Kreativität und körperlichem Ausdruck auf der Bühne.",
          date: "Von März bis Dezember 2025",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Tänzer des Musicals Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Deutschland",
          subtitle:
            "6 Monate (erste Saison in Düsseldorf und zweite Saison in Duisburg)",
          date: "Von April bis Dezember 2024",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Akrobat im Circus Harryson",
          company: "Circus Harryson / Italien",
          subtitle:
            "Akrobatikauftritte mit Solo-Nummern am Luftring, Handbalance und Poledance.",
          date: "Von April bis Oktober 2023",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Tänzer und Handbalance-Nummer",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 Monate",
          date: "Von November 2021 bis Oktober 2022",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Tänzer und Luftring- und Handbalance-Nummern",
          company: "EZGI Events / Alanya-Türkei",
          subtitle: "7 Monate",
          date: "Von 2021 bis 2021",
          img: "/img/danceExperience/2.webp",
        },
        {
          title: "Tänzer und Akrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "Tänzer und Akrobat",
          date: "Von 2019 bis 2020",
          img: "/img/danceExperience/1.webp",
        },
        {
          title: "Tänzer in der Ballett-Show von Sandra Godoy",
          company:
            "Ballettaufführung mit dem Thema Vaiana / Americana-São Paulo",
          subtitle: "Ballett-Art-Tänzer",
          date: "Von 2018 bis 2018",
          img: "/img/danceExperience/9.webp",
        },
        {
          title: "Tänzer in der Ballett-Show von Sandra Godoy",
          company:
            "Aufführung mit dem Thema Der Glöckner von Notre Dame / Americana-São Paulo",
          subtitle: "Ballett-Art-Tänzer",
          date: "Von 2018 bis 2018",
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
    const gallery =
      danceExperienceGalleries[cover] ?? danceExperienceGalleries[filename];
    return gallery?.items.length
      ? gallery.items.map((item) => (item.startsWith("/") ? item : `${gallery.path}/${item}`))
      : [cover];
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
                    <p className="mt-2 text-sm text-gray-400">
                      ({item.date})
                    </p>
                  </div>
                  {/* Imagem do lado oposto da seta */}
                  <div className="mx-auto flex w-full max-w-xs flex-shrink-0 flex-col items-center md:w-52">
                    {item.img ? (
                      <>
                        <button
                          type="button"
                          className="w-full overflow-hidden rounded-lg text-left"
                          aria-label={`${polyglot.t("viewGallery")}: ${item.title}`}
                          onClick={() => setSelectedGallery({ images: getGalleryImages(item.img), index: 0, title: item.title })}
                        >
                          <Image
                            src={item.img}
                            alt={item.title}
                            width={500}
                            height={500}
                            className="h-48 w-full rounded-lg object-cover shadow-md md:h-52"
                          />
                        </button>
                        <button
                          type="button"
                          className="mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                          aria-label={`${polyglot.t("viewGallery")}: ${item.title}`}
                          onClick={() => setSelectedGallery({ images: getGalleryImages(item.img), index: 0, title: item.title })}
                        >
                          <span className="flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-brand-300 text-brand-100">
                            <Images size={12} strokeWidth={2.5} />
                          </span>
                          {polyglot.t("galleryHint")}
                        </button>
                      </>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-300/30 via-gray-900 to-brand-300/10 text-brand-300 shadow-md md:h-52"
                      >
                        <FaTheaterMasks aria-hidden="true" size={48} />
                      </div>
                    )}
                  </div>
                </motion.div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          <ImageLightbox
            images={selectedGallery?.images ?? []}
            selectedIndex={selectedGallery?.index ?? null}
            title={selectedGallery?.title ?? ""}
            closeLabel={polyglot.t("closeGallery")}
            previousLabel={polyglot.t("previousPhoto")}
            nextLabel={polyglot.t("nextPhoto")}
            onClose={() => setSelectedGallery(null)}
            onIndexChange={(index) => setSelectedGallery((current) => current ? { ...current, index } : current)}
          />
          <div className="pt-8 md:flex-rol flex-col flex gap-4 md:justify-center md:items-center">
            <ContactButton />
            <CvDownoladButton />
          </div>
        </div>
      </div>
    </section>
  );
}
