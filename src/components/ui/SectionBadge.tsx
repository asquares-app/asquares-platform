import type { ReactNode } from "react";

type BadgeVariant = "blue" | "green" | "purple" | "pink" | "white";

const variants: Record<BadgeVariant, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-600",
  green: "border-green-200 bg-green-50 text-green-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  pink: "border-pink-200 bg-pink-50 text-pink-600",
  white: "border-white/30 bg-white/20 text-white",
};

export function SectionBadge({
  icon,
  children,
  variant = "blue",
  className = "",
}: {
  icon?: ReactNode;
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
