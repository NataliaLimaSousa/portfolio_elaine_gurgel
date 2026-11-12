// ─────────────────────────────────────────────────
// /content/portfolio.ts — Todo o conteúdo do site
// ─────────────────────────────────────────────────

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

export interface ContactInfo {
  email: string;
  linkedin: string;
  linkedinUrl: string;
  lattes: string;
  lattesUrl: string;
  whatsapp: string;
  whatsappNumber?: string;
  whatsappPatientMessage?: string;
  whatsappManagerMessage?: string;
}

export interface HeroContent {
  label: string;
  title: string;
  subtitle: string;
  photo?: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  badges: string[];
}

export interface AboutContent {
  sectionTitle?: string;
  paragraphs: string[];
  quote: string;
  quoteAuthor?: string;
}

export interface TeachingContent {
  sectionTitle?: string;
  entries: { institution: string; period: string; description: string }[];
  coursesTaught: string[];
  cta: string;
}

export interface ServicePhase {
  phase: string;
  icon: string;
  summary: string;
  items: string[];
}

export interface EgCuidarContent {
  label: string;
  title: string;
  intro: string;
  phases: ServicePhase[];
  note: string;
  ctaText: string;
}

export interface ManagementService {
  icon: string;
  title: string;
  description: string;
}

export interface ManagementContent {
  label: string;
  title: string;
  intro: string;
  services: ManagementService[];
  note: string;
  ctaText: string;
}

// ── Hero ──────────────────────────────────────────
export const hero: HeroContent = {
  label: "Elaine Gurgel · CUIDAR+",
  title: "Excelência no cuidado. Inteligência na gestão.",
  subtitle:
    "Enfermeira especialista SOBECC em Centro Cirúrgico, CME e Recuperação Anestésica, com 20 anos no Hospital São Carlos. Ajudo pacientes a atravessar a jornada cirúrgica com segurança e apoio, e médicos e gestores a organizar a gestão de suas clínicas.",
  photo: "/elaine-photo.jpg",
  ctaPrimary: { text: "Sou paciente", href: "#paciente" },
  ctaSecondary: { text: "Sou médico ou gestor", href: "#gestao" },
  badges: [
    "Especialista SOBECC",
    "Docente UNIFOR",
    "20 anos no Hospital São Carlos",
  ],
};

// ── EG CUIDAR+ · Navegação cirúrgica (pacientes) ──
export const egCuidar: EgCuidarContent = {
  label: "Para pacientes",
  title: "EG CUIDAR+ · Navegação cirúrgica",
  intro:
    "Uma cirurgia envolve muitas etapas, prazos e dúvidas. A navegação cirúrgica é um acompanhamento de enfermagem que traduz as orientações da sua equipe médica e organiza cada fase da sua jornada, com escuta e clareza.",
  phases: [
    {
      phase: "Pré-operatório",
      icon: "ClipboardList",
      summary: "Preparar com segurança, tirando dúvidas antes do grande dia.",
      items: [
        "Explicação clara do caminho até a cirurgia, em linguagem simples",
        "Organização do preparo conforme a orientação da sua equipe médica",
        "Checagem de exames, documentos e agendamentos",
        "Acolhimento das dúvidas e da ansiedade do paciente e da família",
      ],
    },
    {
      phase: "Trans-operatório",
      icon: "ShieldCheck",
      summary: "Tranquilidade para você e para quem espera por você.",
      items: [
        "Orientação sobre o fluxo do dia da cirurgia e o que esperar em cada etapa",
        "Apoio à comunicação com a família durante o procedimento",
        "Olhar de segurança do paciente, baseado na experiência em centro cirúrgico",
      ],
    },
    {
      phase: "Pós-operatório",
      icon: "HeartHandshake",
      summary: "Recuperação com orientação e apoio, sem se sentir sozinho.",
      items: [
        "Revisão das orientações de alta e dos cuidados em casa prescritos pela equipe",
        "Acompanhamento da rotina de recuperação",
        "Orientação sobre quando procurar a equipe médica ou um serviço de urgência",
      ],
    },
  ],
  note:
    "A navegação cirúrgica complementa, e não substitui, o atendimento e as condutas da sua equipe médica. Não oferece diagnóstico nem prescrição.",
  ctaText: "Falar no WhatsApp como paciente",
};

// ── Gestão Estratégica em Saúde (médicos e gestores) ──
export const management: ManagementContent = {
  label: "Para médicos e gestores",
  title: "Gestão Estratégica em Saúde",
  intro:
    "Consultórios e clínicas crescem melhor quando assistência e gestão caminham juntas. Apoio médicos e gestores a organizar processos, equipes e números, com a visão de quem vive a rotina de um ambiente hospitalar complexo.",
  services: [
    {
      icon: "Wallet",
      title: "Gestão financeira",
      description:
        "Organização de custos, receitas e fluxo de caixa para decisões mais seguras no dia a dia da clínica.",
    },
    {
      icon: "Gauge",
      title: "Produtividade e processos",
      description:
        "Mapeamento de rotinas, padronização de processos e indicadores para ganhar eficiência sem perder qualidade assistencial.",
    },
    {
      icon: "Compass",
      title: "Planejamento estratégico",
      description:
        "Definição de metas, prioridades e plano de ação alinhados ao propósito e ao momento do seu negócio.",
    },
    {
      icon: "Users",
      title: "Liderança de equipes",
      description:
        "Desenvolvimento de lideranças, comunicação e engajamento da equipe assistencial e administrativa.",
    },
    {
      icon: "TrendingUp",
      title: "Crescimento de consultórios",
      description:
        "Estratégias para fortalecer a presença, a organização e a sustentabilidade de consultórios e clínicas.",
    },
  ],
  note:
    "Cada projeto é desenhado a partir de um diagnóstico da sua realidade. Não há fórmulas prontas nem promessas de resultado.",
  ctaText: "Falar no WhatsApp como médico ou gestor",
};

// ── Números ───────────────────────────────────────
export const stats: Stat[] = [
  { value: 20, label: "anos de experiência em bloco cirúrgico" },
  {
    value: 10,
    label: "anos coordenando o transoperatório de transplante hepático",
  },
  { value: 4, label: "especializações em enfermagem" },
  { value: 14, label: "palestras e apresentações científicas" },
  { value: 9, label: "eventos científicos organizados" },
  { value: 6, label: "prêmios e reconhecimentos" },
];

// ── Sobre ─────────────────────────────────────────
export const about: AboutContent = {
  sectionTitle: "Quem sou eu",
  paragraphs: [
    "Sou enfermeira formada pela Universidade de Fortaleza (UNIFOR) e especialista em Centro Cirúrgico, Central de Material e Esterilização e Recuperação Anestésica pela SOBECC, título revalidado por dois triênios.",
    "Há 20 anos dedico minha carreira ao bloco cirúrgico do Hospital São Carlos, em Fortaleza. Comecei na unidade de internação, passei mais de uma década no centro cirúrgico — onde coordenei por 10 anos o transoperatório do transplante hepático — e hoje lidero a CME.",
    "Ao longo desse caminho, a gestão de pessoas, processos e projetos passou a ser parte central do meu trabalho. Foi dessa experiência que nasceu a CUIDAR+, iniciativa em que reúno duas frentes: a navegação cirúrgica, que acompanha o paciente do pré ao pós-operatório, e a gestão estratégica em saúde, voltada a médicos e gestores de consultórios e clínicas.",
    "Acredito que a segurança do paciente começa no detalhe: no instrumental bem processado, no indicador bem medido, na equipe bem treinada. É isso que levo para a gestão, para a sala de aula, para cada palestra e para cada pessoa que atendo.",
  ],
  quote: "Segurança do paciente começa no detalhe que ninguém vê.",
  quoteAuthor: "Elaine Gurgel",
};

// ── Áreas de Atuação ──────────────────────────────
export const expertise: ExpertiseCard[] = [
  {
    icon: "ShieldCheck",
    title: "Gestão de CME",
    description:
      "Processamento, rastreabilidade e indicadores de qualidade de produtos para saúde, com foco na segurança do paciente.",
  },
  {
    icon: "Activity",
    title: "Jornada perioperatória",
    description:
      "Assistência de enfermagem ao paciente cirúrgico no pré, trans e pós-operatório.",
  },
  {
    icon: "Cpu",
    title: "Cirurgia robótica e endoscopia",
    description:
      "Implantação do processamento de material robótico e boas práticas em endoscopia.",
  },
  {
    icon: "HeartPulse",
    title: "Transplante hepático",
    description:
      "Uma década coordenando o transoperatório de transplantes de fígado.",
  },
  {
    icon: "GraduationCap",
    title: "Docência e educação",
    description:
      "Pós-graduação na UNIFOR, palestras, cursos e treinamento de equipes.",
  },
  {
    icon: "Workflow",
    title: "Projetos e processos",
    description:
      "Implantação e validação de processos, eventos científicos e gestão de projetos com equipe médica.",
  },
];

// ── Trajetória ────────────────────────────────────
export const timeline: TimelineEntry[] = [
  {
    period: "[A CONFIRMAR] – atual",
    institution: "Equipe médica [A CONFIRMAR]",
    role: "Gestão de projetos e assistência cirúrgica",
    highlights:
      "Jornada perioperatória e assistência direta ao paciente cirúrgico",
    isCurrent: true,
  },
  {
    period: "2024 – atual",
    institution: "Universidade de Fortaleza (UNIFOR)",
    role: "Docente da pós-graduação em Cuidados Cirúrgicos e CME",
    highlights:
      "Planejamento e ministração de disciplinas teóricas e práticas",
    isCurrent: true,
  },
  {
    period: "2019 – atual",
    institution: "Hospital São Carlos (Rede D'Or)",
    role: "Supervisora da Central de Material e Esterilização",
    highlights:
      "Gestão do processamento, indicadores de qualidade, implantação do processamento de material robótico, Embaixadora de Segurança 2023/2024",
    isCurrent: true,
  },
  {
    period: "2018",
    institution: "Universidade Estadual do Ceará (UECE)",
    role: "Docente convidada",
    highlights: "Disciplina de enfermagem [A CONFIRMAR]",
    isCurrent: false,
  },
  {
    period: "2015",
    institution:
      "NASCECME — Núcleo de Assessoria, Capacitação e Especialização em CME",
    role: "Redação de conteúdo técnico",
    highlights: "Textos para o Portal Nasce CME",
    isCurrent: false,
  },
  {
    period: "2011",
    institution: "Governo do Estado do Ceará",
    role: "Colaboradora",
    highlights:
      "Contribuição na marca de 1.000 [transplantes — A CONFIRMAR]",
    isCurrent: false,
  },
  {
    period: "2007 – 2018",
    institution: "Hospital São Carlos",
    role: "Enfermeira do Centro Cirúrgico e Responsável [A CONFIRMAR]",
    highlights:
      "Coordenação do transoperatório do transplante hepático por 10 anos; validação e implantação de processos",
    isCurrent: false,
  },
  {
    period: "2006 – 2007",
    institution: "Hospital São Carlos",
    role: "Enfermeira da unidade de internação",
    highlights: "Início da trajetória na instituição",
    isCurrent: false,
  },
];

// ── Formação ──────────────────────────────────────
export const education: EducationEntry[] = [
  {
    period: "out/2024 – nov/2025",
    title: "Especialização em Enfermagem em Endoscopia",
    institution: "Faculdade Unyleya",
  },
  {
    period: "jul/2024 – mar/2025",
    title: "Especialização em Enfermagem em Cirurgia Robótica",
    institution: "Faculdade Unyleya",
  },
  {
    period: "ago/2022 – jun/2023",
    title: "Especialização em Enfermagem em Centro Cirúrgico e CME",
    institution: "Faculdade Unyleya",
  },
  {
    period: "ago/2022 – jun/2023",
    title: "Especialização em Liderança em Enfermagem",
    institution: "Faculdade Unyleya",
  },
  {
    period: "2017 – 2023",
    title:
      "Título de Especialista em CC, CME e Recuperação Anestésica, revalidado em dois triênios",
    institution: "SOBECC",
  },
  {
    period: "2001 – 2005",
    title: "Bacharelado em Enfermagem",
    institution: "Universidade de Fortaleza (UNIFOR)",
  },
];

// ── Cursos complementares ─────────────────────────
export const courses: CourseEntry[] = [
  { year: "2025", title: "Boas Práticas em Endoscopia e Preparo de Pele", institution: "Rioquímica", hours: "—" },
  { year: "2024", title: "Gestão Hospitalar", institution: "Bookplay", hours: "50 h" },
  { year: "2023", title: "Cuidados ao Paciente Cirúrgico", institution: "Escola de Saúde Pública do Ceará", hours: "60 h" },
  { year: "2023", title: "O Enfermeiro e a Gestão Hospitalar", institution: "Escola de Saúde Pública do Ceará", hours: "80 h" },
  { year: "2023", title: "Avaliação on-line para coordenadores de robótica", institution: "Intuitive", hours: "—" },
  { year: "2023", title: "Produtividade Inteligente", institution: "Escola Conquer", hours: "10 h" },
  { year: "2023", title: "Comunicação Expressiva 2.0", institution: "Fala Lima Treinamentos", hours: "10 h" },
  { year: "2022", title: "Programa de Desenvolvimento de Líderes", institution: "Academia Rede D'Or", hours: "19 h" },
  { year: "2022", title: "Completude de Gestão de CME: ferramentas que engajam e agregam valor", institution: "SOBECC", hours: "—" },
  { year: "2022", title: "13º Simpósio Internacional de Esterilização e Controle de Infecção", institution: "SOBECC", hours: "—" },
  { year: "2022", title: "Inteligência Relacional nas Profissões (extensão)", institution: "Faculdade Unyleya", hours: "—" },
  { year: "2022", title: "Inteligência Emocional 2.0", institution: "Escola Conquer", hours: "15 h" },
  { year: "2022", title: "Formação em Liderança", institution: "Escola Conquer", hours: "10 h" },
  { year: "2022", title: "Formação de Brigada de Incêndio", institution: "CFQTP", hours: "20 h" },
  { year: "2021", title: "Atualização em Ressuscitação Cardiopulmonar", institution: "Instituto D'Or", hours: "—" },
  { year: "2003–2005", title: "Jornadas Norte/Nordeste de CC e Central de Esterilização (VII a IX)", institution: "ABEn", hours: "30 h cada" },
  { year: "2004", title: "Ventilação Mecânica: uma abordagem para a enfermagem", institution: "Hospital São Carlos", hours: "40 h" },
  { year: "2003", title: "Assistência ao Parto Humanizado", institution: "LAPEL", hours: "40 h" },
  { year: "2003", title: "I Semana Nacional de Estomaterapia", institution: "SOBEST", hours: "30 h" },
  { year: "2003", title: "II Encontro Norte-Nordeste de Enfermagem", institution: "ABEn", hours: "24 h" },
  { year: "2001", title: "Princípios Básicos na Prática Oncológica em Enfermagem", institution: "Instituto do Câncer do Ceará", hours: "40 h" },
];

// ── Docência ──────────────────────────────────────
export const teaching: TeachingContent = {
  sectionTitle: "Docência e educação",
  entries: [
    {
      institution: "UNIFOR",
      period: "2024 – atual",
      description:
        "Docente da pós-graduação em Cuidados Cirúrgicos e Central de Material e Esterilização, com disciplinas teóricas e práticas.",
    },
    {
      institution: "UECE",
      period: "2018",
      description: "Docente convidada.",
    },
  ],
  coursesTaught: [
    "Videocirurgia — cuidados com limpeza, preparo e esterilização (aperfeiçoamento)",
  ],
  cta: "Leve a experiência da CME real para a sala de aula da sua instituição.",
};

// ── Palestras e produção científica ───────────────
export const talks: TalkEntry[] = [
  { year: "2025", title: "Contribuições da CME para a segurança do paciente", format: "Palestra", filter: "CME" },
  { year: "2023", title: "Implantação de procedimento de cirurgia robótica e a responsabilidade [A CONFIRMAR]", format: "Palestra", filter: "Robótica" },
  { year: "[A CONFIRMAR]", title: "Processamento do material de robótica e a responsabilidade [A CONFIRMAR]", format: "Palestra", filter: "Robótica" },
  { year: "[A CONFIRMAR]", title: "Relato de experiência: implantação do processamento de material robótico na CME de um hospital privado de Fortaleza (com N. A. L. Magalhães e S. A. Araújo)", format: "Congresso", filter: "Robótica" },
  { year: "[A CONFIRMAR]", title: "Implantação do serviço de processamento de [material robótico — A CONFIRMAR] na CME de um hospital privado", format: "Pôster", filter: "Robótica" },
  { year: "[A CONFIRMAR]", title: "Instrumentais cirúrgicos: cuidados, manuseio e funcionalidades", format: "Palestra", filter: "Instrumentais" },
  { year: "2016", title: "Material cirúrgico e suas funcionalidades", format: "Palestra", filter: "Instrumentais" },
  { year: "2016", title: "A interface da tecnologia em prol da segurança do paciente: desafios da atualidade (14ª Jornada N-NE de CC e CE)", format: "Pôster", filter: "Gestão" },
  { year: "[A CONFIRMAR]", title: "Simulação realística: situações vivenciadas na prática hospitalar", format: "Palestra", filter: "Gestão" },
  { year: "[A CONFIRMAR]", title: "Videocirurgia: cuidados com limpeza, preparo e esterilização", format: "Palestra", filter: "CME" },
  { year: "2015", title: "Diferentes falhas nos processos de esterilização", format: "Palestra", filter: "CME" },
  { year: "[A CONFIRMAR]", title: "Esterilização e manejo em Central de Material e Esterilização", format: "Palestra", filter: "CME" },
  { year: "2011", title: "A trajetória do serviço de transplante em uma instituição: da implantação até os dias atuais — relato de experiência (com A. Vale)", format: "Congresso", filter: "Transplante" },
  { year: "2010", title: "Esterilização, cuidados, limpeza e manuseio com os materiais [A CONFIRMAR]", format: "Palestra", filter: "CME" },
  { year: "2009", title: "Esterilização, cuidados, limpeza e manuseio com os materiais [A CONFIRMAR]", format: "Palestra", filter: "CME" },
  { year: "2009", title: "Limpeza: fluxo, soluções, insumos, procedimentos, monitoramento e registros", format: "Palestra", filter: "CME" },
];

export const talkFilters = ["Todos", "CME", "Robótica", "Instrumentais", "Transplante", "Gestão"];

export const talkHighlights = [
  "CONALE",
  "Portal Nasce CME",
  "Eventos locais",
];

// ── Eventos organizados ───────────────────────────
export const events: EventEntry[] = [
  { year: "2024", title: "II Congresso Norte-Nordeste de Centro Cirúrgico e Central de Material e Esterilização" },
  { year: "2022", title: "Linha de cuidado ao paciente cirúrgico" },
  { year: "[A CONFIRMAR]", title: "16ª Jornada Norte-Nordeste de Centro Cirúrgico e Central de Esterilização" },
  { year: "[A CONFIRMAR]", title: "Coronavírus: repercussões na linha do cuidado cirúrgico" },
  { year: "[A CONFIRMAR]", title: "Alta performance e habilidades das equipes em cirurgias [A CONFIRMAR]" },
  { year: "2018", title: "OPME: avançamos na prática da consciência estéril" },
  { year: "[A CONFIRMAR]", title: "Implantação de indicadores de qualidade e processo na CME" },
  { year: "2016", title: "Inovação incremental: fator-chave para ganhos de produtividade com peróxido de hidrogênio Baumer PHB" },
  { year: "[A CONFIRMAR]", title: "13ª Jornada Norte-Nordeste de Centro Cirúrgico e Central de Esterilização" },
];

// ── Reconhecimentos ───────────────────────────────
export const awards: AwardEntry[] = [
  { year: "2025", title: "Elogiada do mês", grantedBy: "Hospital São Carlos" },
  { year: "2024", title: "Elogiada do mês (duas vezes)", grantedBy: "Hospital São Carlos" },
  { year: "2023", title: "Embaixadora de Segurança 2023/2024", grantedBy: "Hospital São Carlos" },
  { year: "2022", title: "Honra ao Mérito pela organização da 16ª Jornada N-NE de CC e Central de Esterilização", grantedBy: "ABEn-CE" },
  { year: "2015", title: 'Destaque "A nova geração de enfermeiros comprometidos com os processos da CME"', grantedBy: "1º CONALE — Congresso Nacional de Limpeza e Esterilização" },
];

// ── Contato ───────────────────────────────────────
export const contact: ContactInfo = {
  email: "elainecsagurgel@gmail.com",
  linkedin: "linkedin.com/in/elaine-gurgel",
  linkedinUrl: "https://www.linkedin.com/in/elaine-gurgel",
  lattes: "lattes.cnpq.br/0433468117601000",
  lattesUrl: "https://lattes.cnpq.br/0433468117601000",
  whatsapp: "(85) 99940-6173",
  whatsappNumber: "558599406173",
  whatsappPatientMessage:
    "Olá, Elaine! Sou paciente e gostaria de saber mais sobre a navegação cirúrgica EG CUIDAR+.",
  whatsappManagerMessage:
    "Olá, Elaine! Sou médico(a) ou gestor(a) e gostaria de conversar sobre gestão estratégica para minha clínica ou consultório.",
};

export const contactForm = {
  title: "Vamos conversar?",
  subtitle:
    "Pacientes, médicos e gestores: escolha o canal que preferir. Também recebo convites para palestras, aulas e consultoria em CME. Respondo pessoalmente.",
  reasons: [
    "Sou paciente (navegação cirúrgica)",
    "Sou médico ou gestor (gestão em saúde)",
    "Palestra ou docência",
    "Consultoria em CME",
    "Outro assunto",
  ],
};

// ── Rodapé ────────────────────────────────────────
export const footer = {
  tagline: "CUIDAR+ · Conectando cuidado e dedicação à sua saúde",
  author: "por Elaine Gurgel",
  coren: "Coren-CE [A CONFIRMAR]",
  year: 2026,
};
