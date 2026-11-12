"use client";

import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { awards as defaultAwards } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

export default function Awards() {
  const prefersReduced = useReducedMotion();

  let awards = defaultAwards;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.awards) {
      awards = portfolio.data.awards;
    }
  } catch {
    // Fallback
  }

  return (
    <SectionWrapper id="reconhecimentos" number="10" label="Reconhecimentos">
      <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Reconhecimentos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award, i) => (
          <motion.div
            key={i}
            className="relative card p-8 bg-mint-50 border border-transparent hover:border-sand-400/50 group overflow-hidden"
            initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            {/* Sand accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-sand-400" aria-hidden="true" />

            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-sand-400" strokeWidth={1.5} />
              <span className="text-mono text-xs text-sand-400 font-medium">
                {award.year}
              </span>
            </div>
            <h3 className="text-base font-bold text-heading mb-3 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
              {award.title}
            </h3>
            <p className="text-sm text-muted flex items-center gap-1.5">
              <Star size={14} className="text-sand-400" strokeWidth={1.5} />
              {award.grantedBy}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
