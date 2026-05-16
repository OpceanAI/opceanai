"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Cpu, Code, Terminal } from "lucide-react";

const techStack = [
  { icon: Code, label: "C++", desc: "Core systems" },
  { icon: Terminal, label: "Rust", desc: "Safety & performance" },
  { icon: Cpu, label: "proot", desc: "Syscall handling" },
];

export default function ASL() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".asl-item");
    animate(items, {
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary mb-6 asl-item opacity-0">Future</span>
        <h2 className="section-heading mb-6 asl-item opacity-0">ASL</h2>
        <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-4 asl-item opacity-0">
          Android Subsystem for Linux. An alternative to Microsoft&apos;s WSL.
        </p>
        <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto mb-12 asl-item opacity-0">
          A complete Linux kernel running in userspace, so Linux applications believe they are running on native Linux rather than Android.
          To the Android system, ASL appears as just another process. Internally, it is a real kernel.
        </p>

        <div ref={itemsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {techStack.map((t) => (
            <div key={t.label} className="asl-item opacity-0 glass-panel p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mb-4">
                <t.icon className="w-5 h-5 text-text-tertiary" />
              </div>
              <h3 className="font-display text-sm font-medium text-text-primary mb-1">{t.label}</h3>
              <p className="text-xs text-text-quaternary">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 asl-item opacity-0">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="badge badge-research">kernel-first</span>
            <span className="badge badge-research">not distribution-first</span>
            <span className="badge badge-warning">planned</span>
          </div>
          <p className="text-xs text-text-quaternary italic">
            ASL development begins once Doki v1 is complete. The rest is intended for the community.
          </p>
        </div>
      </div>
    </section>
  );
}
