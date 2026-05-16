"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Container, Shield, Smartphone, Calendar, Zap, Server } from "lucide-react";

const capabilities = [
  {
    icon: Container,
    title: "OCI Compatible",
    desc: "Full compatibility with OCI container images. Run standard Docker containers on Android without modification.",
    detail: "Doki accepts any OCI-compliant container image, meaning the vast ecosystem of Docker images works out of the box.",
  },
  {
    icon: Shield,
    title: "4 Isolation Layers",
    desc: "Multiple security layers depending on the environment. Adaptable isolation from sandboxed to full system-level.",
    detail: "The isolation layers adapt to the environment — from lightweight sandboxing for development to full system-level isolation for production workloads.",
  },
  {
    icon: Smartphone,
    title: "Android Native",
    desc: "Bringing Docker containers directly to Android devices. No cloud dependency, no remote server.",
    detail: "Doki runs entirely on-device. No cloud dependency means your containers run locally, with full control and zero latency.",
  },
];

const significance = [
  { icon: Zap, label: "From AI to Infrastructure", desc: "Doki represents the move from model research toward platform infrastructure." },
  { icon: Server, label: "Running Systems", desc: "This is not only about AI anymore. It is about running systems." },
  { icon: Calendar, label: "Launched May 2026", desc: "The most recent project in the OpceanAI ecosystem." },
];

export default function DetailDoki() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".doki-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-doki" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent doki-detail-item">Current Product</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight doki-detail-item">
              Doki
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto doki-detail-item">
              Bringing Docker containers to Android.
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto doki-detail-item">
              Launched in <strong className="text-text-primary">May 2026</strong>.
              Doki is a system focused on bringing Docker containers to Android.
              It is compatible with OCI images and supports four layers of isolation depending on the environment.
            </p>
          </div>

          {/* Capabilities */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center doki-detail-item">Capabilities</h3>
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="glass-panel p-8 text-left doki-detail-item group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-medium text-text-primary mb-2">{c.title}</h4>
                      <p className="text-sm text-text-tertiary leading-relaxed mb-3">{c.desc}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{c.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Significance */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center doki-detail-item">Why Doki Matters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {significance.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass-panel p-6 text-center doki-detail-item">
                    <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-text-tertiary" />
                    </div>
                    <h4 className="font-display text-sm font-medium text-text-primary mb-2">{s.label}</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote */}
          <div className="glass-panel p-10 text-center doki-detail-item">
            <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
              &ldquo;Doki is important because it represents the move from model research toward platform infrastructure.
              This is not only about AI anymore. It is about running systems.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
