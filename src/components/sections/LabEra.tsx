"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { FlaskConical } from "lucide-react";

export default function LabEra() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".lab-item");
    animate(items, {
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-info mb-6 lab-item opacity-0">Lab Era</span>
        <h2 className="section-heading mb-6 lab-item opacity-0">OpceanAI Lab</h2>
        <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-12 lab-item opacity-0">
          In 2025, awa decided to create something historic: <strong className="text-text-primary font-medium">YuuKi v0.1</strong>.
          This became the first prototype of the OpceanAI Lab era.
        </p>

        <div ref={itemsRef} className="glass-panel glass-spotlight p-8 text-left lab-item opacity-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-info" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-lg font-medium text-text-primary">The origin of YuuKi</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">
                Around October 2025, after personal problems, awa entered a period of depression.
                During that time, <strong className="text-text-secondary">Girls&apos; Last Tour</strong> became deeply meaningful.
                Its style, atmosphere, and emotional tone made a strong impact.
              </p>
              <p className="text-sm text-text-tertiary leading-relaxed">
                A Discord bot called <strong className="text-text-secondary">Yuki</strong> was created, but it did not become what was hoped for.
                Even so, that emotional path remained important — it became part of the name and identity of what would later become <strong className="text-text-primary font-medium">YuuKi</strong>.
              </p>
              <div className="pt-3 border-t border-border-default">
                <p className="text-xs text-text-quaternary italic">
                  The project did not emerge from blank product strategy. It emerged from a real attempt to give form to an internal vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
