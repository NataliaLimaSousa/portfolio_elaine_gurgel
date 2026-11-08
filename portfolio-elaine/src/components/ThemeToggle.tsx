"use client";

import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  /** Usa cores claras (para quando estiver sobre fundo escuro, ex.: menu mobile aberto). */
  onDark?: boolean;
}

export default function ThemeToggle({ onDark = false }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
  };

  // Os dois ícones ficam no HTML; o CSS mostra o correto conforme html[data-theme],
  // então não há diferença entre servidor e navegador (sem erro de hidratação).
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar entre modo claro e modo escuro"
      title="Alternar modo claro / escuro"
      className={`theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
        onDark ? "text-white hover:bg-white/10" : "text-heading hover:bg-chip"
      }`}
    >
      <Sun size={22} strokeWidth={1.75} className="icon-sun" aria-hidden="true" />
      <Moon size={22} strokeWidth={1.75} className="icon-moon" aria-hidden="true" />
    </button>
  );
}
