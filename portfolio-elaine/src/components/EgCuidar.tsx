"use client";

import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { egCuidar as defaultEgCuidar } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";
import IconByName from "./IconByName";
import WhatsAppCTA from "./WhatsAppCTA";

export default function EgCuidar() {
  const prefersReduced = useReducedMotion();

  let data = defaultEgCuidar;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.egCuidar) data = portfolio.data.egCuidar;
  } catch {
    // padrão
  }

  return (
    <SectionWrapper
      id="paciente"
      number="01"
      label={data.label}
      className="bg-mint-50 scroll-mt-20"
    >
      <div className="max-w-3xl mb-12">
        <h2
          className="text-3xl md:text-4xl font-bold text-heading mb-5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {data.title}
        </h2>
        <p className="text-lg text-muted leading-relaxed">{data.intro}</p>
      </div>

      <ol className="grid grid-cols-1 lg:grid-cols-3 gap-6 list-none p-0">
        {data.phases.map((phase, i) => (
          <motion.li
            key={phase.phase}
            className="card p-8 flex flex-col"
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-chip text-accent-strong">
                <IconByName name={phase.icon} size={28} strokeWidth={1.5} />
              </span>
              <span className="text-mono text-sm text-accent" aria-hidden="true">
                Etapa {i + 1}
              </span>
            </div>
            <h3
              className="text-xl font-bold text-heading mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {phase.phase}
            </h3>
            <p className="text-muted mb-5">{phase.summary}</p>
            <ul className="space-y-3">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink">
                  <Check
                    size={18}
                    className="mt-1 shrink-0 text-accent"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <p className="flex items-start gap-3 text-sm text-muted max-w-2xl">
          <Info size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <span>{data.note}</span>
        </p>
        <WhatsAppCTA audience="paciente" className="self-start lg:ml-auto">
          {data.ctaText}
        </WhatsAppCTA>
      </div>
    </SectionWrapper>
  );
}
