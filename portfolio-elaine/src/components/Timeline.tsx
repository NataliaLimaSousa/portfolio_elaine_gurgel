"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { timeline as defaultTimeline } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { publicOnly } from "@/lib/pending";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

export default function Timeline() {
  const prefersReduced = useReducedMotion();

  let timeline = defaultTimeline;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.timeline) {
      timeline = portfolio.data.timeline;
    }
  } catch {
    // Fallback padrão
  }

  timeline = publicOnly(timeline, (t) => [t.period, t.institution, t.role, t.highlights]);

  return (
    <SectionWrapper id="trajetoria" number="05" label="Trajetória" className="bg-mint-50">
      <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Minha trajetória profissional
      </h2>

      <div className="relative">
        {/* Linha vertical */}
        <div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-teal-600/20 -translate-x-1/2"
          aria-hidden="true"
        />

        <div className="space-y-12">
          {timeline.map((entry, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={prefersReduced ? {} : { opacity: 0, x: isLeft ? -24 : 24 }}
                whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] z-10 ${
                    entry.isCurrent
                      ? "bg-teal-600 border-chip"
                      : "bg-surface border-teal-600"
                  }`}
                  aria-hidden="true"
                />

                {/* Content card */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-3rem)] ${isLeft ? "md:text-right" : "md:text-left"}`}>
                  <div className="card p-6 inline-block text-left w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase size={18} className="text-accent shrink-0" strokeWidth={1.5} />
                      <span className="text-mono text-xs text-accent-strong font-medium">
                        {entry.period}
                      </span>
                      {entry.isCurrent && (
                        <span className="badge !text-xs !py-0.5 !px-2">
                          Atual
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {entry.role}
                    </h3>
                    <p className="text-sm font-semibold text-accent-strong mb-2">
                      {entry.institution}
                    </p>
                    <p className="text-sm text-muted leading-relaxed">
                      {entry.highlights}
                    </p>
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
