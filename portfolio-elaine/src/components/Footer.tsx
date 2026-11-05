"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { footer as defaultFooter, contact as defaultContact } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Footer() {
  let footer = defaultFooter;
  let contact = defaultContact;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data) {
      if (portfolio.data.footer) footer = portfolio.data.footer;
      if (portfolio.data.contact) contact = portfolio.data.contact;
    }
  } catch {
    // Fallback
  }

  return (
    <footer className="bg-navy-900 border-t border-navy-700/60 py-16 px-6 md:px-12 lg:px-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-navy-700/60">
          {/* Logo Negative / White */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Image
                src="/logo-cuidar.png"
                alt="CUIDAR+ logo"
                width={160}
                height={42}
                className="brightness-0 invert h-9 w-auto"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white tracking-wide">
                {footer.tagline}
              </p>
              <p className="text-mono text-xs text-teal-100/70">
                {footer.author} · {footer.coren}
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-100/80">
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
            <a href="#atuacao" className="hover:text-white transition-colors">Atuação</a>
            <a href="#trajetoria" className="hover:text-white transition-colors">Trajetória</a>
            <a href="#formacao" className="hover:text-white transition-colors">Formação</a>
            <a href="#palestras" className="hover:text-white transition-colors">Palestras</a>
            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-100/60">
          <p>© {footer.year} Elaine Gurgel · Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <a
              href={contact.lattesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-100 transition-colors"
            >
              Lattes
            </a>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-100 transition-colors"
            >
              LinkedIn
            </a>
            <button
              onClick={() => alert("Aviso de Privacidade: Este site não utiliza cookies invasivos de rastreamento de dados de terceiros em conformidade com a LGPD.")}
              className="hover:text-teal-100 transition-colors underline cursor-pointer"
            >
              Aviso de privacidade
            </button>

            {/* Link bem restrito para a Área Restrita */}
            <Link
              href="/restrito"
              className="hover:text-teal-200 text-teal-100/40 hover:opacity-100 transition-all flex items-center gap-1.5 text-[11px] font-medium"
              title="Acesso Restrito Administrativo"
            >
              <Lock size={11} className="opacity-70" />
              <span>Acesso Restrito</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
