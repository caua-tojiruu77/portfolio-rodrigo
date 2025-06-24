"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTheaterMasks } from "react-icons/fa";
import { motion } from "framer-motion";
import FadeInSection from "../animations/fadeAnimation";
import Image from "next/image";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import ContactButton from "../buttons/contactButton";

export default function DanceExperienceFeed() {
  const { language } = useLanguage();

  const phrases = {
    en: {
      titleBg: "DANCE EXPERIENCE",
      title: "Professional Dance Experience",
      items: [
        {
          title: "Dancer of musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germany",
          subtitle: "Dancer 3 months (April to June 2025)",
          date: "Apr - Jun 2025",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Dancer",
          company: "Movie Park / Bottrop-Germany",
          subtitle: "Dancer 7 months (March to September 2025)",
          date: "Mar - Sep 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Dancer of musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germany",
          subtitle:
            "6 months(first season in Düsseldorf April to July 2024 and second season in Duisburg October to December 2024)",
          date: "Apr - Dec 2024",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Aerial hoop, handbalance and poledance numbers",
          company: "Circus Harryson / Italy",
          subtitle: "7 months (April 2023 until October 2023)",
          date: "Apr - Oct 2023",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Dancer and handbalance number",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 months (November 2021 until October 2022)",
          date: "Nov 2021 - Oct 2022",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Dancer and aerial hoop and handbalance numbers",
          company: "EZGI Events / Alanya-Turkey.",
          subtitle: "7 months 2021",
          date: "2021",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Dancer and acrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "In the year 2019 to 2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
      ],
    },

    it: {
      titleBg: "ESPERIENZA DI DANZA",
      title: "Esperienza Professionale di Danza",
      items: [
        {
          title: "Ballerino del musical Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Germania",
          subtitle: "Ballerino per 3 mesi (aprile - giugno 2025)",
          date: "Apr - Giu 2025",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Ballerino",
          company: "Movie Park / Bottrop-Germania",
          subtitle: "Ballerino per 7 mesi (marzo - settembre 2025)",
          date: "Mar - Set 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Ballerino del musical Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Germania",
          subtitle:
            "6 mesi (prima stagione a Düsseldorf da aprile a luglio 2024 e seconda stagione a Duisburg da ottobre a dicembre 2024)",
          date: "Apr - Dic 2024",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Numeri con cerchio aereo, equilibrio sulle mani e pole dance",
          company: "Circus Harryson / Italia",
          subtitle: "7 mesi (aprile - ottobre 2023)",
          date: "Apr - Ott 2023",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Ballerino e numero di equilibrio sulle mani",
          company: "Studio LDI, Intershow Ltd / Eilat-Israele",
          subtitle: "11 mesi (novembre 2021 - ottobre 2022)",
          date: "Nov 2021 - Ott 2022",
          img: "/img/danceExperience/3.webp",
        },
        {
          title:
            "Ballerino e numeri con cerchio aereo ed equilibrio sulle mani",
          company: "EZGI Events / Alanya-Turchia",
          subtitle: "7 mesi nel 2021",
          date: "2021",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Ballerino e acrobata",
          company: "Parker Taihu Longemont Paradise / Cina",
          subtitle: "Nell'anno 2019-2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
      ],
    },

    de: {
      titleBg: "TANZERFAHRUNG",
      title: "Professionelle Tanzerfahrung",
      items: [
        {
          title: "Tänzer des Musicals Ronja Räubertochter",
          company: "Theater und Philharmonie / Essen-Deutschland",
          subtitle: "Tänzer 3 Monate (April bis Juni 2025)",
          date: "Apr - Jun 2025",
          img: "/img/danceExperience/8.webp",
        },
        {
          title: "Tänzer",
          company: "Movie Park / Bottrop-Deutschland",
          subtitle: "Tänzer 7 Monate (März bis September 2025)",
          date: "Mär - Sep 2025",
          img: "/img/danceExperience/7.webp",
        },
        {
          title: "Tänzer des Musicals Anatevka",
          company: "Deutsche Oper am Rhein Düsseldorf / Duisburg-Deutschland",
          subtitle:
            "6 Monate (erste Saison in Düsseldorf April bis Juli 2024 und zweite Saison in Duisburg Oktober bis Dezember 2024)",
          date: "Apr - Dez 2024",
          img: "/img/danceExperience/6.webp",
        },
        {
          title: "Luftring-, Handbalance- und Poledance-Nummern",
          company: "Circus Harryson / Italien",
          subtitle: "7 Monate (April bis Oktober 2023)",
          date: "Apr - Okt 2023",
          img: "/img/danceExperience/5.webp",
        },
        {
          title: "Tänzer und Handbalance-Nummer",
          company: "Studio LDI, Intershow Ltd / Eilat-Israel",
          subtitle: "11 Monate (November 2021 bis Oktober 2022)",
          date: "Nov 2021 - Okt 2022",
          img: "/img/danceExperience/3.webp",
        },
        {
          title: "Tänzer und Luftring- und Handbalance-Nummern",
          company: "EZGI Events / Alanya-Türkei",
          subtitle: "7 Monate 2021",
          date: "2021",
          img: "/img/danceExperience/4.webp",
        },
        {
          title: "Tänzer und Akrobat",
          company: "Parker Taihu Longemont Paradise / China",
          subtitle: "Im Jahr 2019 bis 2020",
          date: "2019 - 2020",
          img: "/img/danceExperience/1.webp",
        },
      ],
    },
  };
  const polyglot = new Polyglot({
    phrases: phrases[language],
    locale: language,
  });

  return (
    <section id="dance-experience">
      <div className="row">
        <div className="container">
          {/* Título da Seção */}
          <div className="relative lg:py-16 mb-6">
            {/* Texto grande de fundo */}
            <h2
              className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[4rem] xl:text-[6rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10 text-center uppercase"
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
                date={item.date}
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
                  className="flex flex-row items-center justify-between gap-4"
                >
                  {/* Informações */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-brand-600 text-sm mb-2">
                      {item.company}
                    </p>
                    <h4 className="text-sm text-gray-300">{item.subtitle}</h4>
                  </div>
                  {/* Imagem do lado oposto da seta */}
                  <div className="flex-shrink-0">
                    <Image
                      src={`/img/danceExperience/${index + 1}.webp`}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover shadow-md w-52 h-52 transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </motion.div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          <div className="pt-6 w-full flex justify-center">
            <ContactButton />
          </div>
        </div>
      </div>
    </section>
  );
}
