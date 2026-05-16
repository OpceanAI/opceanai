"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Cpu, Code, Terminal, Server, Shield, GitBranch } from "lucide-react";

const techStack = [
  {
    icon: Code,
    label: "C++",
    desc: "Core systems programming and performance-critical paths",
    detail: "C++ provides the raw performance needed for syscall translation and kernel-level operations in userspace.",
  },
  {
    icon: Terminal,
    label: "Rust",
    desc: "Memory safety and systems-level correctness",
    detail: "Rust ensures that the most critical parts of ASL are memory-safe, preventing entire classes of bugs at compile time.",
  },
  {
    icon: Cpu,
    label: "Modified proot",
    desc: "Syscall handling layer for Android compatibility",
    detail: "A modified proot layer intercepts and translates Linux syscalls so they work within Android's userspace constraints.",
  },
];

const designPrinciples = [
  { icon: Server, label: "Kernel-first", desc: "OpceanAI will not build a distribution. Only the kernel. The rest is intended for the community." },
  { icon: Shield, label: "Not distribution-first", desc: "The focus is purely on the kernel layer. Community distributions can be built on top." },
  { icon: GitBranch, label: "Community-driven", desc: "Once the kernel is complete, the ecosystem of distributions and tools is left to the community." },
];

export default function DetailASL() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".asl-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-asl" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary doki-detail-item">Future — Planned</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight asl-detail-item">
              ASL
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto asl-detail-item">
              Android Subsystem for Linux
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto asl-detail-item">
              An alternative to Microsoft&apos;s WSL.
              ASL is focused on implementing a complete Linux kernel running in userspace,
              so that Linux applications believe they are running on native Linux rather than Android.
            </p>
          </div>

          {/* How it works */}
          <div className="glass-panel p-10 text-left asl-detail-item">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
                <Server className="w-6 h-6 text-text-tertiary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-text-primary">How it works</h3>
                <p className="text-sm text-text-quaternary mt-1">Invisible to Android, real to Linux</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
              <p>
                To the Android system, ASL appears as just another process consuming resources.
                It runs in userspace, managed by Android&apos;s process scheduler and resource manager.
              </p>
              <p className="text-text-primary font-medium">
                But internally, it is a real kernel.
              </p>
              <p>
                Linux applications running inside ASL believe they are on native Linux.
                They see a full Linux kernel, with proper syscalls, process management, and filesystem support.
                The modified proot layer handles the translation between Linux expectations and Android reality.
              </p>
            </div>
          </div>

          {/* Technical direction */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center asl-detail-item">Technical Direction</h3>
            {techStack.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="glass-panel p-8 text-left asl-detail-item group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-text-tertiary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-medium text-text-primary mb-2">{t.label}</h4>
                      <p className="text-sm text-text-tertiary leading-relaxed mb-3">{t.desc}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{t.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Design principles */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center asl-detail-item">Design Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {designPrinciples.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="glass-panel p-6 text-center asl-detail-item">
                    <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-text-tertiary" />
                    </div>
                    <h4 className="font-display text-sm font-medium text-text-primary mb-2">{p.label}</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Development condition */}
          <div className="glass-panel p-10 text-center asl-detail-item">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
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
