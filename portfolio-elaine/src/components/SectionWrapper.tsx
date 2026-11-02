"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  label?: string;
  number?: string;
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  label,
  number,
}: SectionWrapperProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={`px-6 md:px-12 lg:px-20 py-20 md:py-28 ${className}`}
      initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        {label && (
          <p className="section-label">
            {number} — {label}
          </p>
        )}
        {children}
      </div>
    </motion.section>
  );
}
