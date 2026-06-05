import Image from "next/image";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

/** Static logo for non-animated contexts (e.g. footer). */
export function Logo({ variant = "dark", className = "h-9 w-auto", priority = false }: LogoProps) {
  if (variant === "light") {
    return (
      <Image
        src="/logo-collapsed.svg"
        alt="AsquareS"
        width={350}
        height={214}
        className={`object-contain [filter:brightness(0)_invert(1)] ${className}`}
      />
    );
  }

  return (
    <Image
      src="/logo-collapsed.svg"
      alt="AsquareS"
      width={350}
      height={214}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
