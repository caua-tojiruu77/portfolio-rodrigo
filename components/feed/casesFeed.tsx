import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
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
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinturas planejadas",
    img: "500x500.svg",
  },
];
