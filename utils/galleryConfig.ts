// galleryConfig.ts

export type Translations = {
  en: string;
  it: string;
  de: string;
};

export type ImageItem =
  | string
  | {
    src: string; // filename relative to path, e.g. '1.webp'
    title?: Translations; // optional per-image title translations
  };

export type ImageLibrary = {
  title: Translations;
  type: "image";
  path: string;
  items: ImageItem[];
  description?: Translations;
  cover?: string; // optional local cover image (path under /public)
};

export type VideoLibrary = {
  title: Translations;
  type: "video";
  items: string[];
  description?: Translations;
  cover?: string; // optional local cover image (path under /public)
};

export type GalleryLibrary = ImageLibrary | VideoLibrary;

export const galleryLibraries: Record<string, GalleryLibrary> = {
  posada: {
    title: { en: "Headshot and FullBody", it: "Primo piano e figura intera", de: "Porträt und Ganzkörperaufnahm" },
    type: "image",
    path: "/img/gallery/fotos-posada",
    items: [
      "10.webp", // Foto capa da galleria
      "2.webp",
      "4.webp",
      "5.webp",
      "7.webp",
      "9.webp",
      "12.webp",
      "13.webp",
      "14.webp",
      "11.webp",
      // "15.webp",
      // "16.webp",
      "17.webp",
      "18.webp",
      "19.webp",
      "1.webp",
      // "20.webp",
      // "21.webp",
      // "22.webp",
      // "23.webp",
      // "24.webp",
    ],
    description: { en: "Portraits and body expressions.", it: "Ritratti e espressioni del corpo.", de: "Portraits und Körperausdrücke." },
  },

  dance: {
    title: { en: "Dance", it: "Dança", de: "Tanz" },
    type: "image",
    path: "/img/gallery/fotos-dance",
    items: ["1.webp", 
            "2.webp", 
            "3.webp", 
            "4.webp", 
            "6.webp", 
            "7.webp", 
            "9.webp", 
            "10.webp", 
            "12.webp", 
            "13.webp", 
            "14.webp",
            "15.webp",
            "16.webp",
            "17.webp",
            "21.webp",
            "18.webp",
            "19.webp",
            "20.webp",
          ],
    description: { en: "A selection of dance photos showing stage work and movement.", it: "Selezione di foto di danza che mostrano performance e movimento.", de: "Eine Auswahl an Tanzfotos, die Bühnenarbeit und Bewegung zeigen." },
  },

  artisticas: {
    title: {
      en: "Artistic",
      it: "Artistiche",
      de: "Künstlerisch",
    },
    type: "image",
    path: "/img/gallery/fotos-artisticas",
    items: [
      "29.webp", // Foto capa da galleria
      "1.webp",
      "3.webp",
      "8.webp",
      "4.webp",
      "10.webp",
      "11.webp",
      "14.webp",
      "15.webp",
      "16.webp",
      "17.webp",
      "18.webp",
      "19.webp",
      "20.webp",
      "21.webp",
      "22.webp",
      "23.webp",
      "25.webp",
      "26.webp",
      "27.webp",
      "28.webp",
      "33.webp",
      "30.webp",
      "31.webp",
      "32.webp",
      "34.webp",
    ],
    description: { en: "Artistic portraits and creative shots.", it: "Ritratti artistici e scatti creativi.", de: "Künstlerische Porträts und kreative Aufnahmen." },
  },

  aerialhoop: {
    title: { en: "Aerial Hoop", it: "Aerial Hoop", de: "Aerial Hoop" },
    type: "image",
    path: "/img/gallery/fotos-aerialhoop",
    items: [
      "1.webp", // Foto capa da galleria
      "2.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
      "9.webp",
      "10.webp",
      "11.webp",
      "12.webp",
      "13.webp",
      "14.webp",
      "15.webp",
    ],
    description: { en: "Aerial hoop training and performances.", it: "Allenamento e performance con il cerchio aereo.", de: "Aerial-Hoop-Training und Auftritte." },
  },

  handbalance: {
    title: { en: "Hand Balance", it: "Hand Balance", de: "Hand Balance" },
    type: "image",
    path: "/img/gallery/fotos-handbalance",
    items: [
      "1.webp", // Foto capa da galleria
      "2.webp",
      "3.webp",
      "4.webp",
      // "5.webp",
      // "6.webp",
      "7.webp",
      "8.webp",
      // "9.webp",
      "10.webp",
      "11.webp",
      "12.webp",
      // "13.webp",
      "21.webp",
      "24.webp",
      "15.webp",
      "23.webp",
      "22.webp",
    ],
    description: { en: "Hand balance practice and static holds.", it: "Esercizi di equilibrio sulle mani e posizioni statiche.", de: "Handbalance-Übungen und statische Haltepositionen." },

  },

  poledance: {
    title: { en: "Poledance", it: "Poledance", de: "Poledance" },
    type: "image",
    path: "/img/gallery/fotos-poledance",
    items: [
      "2.webp", // Foto capa da galleria
      "1.webp",
      "3.webp",
      "4.webp",
      "5.webp",
      "6.webp",
      "7.webp",
      "8.webp",
    ],
    description: { en: "Hand balance practice and static holds.", it: "Esercizi di equilibrio sulle mani e posizioni statiche.", de: "Handbalance-Übungen und statische Haltepositionen." },
  },

  youtube: {
    title: { en: "YouTube", it: "YouTube", de: "YouTube" },
    type: "video",
    items: [
      "https://www.youtube.com/embed/DAf2vscAHiY",
      "https://www.youtube.com/embed/7FUkCa85thY",
      "https://www.youtube.com/embed/vRbIdb7xJVw?si=iL4A-V-ki7KfPcnB",
      "https://www.youtube.com/embed/pRVIoJaZuHA?si=OKs41nvl-gFj7C_J",
      "https://www.youtube.com/embed/8mwOdZuE554?si=8bw4Gq1G6JMNlR20",
    ],
    description: { en: "Video performances and tutorials.", it: "Video di performance e tutorial.", de: "Videoauftritte und Tutorials." },
  },
};
