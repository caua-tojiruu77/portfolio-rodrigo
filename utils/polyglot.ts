import Polyglot from "node-polyglot";

const translations = {
  en: {
    header: {
      home: "Home",
      about: "About Me",
      experience: "Experience",
      danceexp: "Professional Experience",
      academicFormation: "Academic Formation",
      gallery: "Gallery",
    },
  },
  it: {
    header: {
      home: "Home",
      about: "Chi sono",
      experience: "Esperienza",
      danceexp: "Esperienza Professionale",
      academicFormation: "Formazione Accademica",
      gallery: "Galleria",
    },
  },
  de: {
    header: {
      home: "Startseite",
      about: "Über mich",
      experience: "Erfahrung",
      danceexp: "Berufserfahrung",
      academicFormation: "Akademische Ausbildung",
      gallery: "Galerie",
    },
  },
};

export const createPolyglot = (locale: "en" | "it" | "de") => {
  return new Polyglot({
    phrases: translations[locale] || translations.en,
    locale,
  });
};
