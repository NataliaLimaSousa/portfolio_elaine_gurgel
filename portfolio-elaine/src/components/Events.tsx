"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { events } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

export default function Events() {
  const prefersReduced = useReducedMotion();

  return (
    <SectionWrapper id="eventos" number="07" label="Eventos organizados" className="bg-mint-50">
      <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Eventos organizados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={i}
            className="card p-6 border border-transparent hover:border-teal-600/30 group"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
            whileInView={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-teal-600" strokeWidth={1.5} />
              <span className="text-mono text-xs text-teal-700 font-medium">
                {event.year}
              </span>
            </div>
            <h3 className="text-base font-bold text-navy-900 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
