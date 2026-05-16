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
      <div id="projects">
        <Projects />
      </div>
      <Philosophy />

      <section className="relative py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            Ready to explore deeper?
          </h2>
          <p className="text-text-tertiary">
            Dive into documentation, browse the codebase, or start building
            with OpceanAI today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#docs"
              className="btn-primary"
            >
              Read Documentation
            </a>
            <a
              href="#projects"
              className="btn-secondary"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
