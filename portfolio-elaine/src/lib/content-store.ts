import { PortfolioData } from "./types";
import * as originalContent from "@/content/portfolio";
import publishedContent from "@/data/portfolio-content.json";
import { readDocument, writeDocument } from "./storage";

const CONTENT_KEY = "portfolio-content";

export function getDefaultContent(): PortfolioData {
  return {
    header: {
      brandName: "CUIDAR+",
      logoUrl: "/logo-cuidar.png",
      ctaText: "Fale comigo",
      ctaHref: "#contato",
    },
    hero: {
      label: originalContent.hero.label,
      title: originalContent.hero.title,
      subtitle: originalContent.hero.subtitle,
      photo: (originalContent.hero as { photo?: string }).photo || "/elaine-photo.jpg",
      ctaPrimary: {
        text: originalContent.hero.ctaPrimary.text,
        href: originalContent.hero.ctaPrimary.href,
      },
      ctaSecondary: {
        text: originalContent.hero.ctaSecondary.text,
        href: originalContent.hero.ctaSecondary.href,
      },
      badges: [...originalContent.hero.badges],
    },
    stats: originalContent.stats.map((s) => ({ ...s })),
    about: {
      sectionTitle: "Quem sou eu",
      paragraphs: [...originalContent.about.paragraphs],
      quote: originalContent.about.quote,
      quoteAuthor: "Elaine Gurgel",
    },
    expertise: originalContent.expertise.map((e) => ({ ...e })),
    timeline: originalContent.timeline.map((t) => ({ ...t })),
    education: originalContent.education.map((ed) => ({ ...ed })),
    courses: originalContent.courses.map((c) => ({ ...c })),
    teaching: {
      sectionTitle: "Docência e educação",
      entries: originalContent.teaching.entries.map((t) => ({ ...t })),
      coursesTaught: [...originalContent.teaching.coursesTaught],
      cta: originalContent.teaching.cta,
    },
    talks: originalContent.talks.map((tk) => ({ ...tk })),
    talkFilters: [...originalContent.talkFilters],
    talkHighlights: [...originalContent.talkHighlights],
    events: originalContent.events.map((ev) => ({ ...ev })),
    awards: originalContent.awards.map((aw) => ({ ...aw })),
    contact: {
      sectionTitle: originalContent.contactForm.title,
      subtitle: originalContent.contactForm.subtitle,
      email: originalContent.contact.email,
      linkedin: originalContent.contact.linkedin,
      linkedinUrl: originalContent.contact.linkedinUrl,
      lattes: originalContent.contact.lattes,
      lattesUrl: originalContent.contact.lattesUrl,
      whatsapp: originalContent.contact.whatsapp,
      whatsappNumber: originalContent.contact.whatsappNumber || "558599406173",
      reasons: [...originalContent.contactForm.reasons],
    },
    footer: {
      tagline: originalContent.footer.tagline,
      author: originalContent.footer.author,
      coren: originalContent.footer.coren,
      year: originalContent.footer.year,
    },
  };
}

function mergeWithDefaults(parsed: Partial<PortfolioData>): PortfolioData {
  const defaults = getDefaultContent();
  // Mescla com defaults para garantir que novos campos estejam presentes
  return {
    ...defaults,
    ...parsed,
    header: { ...defaults.header, ...(parsed.header || {}) },
    hero: { ...defaults.hero, ...(parsed.hero || {}) },
    about: { ...defaults.about, ...(parsed.about || {}) },
    teaching: { ...defaults.teaching, ...(parsed.teaching || {}) },
    contact: { ...defaults.contact, ...(parsed.contact || {}) },
    footer: { ...defaults.footer, ...(parsed.footer || {}) },
  };
}

export async function getContent(): Promise<PortfolioData> {
  try {
    const stored = await readDocument<Partial<PortfolioData>>(CONTENT_KEY);
    // Sem conteúdo salvo ainda: usa o conteúdo publicado no repositório
    return mergeWithDefaults(stored || (publishedContent as Partial<PortfolioData>));
  } catch (err) {
    console.error("Erro ao ler conteúdo do portfólio:", err);
    return mergeWithDefaults(publishedContent as Partial<PortfolioData>);
  }
}

export async function saveContent(data: PortfolioData, updatedBy = "admin"): Promise<PortfolioData> {
  const enriched: PortfolioData = {
    ...data,
    lastUpdated: new Date().toISOString(),
    updatedBy,
  };

  await writeDocument(CONTENT_KEY, enriched);
  return enriched;
}

export async function resetContent(updatedBy = "admin"): Promise<PortfolioData> {
  return saveContent(getDefaultContent(), updatedBy);
}
