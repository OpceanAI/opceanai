"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Fingerprint, Brain, Search, Target, Layers, AlertCircle } from "lucide-react";

const existingBenchmarks = [
  { name: "HLE", focus: "Hard problems, but still knowledge-based" },
  { name: "MMLU", focus: "Massive multitask language understanding" },
  { name: "BIG-Bench", focus: "Broad evaluation of AI capabilities" },
  { name: "ARC", focus: "Abstraction and reasoning challenges" },
];

const cognitivePatterns = [
  { icon: Brain, label: "Pattern 1", desc: "Structural patterns embedded within human language itself" },
  { icon: Layers, label: "Pattern 2", desc: "Cognitive structures that systems trained on human text cannot escape" },
  { icon: Target, label: "Pattern 3", desc: "Traces of human thought processes regardless of scale or capability" },
  { icon: Search, label: "Pattern 4", desc: "Linguistic fingerprints that reveal the source of training data" },
  { icon: Brain, label: "Pattern 5", desc: "Reasoning patterns that mirror human cognitive biases" },
  { icon: AlertCircle, label: "Pattern 6", desc: "Structural artifacts of human knowledge representation" },
];

export default function DetailNHE() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".nhe-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-nhe" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-info nhe-detail-item">Research</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight nhe-detail-item">
              NHE
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto nhe-detail-item">
              Not Humanity Exam
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto nhe-detail-item">
              Not how much the model knows.
              <br />
              <span className="text-accent font-medium">But how human it still thinks.</span>
            </p>
          </div>

          {/* The Problem with Existing Benchmarks */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center nhe-detail-item">
              The Problem with Existing Benchmarks
            </h3>
            <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center nhe-detail-item">
              Every existing benchmark measures nearly the same dimension:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {existingBenchmarks.map((b) => (
                <div key={b.name} className="glass-panel p-6 text-left nhe-detail-item">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center">
                      <Search className="w-4 h-4 text-text-quaternary" />
                    </div>
                    <h4 className="font-display text-sm font-medium text-text-tertiary">{b.name}</h4>
                  </div>
                  <p className="text-xs text-text-quaternary">{b.focus}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel p-8 text-center nhe-detail-item">
              <p className="text-sm text-text-secondary leading-relaxed">
                They all measure: <strong className="text-text-primary">what a model knows</strong>,
                <strong className="text-text-primary"> how much human knowledge it can reproduce</strong>,
                and <strong className="text-text-primary">how accurately it can reason</strong>.
              </p>
            </div>
          </div>

          {/* What NHE Measures */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center nhe-detail-item">
              What NHE Measures
            </h3>
            <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center nhe-detail-item">
              NHE measures the presence of six cognitive patterns structurally embedded within human language itself.
              These are patterns that systems trained on human text cannot fully escape regardless of scale, capability, or intelligence level.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cognitivePatterns.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="glass-panel p-6 text-left nhe-detail-item">
                    <div className="w-10 h-10 rounded-xl bg-info-soft flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-info" />
                    </div>
                    <h4 className="font-display text-sm font-medium text-text-primary mb-2">{p.label}</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Imprint Theory */}
          <div className="glass-panel p-10 text-left nhe-detail-item">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center shrink-0">
                <Fingerprint className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-text-primary">The Imprint Theory</h3>
                <p className="text-sm text-text-quaternary mt-1">NHE as empirical implementation</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
              <p>
                NHE serves as an empirical implementation of The Imprint Theory.
              </p>
              <p>
                Rather than measuring accumulated knowledge, NHE attempts to measure traces of human cognitive structure remaining inside artificial systems.
              </p>
              <p className="text-text-primary font-medium">
                The question is not about intelligence. It is about the imprint — the structural residue of human thought that persists inside AI, regardless of how capable that AI becomes.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="glass-panel p-10 text-center nhe-detail-item">
            <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
              &ldquo;NHE asks a fundamentally different question:
              Not how much the model knows. But how human it still thinks.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
