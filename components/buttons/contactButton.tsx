import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactButton() {
  return (
    <div className="px-1">
      <Link href="https://api.whatsapp.com/send/?phone=5519971265295&text=Ol%C3%A1%2C%20Cau%C3%A3%21%0AEstou%20interessado%20em%20contratar%20seus%20servi%C3%A7os%20de%20desenvolvimento%20de%20landing%20pages.%20Quero%20criar%20uma%20p%C3%A1gina%20moderna%2C%20responsiva%20e%20focada%20em%20convers%C3%A3o%20para%20transformar%20visitantes%20em%20clientes.%20Voc%C3%AA%20poderia%20me%20passar%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20processo%2C%20prazos%20e%20valores%3F%0A%0AObrigado%21&type=phone_number&app_absent=0" passHref>
        <motion.p
          className="inline-flex items-center gap-2 bg-brand-100 transition text-white px-5 py-2 rounded-full shadow-md cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          Contact
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
