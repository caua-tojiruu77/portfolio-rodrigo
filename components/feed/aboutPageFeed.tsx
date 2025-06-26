"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import FadeInSection from "../animations/fadeAnimation";
import ContactButton from "../buttons/contactButton";
import CvDownoladButton from "../buttons/cvDowloadButton";

export default function AboutSection() {
  const [showContent, setShowContent] = useState(false);
  const { language } = useLanguage();

  const polyglot = new Polyglot({
    phrases: {
      en: {
        "about.title": "About Me",
        "about.intro":
          "My name is Rodrigo Willian Tavella, I am a Brazilian artist with Italian citizenship, currently living in Dortmund, Germany. My artistic journey is marked by the fusion of dance, acrobatics, and stage expression, with a dedication that goes beyond technical movement to reach pure emotion. I hold a degree in dance and have extensive experience as a dancer, acrobat, and performer, working with companies, theaters, shows, schools, and major international productions.",
        "about.specialties.title": "My specialties include:",
        "about.specialties.dance":
          "Dance: classical ballet, jazz, contemporary and modern dance.",
        "about.specialties.acrobatics":
          "Acrobatics: solo, group, duo, aerial hoop, handbalance, pole dance.",
        "about.specialties.stage": "Stage performance and musical theater.",
        "about.specialties.professional":
          "Professional Dancer (Ballet Basic, Jazz, Contemporary, moderne Dance, Burlesque Dance and Commercial).",
        "about.specialties.acrobat": "Acrobat (solo and duo, group work).",
        "about.specialties.artistic": "Artistic gymnastics.",
        "about.specialties.aerial": "Aerial Hoop.",
        "about.specialties.hand": "Hand Balance.",
        "about.specialties.poledance": "Poledance.",
        "about.specialties.teacher":
          "Teacher: SexyDance, ChairDance, AerialHoop and Stretching.",
        "about.statement.1":
          "My art is visceral, physical, and symbolic, driven by a constant search for transformation and connection. I believe the body is a living language, and the stage is the place where soul and technique meet.",
        "about.statement.2":
          "Today, in addition to performing, I also work as a dance teacher, sharing my experience with new artists and exploring the pedagogy of movement.",
        "about.mission":
          "Whether on European stages, in a rehearsal room, or suspended in an aerial hoop, my mission is the same: ",
        "about.mission.highlight": "to move with authenticity.",
        "about.tech.title": "Technical sheet",
        "about.tech.nationality":
          "Nationality: Brazilian, with Italian citizenship (European Union)",
        "about.tech.age": "Age: 32 years old",
        "about.tech.birth": "Date of birth: September 17, 1992",
        "about.tech.height": "Height: 1.74 m (or 5'8\")",
        "about.tech.weight": "Weight: 70 kg",
        "about.tech.shoe": "Shoe size: 41 (BR)",
        "about.tech.skin": "Skin color: White",
        "about.tech.eyes": "Eye color: Medium brown",
        "about.tech.status": "Marital status: Single",
      },
      it: {
        "about.title": "Chi sono",
        "about.intro":
          "Mi chiamo Rodrigo Willian Tavella, sono un artista brasiliano con cittadinanza italiana e attualmente vivo a Dortmund, in Germania. Il mio percorso artistico è caratterizzato dalla fusione tra danza, acrobazia ed espressione scenica, con una dedizione che va oltre il movimento tecnico per raggiungere l’emozione pura. Sono laureato in danza e ho una vasta esperienza come ballerino, acrobata e performer, collaborando con compagnie, teatri, spettacoli, scuole e grandi produzioni internazionali.",
        "about.specialties.title": "Le mie specialità includono:",
        "about.specialties.dance":
          "Danza: balletto classico, jazz, danza contemporanea e moderna.",
        "about.specialties.acrobatics":
          "Acrobazie: da solo, in gruppo, in coppia, cerchio aereo, handbalance, pole dance.",
        "about.specialties.stage": "Performance teatrale e musical.",
        "about.specialties.professional":
          "Ballerino professionista (Balletto base, Jazz, Contemporaneo, danza moderna, Burlesque e Commercial).",
        "about.specialties.acrobat":
          "Acrobata (lavoro solista e in duo, lavoro di gruppo).",
        "about.specialties.artistic": "Ginnastica artistica.",
        "about.specialties.aerial": "Cerchio aereo.",
        "about.specialties.hand": "Hand Balance.",
        "about.specialties.poledance": "Pole dance.",
        "about.specialties.teacher":
          "Insegnante: SexyDance, ChairDance, Cerchio aereo e Stretching.",
        "about.statement.1":
          "La mia arte è viscerale, fisica e simbolica, guidata da una costante ricerca di trasformazione e connessione. Credo che il corpo sia un linguaggio vivente e che il palco sia il luogo dove anima e tecnica si incontrano.",
        "about.statement.2":
          "Oggi, oltre a esibirmi, lavoro anche come insegnante di danza, condividendo la mia esperienza con nuovi artisti ed esplorando la pedagogia del movimento.",
        "about.mission":
          "Che sia su un palco europeo, in sala prove o sospeso in un cerchio aereo, la mia missione è la stessa: ",
        "about.mission.highlight": "muovermi con autenticità.",
        "about.tech.title": "Scheda tecnica",
        "about.tech.nationality":
          "Nazionalità: Brasiliano, con cittadinanza italiana (Unione Europea)",
        "about.tech.age": "Età: 32 anni",
        "about.tech.birth": "Data di nascita: 17 settembre 1992",
        "about.tech.height": "Altezza: 1,74 m",
        "about.tech.weight": "Peso: 70 kg",
        "about.tech.shoe": "Numero di scarpe: 41 (BR)",
        "about.tech.skin": "Colore della pelle: Chiara",
        "about.tech.eyes": "Colore degli occhi: Marrone medio",
        "about.tech.status": "Stato civile: Celibe",
      },
      de: {
        "about.title": "Über mich",
        "about.intro":
          "Mein Name ist Rodrigo Willian Tavella. Ich bin ein brasilianischer Künstler mit italienischer Staatsbürgerschaft und lebe derzeit in Dortmund, Deutschland. Mein künstlerischer Weg ist geprägt von der Verschmelzung von Tanz, Akrobatik und Bühnenausdruck – mit einer Hingabe, die über technische Bewegung hinausgeht, um reine Emotion zu erreichen. Ich habe einen Abschluss in Tanz und umfassende Erfahrung als Tänzer, Akrobat und Performer in Zusammenarbeit mit Kompanien, Theatern, Shows, Schulen und großen internationalen Produktionen.",
        "about.specialties.title": "Meine Spezialgebiete sind:",
        "about.specialties.dance":
          "Tanz: klassisches Ballett, Jazz, zeitgenössischer und moderner Tanz.",
        "about.specialties.acrobatics":
          "Akrobatik: solo, Gruppe, Duo, Luftring, Handbalance, Pole Dance.",
        "about.specialties.stage": "Bühnenperformance und Musicaltheater.",
        "about.specialties.professional":
          "Professioneller Tänzer (Basis Ballett, Jazz, Zeitgenössisch, Moderner Tanz, Burlesque und Commercial).",
        "about.specialties.acrobat":
          "Akrobat (Solo- und Duoarbeit, Gruppenarbeit).",
        "about.specialties.artistic": "Künstlerische Gymnastik.",
        "about.specialties.aerial": "Luftring.",
        "about.specialties.hand": "Handbalance.",
        "about.specialties.poledance": "Pole Dance.",
        "about.specialties.teacher":
          "Lehrer: SexyDance, ChairDance, Luftring und Stretching.",
        "about.statement.1":
          "Meine Kunst ist visceral, körperlich und symbolisch – angetrieben von einem ständigen Streben nach Transformation und Verbindung. Ich glaube, der Körper ist eine lebendige Sprache, und die Bühne ist der Ort, an dem sich Seele und Technik begegnen.",
        "about.statement.2":
          "Heute bin ich neben meinen Auftritten auch als Tanzlehrer tätig, teile meine Erfahrungen mit neuen Künstlern und erkunde die Pädagogik der Bewegung.",
        "about.mission":
          "Ob auf europäischen Bühnen, im Proberaum oder im Luftring – meine Mission bleibt dieselbe: ",
        "about.mission.highlight": "mit Authentizität zu bewegen.",
        "about.tech.title": "Technisches Datenblatt",
        "about.tech.nationality":
          "Nationalität: Brasilianer mit italienischer Staatsbürgerschaft (Europäische Union)",
        "about.tech.age": "Alter: 32 Jahre",
        "about.tech.birth": "Geburtsdatum: 17. September 1992",
        "about.tech.height": "Größe: 1,74 m",
        "about.tech.weight": "Gewicht: 70 kg",
        "about.tech.shoe": "Schuhgröße: 41 (BR)",
        "about.tech.skin": "Hautfarbe: Weiß",
        "about.tech.eyes": "Augenfarbe: Mittelbraun",
        "about.tech.status": "Familienstand: Ledig",
      },
    }[language],
    locale: language,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center text-white relative">
        <div className="relative lg:py-16 mb-6">
          {/* Texto grande de fundo */}
          <h1
            className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[5rem] xl:text-[7rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10 whitespace-nowrap uppercase"
            aria-hidden="true"
          >
            {polyglot.t("about.title")}
          </h1>

          {/* Texto principal */}
          <FadeInSection>
            <h2 className="relative text-4xl font-bold text-center">
              <span className="text-white">{polyglot.t("about.title")}</span>
            </h2>
          </FadeInSection>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="row flex flex-col-reverse lg:flex-row-reverse items-center md:justify-center w-full lg:gap-12"
        >
          <div className="container text-start lg:text-left flex items-start flex-col">
            <div className="mb-6 mt-6">
              <FadeInSection>
                <p>{polyglot.t("about.intro")}</p>
                <br />
                <h2 className="text-lg font-bold text-brand-200 mb-4">
                  {polyglot.t("about.specialties.title")}
                </h2>
                <ul className="list-disc pl-5">
                  <li>{polyglot.t("about.specialties.dance")}</li>
                  <li>{polyglot.t("about.specialties.acrobatics")}</li>
                  <li>{polyglot.t("about.specialties.stage")}</li>
                  <li>{polyglot.t("about.specialties.acrobat")}</li>
                  <li>{polyglot.t("about.specialties.artistic")}</li>
                  <li>{polyglot.t("about.specialties.aerial")}</li>
                  <li>{polyglot.t("about.specialties.hand")}</li>
                  <li>{polyglot.t("about.specialties.poledance")}</li>
                  <li>{polyglot.t("about.specialties.teacher")}</li>
                  <li>{polyglot.t("about.specialties.professional")}</li>
                </ul>
                <br />
                <p>{polyglot.t("about.statement.1")}</p>
                <p>{polyglot.t("about.statement.2")}</p>
                <br />
                <p>
                  {polyglot.t("about.mission")}
                  <span className="text-brand-200">
                    {polyglot.t("about.mission.highlight")}
                  </span>
                </p>
                <div className="pt-8 flex gap-4">
                  <ContactButton />
                  <CvDownoladButton />
                </div>
              </FadeInSection>
            </div>
          </div>

          <div className="lg:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-start container">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                scale: {
                  type: "spring",
                  bounce: 0.5,
                },
              }}
              className="w-full h-auto rounded-2xl overflow-hidden"
            >
              <Image
                src="/img/about-images.png"
                alt="About Rodrigo Tavella"
                title="About for Rodrigo Tavella"
                width={500}
                height={500}
                className="rounded-2xl object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Tech Sheet Section */}
      <section className="flex items-center justify-center text-white relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="row flex flex-col-reverse lg:flex-row items-center md:justify-center w-full lg:gap-12"
        >
          <div className="container text-start lg:text-left flex items-start flex-col">
            <div className="mb-6 mt-6">
              <FadeInSection>
                <h2 className="text-6xl font-bold text-start text-brand-200">
                  {polyglot.t("about.tech.title")}
                </h2>
                <ul>
                  <li>{polyglot.t("about.tech.nationality")}</li>
                  <li>{polyglot.t("about.tech.age")}</li>
                  <li>{polyglot.t("about.tech.birth")}</li>
                  <li>{polyglot.t("about.tech.height")}</li>
                  <li>{polyglot.t("about.tech.weight")}</li>
                  <li>{polyglot.t("about.tech.shoe")}</li>
                  <li>{polyglot.t("about.tech.skin")}</li>
                  <li>{polyglot.t("about.tech.eyes")}</li>
                  <li>{polyglot.t("about.tech.status")}</li>
                </ul>
                <div className="pt-8 flex gap-4">
                  <ContactButton />
                  <CvDownoladButton />
                </div>
              </FadeInSection>
            </div>
          </div>

          <div className="lg:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-start container">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                scale: {
                  type: "spring",
                  bounce: 0.5,
                },
              }}
              className="w-full h-auto rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/img/about-image-2.png"
                alt="Tech Sheet Rodrigo Tavella"
                title="Dance and Performance Artist"
                width={500}
                height={500}
                className="rounded-2xl object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
