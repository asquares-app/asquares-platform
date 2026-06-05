"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const EXPANDED_SRC = "/logo-expanded.svg";
const COLLAPSED_SRC = "/logo-collapsed.svg";

/** Align cap-A vertically: expanded/collapsed SVG viewBoxes use different y offsets (44 vs 7). */
const EXPANDED_Y_ALIGN_RATIO = (39 - 3) / 214;
const EXPANDED_ANCHOR_RATIO = 162 / 974;

const EXPANDED_ASPECT = 974 / 214;
const COLLAPSED_ASPECT = 350 / 214;
const LOGO_SCALE = 0.7;
const BASE_HEIGHT = 36;
const DEFAULT_HEIGHT = BASE_HEIGHT * LOGO_SCALE;

const ANIMATION_DURATION = 0.55;
const KEYFRAME_TRANSITION: Transition = {
  duration: ANIMATION_DURATION,
  ease: [0.42, 0, 0.58, 1],
  times: [0, 0.45, 0.55, 1],
};

type LogoState = "expanded" | "collapsed" | "collapsing" | "expanding";
type LogoWidths = { expanded: number; collapsed: number; anchor: number };

type LogoTransitionProps = {
  className?: string;
  priority?: boolean;
};

const DEFAULT_WIDTHS: LogoWidths = {
  expanded: DEFAULT_HEIGHT * EXPANDED_ASPECT,
  collapsed: DEFAULT_HEIGHT * COLLAPSED_ASPECT,
  anchor: DEFAULT_HEIGHT * EXPANDED_ASPECT * EXPANDED_ANCHOR_RATIO,
};

function createLogoVariants(widths: LogoWidths, instant: boolean): {
  container: Variants;
  expandedLayer: Variants;
  collapsedLayer: Variants;
} {
  const { expanded, collapsed, anchor } = widths;
  const transition = instant ? { duration: 0 } : KEYFRAME_TRANSITION;

  return {
    container: {
      expanded: { width: expanded, transition },
      collapsed: { width: collapsed, transition },
      collapsing: {
        width: [expanded, anchor, anchor, collapsed],
        transition,
      },
      expanding: {
        width: [collapsed, anchor, anchor, expanded],
        transition,
      },
    },
    expandedLayer: {
      expanded: { width: expanded, transition },
      collapsed: { width: 0, transition },
      collapsing: {
        width: [expanded, anchor, 0, 0],
        transition,
      },
      expanding: {
        width: [0, 0, anchor, expanded],
        transition,
      },
    },
    collapsedLayer: {
      expanded: { width: 0, transition },
      collapsed: { width: collapsed, transition },
      collapsing: {
        width: [0, 0, anchor, collapsed],
        transition,
      },
      expanding: {
        width: [collapsed, anchor, anchor, 0],
        transition,
      },
    },
  };
}

function useLogoWidths(className: string) {
  const expandedRef = useRef<HTMLImageElement>(null);
  const collapsedRef = useRef<HTMLImageElement>(null);
  const [widths, setWidths] = useState(DEFAULT_WIDTHS);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const expanded = expandedRef.current?.getBoundingClientRect().width;
      const collapsed = collapsedRef.current?.getBoundingClientRect().width;

      if (expanded && collapsed) {
        setWidths({
          expanded,
          collapsed,
          anchor: expanded * EXPANDED_ANCHOR_RATIO,
        });
        setReady(true);
      }
    };

    measure();

    const expandedImg = expandedRef.current;
    const collapsedImg = collapsedRef.current;

    expandedImg?.addEventListener("load", measure);
    collapsedImg?.addEventListener("load", measure);
    window.addEventListener("resize", measure);

    return () => {
      expandedImg?.removeEventListener("load", measure);
      collapsedImg?.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, [className]);

  return { expandedRef, collapsedRef, widths, ready };
}

export function LogoTransition({
  className = "h-[25px] sm:h-[28px]",
  priority = false,
}: LogoTransitionProps) {
  const reduceMotion = useReducedMotion();
  const { expandedRef, collapsedRef, widths, ready } = useLogoWidths(className);

  const [logoState, setLogoState] = useState<LogoState>("expanded");
  const logoStateRef = useRef<LogoState>("expanded");
  const lastScrollY = useRef(0);

  const variants = useMemo(
    () => createLogoVariants(widths, Boolean(reduceMotion)),
    [widths, reduceMotion],
  );

  const setState = useCallback((next: LogoState) => {
    logoStateRef.current = next;
    setLogoState(next);
  }, []);

  const handleAnimationComplete = useCallback(
    (definition: string | string[]) => {
      const name = Array.isArray(definition) ? definition[0] : definition;

      if (name === "collapsing" && logoStateRef.current === "collapsing") {
        setState("collapsed");
      } else if (name === "expanding" && logoStateRef.current === "expanding") {
        setState("expanded");
      }
    },
    [setState],
  );

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta === 0) return;

      lastScrollY.current = currentY;
      const direction = delta > 0 ? "down" : "up";
      const current = logoStateRef.current;

      if (direction === "down") {
        if (current === "collapsed" || current === "collapsing") return;
        setState("collapsing");
        return;
      }

      if (current === "expanded" || current === "expanding") return;
      setState("expanding");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setState]);

  const imgProps = {
    className: `block h-full w-auto max-w-none ${className}`,
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  const expandedImgProps = {
    ...imgProps,
    style: {
      transform: `translateY(calc(${EXPANDED_Y_ALIGN_RATIO} * 100%))`,
    },
  };

  const measureImages = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={expandedRef} src={EXPANDED_SRC} alt="" {...expandedImgProps} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={collapsedRef} src={COLLAPSED_SRC} alt="" {...imgProps} />
    </>
  );

  const animateTarget = ready ? logoState : "expanded";

  return (
    <>
      <div className="pointer-events-none absolute -left-[9999px] opacity-0" aria-hidden>
        {measureImages}
      </div>

      <div
        className={`relative shrink-0 ${className}`}
        style={{ width: ready ? widths.expanded : DEFAULT_WIDTHS.expanded }}
      >
        <motion.div
          className="relative h-full overflow-hidden will-change-[width]"
          initial="expanded"
          animate={animateTarget}
          variants={variants.container}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className="absolute left-0 top-0 h-full overflow-hidden will-change-[width]"
            initial="expanded"
            animate={animateTarget}
            variants={variants.expandedLayer}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={EXPANDED_SRC} alt="" aria-hidden {...expandedImgProps} />
          </motion.div>

          <motion.div
            className="absolute left-0 top-0 h-full overflow-hidden will-change-[width]"
            initial="expanded"
            animate={animateTarget}
            variants={variants.collapsedLayer}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COLLAPSED_SRC} alt="" aria-hidden {...imgProps} />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
