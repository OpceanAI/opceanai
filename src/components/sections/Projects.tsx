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

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "badge-active",
      experimental: "badge-experimental",
      research: "badge-research",
    };
    return colors[status] || "badge-active";
  };

  return (
    <section ref={containerRef} className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
            Ecosystem
          </h2>
          <p className="text-text-tertiary max-w-md mx-auto">
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
                className="project-card opacity-0"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className={`badge ${statusBadge(project.status)}`}>
                      <span className="status-dot" />
                      {project.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-medium text-text-primary">
                      {project.name}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-default">
                    <span className="text-xs font-mono text-text-quaternary">
                      {project.category}
                    </span>
                    <span className="text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer">
                      Explore
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
