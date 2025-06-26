"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import FadeInSection from "../animations/fadeAnimation";
import ContactButton from "../buttons/contactButton";
import CvDownoladButton from "../buttons/cvDowloadButton";

export default function ExperienceSection() {
  const { language } = useLanguage();

  const polyglot = new Polyglot({
    phrases: {},
    locale: language,
  });

  return (
    <>
      <section className="flex flex-col items-center justify-center text-white relative">
        <div className="relative lg:py-16 mb-6">
          {/* Texto grande de fundo */}
          <h1
            className="hidden lg:flex absolute inset-0 justify-center items-center md:text-[5rem] xl:text-[7rem] font-extrabold text-gray-300 opacity-10 select-none pointer-events-none -z-10"
            aria-hidden="true"
          >
            {language === "en" && "EXPERIENCE"}
            {language === "it" && "ESPERIENZA"}
            {language === "de" && "ERFAHRUNG"}
          </h1>

          {/* Texto principal */}
          <FadeInSection>
            <h2 className="relative text-4xl font-bold text-center">
              {language === "en" && (
                <>
                  <span className="text-white">Experience</span>
                </>
              )}
              {language === "it" && (
                <>
                  <span className="text-white">Esperienza</span>
                </>
              )}
              {language === "de" && (
                <>
                  <span className="text-white">Erfahrung</span>
                </>
              )}
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
                {/* Texto principal */}
                <p className="mb-4">
                  {language === "en" &&
                    "Throughout my career, I have worked on various artistic projects combining dance, acrobatics, and performance. I have worked in theaters, dance schools, international shows, and stage productions, bringing my versatility to different formats and audiences."}
                  {language === "it" &&
                    "Nel corso della mia carriera, ho lavorato a vari progetti artistici che combinano danza, acrobatica e performance. Ho lavorato in teatri, scuole di danza, spettacoli internazionali e produzioni teatrali, portando la mia versatilità a diversi formati e pubblici."}
                  {language === "de" &&
                    "Im Laufe meiner Karriere habe ich an verschiedenen künstlerischen Projekten gearbeitet, die Tanz, Akrobatik und Performance kombinieren. Ich habe in Theatern, Tanzschulen, internationalen Shows und Bühnenproduktionen gearbeitet und dabei meine Vielseitigkeit in unterschiedlichen Formaten und für verschiedene Zielgruppen eingebracht."}
                </p>

                {/* Título destacado */}
                <p className="text-lg font-bold text-brand-200 mb-2">
                  {language === "en" && "Key experiences include:"}
                  {language === "it" && "Principali esperienze includono:"}
                  {language === "de" &&
                    "Zu den wichtigsten Erfahrungen gehören:"}
                </p>

                {/* Lista de experiências */}
                <ul className="list-disc pl-5">
                  <li>
                    {language === "en" &&
                      "Dancer and acrobat in theatrical productions, especially musical and visual shows on major European stages and in Asia and the Middle East."}
                    {language === "it" &&
                      "Ballerino e acrobata in produzioni teatrali, soprattutto spettacoli musicali e visivi sui principali palcoscenici europei e in Asia e Medio Oriente."}
                    {language === "de" &&
                      "Tänzer und Akrobat in Theaterproduktionen, insbesondere musikalischen und visuellen Shows auf großen europäischen Bühnen sowie in Asien und dem Nahen Osten."}
                  </li>
                  <li>
                    {language === "en" &&
                      "Performer in German theaters, including seasons in Düsseldorf, Duisburg, and Essen, performing dance and acrobatics in musical productions."}
                    {language === "it" &&
                      "Performer in teatri tedeschi, comprese stagioni a Düsseldorf, Duisburg ed Essen, con esibizioni di danza e acrobazie in musical."}
                    {language === "de" &&
                      "Performer in deutschen Theatern, darunter Spielzeiten in Düsseldorf, Duisburg und Essen mit Tanz- und Akrobatikdarbietungen in Musicals."}
                  </li>
                  <li>
                    {language === "en" &&
                      "Dance teacher for modern dance, flexibility, aerial hoop, and movement technique at Vi-Dance and TSC in Dortmund."}
                    {language === "it" &&
                      "Insegnante di danza moderna, flessibilità, cerchio aereo e tecnica del movimento presso Vi-Dance e TSC a Dortmund."}
                    {language === "de" &&
                      "Tanzlehrer für modernen Tanz, Flexibilität, Luftring und Bewegungstechnik bei Vi-Dance und TSC in Dortmund."}
                  </li>
                  <li>
                    {language === "en" &&
                      "Performer in solo and group acrobatics, including handbalance, pole dance, and aerial hoop for shows and corporate events."}
                    {language === "it" &&
                      "Performance acrobatiche individuali e di gruppo, inclusi numeri di handbalance, pole dance e cerchio aereo per spettacoli ed eventi aziendali."}
                    {language === "de" &&
                      "Auftritte in Solo- und Gruppenakrobatik, einschließlich Handbalance, Pole Dance und Luftring für Shows und Firmenevents."}
                  </li>
                  <li>
                    {language === "en" &&
                      "Participation in artistic events and shows in Brazil, Asia, the Middle East, and Europe, bringing not only technique but also emotion, fluidity, and intense physical energy to the stage."}
                    {language === "it" &&
                      "Partecipazione a eventi e spettacoli artistici in Brasile, Asia, Medio Oriente ed Europa, portando sul palco non solo tecnica, ma anche emozione, fluidità ed energia fisica intensa."}
                    {language === "de" &&
                      "Teilnahme an künstlerischen Veranstaltungen und Shows in Brasilien, Asien, dem Nahen Osten und Europa – mit einer Bühnenpräsenz, die nicht nur Technik, sondern auch Emotion, Fluss und intensive körperliche Energie vermittelt."}
                  </li>
                </ul>

                {/* Texto final destacado */}
                <p className="my-4">
                  {language === "en" &&
                    "Each project reinforced my passion for the art of the body in motion."}
                  {language === "it" &&
                    "Ogni progetto ha rafforzato la mia passione per l’arte del corpo in movimento."}
                  {language === "de" &&
                    "Jedes Projekt hat meine Leidenschaft für die Kunst des bewegten Körpers gestärkt."}
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
                src="/img/exp-image.png"
                alt="Experience for Rodrigo Tavella"
                title="My experience in dance and acrobatics"
                priority
                width={500}
                height={900}
                className="rounded-2xl object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
