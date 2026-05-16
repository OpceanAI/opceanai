"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      toast("info", `Searching: "${query}"`);
      setQuery("");
    }
  };

  const titleWords = ["OpceanAI"];
  const subtitleWords = ["A", "technology", "organization", "focused", "on", "AI", "models,", "infrastructure,", "and", "systems."];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="ambient-glow" style={{ top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-8">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-text-primary tracking-tight" style={{ lineHeight: 1.05 }}>
            {mounted
              ? titleWords.map((word, i) => (
                  <span key={i} className="reveal-word" style={{ "--word-delay": `${i * 150 + 200}ms` } as React.CSSProperties}>
                    {word}{" "}
                  </span>
                ))
              : "OpceanAI"}
          </h1>

          <p className="font-display text-xl sm:text-2xl md:text-3xl text-text-tertiary font-light max-w-2xl mx-auto leading-snug">
            {mounted
              ? subtitleWords.map((word, i) => (
                  <span key={i} className="reveal-word" style={{ "--word-delay": `${i * 50 + 600}ms` } as React.CSSProperties}>
                    {word}{" "}
                  </span>
                ))
              : "A technology organization focused on AI models, infrastructure, and systems."}
          </p>

          <p className="text-base sm:text-lg text-text-quaternary max-w-lg mx-auto leading-relaxed reveal-word" style={{ "--word-delay": "1200ms" } as React.CSSProperties}>
            OpceanAI builds models, tools, and deep systems that turn ideas into infrastructure.
          </p>

          <p className="text-sm text-text-quaternary max-w-md mx-auto leading-relaxed reveal-word" style={{ "--word-delay": "1400ms" } as React.CSSProperties}>
            This is not a brand that was assembled for marketing.
            This is a project that grew through experimentation, constraints, failures, learning, and persistence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full reveal-word" style={{ "--word-delay": "1500ms" } as React.CSSProperties}>
          <div
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
              placeholder="Explore the ecosystem..."
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-quaternary text-base font-body"
              aria-label="Search"
            />
            <button type="submit" className="shrink-0 w-10 h-10 rounded-full bg-text-primary/10 hover:bg-text-primary/15 flex items-center justify-center transition-colors duration-200" aria-label="Submit">
              <ArrowRight className="w-4 h-4 text-text-primary" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 reveal-word" style={{ "--word-delay": "1800ms" } as React.CSSProperties}>
          <a href="#origin" className="btn-secondary">Explore the story</a>
          <a href="#ecosystem" className="btn-ghost">View the ecosystem</a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
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
