export interface Stat {
  value: number;
  label: string;
}

export interface ExpertiseCard {
  icon: string;
  title: string;
  description: string;
}

export interface TimelineEntry {
  period: string;
  institution: string;
  role: string;
  highlights: string;
  isCurrent: boolean;
}

export interface EducationEntry {
  period: string;
  title: string;
  institution: string;
}

export interface CourseEntry {
  year: string;
  title: string;
  institution: string;
  hours: string;
}

export interface TalkEntry {
  year: string;
  title: string;
  format: string;
  filter: string;
}

export interface EventEntry {
  year: string;
  title: string;
}

export interface AwardEntry {
  year: string;
  title: string;
  grantedBy: string;
}

export interface HeroData {
  label: string;
  title: string;
  subtitle: string;
  photo?: string;
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary: {
    text: string;
    href: string;
  };
  badges: string[];
}

export interface AboutData {
  sectionTitle?: string;
  paragraphs: string[];
  quote: string;
  quoteAuthor?: string;
}

export interface TeachingData {
  sectionTitle?: string;
  entries: {
    institution: string;
    period: string;
    description: string;
  }[];
  coursesTaught: string[];
  cta: string;
}

export interface ContactData {
  sectionTitle?: string;
  subtitle?: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  lattes: string;
  lattesUrl: string;
  whatsapp: string;
  whatsappNumber: string;
  whatsappPatientMessage?: string;
  whatsappManagerMessage?: string;
  reasons: string[];
}

export interface FooterData {
  tagline: string;
  author: string;
  coren: string;
  year: number;
}

export interface HeaderData {
  brandName?: string;
  logoUrl?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface ServicePhase {
  phase: string;
  icon: string;
  summary: string;
  items: string[];
}

export interface EgCuidarData {
  label: string;
  title: string;
  intro: string;
  phases: ServicePhase[];
  note: string;
  ctaText: string;
}

export interface ManagementServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ManagementData {
  label: string;
  title: string;
  intro: string;
  services: ManagementServiceItem[];
  note: string;
  ctaText: string;
}

export interface PortfolioData {
  header: HeaderData;
  hero: HeroData;
  egCuidar?: EgCuidarData;
  management?: ManagementData;
  stats: Stat[];
  about: AboutData;
  expertise: ExpertiseCard[];
  timeline: TimelineEntry[];
  education: EducationEntry[];
  courses: CourseEntry[];
  teaching: TeachingData;
  talks: TalkEntry[];
  talkFilters: string[];
  talkHighlights: string[];
  events: EventEntry[];
  awards: AwardEntry[];
  contact: ContactData;
  footer: FooterData;
  lastUpdated?: string;
  updatedBy?: string;
}

