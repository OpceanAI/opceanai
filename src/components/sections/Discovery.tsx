"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

export default function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".discovery-item");
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
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent discovery-item">Discovery</span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight discovery-item">
            The first encounter with LLMs
          </h2>

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto discovery-item">
            While the creator of OpceanAI, <strong className="text-text-primary font-medium">awa-omg</strong>, was thinking about how to build a first model of AI for Sakura, the first interaction with LLMs happened.
          </p>

          <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto discovery-item">
            At that moment, there was no deep familiarity with the modern AI ecosystem.
          </p>

          <div className="glass-panel p-8 mx-auto max-w-lg text-left discovery-item">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary mb-4">The environment was still very early</h4>
            <ul className="space-y-3 text-sm text-text-tertiary">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                No deep knowledge of Hugging Face
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                No deep familiarity with modern AI tooling
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                No &ldquo;instant maturity&rdquo; in the stack
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Just curiosity, code, and a growing ambition
              </li>
            </ul>
          </div>

          <div className="divider max-w-xs mx-auto discovery-item" />

          <p className="text-text-primary text-lg font-medium leading-relaxed max-w-lg mx-auto discovery-item">
            This moment represents the transition from &ldquo;building bots&rdquo; into &ldquo;building intelligence.&rdquo;
          </p>

          <p className="text-text-tertiary text-sm leading-relaxed max-w-md mx-auto discovery-item">
            It is the conceptual bridge between simple automation and model-based systems.
          </p>
        </div>
      </div>
    </section>
  );
}
