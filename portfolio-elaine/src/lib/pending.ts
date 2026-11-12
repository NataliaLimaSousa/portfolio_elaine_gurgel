import type { PortfolioData } from "./types";

/**
 * Informações marcadas como "[A CONFIRMAR]" ainda não foram validadas por Elaine.
 * No site público elas ficam ocultas (os dados continuam salvos e visíveis no painel
 * administrativo para revisão). Para voltar a exibi-las, troque HIDE_PENDING para false.
 */
export const HIDE_PENDING = true;

const PENDING_REGEX = /\[?\s*A CONFIRMAR\s*\]?/i;

export function hasPending(...values: Array<string | undefined | null>): boolean {
  return values.some((v) => typeof v === "string" && PENDING_REGEX.test(v));
}

/** Filtra, no site público, itens que contenham texto pendente de confirmação. */
export function publicOnly<T>(items: T[], pick: (item: T) => Array<string | undefined | null>): T[] {
  if (!HIDE_PENDING) return items;
  return items.filter((item) => !hasPending(...pick(item)));
}

/**
 * Versão pública do conteúdo: remove itens pendentes de confirmação para que
 * nem apareçam no código-fonte da página. O painel administrativo recebe o conteúdo completo.
 */
export function toPublicContent(content: PortfolioData): PortfolioData {
  if (!HIDE_PENDING) return content;
  return {
    ...content,
    timeline: publicOnly(content.timeline, (t) => [t.period, t.institution, t.role, t.highlights]),
    talks: publicOnly(content.talks, (t) => [t.year, t.title]),
    events: publicOnly(content.events, (e) => [e.year, e.title]),
    footer: hasPending(content.footer.coren) ? { ...content.footer, coren: "" } : content.footer,
  };
}
