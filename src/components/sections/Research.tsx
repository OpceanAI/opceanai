import Odometer from "@/components/ui/Odometer";

/**
 * Research — the proof. One enormous measured result carries the section;
 * NHE gets three sentences. Contact lives in the footer, not here.
 */
export default function Research() {
  return (
    <section id="about" className="relative w-full px-6 py-40 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-baseline gap-x-6">
          <p className="font-display text-[clamp(5rem,13vw,11rem)] font-medium leading-none tracking-[0.005em] text-text-primary">
            <Odometer value="57.6" />
            <span className="ml-3 align-baseline text-[0.35em] font-normal text-text-tertiary">
              %
            </span>
          </p>
        </div>
        <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
          Average token reduction, measured. Tsuki — trained on 4,160
          bilingual examples across six task types.
        </p>

        <div className="mt-28 grid gap-12 lg:grid-cols-2">
          <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-text-primary sm:text-4xl">
            NHE — Not Humanity Exam
          </h2>
          <div>
            <p className="max-w-lg text-base leading-relaxed text-text-secondary">
              Existing benchmarks measure what a model knows. NHE measures how
              human it still thinks — six cognitive patterns structurally
              embedded in human language, traced inside artificial systems. It
              is the empirical implementation of the Imprint Theory.
            </p>
            <div className="mt-8">
              <a href="#detail-nhe" className="arrow-link">
                Read the research
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
