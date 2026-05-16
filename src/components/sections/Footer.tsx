import { Github, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 border-t border-border-default">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <span className="font-display text-lg font-semibold text-text-primary chromatic-hover">OpceanAI</span>
            <span className="text-xs font-mono text-text-quaternary">2023 — {year} · A growing system of ideas</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/OpceanAI" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="divider mt-6 mb-4" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-quaternary">
          <span className="font-mono">Built with Next.js, React, and Liquid Glass</span>
          <span className="flex items-center gap-1">
            Designed with precision <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </footer>
  );
}
