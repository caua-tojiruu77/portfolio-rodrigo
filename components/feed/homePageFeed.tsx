"use client";

import Image from "next/image";
import { Mail, ArrowBigDown, Mouse } from "lucide-react";
import Link from "next/link";
import FadeInSection from "../animations/fadeAnimation";
import EntryAnimation from "../animations/entryAnimation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePageSection() {
  const [showContent, setShowContent] = useState(false);

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
              Seja bem-vindo ao meu universo. Aqui você vai conhecer mais sobre
              o caminho que percorri para me tornar o dançarino que sou hoje —
              uma trajetória feita de dedicação, coragem e amor pela arte.
              Sinta-se à vontade para explorar, inspirar-se e conectar-se com
              cada movimento dessa história.
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
