"use client";

import { ReactNode, CSSProperties, useRef } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  variant?: "default" | "editorial" | "minimal";
}

export default function GlassCard({ children, className = "", style, hover = true, variant = "default" }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mx", `${x}%`);
    cardRef.current.style.setProperty("--my", `${y}%`);
  };

  const variants = {
    default: "rounded-[var(--radius-card)] p-6",
    editorial: "rounded-[28px] p-8",
    minimal: "rounded-2xl p-4 bg-white/10 dark:bg-[#0A0A12]/20",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`
        glass-card
        ${variants[variant]}
        transition-all duration-[var(--duration-quick)] ease-[var(--ease-gentle)]
        ${hover ? "hover:-translate-y-1 active:scale-[0.98] cursor-pointer" : ""}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}
