import { HelpCircle } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { faqItems } from "@/lib/content";

export function FAQ() {
  return (
    <div className="border-t border-slate-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <ScrollReveal>
          <SectionBadge icon={<HelpCircle className="h-4 w-4" />} variant="blue" className="mb-6">
            Common Questions
          </SectionBadge>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Before You <span className="text-primary">Reach Out</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Quick answers to the most common questions we receive.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3} className="mt-12">
          <Accordion items={faqItems} />
        </ScrollReveal>
      </div>
    </div>
  );
}
