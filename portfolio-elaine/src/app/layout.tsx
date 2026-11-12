import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://elainegurgel.com.br";

const TITLE = "Elaine Gurgel | Navegação cirúrgica e gestão estratégica em saúde · CUIDAR+";
const DESCRIPTION =
  "Enfermeira especialista SOBECC com 20 anos em centro cirúrgico e CME. Navegação cirúrgica para pacientes, do pré ao pós-operatório, e gestão estratégica em saúde para médicos e clínicas. Fortaleza, CE.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFDFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1824" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "navegação cirúrgica",
    "enfermeira especialista",
    "centro cirúrgico",
    "CME",
    "gestão em saúde",
    "gestão de clínicas",
    "Elaine Gurgel",
    "CUIDAR+",
    "Fortaleza",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Elaine Gurgel · CUIDAR+",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elaine Gurgel — CUIDAR+",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#elaine`,
    name: "Elaine Gurgel",
    url: SITE_URL,
    jobTitle: "Enfermeira Especialista em Centro Cirúrgico e CME",
    description: DESCRIPTION,
    worksFor: [
      { "@type": "Organization", name: "Hospital São Carlos (Rede D'Or)" },
      { "@type": "Organization", name: "Universidade de Fortaleza (UNIFOR)" },
    ],
    alumniOf: { "@type": "Organization", name: "Universidade de Fortaleza (UNIFOR)" },
    sameAs: [
      "https://www.linkedin.com/in/elaine-gurgel",
      "https://lattes.cnpq.br/0433468117601000",
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "Service",
        name: "EG CUIDAR+ · Navegação cirúrgica",
        serviceType: "Acompanhamento de enfermagem no pré, trans e pós-operatório",
        audience: { "@type": "Audience", audienceType: "Pacientes cirúrgicos" },
        provider: { "@id": `${SITE_URL}/#elaine` },
        areaServed: "BR",
      },
      {
        "@type": "Service",
        name: "Gestão Estratégica em Saúde",
        serviceType:
          "Gestão financeira, produtividade, planejamento estratégico, liderança de equipes e crescimento de consultórios",
        audience: { "@type": "Audience", audienceType: "Médicos e gestores de clínicas" },
        provider: { "@id": `${SITE_URL}/#elaine` },
        areaServed: "BR",
      },
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${nunitoSans.variable} ${ibmPlexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica o tema salvo (ou o do sistema) antes da primeira pintura, evitando "flash" */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
