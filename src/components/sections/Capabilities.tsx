import Odometer from "@/components/ui/Odometer";

/**
 * Capabilities strip — opens with a full sentence, no kicker. Three bare-mark
 * facts on an asymmetric grid: no boxes, no borders; alignment and type
 * hierarchy do the structure. Icons are drawn in-house in one style:
 * 1.5 stroke, 24 grid, round caps, indigo line.
 */
function WaveChipIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M8 13.5c1.3-2.6 2.7-2.6 4 0s2.7 2.6 4 0" />
      <path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5" />
    </svg>
  );
}

function VesselIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5h17v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
      <path d="M7.5 11.5v3.5M12 11.5v3.5M16.5 11.5v3.5" />
      <path d="M5 8.5 6.5 5h11L19 8.5" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v16M6 6.5h12" />
      <path d="M6 6.5 3.5 12.5a2.6 2.6 0 0 0 5 0L6 6.5ZM18 6.5l-2.5 6a2.6 2.6 0 0 0 5 0l-2.5-6Z" />
      <path d="M9 20h6" />
    </svg>
  );
}

const facts: Array<{
  icon: () => React.ReactNode;
  pre?: string;
  num: string;
  rest: string;
  line: string;
  placement: string;
}> = [
  {
    icon: WaveChipIcon,
    num: "10",
    rest: "+ models",
    line: "One lineage, YuuKi v0.1 to RxG, with six specialized branches.",
    placement: "md:col-start-1 md:col-span-4",
  },
  {
    icon: VesselIcon,
    num: "4",
    rest: " isolation layers",
    line: "Doki runs OCI containers natively on Android.",
    placement: "md:col-start-6 md:col-span-3 md:mt-20",
  },
  {
    icon: BalanceIcon,
    pre: "Since ",
    num: "2023",
    rest: "",
    line: "Open evaluation research — NHE and the Imprint Theory.",
    placement: "md:col-start-10 md:col-span-3 md:mt-40",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative w-full px-6 py-36 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-4xl font-display text-[clamp(1.9rem,3.4vw,3rem)] font-medium leading-[1.25] tracking-[-0.01em] text-text-primary">
          OpceanAI builds AI models, container infrastructure, and evaluation
          research — engineered under real constraints.
        </p>

        <div className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-y-0">
          {facts.map((f) => (
            <div key={f.num + f.rest} className={f.placement}>
              <span className="icon-draw text-text-tertiary">
                <f.icon />
              </span>
              <p className="mt-5 font-display text-3xl font-medium tracking-tight text-text-primary">
                {f.pre}
                <Odometer value={f.num} />
                {f.rest}
              </p>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-text-secondary">
                {f.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
