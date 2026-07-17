"use client";

import { useCallback } from "react";
import HankoSeal from "@/components/svg/HankoSeal";

/**
 * Hanko seal CTA — the press transform lives on the svg root while the hover
 * stamp keyframe animates an inner group, so the two never fight. Each press
 * gets a ±0.5deg random rotation so no two stamps land identically, like a
 * hand-held stone seal.
 */
export default function SealCta({
  href,
  label,
  size = 44,
  className,
  ariaLabel,
}: {
  href: string;
  label?: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      const rot = (Math.random() - 0.5).toFixed(2);
      e.currentTarget.style.setProperty("--press-rot", `${rot}deg`);
    },
    []
  );

  return (
    <a
      href={href}
      className={`seal-cta ${className ?? ""}`}
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
    >
      <HankoSeal size={size} />
      {label && <span className="seal-label">{label}</span>}
    </a>
  );
}
