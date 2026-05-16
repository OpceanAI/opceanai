"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Minimize2, Languages, BarChart3, Target, Zap, Database } from "lucide-react";

const trainingData = [
  { icon: Languages, label: "Bilingual", value: "Spanish + English", desc: "Two languages, one model" },
  { icon: Database, label: "Examples", value: "4,160", desc: "Carefully curated training pairs" },
  { icon: Target, label: "Task Types", value: "6", desc: "Different compression scenarios" },
  { icon: BarChart3, label: "Token Reduction", value: "57.6%", desc: "Average compression achieved" },
];

export default function DetailTsuki() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".tsuki-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-tsuki" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent tsuki-detail-item">Token Compression</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight tsuki-detail-item">
              Tsuki
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto tsuki-detail-item">
              A quiet contribution to the ecosystem.
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto tsuki-detail-item">
              Tsuki is a token compression model.
              Its value is not loud branding. Its value is precision.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trainingData.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="glass-panel p-6 text-center tsuki-detail-item">
                  <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="font-display text-2xl font-medium text-accent mb-1">{d.value}</p>
                  <p className="text-xs font-medium text-text-primary mb-1">{d.label}</p>
                  <p className="text-xs text-text-quaternary">{d.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Training Details */}
          <div className="glass-panel p-10 text-left tsuki-detail-item">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0">
                <Minimize2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-text-primary">Training Details</h3>
                <p className="text-sm text-text-quaternary mt-1">Precision over noise</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
              <p>
                Tsuki was trained on <strong className="text-text-primary">4,160 bilingual examples</strong> across
                <strong className="text-text-primary"> six different task types</strong>.
              </p>
              <p>
                The training data covered both <strong className="text-text-primary">Spanish and English</strong>,
                making Tsuki a truly bilingual compression model.
              </p>
              <p>
                The result was an average <strong className="text-accent font-medium">57.6% token reduction</strong> —
                meaning that for every 100 tokens of input, Tsuki could compress them down to approximately 42 tokens
                while preserving the essential information.
              </p>
            </div>
          </div>

          {/* Philosophy */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center tsuki-detail-item">
              The Philosophy Behind Tsuki
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-8 text-left tsuki-detail-item">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <h4 className="font-display text-sm font-medium text-text-primary">Quality over Noise</h4>
                </div>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  Tsuki reflects the philosophy of OpceanAI: quality over noise, even without recognition.
                  It does not need to be loud. It just needs to work.
                </p>
              </div>

              <div className="glass-panel p-8 text-left tsuki-detail-item">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
                    <Target className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <h4 className="font-display text-sm font-medium text-text-primary">Precision</h4>
                </div>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  Its value is not in branding or marketing. Its value is in precision —
                  doing one thing extremely well, quietly, without fanfare.
                </p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="glass-panel p-10 text-center tsuki-detail-item">
            <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
              &ldquo;Quality over noise, even without recognition.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
