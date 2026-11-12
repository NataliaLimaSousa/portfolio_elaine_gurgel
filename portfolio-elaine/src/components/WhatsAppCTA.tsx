"use client";

import { MessageCircle } from "lucide-react";
import { contact as defaultContact } from "@/content/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  buildWhatsAppUrl,
  DEFAULT_MANAGER_MESSAGE,
  DEFAULT_PATIENT_MESSAGE,
} from "@/lib/whatsapp";

interface WhatsAppCTAProps {
  audience: "paciente" | "gestor";
  children: React.ReactNode;
  className?: string;
}

/** Botão de WhatsApp com mensagem pré-preenchida específica para cada público. */
export default function WhatsAppCTA({ audience, children, className = "" }: WhatsAppCTAProps) {
  let contact = defaultContact;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.contact) contact = portfolio.data.contact;
  } catch {
    // fora do provider: usa o conteúdo padrão
  }

  const message =
    audience === "paciente"
      ? contact.whatsappPatientMessage || DEFAULT_PATIENT_MESSAGE
      : contact.whatsappManagerMessage || DEFAULT_MANAGER_MESSAGE;

  return (
    <a
      href={buildWhatsAppUrl(contact.whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary !bg-[#128C4A] hover:!bg-[#0E7A3F] justify-center ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {children}
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}
