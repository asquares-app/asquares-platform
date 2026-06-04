"use client";

import { Children, type ReactNode } from "react";

const NAV_H = 80;   // fixed navbar height px
const PEEK = 16;    // each subsequent card peeks this many px below previous

/**
 * Each sticky section gets 100vh of scroll runway so the user sees the full
 * card before the next one slides over it.  All critical sticky properties use
 * inline styles — not Tailwind responsive classes — to guarantee they compile
 * and apply at every viewport width without any breakpoint ambiguity.
 */
function ProductCard({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
  total: number;
}) {
  const stickyTop = NAV_H + index * PEEK;
  // Give cards as much height as possible — only subtract the sticky top + small breathing gap
  const cardMaxH = `calc(100dvh - ${NAV_H + 16}px)`;

  return (
    <div
      style={{
        position: "sticky",
        top: stickyTop,
        zIndex: index + 1,
        /* Each card occupies 100vh of scroll runway.
           The last card also needs 100vh so the third card stays
           fully visible before the about section scrolls up. */
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem 1.5rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "80rem",          /* max-w-7xl */
          maxHeight: cardMaxH,
          overflowY: "auto",
          /* hide scrollbar — content is compact enough to not need it,
             but if a viewport is very short this prevents content loss */
          scrollbarWidth: "none",
        }}
        className="rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_28px_70px_-28px_rgba(15,23,42,0.14)]"
      >
        {children}
      </div>
    </div>
  );
}

export function ProductStack({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    /**
     * No overflow / position / transform on the container.
     * Default block flow + padding at the bottom so the last sticky card
     * is fully visible before the next section intrudes.
     */
    <div style={{ paddingBottom: "18vh" }}>
      {items.map((child, index) => (
        <ProductCard key={index} index={index} total={items.length}>
          {child}
        </ProductCard>
      ))}
    </div>
  );
}
