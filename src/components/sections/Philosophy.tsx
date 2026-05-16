"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Waves, Sparkles, Leaf } from "lucide-react";

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (quoteRef.current) {
      animate(quoteRef.current, {
        opacity: [0, 1],
        translateY: ["30px", "0px"],
        duration: 800,
        ease: "out(3)",
        autoplay: onScroll({
          container: containerRef.current,
          enter: "80%",
          leave: "100%",
        }),
      });
    }

    if (pointsRef.current) {
      const items = pointsRef.current.querySelectorAll(".philosophy-item");
      animate(items, {
        opacity: [0, 1],
        translateY: ["20px", "0px"],
        duration: 500,
        delay: stagger(100, { from: "first" }),
        ease: "out(3)",
        autoplay: onScroll({
          container: containerRef.current,
          enter: "75%",
          leave: "100%",
        }),
      });
    }
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        <blockquote
          ref={quoteRef}
          className="opacity-0 space-y-4"
        >
          <p
            className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-deep-navy/90 dark:text-[#F1F5F9]/90 leading-snug transition-colors duration-300"
            style={{ fontStyle: "italic" }}
          >
            &ldquo;A calm surface for complex ideas. Where clarity meets
            luminous depth.&rdquo;
          </p>
          <div className="w-12 h-px bg-aqua-glass/40 dark:bg-[#38BDF8]/40 mx-auto transition-colors duration-300" />
        </blockquote>

        <div ref={pointsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="philosophy-item opacity-0 space-y-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <Waves className="w-5 h-5 text-deep-navy dark:text-[#38BDF8]" />
            </div>
            <h3 className="font-display text-lg font-medium text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
              Content First
            </h3>
            <p className="text-sm text-museum-blue/60 dark:text-[#94A3B8] leading-relaxed transition-colors duration-300">
              Visual beauty supports clarity, never fights it. The interface
              breathes.
            </p>
          </div>

          <div className="philosophy-item opacity-0 space-y-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <Sparkles className="w-5 h-5 text-deep-navy dark:text-[#38BDF8]" />
            </div>
            <h3 className="font-display text-lg font-medium text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
              Soft Intelligence
            </h3>
            <p className="text-sm text-museum-blue/60 dark:text-[#94A3B8] leading-relaxed transition-colors duration-300">
              Smart but not cold. Aware, composed, and attentive to every
              interaction.
            </p>
          </div>

          <div className="philosophy-item opacity-0 space-y-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <Leaf className="w-5 h-5 text-deep-navy dark:text-[#38BDF8]" />
            </div>
            <h3 className="font-display text-lg font-medium text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
              Nature + Technology
            </h3>
            <p className="text-sm text-museum-blue/60 dark:text-[#94A3B8] leading-relaxed transition-colors duration-300">
              Sky, water, mist, reflection. A future that is clean and
              breathable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
