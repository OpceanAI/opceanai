"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Brain, Calendar, GitBranch, Heart, Zap, ArrowRight } from "lucide-react";

const timeline = [
  {
    version: "v0.1",
    date: "2025",
    label: "First Prototype",
    description: "The first prototype of the OpceanAI Lab era. Born from curiosity, emotional context, and a desire to give form to an internal vision.",
  },
  {
    version: "NxG",
    date: "2026",
    label: "Next Generation",
    description: "The continuing development of the original AI line. Represents the evolution from initial prototype to a more capable system.",
  },
  {
    version: "RxG",
    date: "2026",
    label: "Refined Generation",
    description: "The current state of the YuuKi lineage. The most mature version, representing years of iteration and learning.",
  },
];

const renameDetails = [
  { label: "Iris", desc: "The first milestone. The codename of the first AI born on January 12, 2026.", icon: Zap },
  { label: "YuuKi", desc: "The real symbol. A tribute to Yuu from Girls' Last Tour + a Japanese snow-like suffix.", icon: Heart },
];

export default function DetailYuuki() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".yuuki-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-yuuki" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent yuuki-detail-item">Flagship Model</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight yuuki-detail-item">
              YuuKi
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto yuuki-detail-item">
              The central intellectual line of OpceanAI.
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto yuuki-detail-item">
              It is not just a model name. It is a lineage.
              From v0.1 to NxG to RxG — each version represents the continuing development of the original AI line.
            </p>
          </div>

          {/* The Name Origin */}
          <div className="glass-panel p-10 text-left yuuki-detail-item">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-text-primary">The Origin of the Name</h3>
                <p className="text-sm text-text-quaternary mt-1">Born from emotion, not product strategy</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
              <p>
                Around October 2025, after personal problems, awa entered a period of depression.
                During that time, <strong className="text-text-primary">Girls&apos; Last Tour</strong> became deeply meaningful.
                Its style, atmosphere, and emotional tone made a strong impact.
              </p>
              <p>
                After finishing the manga, awa felt unable to continue carrying that emotional state in the same way.
                A Discord bot called <strong className="text-text-primary">Yuki</strong> was created, but it did not become what was hoped for, and it was eventually discontinued.
              </p>
              <p>
                Even so, that emotional path remained important, because it became part of the name and identity of what would later become <strong className="text-accent font-medium">YuuKi</strong>.
              </p>
            </div>
          </div>

          {/* From Iris to YuuKi */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center yuuki-detail-item">From Iris to YuuKi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {renameDetails.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="glass-panel p-8 text-left yuuki-detail-item">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${i === 0 ? "bg-surface-3" : "bg-accent-soft"} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${i === 0 ? "text-text-tertiary" : "text-accent"}`} />
                      </div>
                      <div>
                        <p className={`font-display text-lg font-medium ${i === 0 ? "text-text-tertiary" : "text-accent"}`}>{item.label}</p>
                        <p className="text-xs text-text-quaternary">{i === 0 ? "First milestone" : "The real symbol"}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-tertiary leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center yuuki-detail-item">The Lineage</h3>
            <div className="space-y-6">
              {timeline.map((v, i) => (
                <div key={v.version} className="glass-panel p-8 text-left yuuki-detail-item group">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0">
                      <Brain className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-display text-xl font-medium text-text-primary group-hover:text-accent transition-colors">{v.version}</h4>
                        <span className="text-xs font-mono text-text-quaternary bg-surface-2 px-2 py-0.5 rounded">{v.date}</span>
                        <span className="text-xs text-text-tertiary">{v.label}</span>
                      </div>
                      <p className="text-sm text-text-tertiary leading-relaxed">{v.description}</p>
                    </div>
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="flex justify-center mt-6">
                      <ArrowRight className="w-4 h-4 text-text-quaternary rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why it matters */}
          <div className="glass-panel p-10 text-center yuuki-detail-item">
            <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
              &ldquo;This rename turned a technical milestone into an identity.
              Iris was the first milestone. YuuKi became the real symbol.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
