import type { Metadata } from "next";

// Área administrativa: não deve aparecer em buscadores
export const metadata: Metadata = {
  title: "Acesso restrito | CUIDAR+",
  robots: { index: false, follow: false },
};

export default function RestritoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
