import Polyglot from 'node-polyglot';

const translations = {
  en: {
    header: { home: 'Home', about: 'About Me', experience: 'Experience' },
  },
  it: {
    header: { home: 'Home', about: 'Chi sono', experience: 'Esperienza' },
  },
  de: {
    header: { home: 'Startseite', about: 'Über mich', experience: 'Erfahrung' },
  },
};

export const createPolyglot = (locale: 'en' | 'it' | 'de') => {
  return new Polyglot({
    phrases: translations[locale] || translations.en,
    locale,
  });
};