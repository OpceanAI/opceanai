"use client";

import { useScrollProgress } from "@/hooks/useScrollAnimations";

export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
