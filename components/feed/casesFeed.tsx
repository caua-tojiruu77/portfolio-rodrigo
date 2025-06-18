import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import CasesSlider from "./casesSlider";

const CasesFeed = () => {
  return (
    <>
      <section className="px-0! text-center" id="aplicacoes">
          <h1 className="mainTitle">My Gallery</h1>
        <CasesSlider cases={cases} />
      </section>
    </>
  );
};

export default CasesFeed;

const cases = [
  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },

  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },

    {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },
  {
    name: "Pinutras planejadas",
    img: "500x500.svg",
  },

];
