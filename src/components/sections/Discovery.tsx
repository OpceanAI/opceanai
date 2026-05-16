"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";
import { Cpu, Brain } from "lucide-react";

export default function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".discovery-item");
    animate(items, {
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: 100, ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-6 discovery-item opacity-0">Discovery</span>
        <h2 className="section-heading mb-6 discovery-item opacity-0">The first encounter with LLMs</h2>
        <div ref={itemsRef} className="space-y-6">
          <p className="text-text-tertiary text-lg leading-relaxed discovery-item opacity-0">
            While thinking about how to build a first model of AI, the first interaction with LLMs happened.
            There was no deep familiarity with the modern AI ecosystem.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 discovery-item opacity-0">
            <span className="badge badge-research">No Hugging Face knowledge</span>
            <span className="badge badge-research">No modern AI tooling</span>
            <span className="badge badge-research">Just curiosity and code</span>
          </div>
          <p className="text-text-secondary text-base leading-relaxed discovery-item opacity-0">
            This moment represents the transition from <strong className="text-text-primary">building bots</strong> into <strong className="text-text-primary">building intelligence</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
