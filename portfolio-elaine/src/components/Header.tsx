"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Pacientes", href: "#paciente" },
  { label: "Gestão", href: "#gestao" },
  { label: "Sobre", href: "#sobre" },
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
            ? "bg-surface/85 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12 lg:px-20 h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0" aria-label="CUIDAR+ — Início">
            <Image
              src="/logo-cuidar.png"
              alt="CUIDAR+ logo"
              width={180}
              height={48}
              className="logo-adaptive h-10 w-auto md:h-12"
              priority
            />
          </a>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-semibold text-ink hover:text-accent-strong transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Alternar tema + CTA desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <a href="#contato" className="btn-primary !py-2.5 !px-6 !text-sm">
              Fale comigo
            </a>
          </div>

          {/* Mobile: tema + menu */}
          <div className="lg:hidden flex items-center gap-1 z-50">
            <ThemeToggle onDark={mobileOpen} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mobileOpen ? "text-white bg-white/10" : "text-heading hover:bg-chip"
            }`}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          </div>
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
