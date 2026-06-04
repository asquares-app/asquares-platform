"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "gradient" | "white";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-lg shadow-blue-500/25 hover:bg-primary-dark hover:shadow-blue-500/40",
  secondary:
    "border border-slate-200 bg-white/80 text-slate-800 hover:bg-white hover:shadow-md",
  ghost:
    "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  gradient:
    "gradient-tea-btn text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40",
  white:
    "bg-white text-primary shadow-lg hover:shadow-xl hover:scale-[1.02]",
};

export function Button({
  children,
  href,
  variant = "primary",
  icon,
  showArrow = false,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollToSection(href);
    }
    onClick?.();
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href && !href.startsWith("#")) {
    return (
      <a href={href} className={classes} onClick={handleClick}>
        {icon}
        {children}
        {showArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </a>
    );
  }

  return (
    <button type="button" className={`group ${classes}`} onClick={handleClick}>
      {icon}
      {children}
      {showArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
