"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Atuação", href: "#atuacao" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Formação", href: "#formacao" },
  { label: "Palestras", href: "#palestras" },
  { label: "Reconhecimentos", href: "#reconhecimentos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12 lg:px-20 h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0" aria-label="CUIDAR+ — Início">
            <Image
              src="/logo-cuidar.png"
              alt="CUIDAR+ logo"
              width={180}
              height={48}
              className="h-10 w-auto md:h-12"
              priority
            />
          </a>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-semibold text-ink hover:text-teal-700 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA desktop */}
          <a
            href="#contato"
            className="hidden lg:inline-flex btn-primary !py-2.5 !px-6 !text-sm"
          >
            Fale comigo
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors z-50 cursor-pointer ${
              mobileOpen ? "text-white bg-white/10" : "text-navy-900 hover:bg-slate-100"
            }`}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu modal */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy-900/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <ul className="flex flex-col items-center gap-6 my-auto">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-bold text-white hover:text-teal-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              onClick={() => setMobileOpen(false)}
              className="mb-8 btn-primary !bg-teal-600 !text-white w-full max-w-xs justify-center"
            >
              Fale comigo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
