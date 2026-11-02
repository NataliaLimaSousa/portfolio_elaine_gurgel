"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CareLine() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-3 md:left-6 lg:left-8 bottom-0 w-8 pointer-events-none z-30 hidden sm:block"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 32 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Background track line */}
        <path
          d="M 16,0 Q 28,250 16,500 T 16,1000"
          stroke="#2A8C82"
          strokeWidth="1.5"
          strokeOpacity="0.12"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {/* Animated progressive Care Line */}
        <motion.path
          d="M 16,0 Q 28,250 16,500 T 16,1000"
          stroke="#2A8C82"
          strokeWidth="2"
          strokeOpacity="0.65"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: scaleY }}
        />
      </svg>
    </div>
  );
}
