import { ReactNode, ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: boolean;
}

export default function GlassButton({
  children,
  variant = "primary",
  icon = true,
  className = "",
  ...props
}: GlassButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-medium transition-all duration-[var(--duration-quick)] ease-[var(--ease-gentle)] focus:outline-none focus:ring-2 focus:ring-aqua-glass/50 hover:-translate-y-0.5 active:scale-[0.97]";

  const variants = {
    primary: "glass-btn-primary",
    secondary: "glass-btn-secondary",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
