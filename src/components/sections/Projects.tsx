"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import GlassCard from "@/components/glass/GlassCard";
import {
  Brain,
  Container,
  Calculator,
  Minimize2,
  Eye,
  Fingerprint,
} from "lucide-react";

const projects = [
  {
    name: "Doki",
    description: "Docker containers on Android. OCI images with 4 isolation layers.",
    category: "Infrastructure",
    status: "active",
    year: "2026",
    icon: Container,
  },
  {
    name: "YuuKi",
    description: "First generative language model. Fine-tuned from the ground up on mobile hardware.",
    category: "AI Model",
    status: "active",
    year: "2025",
    icon: Brain,
  },
  {
    name: "Yumo",
    description: "Mathematics-specialized models built on the YuuKi architecture.",
    category: "AI Model",
    status: "active",
    year: "2025",
    icon: Calculator,
  },
  {
    name: "Tsuki",
    description: "Token compression model. 57.6% reduction across 4,160 bilingual examples.",
    category: "Research",
    status: "active",
    year: "2025",
    icon: Minimize2,
  },
  {
    name: "Yaki",
    description: "Multimodal model with LLaVA-injected vision capabilities on YuuKi base.",
    category: "AI Model",
    status: "experimental",
    year: "2025",
    icon: Eye,
  },
  {
    name: "NHE",
    description: "Not Humanity Exam. Measures traces of human cognitive structure in AI systems.",
    category: "Research",
    status: "active",
    year: "2026",
    icon: Fingerprint,
  },
];

const statusColors: Record<string, string> = {
  active: "bg-washed-mint/60 dark:bg-[#38BDF8]/30",
  beta: "bg-aqua-glass/60 dark:bg-[#38BDF8]/20",
  experimental: "bg-faded-sky/60 dark:bg-[#38BDF8]/15",
  planning: "bg-dry-clay/60 dark:bg-[#475569]/40",
};

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !targetRef.current) return;

    const cards = targetRef.current.querySelectorAll(".project-card");

    animate(cards, {
      opacity: [0, 1],
      translateY: ["40px", "0px"],
      scale: [0.95, 1],
      duration: 600,
      delay: stagger(120, { from: "center" }),
      ease: "out(3)",
      autoplay: onScroll({
        container: containerRef.current,
        enter: "80%",
        leave: "100%",
      }),
    });
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
            Ecosystem
          </h2>
          <p className="text-museum-blue/70 dark:text-[#94A3B8] max-w-md mx-auto transition-colors duration-300">
            Models, infrastructure, and research — built from the ground up.
          </p>
        </div>

        <div
          ref={targetRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <GlassCard
                key={project.name}
                className="project-card opacity-0 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-aqua-glass/15 dark:bg-[#38BDF8]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-deep-navy dark:text-[#38BDF8]" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full ${statusColors[project.status]} text-deep-navy/70 dark:text-[#94A3B8] transition-colors duration-300`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {project.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-medium text-deep-navy dark:text-[#F1F5F9] transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-sm text-museum-blue/60 dark:text-[#94A3B8] mt-1 leading-relaxed transition-colors duration-300">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-[#475569]/40">
                  <span className="text-xs font-mono text-museum-blue/50 dark:text-[#94A3B8]/60 transition-colors duration-300">
                    {project.category}
                  </span>
                  <span className="text-xs text-aqua-glass dark:text-[#38BDF8] hover:text-deep-navy dark:hover:text-[#F1F5F9] transition-colors cursor-pointer">
                    Explore
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
