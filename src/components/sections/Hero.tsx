"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import GlassButton from "@/components/glass/GlassButton";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-museum-blue dark:text-[#38BDF8]" />
            <span className="font-mono text-xs tracking-wide text-deep-navy/80 dark:text-[#94A3B8]">
              Intelligent Systems
            </span>
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-deep-navy dark:text-[#F1F5F9] tracking-tight transition-colors duration-300"
            style={{ lineHeight: 1.05 }}
          >
            OpceanAI
          </h1>

          <p className="font-display text-xl sm:text-2xl text-museum-blue/80 dark:text-[#94A3B8] font-light max-w-xl mx-auto transition-colors duration-300 leading-snug">
            Building intelligent systems that feel natural.
          </p>

          <p className="text-base text-museum-blue/60 dark:text-[#94A3B8]/70 max-w-lg mx-auto leading-relaxed transition-colors duration-300">
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
              transition-all duration-[var(--duration-quick)] ease-[var(--ease-gentle)]
              ${focused ? "scale-[1.01]" : ""}
            `}
            style={{
              padding: "6px 6px 6px 20px",
              background: focused
                ? "rgba(255, 255, 255, 0.45)"
                : "rgba(255, 255, 255, 0.35)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: focused
                ? "0 12px 40px rgba(35, 24, 18, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
                : "0 8px 32px rgba(35, 24, 18, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            }}
          >
            <Search
              className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                focused ? "text-aqua-glass dark:text-[#38BDF8]" : "text-museum-blue/50 dark:text-[#94A3B8]/50"
              }`}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="What would you like to explore?"
              className="flex-1 bg-transparent outline-none text-deep-navy dark:text-[#F1F5F9] placeholder:text-museum-blue/40 dark:placeholder:text-[#94A3B8]/40 text-base font-body transition-colors duration-300"
              aria-label="Search or ask a question"
            />
            <button
              type="submit"
              className="shrink-0 w-10 h-10 rounded-full bg-aqua-glass/25 hover:bg-aqua-glass/35 dark:bg-[#38BDF8]/20 dark:hover:bg-[#38BDF8]/30 flex items-center justify-center transition-colors duration-200"
              aria-label="Submit"
            >
              <ArrowRight className="w-4 h-4 text-deep-navy dark:text-[#F1F5F9]" />
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
        <div
          className="w-6 h-10 rounded-full border-2 border-museum-blue/30 dark:border-[#94A3B8]/30 flex items-start justify-center p-1.5 transition-colors duration-300"
          style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-museum-blue/50 dark:bg-[#94A3B8]/50" />
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
