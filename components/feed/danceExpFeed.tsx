"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTheaterMasks } from "react-icons/fa";
import { motion } from "framer-motion";
import FadeInSection from "../animations/fadeAnimation";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";

export default function DanceExperienceFeed() {
  const { language } = useLanguage();

  const phrases = {
    en: {
      titleBg: "DANCE EXPERIENCE",
      title: "Professional Dance Experience",
      items: [
        {
          title: "Dancer",
          company: "Theater und Philharmonie Essen Gmb",
          subtitle: "Dancer 3 months (April to June 2025)",
          date: "Apr - Jun 2025",
        },
        {
          title: "Dancer",
          company: "Movie Park - Bottrop",
          subtitle: "Dancer 7 months (March to September 2025)",
          date: "Mar - Sep 2025",
        },
        {
          title: "Dancer of musical Anatevka",
          company: "DEUTSCHE OPER AM RHEIN DÜSSELDORF DUISBURG",
          subtitle:
            "6 months (first season in Düsseldorf April to July 2024 and second season in Duisburg October to December 2024)",
          date: "Apr - Dec 2024",
        },
        {
          title: "Aerial hoop, handbalance and poledance numbers",
          company: "Circus Harryson – Italy",
          subtitle: "7 months (April 2023 until October 2023)",
          date: "Apr - Oct 2023",
        },
        {
          title: "Dancer and handbalance number",
          company: "Studio LDI, Intershow Ltd – Eilat Israel",
          subtitle: "11 months (November 2021 until October 2022)",
          date: "Nov 2021 - Oct 2022",
        },
        {
          title: "Dancer and aerial hoop and handbalance numbers",
          company: "EZGI Events – Alanya, Turkey",
          subtitle: "7 months in 2021",
          date: "2021",
        },
        {
          title: "Dancer and acrobat",
          company: "Parker Taihu Longemont Paradise – China",
          subtitle: "In the year 2019 to 2020",
          date: "2019 - 2020",
        },
        {
          title: "Moana Theme Show",
          company: "32° Ballet-Art Show Sandra Godoy – Americana, São Paulo",
          subtitle: "2018",
          date: "2018",
        },
        {
          title: "The Hunchback of Notre Dame Theme Show",
          company: "31° Sandra Godoy Ballet-Art Show",
          subtitle: "In the city of Americana, São Paulo (2017)",
          date: "2017",
        },
        {
          title: "30th Ballet-Art Show",
          company: "Sandra Godoy",
          subtitle:
            "30 years of Sandra Godoy, involving all themes arising from the past years, in the city of Americana - São Paulo in 2016 with the Michael Jackson Dances, Hairspray, Moulin Rouge and Dream Girls. Americana - São Paulo in 2017 with Gypsies, Prayer, Heavenly Light, Faithful and Fire. With People of the Tribe, Know Who I Am, Ancestors and Ocean.",
          date: "2016 - 2017",
        },
      ],
    },

    it: {
      titleBg: "Professionale di Danza",
      title: "Esperienza Professionale di Danza",
      items: [
        {
          title: "Ballerino",
          company: "Theater und Philharmonie Essen Gmb",
          subtitle: "Ballerino 3 mesi (aprile - giugno 2025)",
          date: "Apr - Giu 2025",
        },
        {
          title: "Ballerino",
          company: "Movie Park - Bottrop",
          subtitle: "Ballerino 7 mesi (marzo - settembre 2025)",
          date: "Mar - Set 2025",
        },
        {
          title: "Ballerino del musical Anatevka",
          company: "DEUTSCHE OPER AM RHEIN DÜSSELDORF DUISBURG",
          subtitle:
            "6 mesi (prima stagione a Düsseldorf aprile - luglio 2024 e seconda stagione a Duisburg ottobre - dicembre 2024)",
          date: "Apr - Dic 2024",
        },
        {
          title: "Numeri cerchio aereo, handbalance e pole dance",
          company: "Circus Harryson – Italia",
          subtitle: "7 mesi (aprile 2023 fino a ottobre 2023)",
          date: "Apr - Ott 2023",
        },
        {
          title: "Ballerino e numero di handbalance",
          company: "Studio LDI, Intershow Ltd – Eilat Israele",
          subtitle: "11 mesi (novembre 2021 fino a ottobre 2022)",
          date: "Nov 2021 - Ott 2022",
        },
        {
          title: "Ballerino e numeri cerchio aereo e handbalance",
          company: "EZGI Events – Alanya, Turchia",
          subtitle: "7 mesi nel 2021",
          date: "2021",
        },
        {
          title: "Ballerino e acrobata",
          company: "Parker Taihu Longemont Paradise – Cina",
          subtitle: "Nell'anno 2019 a 2020",
          date: "2019 - 2020",
        },
        {
          title: "Spettacolo a tema Moana",
          company: "32° Show Ballet-Art Sandra Godoy – Americana, São Paulo",
          subtitle: "2018",
          date: "2018",
        },
        {
          title: "Spettacolo a tema Il Gobbo di Notre Dame",
          company: "31° Show Ballet-Art Sandra Godoy",
          subtitle: "Nella città di Americana, São Paulo (2017)",
          date: "2017",
        },
        {
          title: "30° Show Ballet-Art",
          company: "Sandra Godoy",
          subtitle:
            "30 anni di Sandra Godoy, con tutti i temi emersi negli anni precedenti, nella città di Americana - São Paulo nel 2016 con Michael Jackson Dances, Hairspray, Moulin Rouge e Dream Girls. Americana - São Paulo nel 2017 con Gypsies, Prayer, Heavenly Light, Faithful e Fire. Con People of the Tribe, Know Who I Am, Ancestors e Ocean.",
          date: "2016 - 2017",
        },
      ],
    },

    de: {
      titleBg: "Tanzerfahrung",
      title: "Professionelle Tanzerfahrung", 
      items: [
        {
          title: "Tänzer",
          company: "Theater und Philharmonie Essen Gmb",
          subtitle: "Tänzer 3 Monate (April bis Juni 2025)",
          date: "Apr - Jun 2025",
        },
        {
          title: "Tänzer",
          company: "Movie Park - Bottrop",
          subtitle: "Tänzer 7 Monate (März bis September 2025)",
          date: "Mär - Sep 2025",
        },
        {
          title: "Musical-Tänzer Anatevka",
          company: "DEUTSCHE OPER AM RHEIN DÜSSELDORF DUISBURG",
          subtitle:
            "6 Monate (erste Saison in Düsseldorf April bis Juli 2024 und zweite Saison in Duisburg Oktober bis Dezember 2024)",
          date: "Apr - Dez 2024",
        },
        {
          title: "Nummern Luftreifen, Handbalance und Poledance",
          company: "Circus Harryson – Italien",
          subtitle: "7 Monate (April 2023 bis Oktober 2023)",
          date: "Apr - Okt 2023",
        },
        {
          title: "Tänzer und Handbalance-Nummer",
          company: "Studio LDI, Intershow Ltd – Eilat Israel",
          subtitle: "11 Monate (November 2021 bis Oktober 2022)",
          date: "Nov 2021 - Okt 2022",
        },
        {
          title: "Tänzer und Nummern Luftreifen und Handbalance",
          company: "EZGI Events – Alanya, Türkei",
          subtitle: "7 Monate im Jahr 2021",
          date: "2021",
        },
        {
          title: "Tänzer und Akrobat",
          company: "Parker Taihu Longemont Paradise – China",
          subtitle: "Im Jahr 2019 bis 2020",
          date: "2019 - 2020",
        },
        {
          title: "Moana Themen-Show",
          company: "32° Ballet-Art Show Sandra Godoy – Americana, São Paulo",
          subtitle: "2018",
          date: "2018",
        },
        {
          title: "Thema Der Glöckner von Notre Dame Show",
          company: "31° Sandra Godoy Ballet-Art Show",
          subtitle: "In der Stadt Americana, São Paulo (2017)",
          date: "2017",
        },
        {
          title: "30. Ballet-Art Show",
          company: "Sandra Godoy",
          subtitle:
            "30 Jahre Sandra Godoy, mit allen Themen der vergangenen Jahre, in der Stadt Americana - São Paulo im Jahr 2016 mit Michael Jackson Tänzen, Hairspray, Moulin Rouge und Dream Girls. Americana - São Paulo im Jahr 2017 mit Gypsies, Prayer, Heavenly Light, Faithful und Fire. Mit People of the Tribe, Know Who I Am, Ancestors und Ocean.",
          date: "2016 - 2017",
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
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-brand-600 text-sm mb-2">{item.company}</p>
                  <h4 className="text-sm text-gray-300">{item.subtitle}</h4>
                </motion.div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </section>
  );
}
