import Odometer from "@/components/ui/Odometer";

/**
 * Moud: the platform, announced as its own chapter. One number carries the
 * opening (289 models), then the capability list reads as a plain catalog of
 * what the platform actually exposes, in the house's mono data voice.
 */
const capabilities = [
  "API access",
  "BYOK",
  "Agents",
  "Compute",
  "Virtual machines",
  "Deployments",
  "Managed DNS",
  "Moud subdomains",
  "Channels and integrations",
  "Developer tools",
] as const;

export default function Moud() {
  return (
    <section id="moud" className="relative w-full overflow-hidden px-6 py-36 sm:px-10">
      <span
        className="numeral-drift pointer-events-none absolute -left-10 top-10 select-none font-display text-[11rem] font-medium leading-none text-surface-2 sm:-left-16 sm:text-[17rem]"
        aria-hidden="true"
      >
        02
      </span>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl pt-28 sm:pt-0 sm:pl-32 lg:pl-44">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            Public Beta · Now open
          </p>
          <h2 className="mt-5 font-display text-4xl font-medium tracking-tight text-text-primary sm:text-5xl">
            Moud
          </h2>
          <p className="mt-5 text-xl font-medium leading-snug text-text-primary">
            Models, APIs, agents, compute, deployments, and developer tools in
            one place.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary">
            After a few days of development, testing, breaking things, fixing
            them, and probably breaking them again, Moud is entering Public
            Beta. What started as a fairly simple idea grew into an AI and
            developer infrastructure platform built by OpceanAI.
          </p>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-display text-[clamp(4rem,10vw,8rem)] font-medium leading-none tracking-[0.005em] text-text-primary">
              <Odometer value="289" />
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
              Models reachable through a single platform: language and reasoning
              models plus other AI capabilities from different providers, and a
              selection we host ourselves on Moud infrastructure.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-text-quaternary">
              The catalog keeps changing as models, providers, and
              infrastructure availability change.
            </p>
          </div>

          <div>
            <p className="text-base leading-relaxed text-text-secondary">
              More than a model playground. You can build on top of the catalog
              with:
            </p>
            <ul className="mt-7 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <li
                  key={capability}
                  className="border-b border-border-subtle py-3 font-mono text-[13px] tracking-tight text-text-tertiary"
                >
                  {capability}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
              You can also register a device and sign in without copying an API
              key every time.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-medium text-text-primary">
              Privacy
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              Moud is built with privacy and data minimization in mind. Selected
              services hosted directly by Moud operate with Zero Data Retention.
              Third-party models remain subject to their own providers&rsquo;
              policies.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-text-primary">
              Infrastructure
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              Operations run across Mexico, Canada, and the United States, with
              Moud&rsquo;s primary operations based in Mexico.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-text-primary">
              How this is funded
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              A mix of our own infrastructure, provider capacity, shared
              resources, and usage limits keeps a significant part of the
              platform available for free. One person&rsquo;s money is another
              person&rsquo;s tokens.
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-2xl border-t border-border-subtle pt-10">
          <p className="text-base leading-relaxed text-text-secondary">
            There will be bugs. Models may disappear. Providers will probably
            have problems at some point. That is exactly why the beta is open:
            use Moud, find the rough edges, and tell us what to build next.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
            <a
              href="https://mound.opceanai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link"
            >
              Open Moud
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a href="#detail-moud" className="arrow-link">
              Full detail
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
