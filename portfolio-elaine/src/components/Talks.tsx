"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, FileText, LayoutGrid } from "lucide-react";
import {
  talks as defaultTalks,
  talkFilters as defaultFilters,
  talkHighlights as defaultHighlights,
} from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

const formatIcon: Record<string, React.ElementType> = {
  Palestra: Mic,
  Congresso: LayoutGrid,
  Pôster: FileText,
};

export default function Talks() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const prefersReduced = useReducedMotion();

  let talks = defaultTalks;
  let talkFilters = defaultFilters;
  let talkHighlights = defaultHighlights;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data) {
      if (portfolio.data.talks) talks = portfolio.data.talks;
      if (portfolio.data.talkFilters) talkFilters = portfolio.data.talkFilters;
      if (portfolio.data.talkHighlights) talkHighlights = portfolio.data.talkHighlights;
    }
  } catch {
    // Fallback
  }

  const filteredTalks =
    activeFilter === "Todos"
      ? talks
      : talks.filter((t) => t.filter === activeFilter);

  return (
    <SectionWrapper id="palestras" number="06" label="Palestras e produção científica">
      <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Palestras e produção científica
      </h2>

      {/* Speaker highlights */}
      {talkHighlights && talkHighlights.length > 0 && (
        <p className="text-muted mb-8">
          Palestrante convidada:{" "}
          {talkHighlights.map((h, i) => (
            <span key={i}>
              <strong className="text-ink">{h}</strong>
              {i < talkHighlights.length - 1 && " · "}
            </span>
          ))}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filtrar por tema">
        {talkFilters.map((filter) => (
          <button
            key={filter}
            role="tab"
            aria-selected={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeFilter === filter
                ? "bg-navy-700 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Talk list */}
      <div className="space-y-4" role="tabpanel">
        {filteredTalks.map((talk, i) => {
          const Icon = formatIcon[talk.format] || Mic;
          return (
            <motion.div
              key={`${talk.title}-${i}`}
              className="card p-5 flex flex-col md:flex-row md:items-center gap-4 border border-transparent hover:border-teal-600/30"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              layout
            >
              <div className="flex items-center gap-3 md:w-32 shrink-0">
                <Icon size={18} className="text-teal-600" strokeWidth={1.5} />
                <span className="text-mono text-xs text-teal-700">{talk.year}</span>
              </div>
              <div className="flex-1">
                <p className="text-ink font-semibold text-sm leading-snug">{talk.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge !text-xs">{talk.format}</span>
                <span className="badge !text-xs !bg-navy-700/10 !text-navy-700">{talk.filter}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTalks.length === 0 && (
        <p className="text-center text-muted py-12">Nenhuma palestra encontrada nesta categoria.</p>
      )}
    </SectionWrapper>
  );
}
