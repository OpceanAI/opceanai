"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

const dna = [
  "build first",
  "learn while building",
  "accept complexity when needed",
  "use whatever tools are available",
  "keep moving forward",
];

export default function Origin() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".origin-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-10">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent origin-item">Origin</span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight origin-item">
            Where it began
          </h2>

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto origin-item">
            OpceanAI was born on <strong className="text-text-primary font-medium">April 23, 2023</strong>, originally under the name <strong className="text-text-primary">Ocean</strong>.
            At that stage, the mission was simple: build bots for Discord and Telegram.
            That period became known as <strong className="text-text-primary">Bots New</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="glass-panel glass-spotlight p-8 origin-item">
              <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center mb-4">
                <span className="text-xl font-display text-accent font-semibold">S</span>
              </div>
              <h3 className="font-display text-xl font-medium text-text-primary mb-3">Sakura</h3>
              <ul className="space-y-2 text-sm text-text-tertiary">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  Written as a single <code className="text-accent font-mono text-xs bg-accent-soft px-1.5 py-0.5 rounded">main.py</code>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  Around 11k lines of code
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  A massive monolithic beginning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  A direct, bold, experimental approach
                </li>
              </ul>
            </div>

            <div className="glass-panel glass-spotlight p-8 origin-item">
              <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center mb-4">
                <span className="text-xl font-display text-info font-semibold">N</span>
              </div>
              <h3 className="font-display text-xl font-medium text-text-primary mb-3">Nebula</h3>
              <ul className="space-y-2 text-sm text-text-tertiary">
                <li className="flex items-start gap-2">
                  <span className="text-info mt-1.5 w-1 h-1 rounded-full bg-info shrink-0" />
                  Built with JS/TS
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info mt-1.5 w-1 h-1 rounded-full bg-info shrink-0" />
                  A different implementation style
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info mt-1.5 w-1 h-1 rounded-full bg-info shrink-0" />
                  A contrasting path to Sakura
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info mt-1.5 w-1 h-1 rounded-full bg-info shrink-0" />
                  Part of the same foundational era
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 mx-auto max-w-lg text-left origin-item">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary mb-4">The DNA of this era</h4>
            <div className="flex flex-wrap gap-2">
              {dna.map((item) => (
                <span key={item} className="text-xs font-mono text-text-tertiary bg-surface-2 border border-border-subtle rounded-full px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <blockquote className="origin-item">
            <p className="font-display text-lg text-text-secondary italic leading-relaxed max-w-xl mx-auto">
              &ldquo;Sakura and Nebula were not just the first projects. They were the first signs of a system becoming an organization.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
