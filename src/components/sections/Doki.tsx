"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Container, Shield, Smartphone } from "lucide-react";

const capabilities = [
  {
    icon: Container,
    title: "OCI Compatible",
    desc: "Full compatibility with OCI container images. Run standard Docker containers on Android.",
  },
  {
    icon: Shield,
    title: "4 Isolation Layers",
    desc: "Multiple security layers depending on the environment. Adaptable isolation from sandboxed to full system-level.",
  },
  {
    icon: Smartphone,
    title: "Android Native",
    desc: "Bringing Docker containers directly to Android devices. No cloud dependency, no remote server.",
  },
];

export default function Doki() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".doki-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="system" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div ref={itemsRef} className="space-y-12">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent doki-item">Current Product</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-text-primary tracking-tight leading-tight doki-item">Doki</h2>

          <p className="text-text-primary text-xl font-medium leading-relaxed max-w-lg mx-auto doki-item">
            Bringing Docker containers to Android.
          </p>

          <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto doki-item">
            The most recent project, launched in <strong className="text-text-primary font-medium">May 2026</strong>.
            Doki is a system focused on bringing Docker containers to Android.
          </p>

          <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto doki-item">
            It is compatible with OCI images and supports four layers of isolation depending on the environment.
          </p>

          <div className="divider max-w-xs mx-auto doki-item" />

          {/* 3 highlighted capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {capabilities.map((c) => (
              <div key={c.title} className="glass-panel glass-spotlight p-8 doki-item">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center mb-5">
                  <c.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-base font-medium text-text-primary mb-2">{c.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="divider max-w-xs mx-auto doki-item" />

          <div className="space-y-4 doki-item">
            <p className="text-text-primary text-lg font-medium leading-relaxed max-w-lg mx-auto">
              Doki is important because it represents the move from model research toward platform infrastructure.
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-md mx-auto">
              This is not only about AI anymore.
              It is about running systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
