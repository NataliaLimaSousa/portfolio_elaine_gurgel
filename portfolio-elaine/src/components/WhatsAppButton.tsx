"use client";

import { MessageCircle } from "lucide-react";
import { contact } from "@/content/portfolio";

export default function WhatsAppButton() {
  // Se o número for [A CONFIRMAR], direciona com mensagem padrão
  const phoneParam = contact.whatsapp.includes("CONFIRMAR")
    ? ""
    : contact.whatsapp.replace(/\D/g, "");
  
  const textParam = encodeURIComponent(
    "Olá, Elaine! Vi seu portfólio CUIDAR+ e gostaria de conversar sobre uma oportunidade/parceria."
  );

  const href = phoneParam
    ? `https://wa.me/${phoneParam}?text=${textParam}`
    : `https://wa.me/?text=${textParam}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="Falar no WhatsApp"
      title="Conversar no WhatsApp"
    >
      <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
    </a>
  );
}
