"use client";

import Image from "next/image";
import { Mail, ArrowBigDown, Mouse } from "lucide-react";
import Link from "next/link";
import FadeInSection from "../animations/fadeAnimation";
import EntryAnimation from "../animations/entryAnimation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Polyglot from "node-polyglot";
import { useLanguage } from "@/context/languageContext";

export default function HomePageSection() {
  const [showContent, setShowContent] = useState(false);

  const { language } = useLanguage();

  const phrases = {
    de: {
      "page.welcome":
        "Willkommen in meinem Universum. Hier erfährst du mehr über den Weg, den ich gegangen bin, um der Tänzer zu werden, der ich heute bin ein Weg voller Hingabe, Mut und Liebe zur Kunst.\nFühle dich frei, zu erkunden, dich inspirieren zu lassen und dich mit jeder Bewegung dieser Geschichte zu verbinden.",
    },
    it: {
      "page.welcome":
        "Benvenuto nel mio universo. Qui scoprirai di più sul percorso che ho intrapreso per diventare il danzatore che sono oggi un cammino fatto di dedizione, coraggio e amore per l’arte.\nSentiti libero di esplorare, lasciarti ispirare e connetterti con ogni movimento di questa storia.",
    },
    en: {
      "page.welcome":
        "Welcome to my universe. Here you will learn more about the path I have taken to become the dancer I am today a journey shaped by dedication, courage, and love for the art.\nFeel free to explore, be inspired, and connect with every movement of this story.",
    },
  };

  const polyglot = new Polyglot({
    phrases: phrases[language],
    locale: language,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000); // mesmo tempo do EntryAnimation
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="h-screen flex items-center justify-center text-white relative">
      {!showContent && <EntryAnimation />}
      {showContent && (
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
                <p className="text-4xl md:text-5xl font-bold text-start">
                  Rodrigo <span className="text-brand-200">Tavella</span>
                </p>
                <p className="mt-2 text-lg text-start">
                  Professional dancer | Dancing teacher | Polle dance teacher
                </p>
              </FadeInSection>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-2 text-start">
              <h1>{polyglot.t("page.welcome")}</h1>
            </p>
            <div className="mt-4 flex items-center text-center gap-2 text-brand-200 animate-bounce w-full">
              <Mouse size={30} />
              <p className="text-sm">Roll down!</p>
              <ArrowBigDown size={16} />
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 mt-0 flex justify-start container">
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
                src="/img/perfil-photo.jpg"
                alt="Caua Tavella - Desenvolvedor Web"
                title="Desenvolvedor Web apaixonado pelo que faz, com uma imaginação fora dos padrões"
                width={500}
                height={500}
                className="rounded-2xl object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
