"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Container, Shield, Layers, Smartphone } from "lucide-react";

const features = [
  { icon: Container, title: "OCI Compatible", desc: "Full compatibility with OCI container images." },
  { icon: Shield, title: "4 Isolation Layers", desc: "Multiple security layers depending on the environment." },
  { icon: Smartphone, title: "Android Native", desc: "Brings Docker containers directly to Android devices." },
];

export default function Doki() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".doki-item");
    animate(items, {
      opacity: [0, 1], translateY: ["30px", "0px"],
      duration: 700, delay: stagger(100, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="system" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-6 doki-item">Current Product</span>
        <h2 className="section-heading mb-6 doki-item">Doki</h2>
        <p className="text-text-tertiary text-lg leading-relaxed max-w-xl mx-auto mb-4 doki-item">
          Launched in May 2026. Doki is a system focused on bringing Docker containers to Android.
        </p>
        <p className="text-text-secondary text-base leading-relaxed max-w-lg mx-auto mb-12 doki-item">
          This is not only about AI anymore. It is about running systems.
        </p>

        <div ref={itemsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="doki-item glass-panel glass-spotlight p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-sm font-medium text-text-primary mb-1">{f.title}</h3>
              <p className="text-xs text-text-tertiary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
