/**
 * Bespoke sumi-ink line marks — one house stroke style used everywhere a
 * lucide-react icon used to sit: 1.5px stroke, round caps/joins, no fill
 * except small accent dots, 24x24 grid. These replace lucide-react entirely
 * so every glyph on the site is hand-authored rather than pulled from a
 * generic icon pack. Sized purely via the `className` (w-/h- utilities),
 * matching how the previous lucide icons were consumed.
 */
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ——— Navigation / chrome ——— */

export function Command(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="17" cy="7" r="2.4" />
      <circle cx="7" cy="17" r="2.4" />
      <circle cx="17" cy="17" r="2.4" />
      <path d="M9.4 7h5.2M9.4 17h5.2M7 9.4v5.2M17 9.4v5.2" />
    </Base>
  );
}

export function Search(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20 20" />
    </Base>
  );
}

export function Menu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6.5h16M4 12h13M4 17.5h16" />
    </Base>
  );
}

export function X(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20V5" />
      <path d="M6.5 10.5 12 5l5.5 5.5" />
    </Base>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12h15" />
      <path d="M13.5 6.5 19 12l-5.5 5.5" />
    </Base>
  );
}

export function ExternalLink(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 6H5.5a1 1 0 0 0-1 1v11.5a1 1 0 0 0 1 1H17a1 1 0 0 0 1-1V15" />
      <path d="M13 4h6.5v6.5" />
      <path d="M10 14 19.3 4.7" />
    </Base>
  );
}

/* ——— Status / toast ——— */

export function CheckCircle(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3 10.7 14.7l5-5.2" />
    </Base>
  );
}

export function AlertCircle(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4 21 19H3Z" />
      <path d="M12 9.8v3.8" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function Info(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12 11v5.3" />
    </Base>
  );
}

/* ——— Spotlight command list ——— */

export function FileText(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4" />
    </Base>
  );
}

export function Github(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="6.5" cy="6" r="2" />
      <circle cx="6.5" cy="18" r="2" />
      <circle cx="17.5" cy="12" r="2" />
      <path d="M6.5 8v8" />
      <path d="M6.5 12h6.5a4.5 4.5 0 0 0 4.5-4.5" />
    </Base>
  );
}

export function BookOpen(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 6.5c-1.6-1.3-4-2-6.5-2v13c2.5 0 4.9.7 6.5 2 1.6-1.3 4-2 6.5-2v-13c-2.5 0-4.9.7-6.5 2Z" />
      <path d="M12 6.5V19.5" />
    </Base>
  );
}

export function Layers(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4 4 8.2 12 12.4 20 8.2 12 4Z" />
      <path d="M4 12.2 12 16.4 20 12.2" />
      <path d="M4 16.2 12 20.4 20 16.2" />
    </Base>
  );
}

/* ——— Detail view content marks ——— */

export function Brain(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 15c1.5 1.6 3.5 2.5 6 2.5s4.5-.9 6-2.5" />
      <path d="M5 11c1-3.2 3.5-5 7-5s6 1.8 7 5" />
      <path d="M9 9.3c.6-1 1.6-1.5 3-1.5s2.4.5 3 1.5" />
    </Base>
  );
}

export function Calendar(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M4 10h16" />
      <path d="M8 3.5v3.5M16 3.5v3.5" />
    </Base>
  );
}

export function GitBranch(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="7" cy="6" r="2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="15" r="2" />
      <path d="M7 8v8" />
      <path d="M17 13c0-3.5-2.8-6-6.5-6H9" />
    </Base>
  );
}

export function Heart(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19.5c-3.6-2.4-8-5.6-8-9.8a4.7 4.7 0 0 1 8-3.3 4.7 4.7 0 0 1 8 3.3c0 4.2-4.4 7.4-8 9.8Z" />
    </Base>
  );
}

export function Zap(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z" />
    </Base>
  );
}

export function Container(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </Base>
  );
}

export function Shield(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 19 6v5.5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" />
    </Base>
  );
}

export function Smartphone(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10.5 19h3" />
    </Base>
  );
}

export function Server(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4.5" width="17" height="6.5" rx="1.3" />
      <rect x="3.5" y="13" width="17" height="6.5" rx="1.3" />
      <circle cx="7" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="16.25" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function Cpu(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1.2" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9 4v2.3M15 4v2.3M9 17.7V20M15 17.7V20M4 9h2.3M4 15h2.3M17.7 9H20M17.7 15H20" />
    </Base>
  );
}

export function Code(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 8 4.5 12 9 16" />
      <path d="M15 8l4.5 4-4.5 4" />
    </Base>
  );
}

export function Terminal(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M7 9.5 10.5 12 7 14.5" />
      <path d="M12.5 14.5h4" />
    </Base>
  );
}

export function Target(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function Minimize2(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 3v4.5H4.5" />
      <path d="M15 3v4.5H19.5" />
      <path d="M9 21v-4.5H4.5" />
      <path d="M15 21v-4.5H19.5" />
    </Base>
  );
}

export function Languages(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6.5h8" />
      <path d="M8 4v2.5" />
      <path d="M8 6.5c0 3-2 5-4.5 5.8" />
      <path d="M5 12c1.3.9 2.8 1.4 4.5 1.4" />
      <path d="M13 20l3.5-8.5L20 20" />
      <path d="M14.2 17.3h4.6" />
    </Base>
  );
}

export function BarChart3(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20h16" />
      <path d="M5 20v-7" />
      <path d="M12 20V8" />
      <path d="M19 20v-6.5" />
    </Base>
  );
}

export function Database(props: IconProps) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.7" />
      <path d="M5 6v12c0 1.5 3.1 2.7 7 2.7s7-1.2 7-2.7V6" />
      <path d="M5 12c0 1.5 3.1 2.7 7 2.7s7-1.2 7-2.7" />
    </Base>
  );
}

export function FileCode(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9.5 13 8 14.7l1.5 1.7" />
      <path d="M13 13l1.5 1.7-1.5 1.7" />
    </Base>
  );
}
