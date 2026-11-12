"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronDown, BookOpen } from "lucide-react";
import { education as defaultEducation, courses as defaultCourses } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionWrapper from "./SectionWrapper";

export default function Education() {
  const [showCourses, setShowCourses] = useState(false);
  const prefersReduced = useReducedMotion();

  let education = defaultEducation;
  let courses = defaultCourses;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data) {
      if (portfolio.data.education) education = portfolio.data.education;
      if (portfolio.data.courses) courses = portfolio.data.courses;
    }
  } catch {
    // Fallback
  }

  return (
    <SectionWrapper id="formacao" number="06" label="Formação e certificações">
      <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Formação acadêmica
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {education.map((entry, i) => (
          <motion.div
            key={i}
            className="card p-6 border border-transparent hover:border-teal-600/30"
            initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-accent" strokeWidth={1.5} />
              <span className="text-mono text-xs text-accent-strong">
                {entry.period}
              </span>
            </div>
            <h3 className="text-base font-bold text-heading mb-2 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
              {entry.title}
            </h3>
            <p className="text-sm text-muted">{entry.institution}</p>
          </motion.div>
        ))}
      </div>

      {/* Accordion: Cursos complementares */}
      <div className="card overflow-hidden border border-chip">
        <button
          onClick={() => setShowCourses(!showCourses)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-mint-50 transition-colors cursor-pointer"
          aria-expanded={showCourses}
          aria-controls="courses-panel"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={22} className="text-accent" strokeWidth={1.5} />
            <span className="text-lg font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
              Cursos complementares
            </span>
            <span className="badge !text-xs">{courses.length} cursos</span>
          </div>
          <motion.div
            animate={{ rotate: showCourses ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={24} className="text-accent" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showCourses && (
            <motion.div
              id="courses-panel"
              initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-chip">
                        <th className="text-left py-3 pr-4 text-mono text-xs text-accent-strong font-medium">Ano</th>
                        <th className="text-left py-3 pr-4 text-mono text-xs text-accent-strong font-medium">Curso</th>
                        <th className="text-left py-3 pr-4 text-mono text-xs text-accent-strong font-medium">Instituição</th>
                        <th className="text-left py-3 text-mono text-xs text-accent-strong font-medium">Carga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, i) => (
                        <tr key={i} className="border-b border-chip last:border-0 hover:bg-mint-50/50">
                          <td className="py-3 pr-4 text-mono text-xs text-muted whitespace-nowrap">{course.year}</td>
                          <td className="py-3 pr-4 text-ink">{course.title}</td>
                          <td className="py-3 pr-4 text-muted">{course.institution}</td>
                          <td className="py-3 text-mono text-xs text-muted whitespace-nowrap">{course.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
