"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/languageContext";
import Polyglot from "node-polyglot";
import FadeInSection from "../animations/fadeAnimation";
import EntryAnimation from "../animations/entryAnimation";

export default function ExperienceSection() {
  const [showContent, setShowContent] = useState(false);
  const { language } = useLanguage();

  const polyglot = new Polyglot({
    phrases: {},
    locale: language,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center text-white relative">
        <h1 className="mainTitle md:pb-6">
          <span className="text-white">
            {language === "en" && "Experience"}
            {language === "it" && "Esperienza"}
            {language === "de" && "Erfahrung"}
          </span>
        </h1>

        {!showContent && <EntryAnimation />}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="row flex flex-col-reverse lg:flex-row-reverse md:justify-center w-full lg:gap-12"
          >
            <div className="container text-start lg:text-left flex items-start flex-col">
              <div className="mb-6 mt-6">
                <FadeInSection>
                  {/* Texto principal */}
                  <p className="text-sm md:text-base mb-4">
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
                        "Dancer and acrobat in theatrical productions, especially musical and visual shows on major European stages."}
                      {language === "it" &&
                        "Ballerino e acrobata in produzioni teatrali, in particolare spettacoli musicali e visivi su grandi palchi europei."}
                      {language === "de" &&
                        "Tänzer und Akrobat in Theaterproduktionen, insbesondere Musik- und visuelle Shows auf großen Bühnen in Europa."}
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
                        "Participation in artistic events and shows in Brazil and Europe, bringing not only technique but also emotion, fluidity, and intense physical energy to the stage."}
                      {language === "it" &&
                        "Partecipazione a eventi e spettacoli artistici in Brasile e in Europa, portando sul palco non solo tecnica, ma anche emozione, fluidità ed energia fisica intensa."}
                      {language === "de" &&
                        "Teilnahme an künstlerischen Veranstaltungen und Shows in Brasilien und Europa, wobei ich nicht nur Technik, sondern auch Emotion, Fluss und intensive körperliche Energie auf die Bühne bringe."}
                    </li>
                  </ul>

                  {/* Texto final destacado */}
                  <p className="text-sm md:text-base my-4">
                    {language === "en" &&
                      "Each project reinforced my passion for the art of the body in motion."}
                    {language === "it" &&
                      "Ogni progetto ha rafforzato la mia passione per l’arte del corpo in movimento."}
                    {language === "de" &&
                      "Jedes Projekt hat meine Leidenschaft für die Kunst des bewegten Körpers gestärkt."}
                  </p>
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
                  alt="Experience"
                  title="Experience"
                  width={500}
                  height={900}
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
