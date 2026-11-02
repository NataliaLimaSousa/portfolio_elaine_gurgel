"use client";

import { GraduationCap, ArrowRight } from "lucide-react";
import { teaching } from "@/content/portfolio";
import SectionWrapper from "./SectionWrapper";

export default function Teaching() {
  return (
    <SectionWrapper id="docencia" number="05" label="Docência" className="bg-mint-50">
      <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12" style={{ fontFamily: "var(--font-heading)" }}>
        Docência e educação
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {teaching.entries.map((entry, i) => (
          <div key={i} className="card p-8 border border-transparent hover:border-teal-600/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <GraduationCap size={24} className="text-teal-600" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900" style={{ fontFamily: "var(--font-heading)" }}>
                  {entry.institution}
                </h3>
                <p className="text-mono text-xs text-teal-700">{entry.period}</p>
              </div>
            </div>
            <p className="text-ink leading-relaxed">{entry.description}</p>
          </div>
        ))}
      </div>

      {/* Courses taught */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-navy-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Cursos ministrados
        </h3>
        <ul className="space-y-2">
          {teaching.coursesTaught.map((course, i) => (
            <li key={i} className="flex items-start gap-2 text-ink">
              <span className="text-teal-600 font-bold mt-0.5">+</span>
              {course}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="card p-8 gradient-brand text-center">
        <p className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          {teaching.cta}
        </p>
        <a href="#contato" className="btn-primary !bg-white !text-navy-700 hover:!bg-teal-100">
          Convide para uma aula
          <ArrowRight size={18} />
        </a>
      </div>
    </SectionWrapper>
  );
}
