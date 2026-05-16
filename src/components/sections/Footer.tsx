import { Github, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 border-t border-border-default">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-3">
            <span className="font-display text-xl font-semibold text-text-primary chromatic-hover">OpceanAI</span>
            <p className="text-sm text-text-tertiary max-w-sm leading-relaxed">
              A calm surface for complex ideas. Building intelligent systems that feel natural.
            </p>
            <span className="text-xs font-mono text-text-quaternary">2023 — {year}</span>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary">Navigate</h4>
            {["Projects", "Docs", "System", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-quaternary">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="divider mb-6" />

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
