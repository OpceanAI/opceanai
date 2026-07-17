"use client";

import { useCallback, useRef, useState } from "react";
import { animate } from "animejs";

/**
 * The model ledger — the catalog as a precise enterprise table. Strict grid,
 * mono reserved for data, tonal sweep on row hover, rounded 1px rules.
 * Rows expand in place: a physically-honest height animation (measured
 * content height, spring-flavored easing) with the detail fields staggering
 * in on transform only. This is the only section that opens with a giant
 * number, cropped off the left edge; content is padded clear of the cut.
 */
const rows = [
  {
    name: "YuuKi RxG",
    role: "Flagship language model",
    data: "v0.1 → NxG → RxG",
    status: "Active",
    href: "#detail-yuuki",
    summary:
      "The central intellectual line of OpceanAI — one lineage carried from the first v0.1 prototype through NxG to the current RxG generation.",
    fields: [
      { label: "Lineage", value: "v0.1 → NxG → RxG" },
      { label: "First prototype", value: "2025" },
      { label: "Current generation", value: "RxG · 2026" },
    ],
  },
  {
    name: "Yumo",
    role: "Applied mathematics",
    data: "YuuKi base",
    status: "Active",
    href: "#detail-yumo",
    summary:
      "A specialized branch of the YuuKi ecosystem — the same base model, retargeted entirely at mathematics.",
    fields: [
      { label: "Base model", value: "YuuKi" },
      { label: "Domain", value: "Applied mathematics" },
      { label: "Approach", value: "Targeted, domain-oriented" },
    ],
  },
  {
    name: "Tsuki",
    role: "Token compression",
    data: "4,160 ex · −57.6% tokens",
    status: "Active",
    href: "#detail-tsuki",
    summary:
      "A bilingual token compression model trained on 4,160 curated examples across six task types, averaging 57.6% token reduction.",
    fields: [
      { label: "Examples", value: "4,160 bilingual" },
      { label: "Task types", value: "6" },
      { label: "Reduction", value: "57.6% avg" },
    ],
  },
  {
    name: "Yaki",
    role: "Multimodal",
    data: "LLaVA vision adapter",
    status: "Experimental",
    summary:
      "A multimodal experiment pairing the YuuKi line with a LLaVA vision adapter — sight grafted onto the lineage.",
    fields: [
      { label: "Adapter", value: "LLaVA vision" },
      { label: "Base", value: "YuuKi line" },
      { label: "Stage", value: "Experimental" },
    ],
  },
  {
    name: "OwO",
    role: "Omni-reasoning",
    data: "broad task coverage",
    status: "Research",
    summary:
      "An omni-reasoning research model aimed at broad task coverage rather than single-domain depth.",
    fields: [
      { label: "Focus", value: "Broad task coverage" },
      { label: "Paired with", value: "OvO" },
      { label: "Stage", value: "Research" },
    ],
  },
  {
    name: "OvO",
    role: "Origin & versioning",
    data: "paired with OwO",
    status: "Research",
    summary:
      "Origin-and-versioning research paired with OwO — tracking how a model lineage evolves between generations.",
    fields: [
      { label: "Focus", value: "Origin & versioning" },
      { label: "Paired with", value: "OwO" },
      { label: "Stage", value: "Research" },
    ],
  },
  {
    name: "Imprint",
    role: "Multimodal research",
    data: "imprint-theory probe",
    status: "Research",
    summary:
      "A multimodal probe for the Imprint Theory — tracing the residue of human cognitive structure inside artificial systems.",
    fields: [
      { label: "Probe", value: "Imprint theory" },
      { label: "Related", value: "NHE benchmark" },
      { label: "Stage", value: "Research" },
    ],
  },
] as const;

type Row = (typeof rows)[number];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-2.5 inline-block shrink-0 self-center text-text-quaternary transition-transform duration-300"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

function LedgerRow({ row }: { row: Row }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const panelId = `ledger-panel-${row.name.toLowerCase().replace(/\s+/g, "-")}`;

  const toggle = useCallback(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    const next = !open;
    setOpen(next);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      panel.style.height = next ? "auto" : "0px";
      return;
    }

    const contentHeight = inner.offsetHeight;
    if (next) {
      panel.style.height = "0px";
      animate(panel, {
        height: `${contentHeight}px`,
        duration: 560,
        ease: "outElastic(1, 0.9)",
        onComplete: () => {
          panel.style.height = "auto";
        },
      });
      const parts = inner.querySelectorAll<HTMLElement>("[data-ledger-detail]");
      parts.forEach((el, i) => {
        animate(el, {
          translateY: ["10px", "0px"],
          duration: 420,
          delay: 90 + i * 30,
          ease: "outQuart",
        });
      });
    } else {
      panel.style.height = `${panel.offsetHeight}px`;
      animate(panel, {
        height: "0px",
        duration: 340,
        ease: "outQuart",
      });
    }
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="ledger-row block w-full cursor-pointer text-left"
      >
        <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 px-4 py-5 sm:grid-cols-[1.1fr_1.5fr_1.3fr_0.6fr] sm:px-6">
          <span className="inline-flex items-baseline font-display text-lg font-medium tracking-tight text-text-primary">
            {row.name}
            <Chevron open={open} />
          </span>
          <span className="order-3 col-span-2 text-sm text-text-secondary sm:order-none sm:col-span-1">
            {row.role}
          </span>
          <span className="order-4 col-span-2 sm:order-none sm:col-span-1">
            <span className="inline-block border-b border-border-subtle pb-0.5 font-mono text-[13px] tracking-tight text-text-tertiary tabular-nums">
              {row.data}
            </span>
          </span>
          <span
            className={`text-right text-sm ${
              row.status === "Active" ? "text-accent" : "text-text-quaternary"
            }`}
          >
            {row.status}
          </span>
        </div>
      </button>

      {/* Inline detail panel — height is measured, never guessed. */}
      <div
        id={panelId}
        ref={panelRef}
        style={{ height: 0, overflow: "hidden" }}
        aria-hidden={!open}
      >
        <div ref={innerRef} className="px-4 pb-7 pt-1 sm:px-6">
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-[1.1fr_2.8fr_0.6fr]">
            <span className="hidden sm:block" aria-hidden="true" />
            <div>
              <p
                data-ledger-detail
                className="max-w-xl text-sm leading-relaxed text-text-secondary"
              >
                {row.summary}
              </p>
              <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
                {row.fields.map((f) => (
                  <div key={f.label} data-ledger-detail>
                    <dt className="text-xs text-text-quaternary">{f.label}</dt>
                    <dd className="mt-1 font-mono text-[13px] tracking-tight text-text-tertiary tabular-nums">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {"href" in row && row.href && (
                <p data-ledger-detail className="mt-6">
                  <a
                    href={row.href}
                    className="arrow-link !text-sm"
                    tabIndex={open ? 0 : -1}
                  >
                    Full detail
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="relative w-full overflow-hidden px-6 py-36 sm:px-10">
      {/* Section number, cropped off the left edge on purpose. Drifts slowly
          on its own scroll timeline (transform only, CSS-gated). */}
      <span
        className="numeral-drift pointer-events-none absolute -left-10 top-10 select-none font-display text-[11rem] font-medium leading-none text-surface-2 sm:-left-16 sm:text-[17rem]"
        aria-hidden="true"
      >
        01
      </span>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-xl pt-28 sm:pt-0 sm:pl-32 lg:pl-44">
          <h2 className="font-display text-3xl font-medium tracking-tight text-text-primary sm:text-4xl">
            The model ledger
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            One lineage and its branches, maintained as a working catalog.
          </p>
        </div>

        <div className="mt-16">
          {/* Column heads — desktop only, aligned to the row grid. */}
          <div className="hidden grid-cols-[1.1fr_1.5fr_1.3fr_0.6fr] gap-x-6 border-b border-border-subtle px-6 pb-3 sm:grid">
            {["Model", "Role", "Data", "Status"].map((h, i) => (
              <span
                key={h}
                className={`font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary ${
                  i === 3 ? "text-right" : ""
                }`}
              >
                {h}
              </span>
            ))}
          </div>

          <div className="ledger-rule" />
          {rows.map((row) => (
            <div key={row.name}>
              <LedgerRow row={row} />
              <div className="ledger-rule" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
