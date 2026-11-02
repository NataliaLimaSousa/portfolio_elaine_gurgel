import Header from "@/components/Header";
import Hero from "@/components/Hero";
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

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-ink overflow-x-hidden selection:bg-teal-100 selection:text-navy-900">
      <CareLine />
      <Header />
      <Hero />
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
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
