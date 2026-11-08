"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, ExternalLink, Send, CheckCircle, Phone } from "lucide-react";
import { contact as defaultContact, contactForm as defaultContactForm } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const whatsappClean = (contact.whatsappNumber || "558599406173").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappClean.startsWith("55") ? whatsappClean : `55${whatsappClean}`}?text=${encodeURIComponent(
    "Olá, Elaine! Vi seu portfólio CUIDAR+ e gostaria de conversar."
  )}`;

  return (
    <section id="contato" className="bg-navy-900 py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <p className="section-label !text-accent">09 — Contato</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: info */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {contactForm.title}
            </h2>
            <p className="text-teal-100 text-lg mb-10 leading-relaxed">
              {contactForm.subtitle}
            </p>

            <div className="space-y-6">
              {/* Celular / WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <Phone size={22} className="text-emerald-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-teal-100/60 text-mono">WhatsApp / Celular</p>
                  <p className="font-semibold">{contact.whatsapp || "(85) 99940-6173"}</p>
                </div>
              </a>

              {/* E-mail */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <Mail size={22} className="text-accent group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-teal-100/60 text-mono">E-mail</p>
                  <p className="font-semibold">{contact.email}</p>
                </div>
              </a>

              {/* LinkedIn */}
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
                  <p className="text-xs text-teal-100/60 text-mono">LinkedIn</p>
                  <p className="font-semibold">{contact.linkedin}</p>
                </div>
              </a>

              {/* Lattes */}
              <a
                href={contact.lattesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-white hover:text-teal-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <ExternalLink size={22} className="text-accent group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-teal-100/60 text-mono">Currículo Lattes</p>
                  <p className="font-semibold">{contact.lattes}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <CheckCircle size={64} className="text-accent mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Mensagem enviada!
                </h3>
                <p className="text-teal-100">
                  Obrigada pelo contato. Responderei em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-navy-700 border border-navy-700 text-white placeholder-muted focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-navy-700 border border-navy-700 text-white placeholder-muted focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    Motivo
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-navy-700 border border-navy-700 text-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Selecione um motivo</option>
                    {contactForm.reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-navy-700 border border-navy-700 text-white placeholder-muted focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors resize-none"
                    placeholder="Conte sobre seu projeto ou convite..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary !bg-teal-600 hover:!bg-teal-700 w-full justify-center disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Enviando..." : "Enviar mensagem"}
                  <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
