"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Terminal, AlertTriangle, Zap } from "lucide-react";

export default function Breakthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".breakthrough-item");
    animate(items, {
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-warning mb-6 breakthrough-item opacity-0">Breakthrough</span>
        <h2 className="section-heading mb-6 breakthrough-item opacity-0">December 2025: the first training attempt</h2>

        <div ref={itemsRef} className="space-y-8">
          <div className="glass-panel glass-spotlight p-8 text-left breakthrough-item opacity-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning-soft flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary mb-2">The problem</h3>
                <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                  The training time estimate was far too long: <strong className="text-warning font-mono">about 2.66 years</strong> on average.
                  That made the approach feel impossible.
                </p>
                <p className="text-sm text-text-quaternary">
                  Awa wanted to stop. Wanted a better path.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel glass-spotlight p-8 text-left breakthrough-item opacity-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary mb-2">The discovery</h3>
                <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                  A video about <strong className="text-text-primary">BitNet</strong> and the idea of <strong className="text-text-primary">full fine-tuning</strong> — retraining all the weights of a model.
                  This inspired a new direction.
                </p>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  LLaMA 3.2 1B was downloaded, but the phone could not handle that scale.
                  So the next attempt was much smaller: <strong className="text-accent font-mono">GPT-2 82M</strong>.
                  That became the practical breakthrough point.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel glass-spotlight p-8 text-left breakthrough-item opacity-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-text-tertiary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary mb-2">Environment constraints</h3>
                <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                  The device available was only a <strong className="text-text-primary">Snapdragon 685 phone</strong>.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["torch", "numpy", "pandas", "Python ecosystem", "model experimentation"].map((item) => (
                    <span key={item} className="text-xs font-mono text-text-quaternary bg-surface-2 border border-border-subtle rounded-full px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
