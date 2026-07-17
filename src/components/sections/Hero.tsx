import OceanInstrument from "@/components/hero/OceanInstrument";
import ProximityHeadline from "@/components/hero/ProximityHeadline";
import SealCta from "@/components/ui/SealCta";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
    >
      {/* The instrument that reads the ocean — a live chart recorder owns
          the first screen: one luminous trace over drifting bathymetric
          contours. */}
      <OceanInstrument className="absolute inset-0 -z-10 h-full w-full" />

      {/* Publisher's column — one deliberate mark on the print's edge. */}
      <span
        className="vertical-column absolute right-5 top-1/2 hidden -translate-y-1/2 select-none font-display text-[12px] text-text-quaternary md:block"
        aria-hidden="true"
      >
        藍摺絵 — OPCEANAI — EST. 2023
      </span>

      {/* Headline in the empty sky (Ma), left of the rising wave. */}
      {/* On small screens the empty sky is cropped away, so the copy sits
          low, over the deep wave body; on md+ it lives in the sky (Ma). */}
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 pb-[12svh] md:justify-start md:pb-0 md:pt-[20svh] sm:px-10">
        <ProximityHeadline className="max-w-[13ch] font-display text-[clamp(2.6rem,6.2vw,5.4rem)] font-medium leading-[1.06] tracking-[-0.01em] text-text-primary" />

        <p className="mt-7 max-w-md text-lg leading-relaxed text-text-secondary">
          Models, runtimes, and evaluation research — engineered to hold in
          production.
        </p>

        <div className="mt-12">
          <SealCta
            href="mailto:contact@opceanai.com"
            className="hero-ink-cursor"
            size={44}
            label="Get in touch"
          />
        </div>
      </div>
    </section>
  );
}
