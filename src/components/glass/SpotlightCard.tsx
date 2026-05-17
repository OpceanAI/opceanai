"use client";

import { useRef, useCallback } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function SpotlightCard({ children, className = "", intensity = 1 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--spotlight-x", `${x}%`);
    ref.current.style.setProperty("--spotlight-y", `${y}%`);
    ref.current.style.setProperty("--spotlight-intensity", intensity.toString());
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}
