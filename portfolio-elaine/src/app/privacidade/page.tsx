import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { contact } from "@/content/portfolio";
import { CONTACT_CONSENT_VERSION } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Política de Privacidade | Elaine Gurgel · CUIDAR+",
  description:
    "Como o site de Elaine Gurgel (CUIDAR+) trata os dados pessoais enviados pelo formulário de contato, conforme a LGPD.",
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. Quem é responsável pelos seus dados",
    body: (
      <p>
        Elaine C. S. A. Gurgel, responsável por este site, é a controladora dos dados pessoais
        tratados aqui. Para qualquer assunto sobre privacidade, escreva para{" "}
        <a className="underline" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. Quais dados coletamos",
    body: (
      <>
        <p>Apenas os que você digita no formulário de contato:</p>
        <ul>
          <li>nome;</li>
          <li>e-mail;</li>
          <li>assunto escolhido;</li>
          <li>texto da mensagem;</li>
          <li>data e hora do envio e o registro do seu consentimento.</li>
        </ul>
        <p>
          Não gravamos seu endereço de IP. Ele é transformado em um código irreversível, usado só
          por uma hora para limitar o envio excessivo de mensagens.
        </p>
      </>
    ),
  },
  {
    title: "3. Para que usamos e em que base legal",
    body: (
      <p>
        Usamos esses dados somente para responder ao seu contato. A base legal é o seu
        consentimento (art. 7º, I, da Lei nº 13.709/2018 — LGPD), dado ao marcar a caixa de
        concordância antes de enviar. Não usamos seus dados para publicidade nem os vendemos.
      </p>
    ),
  },
  {
    title: "4. Dados de saúde",
    body: (
      <p>
        Dados de saúde são dados pessoais sensíveis. Por isso, pedimos que{" "}
        <strong>não envie exames, laudos, diagnósticos ou fotos clínicas</strong> pelo formulário.
        Assuntos de saúde devem ser tratados diretamente com sua equipe médica e, se houver
        acompanhamento, em canal adequado combinado com você.
      </p>
    ),
  },
  {
    title: "5. WhatsApp",
    body: (
      <p>
        Os botões de WhatsApp apenas abrem o aplicativo com uma mensagem inicial. Este site não
        recebe nem armazena essa conversa, que passa a seguir os termos e a política de privacidade
        do WhatsApp.
      </p>
    ),
  },
  {
    title: "6. Com quem os dados podem ser compartilhados",
    body: (
      <p>
        Os dados ficam armazenados em serviços de infraestrutura contratados para manter o site
        funcionando (hospedagem e banco de dados), que os processam em nosso nome e podem estar em
        servidores fora do Brasil. Fora isso, não compartilhamos seus dados, salvo obrigação legal.
      </p>
    ),
  },
  {
    title: "7. Por quanto tempo guardamos",
    body: (
      <p>
        Pelo tempo necessário para atender ao seu contato. Depois disso, a mensagem é excluída. Você
        também pode pedir a exclusão antes, a qualquer momento.
      </p>
    ),
  },
  {
    title: "8. Seus direitos",
    body: (
      <>
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incorretos;</li>
          <li>eliminação dos dados tratados com base no consentimento;</li>
          <li>revogação do consentimento, sem prejuízo do que já foi feito antes;</li>
          <li>informações sobre com quem os dados são compartilhados.</li>
        </ul>
        <p>
          Basta escrever para{" "}
          <a className="underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          . Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </>
    ),
  },
  {
    title: "9. Segurança e cookies",
    body: (
      <p>
        A comunicação com o site é criptografada (HTTPS). As mensagens recebidas só podem ser lidas
        por pessoas autorizadas, em área restrita com senha. Este site não usa cookies de
        publicidade ou de rastreamento. Guardamos apenas, no seu navegador, a sua preferência por
        modo claro ou escuro.
      </p>
    ),
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-teal-600/20">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="CUIDAR+ — Voltar ao início">
            <Image
              src="/logo-cuidar.png"
              alt="CUIDAR+"
              width={180}
              height={48}
              className="logo-adaptive h-10 w-auto"
            />
          </Link>
          <Link href="/" className="text-sm font-semibold text-accent-strong hover:underline">
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Política de Privacidade
        </h1>
        <p className="text-muted mb-10">
          Versão {CONTACT_CONSENT_VERSION}. Explicamos de forma simples como tratamos seus dados
          pessoais, de acordo com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={section.title}>
              <h2
                id={section.title}
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {section.title}
              </h2>
              <div className="space-y-3 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-accent-strong">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
