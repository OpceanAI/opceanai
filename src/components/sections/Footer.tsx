import { Github, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 border-t border-border-default">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="font-display text-lg font-medium text-text-primary/80">
            OpceanAI
          </span>
          <span className="text-xs font-mono text-text-quaternary">
            2023 — {year} · A calm surface for complex ideas
          </span>
        </div>

        <nav className="flex items-center gap-6">
          {["Projects", "Docs", "System", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-text-tertiary hover:text-text-primary transition-colors duration-200"
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
            className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
