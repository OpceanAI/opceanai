import { Github, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 border-t border-white/10 dark:border-[#475569]/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="font-display text-lg font-medium text-deep-navy/80 dark:text-[#F1F5F9]/80 transition-colors duration-300">
            OpceanAI
          </span>
          <span className="text-xs font-mono text-museum-blue/40 dark:text-[#94A3B8]/40 transition-colors duration-300">
            2023 — {year} · A calm surface for complex ideas
          </span>
        </div>

        <nav className="flex items-center gap-6">
          {["Projects", "Docs", "System", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-museum-blue/60 dark:text-[#94A3B8] hover:text-deep-navy dark:hover:text-[#F1F5F9] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full glass-surface-tertiary flex items-center justify-center text-museum-blue/50 dark:text-[#94A3B8] hover:text-deep-navy dark:hover:text-[#F1F5F9] transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full glass-surface-tertiary flex items-center justify-center text-museum-blue/50 dark:text-[#94A3B8] hover:text-deep-navy dark:hover:text-[#F1F5F9] transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
