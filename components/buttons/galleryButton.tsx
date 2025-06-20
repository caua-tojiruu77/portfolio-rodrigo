import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/languageContext";

const buttonTexts: Record<string, string> = {
  en: "More Images",
  it: "Altre Immagini",
  de: "Mehr Bilder",
};

export default function GalleryButton() {
  const { language } = useLanguage();

  return (
    <div className="px-1">
      <Link href="/gallery" passHref>
        <motion.p
          className="inline-flex items-center gap-2 bg-brand-100 transition text-white px-5 py-2 rounded-full shadow-md cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          {buttonTexts[language] || buttonTexts.en}
          <motion.span
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </motion.p>
      </Link>
    </div>
  );
}