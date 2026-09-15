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
      workshops: "Workshops",
    },
    site: {
      title: "Rodrigo Tavella",
      subtitle: "Professional dancer and choreographer",
    },
    contact: {
      title: "Contact",
      enter: "Get in touch",
      description: "Fill the form to get in touch — your message will arrive by email.",
      nome: "First name",
      sobrenome: "Last name",
      telefone: "Phone number",
      email: "Email",
      mensagem: "Message",
      submit: "Send message",
      sending: "Sending...",
      validation: {
        nomeSobrenome: "Please fill first and last name.",
        email: "Please fill the email.",
        emailInvalid: "Invalid email.",
        mensagem: "Please write a message.",
      }
    },
    privacy: {
      heading: "Privacy & consent:",
      body: "By submitting this form you agree that your information will be used to contact you. I will not share your data with third parties.",
    },
    success: "Send completed",
    workshops: {
      page: {
        title: "Workshops",
        subtitle: "Learn technique, balance and confidence in a practical environment.",
      },
      card: {
        register: "Enroll now",
      },
      popup: {
        eyebrow: "New workshops",
        title: "Discover new movement and performance experiences",
        description: "Explore the available opportunities and sign up for the next sessions in dance, technique and body expression.",
        close: "Close",
        action: "See workshops",
      },
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
      workshops: "Workshop",
    },
    contact: {
      title: "Contatto",
      enter: "Mettiti in contatto",
      description: "Compila il modulo per metterti in contatto — il tuo messaggio arriverà via e-mail.",
      nome: "Nome",
      sobrenome: "Cognome",
      telefone: "Numero di contatto",
      email: "E-mail",
      mensagem: "Messaggio",
      submit: "Invia messaggio",
      sending: "Invio...",
      validation: {
        nomeSobrenome: "Compila nome e cognome.",
        email: "Compila l'e-mail.",
        emailInvalid: "E-mail non valida.",
        mensagem: "Scrivi un messaggio.",
      }
    },
      site: {
        title: "Rodrigo Tavella",
        subtitle: "Ballerino professionista e coreografo",
      },
      privacy: {
        heading: "Privacy e consenso:",
        body: "Inviando questo modulo accetti che le tue informazioni vengano utilizzate per contattarti. Non condividerò i tuoi dati con terze parti.",
      },
      success: "Invio completato",
      workshops: {
        page: {
          title: "Workshop",
          subtitle: "Impara tecnica, equilibrio e sicurezza in un ambiente pratico.",
        },
        card: {
          register: "Iscriviti",
        },
        popup: {
          eyebrow: "Nuovi workshop",
          title: "Scopri nuove esperienze di movimento e performance",
          description: "Esplora le opportunità disponibili e iscriviti ai prossimi incontri di danza, tecnica ed espressione corporea.",
          close: "Chiudi",
          action: "Vedi workshop",
        },
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
      workshops: "Workshops",
    },
    contact: {
      title: "Kontakt",
      enter: "Kontakt aufnehmen",
      description: "Füllen Sie das Formular aus, um Kontakt aufzunehmen — Ihre Nachricht wird per E-Mail zugestellt.",
      nome: "Vorname",
      sobrenome: "Nachname",
      telefone: "Kontakt Nr.",
      email: "E-Mail",
      mensagem: "Nachricht",
      submit: "Nachricht senden",
      sending: "Sende...",
      validation: {
        nomeSobrenome: "Bitte Vor- und Nachname ausfüllen.",
        email: "Bitte E-Mail ausfüllen.",
        emailInvalid: "Ungültige E-Mail.",
        mensagem: "Bitte eine Nachricht schreiben.",
      }
    },
      site: {
        title: "Rodrigo Tavella",
        subtitle: "Professioneller Tänzer und Choreograf",
      },
      privacy: {
        heading: "Datenschutz und Zustimmung:",
        body: "Durch das Absenden dieses Formulars stimmen Sie zu, dass Ihre Daten verwendet werden, um Sie zu kontaktieren. Ich werde Ihre Daten nicht an Dritte weitergeben.",
      },
      success: "Versand abgeschlossen",
      workshops: {
        page: {
          title: "Workshops",
          subtitle: "Lerne Technik, Gleichgewicht und Selbstvertrauen in einer praktischen Umgebung.",
        },
        card: {
          register: "Jetzt anmelden",
        },
        popup: {
          eyebrow: "Neue Workshops",
          title: "Entdecke neue Bewegungs- und Performance-Erlebnisse",
          description: "Entdecke die verfügbaren Möglichkeiten und melde dich für die nächsten Tanz-, Technik- und Körperexpressionseinheiten an.",
          close: "Schließen",
          action: "Workshops ansehen",
        },
      },
  },
};

export const createPolyglot = (locale: "en" | "it" | "de") => {
  return new Polyglot({
    phrases: translations[locale] || translations.en,
    locale,
  });
};
