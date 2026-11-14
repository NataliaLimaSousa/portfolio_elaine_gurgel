"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { contact as defaultContact, contactForm as defaultContactForm } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppCTA from "./WhatsAppCTA";

export default function Contact() {
  const prefersReduced = useReducedMotion();

  let contact = defaultContact;
  let contactForm = defaultContactForm;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.contact) {
      contact = portfolio.data.contact;
      contactForm = {
        title: portfolio.data.contact.sectionTitle || defaultContactForm.title,
        subtitle: portfolio.data.contact.subtitle || defaultContactForm.subtitle,
        reasons: portfolio.data.contact.reasons || defaultContactForm.reasons,
      };
    }
  } catch {
    // Fallback
  }

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="bg-navy-900 py-20 md:py-28 px-6 md:px-12 lg:px-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl">
        <p className="section-label !text-[#7FD6CB]">11 — Contato</p>

        <div className="grid grid-cols-1 gap-12 max-w-2xl">
          {/* Left: info */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              id="contato-titulo"
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {contactForm.title}
            </h2>
            <p className="text-teal-100 text-lg mb-8 leading-relaxed">{contactForm.subtitle}</p>

            {/* WhatsApp por público */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 mb-3">
              <WhatsAppCTA audience="paciente">Sou paciente</WhatsAppCTA>
              <WhatsAppCTA audience="gestor">Sou médico ou gestor</WhatsAppCTA>
            </div>
            <p className="text-sm text-teal-100/80 mb-10">
              WhatsApp / celular: <span className="font-semibold text-white">{contact.whatsapp}</span>
            </p>

            <ul className="space-y-6 list-none p-0">
              {/* E-mail */}
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <Mail size={22} className="text-accent group-hover:text-white transition-colors" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-100/70 text-mono">E-mail</p>
                    <p className="font-semibold">{contact.email}</p>
                  </div>
                </a>
              </li>

              {/* LinkedIn */}
              <li>
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <svg
                      className="w-5 h-5 text-accent group-hover:text-white transition-colors fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-teal-100/70 text-mono">LinkedIn</p>
                    <p className="font-semibold">{contact.linkedin}</p>
                  </div>
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>

              {/* Lattes */}
              <li>
                <a
                  href={contact.lattesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                    <ExternalLink size={22} className="text-accent group-hover:text-white transition-colors" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-100/70 text-mono">Currículo Lattes</p>
                    <p className="font-semibold">{contact.lattes}</p>
                  </div>
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
