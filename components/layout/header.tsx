"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createPolyglot } from "@/utils/polyglot";
import { useLanguage } from "@/context/languageContext";

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
  ];

  return (
    <header>
      <nav
        className={`fixed z-50 top-0 left-0 w-full transition-all duration-300 ${
          navbar ? "shadow-md" : ""
        } bg-brand-500 px-5 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl lg:rounded-full`}
      >
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="pr-20">
            <Image
              src="/img/logo-header.png"
              width={50}
              height={50}
              alt="Logo"
              className="rounded-full"
            />
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden lg:flex gap-6">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-brand-100 font-semibold hover:underline"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Seletor de Idiomas */}
          <div className="hidden lg:flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as "it" | "de")}
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  language === lang
                    ? "bg-brand-200 text-brand-500"
                    : "bg-brand-100 text-white hover:bg-blue-400 hover:text-brand-500"
                } transition-all duration-200`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Botão Menu Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-100 focus:outline-none"
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
            className="lg:hidden fixed top-0 left-0 w-full h-screen bg-brand-100 z-40 px-6 pt-28"
          >
            <div className="flex flex-col gap-20 items-center">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-lg font-medium hover:underline"
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
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      language === lang
                        ? "bg-brand-200 text-brand-500"
                        : "bg-brand-100 text-white hover:bg-blue-400 hover:text-brand-500"
                    }`}
                  >
                    {lang.toUpperCase()}
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
