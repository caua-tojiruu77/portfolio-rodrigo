import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/languageContext";

const buttonTexts: Record<string, string> = {
  en: "Contact me",
  it: "Contattami",
  de: "Kontaktiere mich",
};

export default function ContactButton() {
  const { language } = useLanguage();

  return (
    <div className="px-1">
      <Link
        href="https://api.whatsapp.com/send/?phone=4915234679241&text=Hello%2C%20am%20I%20speaking%20with%20Rodrigo%3F
"
        passHref
        target="_blank"
      >
        <motion.p
          className="inline-flex items-center gap-2 bg-brand-200 transition text-brand-100 px-5 py-2 rounded-full shadow-md cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          {buttonTexts[language] || buttonTexts.en}
          <motion.span
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </motion.p>
      </Link>
    </div>
  );
}
