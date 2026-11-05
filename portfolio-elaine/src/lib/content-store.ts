import fs from "fs";
import path from "path";
import { PortfolioData } from "./types";
import * as originalContent from "@/content/portfolio";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONTENT_FILE = path.join(DATA_DIR, "portfolio-content.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

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

export function getContent(): PortfolioData {
  ensureDirectoryExists(DATA_DIR);

  if (!fs.existsSync(CONTENT_FILE)) {
    const defaults = getDefaultContent();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }

  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
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
  } catch (err) {
    console.error("Erro ao ler portfolio-content.json:", err);
    return getDefaultContent();
  }
}

export function saveContent(data: PortfolioData, updatedBy = "admin"): PortfolioData {
  ensureDirectoryExists(DATA_DIR);

  const enriched: PortfolioData = {
    ...data,
    lastUpdated: new Date().toISOString(),
    updatedBy,
  };

  fs.writeFileSync(CONTENT_FILE, JSON.stringify(enriched, null, 2), "utf-8");
  return enriched;
}

export function resetContent(updatedBy = "admin"): PortfolioData {
  const defaults = getDefaultContent();
  return saveContent(defaults, updatedBy);
}

