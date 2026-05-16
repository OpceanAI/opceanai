"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Terminal, AlertTriangle, Zap, Cpu, Database } from "lucide-react";

export default function Breakthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".breakthrough-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-24">
          {/* December 2025 - First training attempt */}
          <div>
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 breakthrough-item">December 2025</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight mb-6 breakthrough-item">
              The first training attempt
            </h2>

            <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-6 breakthrough-item">
              In December 2025, awa had a new idea:
            </p>

            <p className="text-text-primary text-xl font-display font-medium mb-8 breakthrough-item">
              &ldquo;What if I make an AI?&rdquo;
            </p>

            <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto mb-6 breakthrough-item">
              So a dataset was downloaded — essentially all of Wikipedia — and the work began.
            </p>

            <div className="glass-panel p-8 mx-auto max-w-lg text-left breakthrough-item">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-warning-soft flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-warning" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-medium text-text-primary">The tools were very limited</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    The first attempt used <strong className="text-text-primary">TinyGram</strong>.
                    But it became clear that the ambition exceeded the environment, so PyTorch had to be installed.
                  </p>
                </div>
              </div>
            </div>

            <div className="divider max-w-xs mx-auto breakthrough-item" />

            <div className="glass-panel p-8 mx-auto max-w-lg text-left breakthrough-item">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-text-tertiary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-text-primary mb-3">Environment constraints</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed mb-4">
                    At that time, the device available was only a <strong className="text-text-primary">Snapdragon 685 phone</strong>.
                    The setup effort was enormous.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["torch", "numpy", "pandas", "Python ecosystem", "model experimentation"].map((item) => (
                      <span key={item} className="text-xs font-mono text-text-quaternary bg-surface-2 border border-border-subtle rounded-full px-3 py-1.5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto mt-8 breakthrough-item">
              This was a difficult period, but it was also foundational.
              OpceanAI was never built with comfortable resources.
              It was built through persistence, adaptation, repeated technical struggle, and learning through friction.
            </p>
          </div>

          {/* Iris birth */}
          <div>
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-6 breakthrough-item">January 12, 2026</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight mb-6 breakthrough-item">
              Iris
            </h2>
            <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-4 breakthrough-item">
              As January arrived, the technical learning process continued.
              The first AI was born on <strong className="text-text-primary font-medium">January 12, 2026</strong>, under the codename:
            </p>
            <p className="text-text-primary text-2xl font-display font-medium mb-6 breakthrough-item">Iris</p>
            <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto mb-4 breakthrough-item">
              But that name was not the final identity.
            </p>
            <p className="text-text-tertiary text-sm leading-relaxed max-w-md mx-auto breakthrough-item">
              The final name became <strong className="text-text-primary">YuuKi</strong>, chosen as a tribute and transformation:
              a reference to <strong className="text-text-secondary">Yuu</strong> from <em className="text-text-secondary">Girls&apos; Last Tour</em>,
              combined with a Japanese snow-like suffix, transformed into a name that felt more fitting for the project.
            </p>
          </div>

          <div className="divider max-w-xs mx-auto breakthrough-item" />

          {/* The rename meaning */}
          <div className="glass-panel p-8 mx-auto max-w-lg text-left breakthrough-item">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary mb-3">Why the rename mattered</h4>
            <p className="text-sm text-text-tertiary leading-relaxed mb-3">
              This rename turned a technical milestone into an identity.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Iris was the first milestone.
              YuuKi became the real symbol.
            </p>
          </div>

          {/* Training problem */}
          <div>
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-warning mb-6 breakthrough-item">The Training Problem</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight mb-6 breakthrough-item">
              2.66 years
            </h2>
            <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-4 breakthrough-item">
              The training time estimate was far too long: <strong className="text-warning font-mono text-xl">about 2.66 years</strong> on average.
            </p>
            <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto mb-4 breakthrough-item">
              That made the approach feel impossible.
            </p>
            <p className="text-text-tertiary text-sm leading-relaxed max-w-md mx-auto mb-8 breakthrough-item">
              Awa wanted to stop. Wanted to do nothing. Wanted a better path.
            </p>

            <div className="glass-panel p-8 mx-auto max-w-lg text-left breakthrough-item">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-medium text-text-primary">The architectural discovery</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    Then came a video about <strong className="text-text-primary">BitNet</strong> and the idea of <strong className="text-text-primary">full fine-tuning</strong> — retraining all the weights of a model.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    This inspired a new direction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="divider max-w-xs mx-auto breakthrough-item" />

          {/* GPT-2 breakthrough */}
          <div>
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 breakthrough-item">Model Experimentation</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight mb-6 breakthrough-item">
              GPT-2 82M
            </h2>
            <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-4 breakthrough-item">
              LLaMA 3.2 1B was downloaded, but the phone could not realistically handle that scale.
            </p>
            <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto mb-8 breakthrough-item">
              So the next attempt was much smaller: <strong className="text-accent font-mono">GPT-2 82M</strong>.
              That became the practical breakthrough point.
            </p>

            <div className="divider max-w-xs mx-auto breakthrough-item" />

            <div className="space-y-4 breakthrough-item">
              <p className="text-text-primary text-lg font-medium leading-relaxed max-w-lg mx-auto">
                This moment represents the move from impossible ambition to constrained but real execution.
              </p>
              <p className="text-text-tertiary text-sm leading-relaxed max-w-md mx-auto">
                This should feel like the &ldquo;hard part&rdquo; of the keynote:
                quiet, serious, and impressive without overexplaining.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
