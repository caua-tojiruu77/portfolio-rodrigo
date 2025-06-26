"use client";

import Image from "next/image";
import { ArrowBigDown, Mouse } from "lucide-react";
import FadeInSection from "../animations/fadeAnimation";
import { motion } from "framer-motion";
import { useState } from "react";
import Polyglot from "node-polyglot";
import { useLanguage } from "@/context/languageContext";

export default function HomePageSection() {
  const [showContent, setShowContent] = useState(false);

  const { language } = useLanguage();

  const phrases = {
    de: {
      "page.welcome":
        "Willkommen in meinem Universum. Hier erfährst du mehr über den Weg, den ich gegangen bin, um der Tänzer zu werden, der ich heute bin ein Weg voller Hingabe, Mut und Liebe zur Kunst.\nFühle dich frei, zu erkunden, dich inspirieren zu lassen und dich mit jeder Bewegung dieser Geschichte zu verbinden.",
      "page.profession":
        "Professioneller Tänzer (Ballett, Jazz, Zeitgenössisch, Modern, Burlesque, Commercial) | Akrobat (Solo, Duo, Gruppe) | Kunstturner | Performer für Aerial Hoop und Handbalance | Poledancer | Lehrer: SexyDance, ChairDance, Aerial Hoop, Stretching.",
      "page.rolldown": "Runterscrollen!",
    },
    it: {
      "page.welcome":
        "Benvenuto nel mio universo. Qui scoprirai di più sul percorso che ho intrapreso per diventare il danzatore che sono oggi un cammino fatto di dedizione, coraggio e amore per l’arte.\nSentiti libero di esplorare, lasciarti ispirare e connetterti con ogni movimento di questa storia.",
      "page.profession":
        "Ballerino Professionista (Balletto, Jazz, Contemporaneo, Moderno, Burlesque, Commercial) | Acrobata (solo, duo, in gruppo) | Ginnasta Artistico | Performer di Aerial Hoop e Hand Balance | Poledancer | Insegnante: SexyDance, ChairDance, Aerial Hoop, Stretching.",
      "page.rolldown": "Scorri giù!",
    },
    en: {
      "page.welcome":
        "Welcome to my universe. Here you will learn more about the path I have taken to become the dancer I am today a journey shaped by dedication, courage, and love for the art.\nFeel free to explore, be inspired, and connect with every movement of this story.",
      "page.profession":
        "Professional Dancer (Ballet, Jazz, Contemporary, Modern, Burlesque, Commercial) | Acrobat (solo, duo, group) | Artistic Gymnast | Aerial Hoop & Hand Balance Performer | Poledancer | Teacher: SexyDance, ChairDance, Aerial Hoop, Stretching.",
      "page.rolldown": "Roll down!",
    },
  };

  const polyglot = new Polyglot({
    phrases: phrases[language],
    locale: language,
  });

  return (
    <section className="min-h-screen flex items-center justify-center text-white relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="row flex flex-col-reverse lg:flex-row items-center md:justify-center w-full lg:gap-12"
      >
        {/* Text Content */}
        <div className="container text-start lg:text-left flex items-start flex-col">
          <div className="mb-4 mt-4">
            <FadeInSection>
              <h1 className="text-4xl md:text-5xl font-bold text-start">
                Rodrigo <span className="text-brand-200">Tavella</span>
              </h1>
              <p className="mt-2 text-lg text-start">
                {polyglot.t("page.profession")}
              </p>
            </FadeInSection>
          </div>
          <h2 className="text-sm md:text-base text-gray-300 mb-2 text-start">
            {polyglot.t("page.welcome")}
          </h2>
          <div className="mt-4 flex items-center text-center gap-2 text-brand-200 animate-bounce w-full">
            <Mouse size={30} />
            <p className="text-sm">{polyglot.t("page.rolldown")}</p>
            <ArrowBigDown size={16} />
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 md:mt-0 mt-12 flex justify-start container">
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
            className="w-96 h-96 lg:w-full lg:h-auto rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/img/home-photo.webp"
              alt="Rodrigo Tavella, Professional Dancer and Teacher"
              title="Professional Dancer and Teacher"
              width={500}
              height={500}
              priority
              className="rounded-2xl object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
