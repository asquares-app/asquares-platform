import Image from "next/image";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

/**
 * Logo uses mix-blend-multiply on white backgrounds (navbar) so the JPEG's white
 * background disappears and only the black a²S mark is visible.
 * On dark backgrounds (footer) we use CSS filter to invert it to white.
 */
export function Logo({ variant = "dark", className = "h-9 w-auto", priority = false }: LogoProps) {
  if (variant === "light") {
    return (
      <Image
        src="/logo.png"
        alt="AsquareS"
        width={164}
        height={100}
        className={`object-contain [filter:brightness(0)_invert(1)] ${className}`}
      />
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="AsquareS"
      width={164}
      height={100}
      priority={priority}
      className={`object-contain mix-blend-multiply ${className}`}
    />
  );
}
