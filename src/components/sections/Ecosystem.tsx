"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Calculator, ArrowRight } from "lucide-react";
import SpotlightCard from "@/components/glass/SpotlightCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const yuuKiLine = [
  { version: "v0.1", label: "First prototype", desc: "The first prototype of the OpceanAI Lab era. Where it all began." },
  { version: "NxG", label: "Next generation", desc: "The continuing development of the original AI line." },
  { version: "RxG", label: "Refined generation", desc: "The current state of the YuuKi lineage." },
];

const ecosystemModels = [
  {
    name: "Yumo",
    tagline: "Specialized mathematics",
    description: "The Yumo models emerged as a specialized branch of the YuuKi ecosystem. Based on YuuKi, but specialized in mathematics. Demonstrates that OpceanAI creates targeted, domain-oriented models — specialized, focused, mathematical, structured.",
    image: "/yuuki/yuuki.jpg",
    badge: "badge-active",
  },
  {
    name: "OwO",
    tagline: "OpceanAI with Omni-Reasoning",
    description: "Short, memorable, and identity-driven. Shows that OpceanAI uses naming not only as branding, but as architectural identity.",
    image: "/owo/OwO.webp",
    badge: "badge-research",
  },
  {
    name: "OvO",
    tagline: "OpceanAI v0",
    description: "Origin and versioning as architectural identity. Paired with OwO — one for reasoning, one for origin/versioning.",
    image: "/ovo/OvO.webp",
    badge: "badge-research",
  },
  {
    name: "Yaki",
    tagline: "Multimodal",
    description: "Based on YuuKi, enhanced with multimodal abilities. Capabilities injected via LLaVA. A non-native VL model — different from YuuKi VL models. Shows that OpceanAI is not limited to one modality or one architecture style.",
    image: "/yaki/Yaki.webp",
    badge: "badge-experimental",
  },
  {
    name: "Imprint",
    tagline: "Multimodal research",
    description: "The Imprint line expands the ecosystem into multimodal territory alongside Yaki. Exploring multiple paths toward intelligence.",
    image: "/imprint/nhe.webp",
    badge: "badge-research",
  },
  {
    name: "Tsuki",
    tagline: "Token compression",
    description: "A token compression model created as a quiet contribution to the ecosystem. Trained on 4,160 bilingual examples (Spanish and English), six different task types. Result: average 57.6% token reduction. Its value is precision, not loud branding.",
    image: "/tsuki/tsuki.webp",
    badge: "badge-active",
  },
];

export default function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".eco-item");
    animate(items, {
      translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "center" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="ecosystem" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={itemsRef} className="space-y-32">
          {/* YuuKi Line */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent eco-item">The YuuKi Line</span>
            <h2 className="section-heading eco-item">From YuuKi v0.1 to YuuKi RxG</h2>
            <p className="section-subtitle eco-item">
              YuuKi is the central intellectual line of OpceanAI.
              It is not just a model name. It is a lineage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {yuuKiLine.map((v, i) => (
                <SpotlightCard key={v.version}>
                  <div className="glass-panel glass-spotlight glass-shimmer p-8 text-left eco-item group haptic-tap hover-lift hover-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden hover-image-zoom">
                        <img src="/yuuki/yuuki.jpg" alt={v.version} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-display text-lg font-medium text-text-primary">{v.version}</p>
                        <p className="text-xs text-text-quaternary">{v.label}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-tertiary leading-relaxed">{v.desc}</p>
                    {i < yuuKiLine.length - 1 && (
                      <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-text-quaternary" />
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Other models */}
          <div className="text-center">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary eco-item">The Full Ecosystem</span>
            <h2 className="section-heading eco-item">Beyond YuuKi</h2>
            <p className="section-subtitle eco-item">
              OpceanAI does not only create general-purpose systems.
              It creates targeted, domain-oriented models and explores multiple paths toward intelligence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              {ecosystemModels.map((model) => (
                <SpotlightCard key={model.name}>
                  <div className="glass-panel glass-spotlight glass-shimmer group cursor-pointer eco-item haptic-tap hover-lift hover-border">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110 hover-image-zoom">
                          <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`badge ${model.badge}`}>
                          <span className="status-dot" />
                          {model.tagline}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-medium text-text-primary group-hover:text-accent transition-colors duration-200">
                          {model.name}
                        </h3>
                        <p className="text-sm text-text-tertiary mt-1.5 leading-relaxed">{model.description}</p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Tsuki highlight */}
          <ScrollReveal animation="scale">
            <div className="text-center">
              <SpotlightCard intensity={1.5}>
                <div className="glass-panel glass-spotlight glass-shimmer glass-edge-glow p-10 mx-auto max-w-2xl text-left eco-item haptic-tap hover-lift">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
                  <img src="/tsuki/tsuki.webp" alt="Tsuki" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-text-primary">Tsuki — Token Compression</h3>
                  <p className="text-sm text-text-quaternary mt-1">A quiet contribution to the ecosystem</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="font-display text-2xl font-medium text-accent">4,160</p>
                  <p className="text-xs text-text-quaternary mt-1">Bilingual examples</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-medium text-accent">6</p>
                  <p className="text-xs text-text-quaternary mt-1">Task types</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-medium text-accent">57.6%</p>
                  <p className="text-xs text-text-quaternary mt-1">Token reduction</p>
                </div>
              </div>

              <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                Tsuki was trained on Spanish and English examples across six different task types.
                The result was an average 57.6% token reduction.
              </p>

              <div className="divider" />

              <p className="text-sm text-text-secondary italic leading-relaxed">
                &ldquo;Quality over noise, even without recognition.&rdquo;
              </p>
                </div>
              </SpotlightCard>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
