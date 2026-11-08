"use client";

import { motion } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";
import Image from "next/image";
import { hero as defaultHero, HeroContent } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Hero() {
  const prefersReduced = useReducedMotion();
  let hero: HeroContent = defaultHero;

  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.hero) {
      hero = portfolio.data.hero;
    }
  } catch {
    // Fallback padrão
  }

  const fadeUp = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-surface pt-20"
    >
      {/* Watermark monogram */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-extrabold text-heading opacity-[0.04] select-none pointer-events-none leading-none"
        aria-hidden="true"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        EG
      </div>

      {/* Subtle gradient glow */}
      <div
        className="absolute top-0 right-0 w-[60%] h-[60%] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(42,140,130,0.3), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="order-2 lg:order-1">
            <motion.p
              className="text-mono text-sm text-accent mb-6 tracking-wider"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {hero.label}
            </motion.p>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-heading leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {hero.title}
            </motion.h1>

            <motion.p
              className="text-lg text-muted mb-8 max-w-xl"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href={hero.ctaPrimary.href} className="btn-primary">
                {hero.ctaPrimary.text}
                <ArrowDown size={18} />
              </a>
              <a href={hero.ctaSecondary.href} className="btn-secondary">
                <MessageCircle size={18} />
                {hero.ctaSecondary.text}
              </a>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {hero.badges.map((badge) => (
                <span key={badge} className="badge">
                  <span className="text-accent font-bold">+</span>
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right column — Photo */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-teal-600/20" aria-hidden="true" />
              <div className="absolute -inset-8 rounded-full border border-teal-600/10" aria-hidden="true" />

              {/* Care Line start decoration */}
              <svg
                className="absolute -right-12 top-1/2 w-24 h-48 -translate-y-1/2 hidden lg:block"
                viewBox="0 0 96 192"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 0 96 C 48 96, 48 0, 96 0 M 0 96 C 48 96, 48 192, 96 192"
                  stroke="#2A8C82"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
              </svg>

              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-surface shadow-xl bg-chip">
                <Image
                  src={hero.photo || "/elaine-photo.jpg"}
                  alt="Elaine Gurgel — Enfermeira especialista em Centro Cirúrgico e CME"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
