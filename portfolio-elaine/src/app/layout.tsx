import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://elainegurgel.com.br"),
  title: "Elaine Gurgel — Enfermeira especialista em CME e Centro Cirúrgico | CUIDAR+",
  description:
    "Enfermeira especialista SOBECC com 20 anos em centro cirúrgico e CME. Supervisora no Hospital São Carlos, docente UNIFOR e palestrante.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Elaine Gurgel — Enfermeira especialista em CME e Centro Cirúrgico | CUIDAR+",
    description:
      "Enfermeira especialista SOBECC com 20 anos em centro cirúrgico e CME. Supervisora no Hospital São Carlos, docente UNIFOR e palestrante.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elaine Gurgel — CUIDAR+",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Elaine Gurgel",
    jobTitle: "Enfermeira Especialista em Centro Cirúrgico e CME",
    worksFor: [
      {
        "@type": "Organization",
        name: "Hospital São Carlos (Rede D'Or)",
      },
      {
        "@type": "Organization",
        name: "Universidade de Fortaleza (UNIFOR)",
      },
    ],
    alumniOf: {
      "@type": "Organization",
      name: "Universidade de Fortaleza (UNIFOR)",
    },
    sameAs: [
      "https://www.linkedin.com/in/elaine-gurgel",
      "https://lattes.cnpq.br/0433468117601000",
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
