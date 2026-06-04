import { Info } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export function ProductsIntro() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-4 pt-4 text-center lg:px-8">
      <ScrollReveal>
        <SectionBadge icon={<Info className="h-4 w-4" />} variant="blue" className="mb-4">
          Our Products
        </SectionBadge>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Three Products. <span className="text-primary">One Vision.</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
          Each product is crafted with precision, designed to solve real-world problems and deliver
          extraordinary experiences.
        </p>
      </ScrollReveal>
    </div>
  );
}
