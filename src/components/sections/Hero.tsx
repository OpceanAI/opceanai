"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const el = inputRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      toast("info", `Searching: "${query}"`);
      setQuery("");
    }
  };

  const headingWords = ["OpceanAI"];
  const subtitleWords = ["Building", "intelligent", "systems", "that", "feel", "natural."];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="ambient-glow" style={{ top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div className="max-w-3xl w-full text-center space-y-10 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 reveal-word" style={{ "--word-delay": "100ms" } as React.CSSProperties}>
            <span className="status-dot-pulse text-accent" />
            <span className="badge badge-active">Intelligent Systems</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-text-primary tracking-tight" style={{ lineHeight: 1.05 }}>
            {mounted
              ? headingWords.map((word, i) => (
                  <span key={i} className="reveal-word" style={{ "--word-delay": `${i * 100 + 200}ms` } as React.CSSProperties}>
                    {word}{" "}
                  </span>
                ))
              : "OpceanAI"}
          </h1>

          <p className="font-display text-xl sm:text-2xl text-text-tertiary font-light max-w-xl mx-auto leading-snug">
            {mounted
              ? subtitleWords.map((word, i) => (
                  <span key={i} className="reveal-word" style={{ "--word-delay": `${i * 60 + 500}ms` } as React.CSSProperties}>
                    {word}{" "}
                  </span>
                ))
              : "Building intelligent systems that feel natural."}
          </p>

          <p className="text-base text-text-quaternary max-w-lg mx-auto leading-relaxed reveal-word" style={{ "--word-delay": "800ms" } as React.CSSProperties}>
            A calm surface for complex ideas. Explore projects, tools, and living interfaces where clarity meets luminous depth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
          <div
            ref={inputRef}
            className={`
              glass-spotlight
              relative flex items-center gap-3
              rounded-[var(--radius-pill)]
              transition-all duration-300
              ${focused ? "scale-[1.01]" : ""}
            `}
            style={{
              padding: "6px 6px 6px 20px",
              background: focused ? "var(--glass-bg-hover)" : "var(--glass-bg)",
              border: `1px solid ${focused ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
              boxShadow: focused
                ? "var(--shadow-lg), 0 0 0 2px var(--color-accent-glow)"
                : "var(--shadow-md)",
            }}
          >
            <Search className={`w-5 h-5 shrink-0 transition-colors duration-200 ${focused ? "text-accent" : "text-text-quaternary"}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="What would you like to explore?"
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-quaternary text-base font-body"
              aria-label="Search or ask a question"
            />
            <button
              type="submit"
              className="shrink-0 w-10 h-10 rounded-full bg-text-primary/10 hover:bg-text-primary/15 flex items-center justify-center transition-colors duration-200"
              aria-label="Submit"
            >
              <ArrowRight className="w-4 h-4 text-text-primary" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 reveal-word" style={{ "--word-delay": "1000ms" } as React.CSSProperties}>
          <a href="#projects" className="btn-secondary">Explore Projects</a>
          <a href="#docs" className="btn-secondary">Read Docs</a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border border-border-default flex items-start justify-center p-1.5" style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-text-quaternary/50" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
