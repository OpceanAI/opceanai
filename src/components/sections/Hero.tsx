"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import GlassButton from "@/components/glass/GlassButton";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Query:", query);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full text-center space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="status-dot text-accent" />
            <span className="badge badge-active">
              Intelligent Systems
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-text-primary tracking-tight" style={{ lineHeight: 1.05 }}>
            OpceanAI
          </h1>

          <p className="font-display text-xl sm:text-2xl text-text-tertiary font-light max-w-xl mx-auto leading-snug">
            Building intelligent systems that feel natural.
          </p>

          <p className="text-base text-text-quaternary max-w-lg mx-auto leading-relaxed">
            A calm surface for complex ideas. Explore projects, tools, and
            living interfaces where clarity meets luminous depth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
          <div
            ref={inputRef}
            className={`
              relative flex items-center gap-3
              rounded-[var(--radius-pill)]
              transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]
              ${focused ? "scale-[1.01]" : ""}
            `}
            style={{
              padding: "6px 6px 6px 20px",
              background: focused ? "rgba(15, 16, 17, 0.80)" : "rgba(15, 16, 17, 0.65)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: `1px solid ${focused ? "rgba(255, 255, 255, 0.10)" : "rgba(255, 255, 255, 0.06)"}`,
              boxShadow: focused
                ? "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(45, 212, 191, 0.15)"
                : "0 8px 32px rgba(0, 0, 0, 0.3)",
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
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-quaternary text-base font-body transition-colors duration-300"
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

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <GlassButton variant="secondary" icon={false}>
            Explore Projects
          </GlassButton>
          <GlassButton variant="secondary" icon={false}>
            Read Docs
          </GlassButton>
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
