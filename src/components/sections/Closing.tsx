"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".closing-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 800, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight closing-item">
            OpceanAI is a technology organization that grew from experimentation into a real ecosystem.
          </h2>

          <div className="divider max-w-xs mx-auto closing-item" />

          <div className="space-y-6 closing-item">
            <p className="text-text-tertiary text-base leading-relaxed">It is a story of:</p>
            <div className="space-y-4">
              <p className="text-text-secondary text-xl font-display font-medium">Bots becoming models.</p>
              <p className="text-text-secondary text-xl font-display font-medium">Models becoming systems.</p>
              <p className="text-text-secondary text-xl font-display font-medium">Systems becoming infrastructure.</p>
              <p className="text-text-secondary text-xl font-display font-medium">Infrastructure becoming a research identity.</p>
            </div>
          </div>

          <div className="divider max-w-xs mx-auto closing-item" />

          <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto closing-item">
            And that story should be told with the same level of care and precision that the work itself demands.
          </p>

          <div className="glass-panel p-10 mx-auto max-w-2xl closing-item">
            <p className="font-display text-xl sm:text-2xl text-text-primary/90 italic leading-relaxed">
              &ldquo;OpceanAI is not one project.
              It is a growing system of ideas that learned how to become real.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
