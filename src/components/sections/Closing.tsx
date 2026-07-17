import SealCta from "@/components/ui/SealCta";

/**
 * Closing band — the only patterned band on the page: seigaiha under one
 * line and the seal. The print's narrative returns at the end: a low
 * foreground wave sliver rises behind the band on its own view() timeline
 * (transform only; static and fully visible without support).
 */
export default function Closing() {
  return (
    <section className="seigaiha-bg relative w-full overflow-hidden px-6 py-36 sm:px-10">
      {/* Wave reprise — behind the content, above the seigaiha pattern. */}
      <div
        aria-hidden="true"
        className="closing-wave-rise pointer-events-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 0 }}
      >
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="block h-[90px] w-full sm:h-[120px]"
        >
          <path
            d="M -10 150 L -10 96
               C 140 68, 300 88, 470 78
               C 650 66, 800 86, 980 76
               C 1150 67, 1300 84, 1450 76
               L 1450 150 Z"
            fill="var(--wave-4)"
            stroke="var(--wave-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M -10 150 L -10 122
               C 190 104, 360 120, 560 112
               C 760 104, 920 120, 1120 112
               C 1280 106, 1380 116, 1450 112
               L 1450 150 Z"
            fill="var(--wave-5)"
            stroke="var(--wave-ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 320 88 c 12 -10, 30 -10, 40 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 940 84 c 12 -10, 30 -10, 40 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-text-primary sm:text-4xl">
          Evaluating the models, running Doki, or talking research — reach out
          directly.
        </h2>

        <SealCta href="mailto:contact@opceanai.com" size={48} label="Contact us" />
      </div>
    </section>
  );
}
