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
import CvDownoladButton from "../buttons/cvDowloadButton";

export default function DanceExperienceFeed() {
  const { language } = useLanguage();

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
                  <div className="flex-shrink-0 w-full md:w-52">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover shadow-md w-full h-48 md:w-52 md:h-52 max-w-xs mx-auto transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </motion.div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          <div className="pt-8 md:flex-rol flex-col flex gap-4 md:justify-center md:items-center">
            <ContactButton />
            <CvDownoladButton />
          </div>
        </div>
      </div>
    </section>
  );
}
