"use client";

import { useEffect, useRef, useCallback } from "react";
import { Github, ArrowUpRight, ExternalLink, Mail, Code, Heart } from "lucide-react";

const projectLinks = [
  { label: "YuuKi v0.1", url: "https://yuuki-web.vercel.app/" },
  { label: "YuuKi RxG", url: "https://yuuki.opceanai.com/" },
  { label: "Doki", url: "https://doki.opceanai.com" },
  { label: "awa-omg", url: "https://aguita.site" },
];

const orgLinks = [
  { label: "GitHub", url: "https://github.com/OpceanAI" },
  { label: "Hugging Face", url: "https://huggingface.co/OpceanAI" },
];

const emails = [
  { label: "General", email: "opceanai@gmail.com" },
  { label: "Business", email: "contact@opceanai.com" },
  { label: "Personal", email: "aguitachan3@gmail.com" },
];

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = "ontouchstart" in window;
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (isMobile.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 8;
    const tiltY = (x - 0.5) * -8;
    ref.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.setProperty("--mx", `${x * 100}%`);
    ref.current.style.setProperty("--my", `${y * 100}%`);
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    ref.current.style.transition = "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 300);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-24 px-4 border-t border-border-default">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-display text-xl font-semibold text-text-primary chromatic-hover">OpceanAI</span>
            <p className="text-xs font-mono text-text-quaternary mt-2">2023 -- {year}</p>
            <p className="text-sm text-text-tertiary mt-4 leading-relaxed">
              A growing system of ideas that learned how to become real.
            </p>
          </div>

          {/* Projects */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-text-quaternary mb-4">Projects</h4>
            <ul className="space-y-3">
              {projectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-tertiary hover:text-accent transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-text-quaternary mb-4">Organization</h4>
            <ul className="space-y-3">
              {orgLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-tertiary hover:text-accent transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-text-quaternary mb-4">Contact</h4>
            <ul className="space-y-3">
              {emails.map((e) => (
                <li key={e.label}>
                  <p className="text-xs text-text-quaternary">{e.label}</p>
                  <a href={`mailto:${e.email}`} className="text-sm text-text-tertiary hover:text-accent transition-colors font-mono">
                    {e.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://github.com/OpceanAI" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-text-quaternary">
            <span className="font-mono">Built with Next.js, React, Three.js, and Liquid Glass</span>
            <span className="hidden sm:inline text-text-quaternary">--</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-accent" /> by awa-omg
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
