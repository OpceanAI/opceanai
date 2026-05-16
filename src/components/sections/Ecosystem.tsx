"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Brain, Calculator, GitBranch, Eye, Layers, Minimize2, Fingerprint } from "lucide-react";

const models = [
  { name: "YuuKi", line: "RxG", description: "The central intellectual line. From v0.1 to NxG to RxG — a lineage, not just a model.", icon: Brain, badge: "badge-active", color: "accent" },
  { name: "Yumo", line: "Mathematics", description: "Specialized branch of the YuuKi ecosystem. Focused, structured, mathematical.", icon: Calculator, badge: "badge-active", color: "info" },
  { name: "OwO", line: "Omni-Reasoning", description: "OpceanAI with Omni-Reasoning. Short, memorable, identity-driven.", icon: GitBranch, badge: "badge-research", color: "info" },
  { name: "OvO", line: "v0", description: "OpceanAI v0. Origin and versioning as architectural identity.", icon: Layers, badge: "badge-research", color: "info" },
  { name: "Yaki", line: "Multimodal", description: "Based on YuuKi, enhanced with multimodal abilities via LLaVA. Non-native VL model.", icon: Eye, badge: "badge-experimental", color: "warning" },
  { name: "Tsuki", line: "Compression", description: "Token compression model. 4,160 bilingual examples. 57.6% token reduction.", icon: Minimize2, badge: "badge-active", color: "accent" },
  { name: "NHE", line: "Research", description: "Not Humanity Exam. Measures traces of human cognitive structure in AI systems.", icon: Fingerprint, badge: "badge-research", color: "info" },
];

export default function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".eco-card");
    animate(cards, {
      opacity: [0, 1], translateY: ["30px", "0px"], scale: [0.96, 1],
      duration: 600, delay: stagger(80, { from: "center" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="ecosystem" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent">Ecosystem</span>
          <h2 className="section-heading">The model lines</h2>
          <p className="section-subtitle">Not one project. A growing system of ideas that learned how to become real.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div key={model.name} className="eco-card opacity-0 glass-panel glass-spotlight group cursor-pointer">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-${model.color}-soft flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-5 h-5 text-${model.color}`} />
                    </div>
                    <span className={`badge ${model.badge}`}>
                      <span className="status-dot" />
                      {model.line}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-text-primary group-hover:text-accent transition-colors duration-200">
                      {model.name}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1.5 leading-relaxed">{model.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 space-y-4">
          <p className="text-text-quaternary text-sm italic">
            &ldquo;Quality over noise, even without recognition.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
