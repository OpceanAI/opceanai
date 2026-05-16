"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

export default function Origin() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    const items = contentRef.current.querySelectorAll(".origin-item");
    animate(items, {
      opacity: [0, 1],
      translateY: ["30px", "0px"],
      duration: 700,
      delay: stagger(120, { from: "first" }),
      ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="origin" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-6 origin-item opacity-0">Origin</span>
        <h2 className="section-heading mb-6 origin-item opacity-0">Where it began</h2>
        <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-16 origin-item opacity-0">
          OpceanAI was born on April 23, 2023, originally under the name <strong className="text-text-primary font-medium">Ocean</strong>.
          At that stage, the mission was simple: build bots for Discord and Telegram.
          That period became known as <strong className="text-text-primary font-medium">Bots New</strong>.
        </p>

        <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="origin-item opacity-0 glass-panel glass-spotlight p-8 text-left">
            <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center mb-4">
              <span className="text-xl font-display text-accent font-semibold">S</span>
            </div>
            <h3 className="font-display text-xl font-medium text-text-primary mb-2">Sakura</h3>
            <p className="text-sm text-text-tertiary leading-relaxed">
              Written as a single <code className="text-accent font-mono text-xs bg-accent-soft px-1.5 py-0.5 rounded">main.py</code>.
              Around 11k lines of code. A massive monolithic beginning — a direct, bold, experimental approach.
            </p>
          </div>

          <div className="origin-item opacity-0 glass-panel glass-spotlight p-8 text-left">
            <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center mb-4">
              <span className="text-xl font-display text-info font-semibold">N</span>
            </div>
            <h3 className="font-display text-xl font-medium text-text-primary mb-2">Nebula</h3>
            <p className="text-sm text-text-tertiary leading-relaxed">
              Built with JS/TS. A different implementation style. A contrasting path to Sakura — part of the same foundational era.
            </p>
          </div>
        </div>

        <blockquote className="mt-16 origin-item opacity-0">
          <p className="font-display text-lg text-text-secondary italic leading-relaxed">
            &ldquo;Sakura and Nebula were not just the first projects. They were the first signs of a system becoming an organization.&rdquo;
          </p>
        </blockquote>
      </div>
    </section>
  );
}
