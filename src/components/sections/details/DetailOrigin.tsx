"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import { Calendar, Code, FileCode, Terminal, Zap, Heart } from "lucide-react";

const dna = [
  { icon: Zap, label: "Build first", desc: "Start building before you have all the answers" },
  { icon: Code, label: "Learn while building", desc: "Knowledge comes from doing, not planning" },
  { icon: Terminal, label: "Accept complexity", desc: "When needed, embrace the hard parts" },
  { icon: FileCode, label: "Use what's available", desc: "No perfect tools — just what works" },
  { icon: Heart, label: "Keep moving forward", desc: "Persistence over perfection" },
];

const firstProjects = [
  {
    name: "Sakura",
    icon: "S",
    color: "accent",
    details: [
      { label: "Language", value: "Python" },
      { label: "Structure", value: "Single main.py" },
      { label: "Size", value: "~11k lines" },
      { label: "Type", value: "Monolithic" },
    ],
    description: "A massive monolithic beginning. Written as a single main.py file with around 11,000 lines of code. A direct, bold, experimental approach that defined the early spirit of OpceanAI.",
  },
  {
    name: "Nebula",
    icon: "N",
    color: "info",
    details: [
      { label: "Language", value: "JavaScript / TypeScript" },
      { label: "Structure", value: "Modular" },
      { label: "Style", value: "Different approach" },
      { label: "Era", value: "Foundational" },
    ],
    description: "Built with JS/TS, representing a different implementation style. A contrasting path to Sakura, but part of the same foundational era that established the DNA of the organization.",
  },
];

export default function DetailOrigin() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll(".origin-detail-item");
    animate(items, {
      opacity: [0, 1], translateY: ["20px", "0px"],
      duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
      autoplay: onScroll({ container: sectionRef.current, enter: "80%", leave: "100%" }),
    });
  }, []);

  return (
    <section id="detail-origin" ref={sectionRef} className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef} className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent origin-detail-item">April 23, 2023</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight origin-detail-item">
              Origin
            </h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto origin-detail-item">
              Where it all began.
            </p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto origin-detail-item">
              OpceanAI was born on <strong className="text-text-primary">April 23, 2023</strong>,
              originally under the name <strong className="text-text-primary">Ocean</strong>.
              At that stage, the mission was simple: build bots for Discord and Telegram.
              That period became known as <strong className="text-text-primary">Bots New</strong>.
            </p>
          </div>

          {/* First Projects */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center origin-detail-item">
              The First Creations
            </h3>

            {firstProjects.map((project) => (
              <div key={project.name} className="glass-panel p-10 text-left origin-detail-item group">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${project.color === "accent" ? "bg-accent-soft" : "bg-info-soft"} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <span className={`text-xl font-display font-semibold ${project.color === "accent" ? "text-accent" : "text-info"}`}>
                      {project.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-2xl font-medium text-text-primary">{project.name}</h4>
                    <p className="text-sm text-text-quaternary mt-1">Bots New Era</p>
                  </div>
                </div>

                <p className="text-sm text-text-tertiary leading-relaxed mb-6">{project.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.details.map((d) => (
                    <div key={d.label} className="bg-surface-2 rounded-lg p-3 text-center">
                      <p className="text-xs text-text-quaternary mb-1">{d.label}</p>
                      <p className="text-sm font-medium text-text-primary">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DNA of the Era */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-medium text-text-primary text-center origin-detail-item">
              The DNA of This Era
            </h3>
            <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center origin-detail-item">
              This phase matters because it established the DNA of the organization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dna.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="glass-panel p-6 text-left origin-detail-item">
                    <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="font-display text-sm font-medium text-text-primary mb-2">{d.label}</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">{d.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote */}
          <div className="glass-panel p-10 text-center origin-detail-item">
            <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
              &ldquo;Sakura and Nebula were not just the first projects.
              They were the first signs of a system becoming an organization.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
