/** Monta o link wa.me com número (apenas dígitos, com DDI 55) e mensagem pré-preenchida. */
export function buildWhatsAppUrl(rawNumber: string | undefined, message: string): string {
  const digits = (rawNumber || "558599406173").replace(/\D/g, "");
  const phone = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_PATIENT_MESSAGE =
  "Olá, Elaine! Sou paciente e gostaria de saber mais sobre a navegação cirúrgica EG CUIDAR+.";

export const DEFAULT_MANAGER_MESSAGE =
  "Olá, Elaine! Sou médico(a) ou gestor(a) e gostaria de conversar sobre gestão estratégica para minha clínica ou consultório.";

export const DEFAULT_GENERAL_MESSAGE =
  "Olá, Elaine! Vi seu portfólio CUIDAR+ e gostaria de conversar.";
