"use client"

import CasesSlider from "./casesSlider";
import Polyglot from "node-polyglot";
import { useLanguage } from "@/context/languageContext";

const CasesFeed = () => {
  const { language } = useLanguage();

  const polyglot = new Polyglot({
    phrases: {
      de: { "page.title": "Meine Galerie" },
      it: { "page.title": "La mia galleria" },
      en: { "page.title": "My Gallery" },
    }[language],
    locale: language,
  });

  return (
    <section className="px-0! text-center" id="aplicacoes">
      <h1 className="mainTitle">{polyglot.t("page.title")}</h1>
      <CasesSlider cases={cases} />
    </section>
  );
};

export default CasesFeed;

const cases = [
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-dance/1.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-dance/2.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-artisticas/1.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-artisticas/2.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-aerialhoop/1.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-handbalance/1.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-artisticas/3.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/fotos-dance/3.webp",
  },
];
