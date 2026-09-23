/**
 * Latest: short, factual notes on what just shipped or opened. Rows keep the
 * ledger idiom (rule, mono category, one line, arrow link) so the band reads
 * as part of the same catalog rather than a separate marketing strip.
 */
const items = [
  {
    category: "Platform",
    line: "Moud enters Public Beta: 289 models, APIs, agents, compute, deployments, and developer tools in one platform.",
    href: "https://mound.opceanai.com/",
    linkLabel: "mound.opceanai.com",
  },
  {
    category: "Program",
    line: "OpceanAI for startups is open: domains, compute, storage, and our engineers for open-source projects and early teams.",
    href: "https://startups.opceanai.com",
    linkLabel: "startups.opceanai.com",
  },
  {
    category: "Support",
    line: "OpceanAI is supporting a startup for the first time. We are providing Badtheorylabs with compute capacity to help bring Tinfield 1 to production; their API is live at rntm.sh.",
    href: "https://rntm.sh",
    linkLabel: "rntm.sh",
  },
] as const;

export default function Latest() {
  return (
    <section id="latest" className="relative w-full px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-medium tracking-tight text-text-primary sm:text-4xl">
          Latest
        </h2>

        <div className="mt-12">
          <div className="ledger-rule" />
          {items.map((item) => (
            <div key={item.category}>
              <div className="grid gap-x-6 gap-y-2 px-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:px-4">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
                  {item.category}
                </span>
                <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
                  {item.line}
                </p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arrow-link !text-sm"
                >
                  {item.linkLabel}
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
              <div className="ledger-rule" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
