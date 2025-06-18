import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
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
                <Link href="/" className="block max-w-[20rem] md:max-w-[16rem]">
                  <Image
                    src="/img/logo-header.png"
                    width={150}
                    height={150}
                    alt="Tojiru desenvolvedor web"
                    title="Tojiru significa abrir, se livrar do que te prende."
                    className="w-full h-auto"
                  />
                </Link>
                <div className="flex gap-3 mt-4">
                  <a
                    href="https://www.linkedin.com/in/caua-tavella/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <FaLinkedinIn size={iconSize} />
                  </a>
                  <a
                    href="https://www.instagram.com/tojiruu77/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <FaInstagram size={iconSize} />
                  </a>
                  <a
                    href="https://api.whatsapp.com/send/?phone=5519971265295&text=Olá%2C%20Cauã%21%0AEstou%20interessado%20em%20contratar%20seus%20serviços%20de%20desenvolvimento%20de%20landing%20pages.%20Quero%20criar%20uma%20página%20moderna%2C%20responsiva%20e%20focada%20em%20conversão%20para%20transformar%20visitantes%20em%20clientes.%20Você%20poderia%20me%20passar%20mais%20informações%20sobre%20o%20processo%2C%20prazos%20e%20valores%3F%0A%0AObrigado%21&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white rounded-full text-white hover:bg-white hover:text-brand-100 transition duration-300"
                  >
                    <span className="sr-only">WhatsApp</span>
                    <FaWhatsapp size={iconSize} />
                  </a>
                </div>
              </div>

              {/* Coluna 2: Horário e Endereço */}
              <div>
                <h2 className="text-xl text-white mb-2 font-bold">E-MAIL</h2>
                <div>
                  <a
                    href="mailto:cauatavellaprofissional@gmail.com"
                    className="flex items-center text-white transition duration-300 break-all hover:text-brand-200"
                  >
                    <IoMdMail size={iconSize} className="mr-2" />
                    cauatavellaprofissional@gmail.com
                  </a>
                </div>
              </div>

              {/* Coluna 3: Contato e E-mail */}
              <div>
                <h2 className="text-xl text-white mb-4 font-bold">TELEFONE</h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://api.whatsapp.com/send/?phone=5519971265295&text=Olá%2C%20Cauã%21%0AEstou%20interessado%20em%20contratar%20seus%20serviços%20de%20desenvolvimento%20de%20landing%20pages.%20Quero%20criar%20uma%20página%20moderna%2C%20responsiva%20e%20focada%20em%20conversão%20para%20transformar%20visitantes%20em%20clientes.%20Você%20poderia%20me%20passar%20mais%20informações%20sobre%20o%20processo%2C%20prazos%20e%20valores%3F%0A%0AObrigado%21&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white transition duration-300 hover:text-brand-200"
                    >
                      <FaWhatsapp size={iconSize} className="mr-2" />
                      +55 (19) 97126-5295
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
                href="https://www.instagram.com/tojiruu77/"
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
