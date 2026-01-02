import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa";
import { FaMapLocation, FaPhoneVolume } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const iconSize = 24; // Tamanho fixo para todos os ícones

  return (
    <footer className="bg-brand-100 pt-10">
      <section className="pb-0!">
        <div className="row">
          <div className="container">
            {/* Top section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-0 pb-5">
              {/* Coluna 1: Logo e Redes Sociais */}
              <div>
                <Link href="/" className="block max-w-[8rem] md:max-w-[9rem]">
                  <Image
                    src="/img/logo-header.png"
                    width={100}
                    height={100}
                    alt=""
                    title=""
                    className="w-full h-auto"
                  />
                </Link>
                <div className="flex gap-3 mt-4">
                  <a
                    href="https://web.telegram.org/k/#@rodrigoTavella"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">Telegram</span>
                    <FaTelegram size={iconSize} />
                  </a>
                  <a
                    href="https://www.instagram.com/rodrigo.tavella/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <FaInstagram size={iconSize} />
                  </a>
                  <a
                    href="https://www.youtube.com/@Rodrigotavella"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">Youtube Channel</span>
                    <FaYoutube size={iconSize} />
                  </a>
                </div>
              </div>

              {/* Coluna 2: Horário e Endereço */}
              <div>
                <h2 className="text-xl text-white mb-2 font-bold">E-MAIL</h2>
                <div>
                  <a
                    href="mailto:digotavela@hotmail.com"
                    className="flex items-center text-white transition duration-300 break-all hover:text-brand-200"
                  >
                    <IoMdMail size={iconSize} className="mr-2" />
                    digotavela@hotmail.com
                  </a>
                </div>
              </div>

              {/* Coluna 3: Contato e E-mail */}
              <div>
                <h2 className="text-xl text-white mb-4 font-bold">CONTACT</h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="tel:+4915234679241"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white transition duration-300 hover:text-brand-200"
                    >
                      <Phone size={iconSize} className="mr-2" />
                      +49 1523 4679241
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom section */}
      <div className="bg-brand-200 mt-4">
        <div className="max-w-screen-xl mx-auto px-5 md:px-0">
          <div className="flex flex-col md:flex-row justify-center items-center py-3 text-white text-sm">
            <p className="mr-1">
              © {currentYear} Todos os direitos reservados.
            </p>
            <p className="mt-2 md:mt-0">
              Desenvolvido por{" "}
              <a
                href="https://www.instagram.com/bigaoftn/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand-50 transition duration-300"
              >
                Caua Tavella.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
