"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".closing-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 800, delay: 100, ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-8">
          <h2 className="section-heading closing-item">
            OpceanAI is not one project.
          </h2>
          <p className="text-text-tertiary text-lg leading-relaxed closing-item">
            It is a growing system of ideas that learned how to become real.
          </p>

          <div className="divider max-w-xs mx-auto closing-item" />

          <div className="space-y-3 closing-item">
            <p className="text-sm text-text-quaternary">
              Bots becoming models.
            </p>
            <p className="text-sm text-text-quaternary">
              Models becoming systems.
            </p>
            <p className="text-sm text-text-quaternary">
              Systems becoming infrastructure.
            </p>
            <p className="text-sm text-text-quaternary">
              Infrastructure becoming a research identity.
            </p>
          </div>

          <div className="divider max-w-xs mx-auto closing-item" />

          <blockquote className="closing-item">
            <p className="font-display text-lg text-text-secondary italic leading-relaxed">
              &ldquo;OpceanAI exists to build systems that feel intentional, useful, and technically alive.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
