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
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
            Ready to explore deeper?
          </h2>
          <p className="text-museum-blue/70 dark:text-[#94A3B8] transition-colors duration-300">
            Dive into documentation, browse the codebase, or start building
            with OpceanAI today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#docs"
              className="inline-flex items-center gap-2 glass-surface text-deep-navy dark:text-[#F1F5F9] px-6 py-3 rounded-[var(--radius-button)] font-medium transition-all duration-[var(--duration-quick)] ease-[var(--ease-gentle)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glass-hover)] active:scale-[0.97]"
            >
              Read Documentation
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 glass-surface-tertiary text-museum-blue dark:text-[#94A3B8] px-6 py-3 rounded-[var(--radius-button)] font-medium transition-all duration-[var(--duration-quick)] ease-[var(--ease-gentle)] hover:bg-white/20 dark:hover:bg-white/5 active:scale-[0.97]"
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
