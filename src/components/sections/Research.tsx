"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Fingerprint, Mail, ExternalLink, Github } from "lucide-react";

const contacts = [
  { label: "General", email: "opceanai@gmail.com" },
  { label: "Personal", email: "aguitachan3@gmail.com" },
  { label: "Business", email: "contact@opceanai.com" },
];

const links = [
  { category: "Organizations", items: [
    { label: "OpceanAI", url: "https://github.com/OpceanAI" },
    { label: "Doki", url: "https://github.com/OpceanAI/Doki" },
    { label: "YuuKi OS", url: "https://github.com/YuuKi-OS" },
  ]},
  { category: "Models", items: [
    { label: "OpceanAI", url: "https://huggingface.co/OpceanAI" },
    { label: "YU-MO", url: "https://huggingface.co/YU-MO" },
    { label: "Tsuki", url: "https://huggingface.co/tsuki-team" },
    { label: "OwO", url: "https://huggingface.co/OpceanAI-With-Omnireasoning" },
    { label: "OvO", url: "https://huggingface.co/OpceanAI-v0" },
    { label: "YuuKi RxG", url: "https://huggingface.co/OpceanAI/Yuuki-RxG" },
  ]},
  { category: "Research", items: [
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
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* NHE */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-info mb-6 research-item opacity-0">Research</span>
          <h2 className="section-heading mb-6 research-item opacity-0">NHE — Not Humanity Exam</h2>
          <div ref={itemsRef} className="space-y-6 max-w-2xl mx-auto text-left">
            <p className="text-text-tertiary text-base leading-relaxed research-item opacity-0">
              Every existing benchmark — HLE, MMLU, BIG-Bench, ARC — measures nearly the same dimension:
              what a model knows, how much human knowledge it can reproduce, how accurately it can reason.
            </p>
            <p className="text-text-primary text-lg font-medium research-item opacity-0">
              NHE asks a fundamentally different question: not how much the model knows, but how human it still thinks.
            </p>
            <p className="text-text-tertiary text-sm leading-relaxed research-item opacity-0">
              NHE measures the presence of six cognitive patterns structurally embedded within human language itself.
              These are patterns that systems trained on human text cannot fully escape regardless of scale, capability, or intelligence level.
            </p>
            <div className="glass-panel glass-spotlight p-6 research-item opacity-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-info-soft flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-medium text-text-primary mb-1">The Imprint Theory</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    NHE serves as an empirical implementation of The Imprint Theory.
                    Rather than measuring accumulated knowledge, NHE attempts to measure traces of human cognitive structure remaining inside artificial systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 research-item opacity-0">Contact</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contacts.map((c) => (
              <div key={c.label} className="glass-panel p-6 text-center research-item opacity-0">
                <Mail className="w-5 h-5 text-text-quaternary mx-auto mb-3" />
                <p className="text-xs text-text-quaternary mb-1">{c.label}</p>
                <a href={`mailto:${c.email}`} className="text-sm text-text-primary hover:text-accent transition-colors font-mono">
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 research-item opacity-0">Ecosystem Links</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {links.map((group) => (
              <div key={group.category} className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary research-item opacity-0">{group.category}</h4>
                {group.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors group research-item opacity-0"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:text-accent transition-colors">{item.label}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
