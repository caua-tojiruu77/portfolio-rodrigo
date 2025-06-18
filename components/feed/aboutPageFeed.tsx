"use client";

import Image from "next/image";
import { Mail, ArrowBigDown, Mouse } from "lucide-react";
import Link from "next/link";
import FadeInSection from "../animations/fadeAnimation";
import EntryAnimation from "../animations/entryAnimation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'

export default function AboutSection() {
  const [showContent, setShowContent] = useState(false);

  interface Props {
    texts: {
      description: string
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000); // mesmo tempo do EntryAnimation
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center text-white relative">
        <h1 className="mainTitle md:pb-12">
          <span className="text-brand-200">About</span> Me
        </h1>
        {!showContent && <EntryAnimation />}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="row flex flex-col-reverse lg:flex-row-reverse items-center md:justify-center w-full lg:gap-12"
          >
            {/* Text Content */}
            <div className="container text-start lg:text-left flex items-start flex-col">
              <div className="mb-6 mt-6">
                <FadeInSection>
                  <p className="text-sm md:text-base text-start">
                    Meu nome é Rodrigo Willian Tavella, sou artista brasileiro
                    com cidadania italiana e atualmente vivo em Dortmund,
                    Alemanha. Minha trajetória artística é marcada pela união
                    entre dança, acrobacia e expressão cênica, com uma entrega
                    que ultrapassa o movimento técnico para alcançar a emoção
                    pura. Sou formado em dança e possuo ampla experiência como
                    bailarino, acrobata e performer, atuando em companhias,
                    teatros, shows, escolas e grandes produções internacionais.
                  </p>

                  <br />

                  <h2 className="text-xl font-bold">
                    Minhas especialidades incluem:
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>
                      <b>Dança:</b> balé clássico, jazz, dança contemporânea e
                      moderna.
                    </li>
                    <li>
                      <b>Acrobacias:</b> solo, em grupo, em dupla, aerial hoop,
                      handbalance, pole dance.
                    </li>
                    <li>Performance de palco e teatro musical.</li>
                  </ul>

                  <br />

                  <p>
                    Minha arte é visceral, física e simbólica movida por uma
                    busca constante por transformação e conexão. Acredito que o
                    corpo é uma linguagem viva e que o palco é o lugar onde alma
                    e técnica se encontram.
                  </p>
                  <p>
                    Hoje, além de performer, também atuo como professor de
                    dança, dividindo minha experiência com novos artistas e
                    explorando a pedagogia do movimento.
                  </p>

                  <br />

                  <p>
                    Seja nos palcos da Europa, em uma sala de ensaio ou nas
                    alturas de um aro aéreo, minha missão é a mesma:{" "}
                    <span className="text-brand-200">
                      emocionar com autenticidade.
                    </span>
                  </p>
                </FadeInSection>
              </div>
            </div>

            {/* Image */}
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
                  alt=""
                  title=""
                  width={500}
                  height={500}
                  className="rounded-2xl object-cover w-full h-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </section>
      <section className=" flex items-center justify-center text-white relative">
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
              <div className="mb-6 mt-6">
                <FadeInSection>
                  <p className="text-3xl font-bold text-start">
                    <span className="text-brand-200">Technical</span> sheet
                  </p>
                  <ul>
                    <li>
                      <span className="font-bold">Nationality:</span> Brazilian,
                      with Italian citizenship (European Union)
                    </li>
                    <li>
                      <span className="font-bold">Age:</span> 32 years old
                    </li>
                    <li>
                      <span className="font-bold">Date of birth:</span>{" "}
                      September 17, 1992
                    </li>
                    <li>
                      <span className="font-bold">Height:</span> 1.74 m (or
                      5'8")
                    </li>
                    <li>
                      <span className="font-bold">Weight:</span> 70 kg
                    </li>
                    <li>
                      <span className="font-bold">Shoe size:</span> 41 (BR)
                    </li>
                    <li>
                      <span className="font-bold">Skin color:</span> White
                    </li>
                    <li>
                      <span className="font-bold">Eye color:</span> Medium brown
                    </li>
                    <li>
                      <span className="font-bold">Marital status:</span> Single
                    </li>
                  </ul>
                </FadeInSection>
              </div>
            </div>

            {/* Image */}
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
    </>
  );
}
