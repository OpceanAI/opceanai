"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

export default function WhatIs() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".what-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(120, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-8">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent what-item">What is OpceanAI?</span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight what-item">
            A technology organization focused on the development of artificial intelligence models, infrastructure, and systems.
          </h2>

          <div className="divider max-w-xs mx-auto what-item" />

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto what-item">
            It is not a single product.
            It is an evolving ecosystem of software, research, architecture, and applied experimentation.
          </p>

          <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto what-item">
            OpceanAI is the result of years of curiosity, resource limitations, hands-on experimentation, and long-form technical iteration.
            Its evolution reflects a path from simple bots to foundational AI work, then to system-level software and infrastructure.
          </p>

          <div className="glass-panel p-8 mx-auto max-w-lg text-left what-item">
            <p className="text-sm text-text-tertiary italic leading-relaxed">
              &ldquo;OpceanAI exists to build systems that feel intentional, useful, and technically alive.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
