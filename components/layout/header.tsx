"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createPolyglot } from "@/utils/polyglot";
import { useLanguage } from "@/context/languageContext";
import { workshopsEnabled } from "@/utils/workshops";

export default function Header() {
  const [navbar, setNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const polyglot = createPolyglot(language);
  const languages = ["it", "de", "en"];

  useEffect(() => {
    const changeBackground = () => {
      setNavbar(window.scrollY >= 30);
    };
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  const navigation = [
    { name: polyglot.t("header.home"), href: "/#" },
    { name: polyglot.t("header.about"), href: "/about" },
    { name: polyglot.t("header.experience"), href: "/experience" },
    { name: polyglot.t("header.danceexp"), href: "/danceExperience" },
    {
      name: polyglot.t("header.academicFormation"),
      href: "/academicFormation",
    },
    { name: polyglot.t("header.gallery"), href: "/gallery" },
    ...(workshopsEnabled
      ? [{ name: polyglot.t("header.workshops"), href: "/workshops" }]
      : []),
  ];

  return (
    <header>
      <nav
        className={`fixed z-50 top-0 left-0 w-full transition-all duration-300 ${
          navbar ? "shadow-md" : ""
        } bg-brand-500/30 px-3 sm:px-5 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-[calc(100%-2rem)] lg:max-w-6xl lg:rounded-full backdrop-blur-md`}
      >
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/img/logo-header-1.png"
              width={170}
              height={170}
              alt="Logo"
              className="h-auto w-[120px] sm:w-[140px] lg:w-[170px]"
            />
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden flex-1 items-center justify-center lg:flex lg:gap-2 xl:gap-4 2xl:gap-5">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative whitespace-nowrap text-[10px] font-semibold text-brand-500 transition-colors duration-200 sm:text-[11px] xl:text-sm
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5
                after:bg-brand-200 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Seletor de Idiomas */}
          <div className="hidden shrink-0 lg:flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as "it" | "de")}
                className={`p-0 rounded-full w-10 h-7 overflow-hidden border-2 ${
                  language === lang
                    ? "border-brand-200"
                    : "border-transparent hover:border-brand-200"
                } transition-all duration-200 flex items-center justify-center`}
                style={{ background: "transparent" }}
              >
                {lang === "it" && (
                  <Image
                    src={"/img/flags/flag-italy.webp"}
                    alt="Italian"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                )}
                {lang === "de" && (
                  <Image
                    src={"/img/flags/flag-germany.webp"}
                    alt="German"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                )}
                {lang === "en" && (
                  <Image
                    src={"/img/flags/flag-eua.webp"}
                    alt="English"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Botão Menu Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-200 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-full h-screen min-h-screen max-h-screen bg-brand-500 z-40 px-6 pt-28 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-12 items-center">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-brand-100 text-lg font-medium hover:underline"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang as "it" | "de");
                      setMobileMenuOpen(false);
                    }}
                    className={`p-0 rounded-full w-8 h-8 overflow-hidden border-2 ${
                      language === lang
                        ? "border-brand-200"
                        : "border-transparent hover:border-brand-200"
                    } flex items-center justify-center`}
                    style={{ background: "transparent" }}
                  >
                    {lang === "it" && (
                      <Image
                        src={"/img/flags/flag-italy.webp"}
                        alt="Italian"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    )}
                    {lang === "de" && (
                      <Image
                        src={"/img/flags/flag-germany.webp"}
                        alt="German"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    )}
                    {lang === "en" && (
                      <Image
                        src={"/img/flags/flag-eua.webp"}
                        alt="English"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
