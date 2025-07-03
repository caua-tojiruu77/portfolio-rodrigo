"use client"
import Polyglot from "node-polyglot";
import { useLanguage } from "@/context/languageContext";
import VideoSlider from "./videoSlider";

const VideosFeed = () => {
  const { language } = useLanguage();

  const polyglot = new Polyglot({
    phrases: {
      de: { "page.title": "Meine Auftritte" },
      it: { "page.title": "Le mie esibizioni" },
      en: { "page.title": "My Performances" },
    }[language],
    locale: language,
  });

  return (
    <section className="px-0! text-center" id="aplicacoes">
      <h1 className="mainTitle">{polyglot.t("page.title")}</h1>
      <VideoSlider cases={videos} />
    </section>
  );
};

export default VideosFeed;

const videos = [
  {
    name: "Dance performance…2025",
    video: "https://www.youtube.com/embed/DAf2vscAHiY?si=XwmPMhNzFZzCwN_F",
  },
  {
    name: "Show at the circus, numbers AERIALHOOP, POLEDANCE and HANDBALANCE",
    video: "https://www.youtube.com/embed/7FUkCa85thY?si=4_GMUi32me7yBHDY",
  },
  {
    name: "Israel hand balance number",
    video: "https://www.youtube.com/embed/k4QatTbbGno?si=rgJ1hdn-H1-duLA4",
  },
  {
    name: "Jazz dance, Rodrigo Tavella coreógrafa Kely Gouveia",
    video: "https://www.youtube.com/embed/1TMq6kDOfMo?si=5zAqDwrBMLoVkd58",
  },
  {
    name: "HandBalance Show",
    video: "https://www.youtube.com/embed/pRVIoJaZuHA?si=NCCv6g7HsshcyrNh"
  },
];