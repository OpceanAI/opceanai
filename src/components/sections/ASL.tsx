"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Cpu, Code, Terminal, Server } from "lucide-react";

const techStack = [
  { icon: Code, label: "C++", desc: "Core systems programming and performance-critical paths" },
  { icon: Terminal, label: "Rust", desc: "Memory safety and systems-level correctness" },
  { icon: Cpu, label: "Modified proot", desc: "Syscall handling layer for Android compatibility" },
];

export default function ASL() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".asl-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-12">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary asl-item">Future</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight asl-item">ASL</h2>
          <p className="text-text-primary text-xl font-medium leading-relaxed max-w-lg mx-auto asl-item">
            Android Subsystem for Linux
          </p>

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto asl-item">
            An alternative to Microsoft&apos;s WSL.
            The next step for OpceanAI.
          </p>

          <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto asl-item">
            ASL is focused on implementing a complete Linux kernel running in userspace,
            so that Linux applications believe they are running on native Linux rather than Android.
          </p>

          <div className="glass-panel glass-shimmer p-8 mx-auto max-w-lg text-left asl-item haptic-tap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-text-tertiary" />
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-lg font-medium text-text-primary">How it works</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  To the Android system, ASL appears as just another process consuming resources.
                </p>
                <p className="text-sm text-text-primary font-medium leading-relaxed">
                  But internally, it is a real kernel.
                </p>
              </div>
            </div>
          </div>

          <div className="divider max-w-xs mx-auto asl-item" />

          <h3 className="font-display text-xl font-medium text-text-primary asl-item">Technical direction</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {techStack.map((t) => (
              <div key={t.label} className="glass-panel glass-shimmer p-6 text-left asl-item haptic-tap">
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mb-4">
                  <t.icon className="w-5 h-5 text-text-tertiary" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-primary mb-1">{t.label}</h4>
                <p className="text-xs text-text-quaternary">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel glass-shimmer p-8 mx-auto max-w-lg text-left asl-item haptic-tap">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-research">kernel-first</span>
              <span className="badge badge-research">not distribution-first</span>
              <span className="badge badge-warning">planned</span>
            </div>
            <p className="text-sm text-text-tertiary leading-relaxed mb-3">
              OpceanAI will not build a distribution. Only the kernel.
              The rest is intended for the community.
            </p>
            <p className="text-sm text-text-quaternary italic">
              ASL development begins once Doki v1 is complete.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
