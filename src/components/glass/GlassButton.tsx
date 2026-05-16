"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: boolean;
}

export default function GlassButton({
  children,
  variant = "primary",
  icon = true,
  className = "",
  ...props
}: GlassButtonProps) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
