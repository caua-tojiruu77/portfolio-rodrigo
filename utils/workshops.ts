export type WorkshopLocaleContent = {
  name: string;
  description: string;
  date: string;
  location: string;
  level: string;
  duration: string;
  price: string;
  button: string;
};

export type Workshop = {
  id: string;
  image: string;
  registrationUrl?: string;
  visible?: boolean;
  price: string;
  amount: number;
  currency: string;
  translations: {
    en: WorkshopLocaleContent;
    it: WorkshopLocaleContent;
    de: WorkshopLocaleContent;
  };
};

export const workshops: Workshop[] = [
  {
    id: "handstand-beginners",
    image: "/img/workshopo-d.png",
    registrationUrl: "/contact?subject=Handstand%20Workshop%20Beginners",
    visible: true,
    price: "€80",
    amount: 80,
    currency: "EUR",
    translations: {
      en: {
        name: "HANDSTAND WORKSHOP – BEGINNERS",
        description:
          "This workshop is designed for anyone who wants to discover and build a strong foundation in handstands. We will work on body alignment, balance, shoulder strength, hand positioning and the fundamentals of safely entering and exiting a handstand. You will learn practical exercises and progressions to help you feel more confident upside down. No previous handstand experience is required — just curiosity and the motivation to try! 🤸‍♂️",
        date: "October 21 & 28 · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Beginner",
        duration: "1h 30m per session",
        price: "€80",
        button: "Enroll now",
      },
      it: {
        name: "HANDSTAND WORKSHOP – PRINCIPIANTI",
        description:
          "Questo workshop è pensato per chi vuole scoprire e costruire una solida base nel lavoro del handstand. Lavoreremo su allineamento del corpo, equilibrio, forza delle spalle, posizione delle mani e sui fondamenti per entrare e uscire in sicurezza dal capovolgimento. Imparerai esercizi pratici e progressioni per sentirti più sicuro a testa in giù. Nessuna esperienza precedente è richiesta — basta curiosità e voglia di provare! 🤸‍♂️",
        date: "21 e 28 ottobre · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Principiante",
        duration: "1h 30m per sessione",
        price: "€80",
        button: "Iscriviti",
      },
      de: {
        name: "HANDSTAND WORKSHOP – ANFÄNGER",
        description:
          "Dieser Workshop ist für alle geeignet, die die Grundlagen des Handstands entdecken und aufbauen möchten. Wir arbeiten an Körperausrichtung, Gleichgewicht, Schulterkraft, Handposition und den Grundlagen für einen sicheren Einstieg und Ausstieg in den Handstand. Du lernst praktische Übungen und Progressionen, mit denen du dich sicherer im Kopfstand fühlst. Vorkenntnisse sind nicht erforderlich — nur Neugierde und der Wille, es auszuprobieren! 🤸‍♂️",
        date: "21. und 28. Oktober · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Anfänger",
        duration: "1 Std. 30 Min. pro Einheit",
        price: "€80",
        button: "Jetzt anmelden",
      },
    },
  },
  {
    id: "handstand-intermediate-advanced",
    image: "/img/workshopo-d.png",
    registrationUrl: "/contact?subject=Handstand%20Workshop%20Intermediate%20Advanced",
    visible: true,
    price: "€100",
    amount: 100,
    currency: "EUR",
    translations: {
      en: {
        name: "HANDSTAND WORKSHOP – INTERMEDIATE & ADVANCED",
        description:
          "For participants who already have experience with handstands and want to take their skills to the next level. We will focus on improving balance, strength, control and body lines, while exploring more challenging handstand variations, transitions and creative movement. The workshop will also include exercises to develop endurance, technique and greater freedom in hand balancing. A chance to refine your technique, challenge yourself and explore new possibilities upside down. ✨",
        date: "October 21 & 28 · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Intermediate / Advanced",
        duration: "1h 30m per session",
        price: "€100",
        button: "Enroll now",
      },
      it: {
        name: "HANDSTAND WORKSHOP – INTERMEDIO & AVANZATO",
        description:
          "Per chi ha già esperienza con gli handstand e vuole portare le proprie capacità a un livello superiore. Ci concentreremo sul miglioramento dell’equilibrio, della forza, del controllo e delle linee del corpo, esplorando varianti più impegnative, transizioni e movimento creativo. Il workshop includerà anche esercizi per sviluppare resistenza, tecnica e maggiore libertà nel bilanciamento a testa in giù. Un’occasione per perfezionare la tecnica, sfidare sé stessi ed esplorare nuove possibilità a testa in su. ✨",
        date: "21 e 28 ottobre · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Intermedio / Avanzato",
        duration: "1h 30m per sessione",
        price: "€100",
        button: "Iscriviti",
      },
      de: {
        name: "HANDSTAND WORKSHOP – MITTLERES & FORTGESCHRITTENES NIVEAU",
        description:
          "Für Teilnehmende, die bereits Erfahrung mit dem Handstand haben und ihre Fähigkeiten auf das nächste Level bringen möchten. Wir konzentrieren uns auf Verbesserung von Balance, Kraft, Kontrolle und Körperlinien und erkunden anspruchsvollere Variationen, Übergänge und kreative Bewegungen. Der Workshop enthält zudem Übungen zur Entwicklung von Ausdauer, Technik und mehr Freiheit im Handbalance. Eine Chance, deine Technik zu verfeinern, dich selbst herauszufordern und neue Möglichkeiten im Kopfstand zu entdecken. ✨",
        date: "21. und 28. Oktober · 18:00–19:30 / 19:30–21:00",
        location: "Studio Rodrigo Tavella",
        level: "Mittel / Fortgeschritten",
        duration: "1 Std. 30 Min. pro Einheit",
        price: "€100",
        button: "Jetzt anmelden",
      },
    },
  },
];

export const getWorkshopContent = (
  workshop: Workshop,
  language: "en" | "it" | "de",
) => workshop.translations[language];

export const enabledWorkshops = workshops.filter(
  (workshop) => workshop.visible !== false,
);

export const getWorkshopById = (id: string) =>
  enabledWorkshops.find((workshop) => workshop.id === id);

export const workshopsEnabled = enabledWorkshops.length > 0;
