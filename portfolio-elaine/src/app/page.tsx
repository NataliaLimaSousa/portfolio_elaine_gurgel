import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EgCuidar from "@/components/EgCuidar";
import Management from "@/components/Management";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Timeline from "@/components/Timeline";
import Education from "@/components/Education";
import Teaching from "@/components/Teaching";
import Talks from "@/components/Talks";
import Events from "@/components/Events";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CareLine from "@/components/CareLine";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { getContent } from "@/lib/content-store";
import { toPublicContent } from "@/lib/pending";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = toPublicContent(await getContent());

  return (
    <PortfolioProvider initialData={content}>
      <main className="relative min-h-screen bg-surface text-ink overflow-x-hidden selection:bg-chip selection:text-heading">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <CareLine />
        <Header />
        <div id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <EgCuidar />
        <Management />
        <Stats />
        <About />
        <Expertise />
        <Timeline />
        <Education />
        <Teaching />
        <Talks />
        <Events />
        <Awards />
        <Contact />
        </div>
        <Footer />
        <WhatsAppButton />
      </main>
    </PortfolioProvider>
  );
}
