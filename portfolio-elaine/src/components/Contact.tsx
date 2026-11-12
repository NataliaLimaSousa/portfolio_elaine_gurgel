"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ExternalLink, Send, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";
import { contact as defaultContact, contactForm as defaultContactForm } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import WhatsAppCTA from "./WhatsAppCTA";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-navy-700 border border-navy-700 text-white placeholder:text-teal-100/60 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const startedAt = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

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
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          reason: data.get("reason"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"), // campo-isca (deve ficar vazio)
          startedAt: startedAt.current,
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        setStatus("error");
        setFeedback(json.message || "Não foi possível enviar agora. Tente pelo WhatsApp ou e-mail.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setFeedback("Sem conexão no momento. Tente novamente ou fale pelo WhatsApp.");
    }
  };

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="bg-navy-900 py-20 md:py-28 px-6 md:px-12 lg:px-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl">
        <p className="section-label !text-[#7FD6CB]">11 — Contato</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
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

          {/* Right: form */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {status === "success" ? (
              <div
                role="status"
                className="flex flex-col items-center justify-center h-full text-center py-16"
              >
                <CheckCircle size={64} className="text-accent mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Mensagem enviada!
                </h3>
                <p className="text-teal-100">Obrigada pelo contato. Responderei em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" aria-describedby="form-aviso">
                <div>
                  <label htmlFor="name" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    className={inputClass}
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
                    maxLength={254}
                    autoComplete="email"
                    className={inputClass}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm text-teal-100 mb-1.5 text-mono">
                    Assunto
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    defaultValue=""
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecione o assunto
                    </option>
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
                    minLength={10}
                    maxLength={2000}
                    className={`${inputClass} resize-none`}
                    placeholder="Como posso ajudar?"
                  />
                </div>

                {/* Campo-isca anti-robô: invisível para pessoas */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Não preencha este campo</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <p
                  id="form-aviso"
                  className="flex items-start gap-2.5 text-xs text-teal-100/90 leading-relaxed"
                >
                  <ShieldAlert size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    Não envie exames, laudos, diagnósticos ou outros dados de saúde por este formulário.
                    Eles serão tratados presencialmente ou em canal adequado.
                  </span>
                </p>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-navy-700 bg-navy-700 accent-teal-600"
                  />
                  <label htmlFor="consent" className="text-sm text-teal-100 leading-relaxed cursor-pointer">
                    Li e concordo com o uso do meu nome, e-mail e mensagem para que Elaine Gurgel
                    responda a este contato, conforme a{" "}
                    <Link
                      href="/privacidade"
                      target="_blank"
                      className="underline text-white hover:text-teal-100"
                    >
                      Política de Privacidade
                      <span className="sr-only"> (abre em nova aba)</span>
                    </Link>
                    .
                  </label>
                </div>

                <div aria-live="assertive" className="min-h-0">
                  {status === "error" && (
                    <p
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl border border-red-400/50 bg-red-950/50 p-3.5 text-sm text-red-100"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{feedback}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary !bg-teal-600 hover:!bg-teal-700 w-full justify-center disabled:opacity-60 cursor-pointer"
                >
                  {status === "loading" ? "Enviando..." : "Enviar mensagem"}
                  <Send size={18} aria-hidden="true" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
