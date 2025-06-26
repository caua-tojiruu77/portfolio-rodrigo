import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/languageContext";
import { Download } from "lucide-react"; // ou outro ícone de download

const buttonTexts: Record<string, string> = {
  en: "Download Curriculum",
  it: "Scarica Curriculum",
  de: "Lebenslauf herunterladen",
};

export default function CvDownoladButton() {
  const { language } = useLanguage();

  return (
    <div className="px-1">
      <Link
        href="/CV-RodrigoTavella.pdf"
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.button
          type="button"
          className="inline-flex items-center gap-2 bg-brand-200 transition text-brand-100 px-5 py-2 rounded-full shadow-md cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <Download size={18} />
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
        </motion.button>
      </Link>
    </div>
  );
}