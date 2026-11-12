"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { management as defaultManagement } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";
import IconByName from "./IconByName";
import WhatsAppCTA from "./WhatsAppCTA";

export default function Management() {
  const prefersReduced = useReducedMotion();

  let data = defaultManagement;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.management) data = portfolio.data.management;
  } catch {
    // padrão
  }

  return (
    <SectionWrapper id="gestao" number="02" label={data.label} className="scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Coluna de apresentação */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
          <h2
            className="text-3xl md:text-4xl font-bold text-heading mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data.title}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-6">{data.intro}</p>
          <p className="flex items-start gap-3 text-sm text-muted mb-8">
            <Info size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span>{data.note}</span>
          </p>
          <WhatsAppCTA audience="gestor">{data.ctaText}</WhatsAppCTA>
        </div>

        {/* Serviços */}
        <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 list-none p-0">
          {data.services.map((service, i) => (
            <motion.li
              key={service.title}
              className="card p-7 group sm:last:col-span-2"
              initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            >
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-chip text-accent-strong transition-colors duration-300 group-hover:bg-teal-600 group-hover:text-white">
                <IconByName name={service.icon} size={28} strokeWidth={1.5} />
              </span>
              <h3
                className="text-lg font-bold text-heading mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {service.title}
              </h3>
              <p className="text-muted">{service.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
