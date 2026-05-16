"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Fingerprint, Mail, ExternalLink, Github } from "lucide-react";

const contacts = [
  { label: "General Contact", email: "opceanai@gmail.com" },
  { label: "Personal Contact", email: "aguitachan3@gmail.com" },
  { label: "Business Contact", email: "contact@opceanai.com" },
];

const ecosystemList = [
  "OpceanAI Organization",
  "Doki",
  "YuuKi",
  "Yumo",
  "Tsuki",
  "OwO",
  "OvO",
  "Yaki",
  "Imprint models",
  "NHE (Not Humanity Exam)",
];

const links = [
  { category: "Organizations & Repositories", items: [
    { label: "OpceanAI", url: "https://github.com/OpceanAI" },
    { label: "Doki", url: "https://github.com/OpceanAI/Doki" },
    { label: "YuuKi OS", url: "https://github.com/YuuKi-OS" },
  ]},
  { category: "Models & Research Hubs", items: [
    { label: "OpceanAI", url: "https://huggingface.co/OpceanAI" },
    { label: "YU-MO", url: "https://huggingface.co/YU-MO" },
    { label: "Tsuki", url: "https://huggingface.co/tsuki-team" },
    { label: "OwO", url: "https://huggingface.co/OpceanAI-With-Omnireasoning" },
    { label: "OvO", url: "https://huggingface.co/OpceanAI-v0" },
    { label: "YuuKi RxG", url: "https://huggingface.co/OpceanAI/Yuuki-RxG" },
    { label: "NHE", url: "https://huggingface.co/Not-Humanity-Exam" },
  ]},
];

export default function Research() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".research-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-32">
          {/* NHE */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-info mb-6 research-item">Research</span>
            <h2 className="section-heading mb-6 research-item">NHE — Not Humanity Exam</h2>

            <div className="space-y-8 max-w-2xl mx-auto">
              <p className="text-text-tertiary text-lg leading-relaxed research-item">
                Every existing benchmark — HLE, MMLU, BIG-Bench, ARC — measures nearly the same dimension:
              </p>

              <div className="glass-panel p-8 text-left research-item">
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-info mt-1.5 w-1.5 h-1.5 rounded-full bg-info shrink-0" />
                    What a model knows
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-info mt-1.5 w-1.5 h-1.5 rounded-full bg-info shrink-0" />
                    How much human knowledge it can reproduce
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-info mt-1.5 w-1.5 h-1.5 rounded-full bg-info shrink-0" />
                    How accurately it can reason
                  </li>
                </ul>
              </div>

              <div className="research-item">
                <p className="text-text-primary text-xl font-medium leading-relaxed mb-2">
                  NHE asks a fundamentally different question:
                </p>
                <p className="text-text-primary text-2xl font-display font-medium leading-relaxed">
                  Not how much the model knows.
                </p>
                <p className="text-accent text-2xl font-display font-medium leading-relaxed">
                  But how human it still thinks.
                </p>
              </div>

              <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto research-item">
                NHE measures the presence of six cognitive patterns structurally embedded within human language itself.
                These are patterns that systems trained on human text cannot fully escape regardless of scale, capability, or intelligence level.
              </p>

              <div className="glass-panel glass-spotlight p-8 text-left research-item">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center shrink-0">
                    <Fingerprint className="w-6 h-6 text-info" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-medium text-text-primary">The Imprint Theory</h3>
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      NHE serves as an empirical implementation of The Imprint Theory.
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Rather than measuring accumulated knowledge, NHE attempts to measure traces of human cognitive structure remaining inside artificial systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ecosystem list */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 research-item">Ecosystem</span>
            <h2 className="section-heading mb-6 research-item">The full ecosystem</h2>
            <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto mb-8 research-item">
              OpceanAI is not built around a single project.
              Over time it evolved into an ecosystem of models, systems, experiments, infrastructure, and research.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 research-item">
              {ecosystemList.map((item) => (
                <span key={item} className="text-xs font-mono text-text-tertiary bg-surface-2 border border-border-subtle rounded-full px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 research-item">Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contacts.map((c) => (
                <div key={c.label} className="glass-panel p-6 text-center research-item">
                  <Mail className="w-5 h-5 text-text-quaternary mx-auto mb-3" />
                  <p className="text-xs text-text-quaternary mb-1">{c.label}</p>
                  <a href={`mailto:${c.email}`} className="text-sm text-text-primary hover:text-accent transition-colors font-mono">
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* External links */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 research-item">External Links</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {links.map((group) => (
                <div key={group.category} className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary research-item">{group.category}</h4>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors group research-item"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:text-accent transition-colors">{item.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
