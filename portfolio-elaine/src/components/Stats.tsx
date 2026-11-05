"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats as defaultStats } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function AnimatedCounter({ value, inView, reduced }: { value: number; inView: boolean; reduced: boolean }) {
  const [count, setCount] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) {
      return;
    }
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, reduced]);

  return <span>{reduced ? value : count}</span>;
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();

  let stats = defaultStats;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.stats) {
      stats = portfolio.data.stats;
    }
  } catch {
    // Padrão
  }

  return (
    <section
      ref={ref}
      className="gradient-brand py-16 md:py-20"
      aria-label="Números de destaque"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              animate={inView && !prefersReduced ? { opacity: 1, y: 0 } : prefersReduced ? {} : undefined}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                <AnimatedCounter value={stat.value} inView={inView} reduced={prefersReduced} />
              </p>
              <p className="text-sm text-teal-100 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
