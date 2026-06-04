"use client";

import { useEffect, useState } from "react";
import { sectionIds, type SectionId } from "@/lib/content";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<SectionId, number>();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }

          if (visibleSections.size === 0) return;

          const sorted = [...visibleSections.entries()].sort((a, b) => b[1] - a[1]);
          setActiveSection(sorted[0][0]);
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return activeSection;
}
