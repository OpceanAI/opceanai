"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, X, Sparkles, Zap, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { search, SearchResult, EasterEgg } from "@/lib/search";
import dynamic from "next/dynamic";

const AsciiHero = dynamic(() => import("@/components/three/AsciiHero"), {
  ssr: false,
  loading: () => null,
});

const categoryIcons: Record<string, React.ReactNode> = {
  model: <Sparkles className="w-4 h-4" />,
  project: <Zap className="w-4 h-4" />,
  research: <Search className="w-4 h-4" />,
  era: <Search className="w-4 h-4" />,
  concept: <Search className="w-4 h-4" />,
};

const subtitleLines = [
  "Bots became models.",
  "Models became systems.",
  "Systems became infrastructure.",
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [easterEgg, setEasterEgg] = useState<EasterEgg | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (currentLine >= subtitleLines.length) return;

    const line = subtitleLines[currentLine];
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedLines((prev) => [...prev, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [currentChar, currentLine]);

  useEffect(() => {
    if (query.trim()) {
      const { results: r, easterEgg: e } = search(query);
      setResults(r);
      setEasterEgg(e || null);
      setShowDropdown(true);
      setActiveIndex(0);

      if (e && e.action === "redirect" && e.target) {
        window.open(e.target, "_blank");
        setQuery("");
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    } else {
      setResults([]);
      setEasterEgg(null);
      setShowDropdown(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback((item: SearchResult) => {
    setShowDropdown(false);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();

    if (item.sectionId.startsWith("detail-")) {
      window.location.hash = item.sectionId;
      toast("info", `Navigating to ${item.title}`);
    } else {
      const el = document.getElementById(item.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("search-highlight");
        setTimeout(() => el.classList.remove("search-highlight"), 2500);
        toast("info", `Navigating to ${item.title}`);
      } else {
        toast("info", `Section "${item.title}" -- coming soon`);
      }
    }
  }, [toast]);

  const handleEasterEgg = useCallback((egg: EasterEgg) => {
    setShowDropdown(false);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();

    if (egg.action === "redirect" && egg.target) {
      window.open(egg.target, "_blank");
    } else if (egg.action === "alert" && egg.message) {
      toast("info", egg.message);
    } else if (egg.action === "section" && egg.target) {
      const el = document.getElementById(egg.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("search-highlight");
        setTimeout(() => el.classList.remove("search-highlight"), 2500);
      }
    }
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (easterEgg) {
      handleEasterEgg(easterEgg);
    } else if (results.length > 0) {
      handleSelect(results[activeIndex] || results[0]);
    } else if (query.trim()) {
      toast("info", `No results for "${query}". Try: yuuki, doki, nhe, tsuki, origin`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (easterEgg) {
        handleEasterEgg(easterEgg);
      } else if (results.length > 0) {
        handleSelect(results[activeIndex] || results[0]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <AsciiHero />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-8">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-text-primary tracking-tight reveal-word" style={{ "--word-delay": "200ms", lineHeight: 1.05 } as React.CSSProperties}>
            OpceanAI
          </h1>

          <div className="space-y-2 min-h-[7rem] sm:min-h-[8rem]">
            {typedLines.map((line, i) => (
              <p
                key={i}
                className="font-display text-xl sm:text-2xl md:text-3xl text-text-tertiary font-light leading-snug"
              >
                {line}
              </p>
            ))}
            {currentLine < subtitleLines.length && (
              <p className="font-display text-xl sm:text-2xl md:text-3xl text-text-tertiary font-light leading-snug">
                {subtitleLines[currentLine].slice(0, currentChar)}
                <span
                  className="inline-block w-0.5 h-6 sm:h-8 bg-accent ml-0.5 align-middle"
                  style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
                />
              </p>
            )}
          </div>

          <p className="text-base sm:text-lg text-text-quaternary max-w-lg mx-auto leading-relaxed reveal-word" style={{ "--word-delay": "1200ms" } as React.CSSProperties}>
            Born on a Snapdragon 685 phone. Built through constraints, not resources.
            Now an ecosystem of models, systems, and infrastructure.
          </p>

          <p className="text-sm text-text-quaternary max-w-md mx-auto leading-relaxed reveal-word" style={{ "--word-delay": "1400ms" } as React.CSSProperties}>
            Not one project. A growing system of ideas that learned how to become real.
          </p>
        </div>

        <div className="max-w-xl mx-auto w-full relative reveal-word" style={{ "--word-delay": "1500ms" } as React.CSSProperties}>
          <form onSubmit={handleSubmit}>
            <div
              className={`
                glass-spotlight
                relative flex items-center gap-3
                rounded-[var(--radius-pill)]
                transition-all duration-300
                ${focused ? "scale-[1.01] rounded-b-none" : ""}
              `}
              style={{
                padding: "6px 6px 6px 20px",
                background: focused ? "var(--glass-bg-hover)" : "var(--glass-bg)",
                border: `1px solid ${focused ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
                boxShadow: focused
                  ? "var(--shadow-lg), 0 0 0 2px var(--color-accent-glow)"
                  : "var(--shadow-md)",
                borderBottomLeftRadius: showDropdown ? "0" : undefined,
                borderBottomRightRadius: showDropdown ? "0" : undefined,
              }}
            >
              <Search className={`w-5 h-5 shrink-0 transition-colors duration-200 ${focused ? "text-accent" : "text-text-quaternary"}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { setFocused(true); if (query.trim()) setShowDropdown(true); }}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Search the ecosystem..."
                className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-quaternary text-base font-body"
                aria-label="Search"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setShowDropdown(false); inputRef.current?.focus(); }}
                  className="shrink-0 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Clear"
                >
                  <X className="w-3.5 h-3.5 text-text-quaternary" />
                </button>
              )}
              <button type="submit" className="shrink-0 w-10 h-10 rounded-full bg-text-primary/10 hover:bg-text-primary/15 flex items-center justify-center transition-colors duration-200" aria-label="Submit">
                <ArrowRight className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          </form>

          {showDropdown && !easterEgg && results.length > 0 && (
            <div ref={dropdownRef} className="search-dropdown">
              <div className="search-suggestions-header">Results</div>
              {results.map((item, i) => (
                <div key={item.id}>
                  <div
                    className={`search-dropdown-item ${i === activeIndex ? "active" : ""}`}
                    onMouseDown={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className={`search-dropdown-icon ${item.category}`}>
                      {categoryIcons[item.category] || <Search className="w-4 h-4" />}
                    </div>
                    <div className="search-dropdown-text">
                      <p className="search-dropdown-title">{item.title}</p>
                      <p className="search-dropdown-desc">{item.description}</p>
                    </div>
                    <span className="search-dropdown-category">{item.category}</span>
                  </div>
                  {item.externalLinks && item.externalLinks.length > 0 && (
                    <div className="search-dropdown-links">
                      {item.externalLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="search-dropdown-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {showDropdown && !easterEgg && results.length === 0 && (
            <div ref={dropdownRef} className="search-dropdown">
              <div className="search-empty">
                <p>No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1">Try: yuuki, doki, nhe, tsuki, origin, sakura</p>
              </div>
            </div>
          )}
        </div>

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
