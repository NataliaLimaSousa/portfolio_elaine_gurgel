"use client";

import { contact as defaultContact } from "@/content/portfolio";
import WhatsAppIcon from "./WhatsAppIcon";
import { usePortfolio } from "@/context/PortfolioContext";

interface WhatsAppButtonProps {
  customPhone?: string;
  customText?: string;
}

export default function WhatsAppButton({ customPhone, customText }: WhatsAppButtonProps) {
  let contact = defaultContact;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.data?.contact) {
      contact = portfolio.data.contact;
    }
  } catch {
    // Caso esteja fora do provider, usa o padrão
  }

  // Número solicitado: 85999406173
  const rawNumber = customPhone || contact.whatsappNumber || "558599406173";
  const cleanDigits = rawNumber.replace(/\D/g, "");
  const phoneParam = cleanDigits.startsWith("55") ? cleanDigits : `55${cleanDigits}`;

  const textParam = encodeURIComponent(
    customText || "Olá, Elaine! Vi seu portfólio CUIDAR+ e gostaria de conversar sobre uma oportunidade/parceria."
  );

  const href = `https://wa.me/${phoneParam}?text=${textParam}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="Falar via WhatsApp / Celular: (85) 99940-6173"
      title="Falar via WhatsApp / Celular: (85) 99940-6173"
    >
      <div className="relative flex items-center justify-center">
        {/* Logotipo oficial do WhatsApp */}
        <WhatsAppIcon size={34} className="group-hover:scale-110 transition-transform text-white" />

        {/* Indicador de onda de chamada / status ativo */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-emerald-600"></span>
        </span>
      </div>

      {/* Tooltip moderno */}
      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
        Falar no WhatsApp: (85) 99940-6173
      </span>
    </a>
  );
}
