"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Waves, Sparkles, Leaf } from "lucide-react";

const principles = [
  { icon: Waves, title: "Content First", desc: "Visual beauty supports clarity, never fights it. The interface breathes." },
  { icon: Sparkles, title: "Soft Intelligence", desc: "Smart but not cold. Aware, composed, and attentive to every interaction." },
  { icon: Leaf, title: "Nature + Technology", desc: "Sky, water, mist, reflection. A future that is clean and breathable." },
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (quoteRef.current) {
      animate(quoteRef.current, {
        opacity: [0, 1], translateY: ["30px", "0px"],
        duration: 800, ease: "out(3)",
        autoplay: onScroll({ container: containerRef.current, enter: "80%", leave: "100%" }),
      });
    }
    if (pointsRef.current) {
      const items = pointsRef.current.querySelectorAll(".philosophy-item");
      animate(items, {
        opacity: [0, 1], translateY: ["20px", "0px"],
        duration: 500, delay: stagger(100, { from: "first" }), ease: "out(3)",
        autoplay: onScroll({ container: containerRef.current, enter: "75%", leave: "100%" }),
      });
    }
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-20">
        <blockquote ref={quoteRef} className="opacity-0 space-y-4">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-text-primary/90 leading-snug italic">
            &ldquo;A calm surface for complex ideas. Where clarity meets luminous depth.&rdquo;
          </p>
          <div className="w-12 h-px bg-accent/40 mx-auto" />
        </blockquote>

        <div ref={pointsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {principles.map((p, i) => (
            <div key={i} className="philosophy-item opacity-0 space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto glass-subtle">
                <p.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-medium text-text-primary">{p.title}</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
