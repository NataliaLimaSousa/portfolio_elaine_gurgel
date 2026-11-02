"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Cpu,
  HeartPulse,
  GraduationCap,
  Workflow,
} from "lucide-react";
import { expertise } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Activity,
  Cpu,
  HeartPulse,
  GraduationCap,
  Workflow,
};

export default function Expertise() {
  const prefersReduced = useReducedMotion();

  return (
    <SectionWrapper id="atuacao" number="02" label="Áreas de atuação">
      <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Como posso ajudar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertise.map((card, i) => {
          const Icon = iconMap[card.icon] || ShieldCheck;
          return (
            <motion.div
              key={i}
              className="card p-8 border border-transparent hover:border-teal-600/30 group cursor-default"
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={prefersReduced ? {} : { y: -4 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mb-5 group-hover:bg-teal-600 transition-colors duration-300">
                <Icon
                  size={28}
                  className="text-teal-600 group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {card.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
