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
        <div ref={itemsRef} className="space-y-10">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-info lab-item">Lab Era</span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight lab-item">
            OpceanAI Lab
          </h2>

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto lab-item">
            In 2025, awa decided to create something historic: <strong className="text-text-primary font-medium">YuuKi v0.1</strong>.
            This became the first prototype of the OpceanAI Lab era.
          </p>

          <div className="glass-panel p-8 mx-auto max-w-lg text-left lab-item">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5 text-info" />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-lg font-medium text-text-primary">The origin of the name YuuKi</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  The name YuuKi comes from a very specific personal and emotional context.
                </p>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  Around October 2025, after personal problems, awa entered a period of depression.
                  During that time, <strong className="text-text-secondary">Girls&apos; Last Tour</strong> became deeply meaningful.
                  Its style, atmosphere, and emotional tone made a strong impact.
                </p>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  After finishing the manga, awa felt unable to continue carrying that emotional state in the same way.
                  A Discord bot called <strong className="text-text-secondary">Yuki</strong> was created, but it did not become what was hoped for, and it was eventually discontinued.
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Even so, that emotional path remained important, because it became part of the name and identity of what would later become <strong className="text-text-primary font-medium">YuuKi</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 mx-auto max-w-lg text-left lab-item">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary mb-3">Why this matters</h4>
            <p className="text-sm text-text-tertiary leading-relaxed mb-3">
              This part of the story should not be treated like trivia.
              It is part of the emotional origin of the lab era.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              The project did not emerge from blank product strategy.
              It emerged from a real attempt to give form to an internal vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
