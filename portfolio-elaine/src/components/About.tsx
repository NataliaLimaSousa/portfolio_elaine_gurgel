"use client";

import { ExternalLink } from "lucide-react";
import { about as defaultAbout, contact as defaultContact } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import SectionWrapper from "./SectionWrapper";

export default function About() {
  let about = defaultAbout;
  let contact = defaultContact;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data) {
      if (portfolio.data.about) about = portfolio.data.about;
      if (portfolio.data.contact) contact = portfolio.data.contact;
    }
  } catch {
    // Fallback padrão
  }

  return (
    <SectionWrapper id="sobre" number="01" label="Sobre" className="bg-mint-50">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Text */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            {about.sectionTitle || "Quem sou eu"}
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-ink mb-5 last:mb-0">
              {p}
            </p>
          ))}

          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href={contact.lattesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-sm"
            >
              Currículo Lattes
              <ExternalLink size={16} />
            </a>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-sm"
            >
              LinkedIn
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Quote */}
        <div className="lg:col-span-2 flex items-center">
          <blockquote className="relative pl-6 border-l-4 border-teal-600">
            <p className="text-2xl md:text-3xl font-bold text-heading italic leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
              &ldquo;{about.quote}&rdquo;
            </p>
            <footer className="mt-4 text-mono text-sm text-muted">
              — {about.quoteAuthor || "Elaine Gurgel"}
            </footer>
          </blockquote>
        </div>
      </div>
    </SectionWrapper>
  );
}
