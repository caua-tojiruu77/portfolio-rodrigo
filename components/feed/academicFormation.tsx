"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaGraduationCap } from "react-icons/fa"; // Ícone de formação acadêmica
import { motion } from "framer-motion";
import FadeInSection from "../animations/fadeAnimation";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";

export default function AcademicFormationFeed() {
  const { language } = useLanguage();

  const phrases = {
    en: {
      titleBg: "ACADEMIC FORMATION",
      title: "Academic Formation",
      items: [
        {
          title: "Classical Ballet",
          company: "Ballet-Art School Sandra Godoy – Americana, São Paulo",
          subtitle: "With Professor Vanessa Chieus from 2016 until now",
          date: "2016 - Present",
        },
        {
          title: "Jazz",
          company: "Ballet-Art School Sandra Godoy – Americana, São Paulo",
          subtitle: "With Professors Kely Golveia and Mayne Sass from 2015 until now",
          date: "2015 - Present",
        },
        {
          title: "Artistic Gymnastics",
          company: "Civic Center – Americana, São Paulo",
          subtitle: "With Professor Diara Peressinotto from 2015 until now",
          date: "2015 - Present",
        },
        {
          title: "General Gymnastics",
          company: "City of Artur Nogueira, São Paulo",
          subtitle:
            "Artistic, Rhythmic, Acrobatic Gymnastics and Dance Group with Professor Luiz Fernando dos Santos (2002 to 2011)",
          date: "2002 - 2011",
        },
      ],
    },

    it: {
      titleBg: "FORMAZIONE ACCADEMICA",
      title: "Formazione Accademica",
      items: [
        {
          title: "Balletto Classico",
          company: "Scuola Ballet-Art Sandra Godoy – Americana, São Paulo",
          subtitle: "Con la Professoressa Vanessa Chieus dal 2016 a oggi",
          date: "2016 - Presente",
        },
        {
          title: "Jazz",
          company: "Scuola Ballet-Art Sandra Godoy – Americana, São Paulo",
          subtitle:
            "Con le professoresse Kely Golveia e Mayne Sass dal 2015 a oggi",
          date: "2015 - Presente",
        },
        {
          title: "Ginnastica Artistica",
          company: "Centro Civico – Americana, São Paulo",
          subtitle: "Con la Professoressa Diara Peressinotto dal 2015 a oggi",
          date: "2015 - Presente",
        },
        {
          title: "Ginnastica Generale",
          company: "Città di Artur Nogueira, São Paulo",
          subtitle:
            "Ginnastica Artistica, Ritmica, Acrobatica e Gruppo Danza con il Professore Luiz Fernando dos Santos (2002-2011)",
          date: "2002 - 2011",
        },
      ],
    },

    de: {
      titleBg: "AKADEMISCHE AUSBILDUNG",
      title: "Akademische Ausbildung",
      items: [
        {
          title: "Klassisches Ballett",
          company: "Ballettschule Ballet-Art Sandra Godoy – Americana, São Paulo",
          subtitle: "Bei Professorin Vanessa Chieus von 2016 bis heute",
          date: "2016 - Heute",
        },
        {
          title: "Jazz",
          company: "Ballettschule Ballet-Art Sandra Godoy – Americana, São Paulo",
          subtitle:
            "Bei Professorinnen Kely Golveia und Mayne Sass von 2015 bis heute",
          date: "2015 - Heute",
        },
        {
          title: "Kunstturnen",
          company: "Bürgerzentrum – Americana, São Paulo",
          subtitle: "Bei Professorin Diara Peressinotto von 2015 bis heute",
          date: "2015 - Heute",
        },
        {
          title: "Allgemeine Gymnastik",
          company: "Stadt Artur Nogueira, São Paulo",
          subtitle:
            "Kunst-, Rhythmus- und Akrobatikgymnastik sowie Tanzgruppe mit Professor Luiz Fernando dos Santos (2002 bis 2011)",
          date: "2002 - 2011",
        },
      ],
    },
  };

  const polyglot = new Polyglot({
    phrases: phrases[language],
    locale: language,
  });

  return (
    <section id="academic-formation">
      <div className="row">
        <div className="container">
          {/* Título da Seção */}
          <div className="relative lg:py-16 mb-6">
            {/* Texto grande de fundo */}
            <h2
              className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[4rem] xl:text-[6rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10 text-center uppercase whitespace-nowrap  "
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
                icon={<FaGraduationCap />}
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
