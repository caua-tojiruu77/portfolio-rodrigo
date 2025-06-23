"use client"

import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import CasesSlider from "./casesSlider";
import Polyglot from "node-polyglot";
import { useLanguage } from "@/context/languageContext";
import { createPolyglot } from "@/utils/polyglot";


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
    img: "/img/gallery/1.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/2.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/4.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/5.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/6.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/7.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/24.webp",
  },
  {
    name: "Professional Dancer and Choreographer",
    img: "/img/gallery/3.webp",
  },
];
