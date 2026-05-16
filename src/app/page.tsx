import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Philosophy from "@/components/sections/Philosophy";
import Footer from "@/components/sections/Footer";
import AtmosphericBg from "@/components/background/AtmosphericBg";
import LiquidFilters from "@/components/svg/LiquidFilters";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <LiquidFilters />
      <AtmosphericBg />
      <Navigation />
      <Hero />
      <Projects />
      <Philosophy />

      <section id="docs" className="relative py-32 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="section-heading">Ready to explore deeper?</h2>
          <p className="section-subtitle">
            Dive into documentation, browse the codebase, or start building with OpceanAI today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a href="#docs" className="btn-primary">Read Documentation</a>
            <a href="#projects" className="btn-secondary">View Projects</a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
