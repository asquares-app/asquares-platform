import { Mail, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export function CTABanner() {
  return (
    <div className="bg-primary py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <ScrollReveal>
          <SectionBadge icon={<Rocket className="h-4 w-4" />} variant="white" className="mb-8">
            Ready to get started?
          </SectionBadge>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Join the Future AsquareS is Building
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Whether you&apos;re a restaurant, real estate agency, or someone who loves authentic
            social connections — AsquareS has something for you.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="#products" variant="white" showArrow>
              Explore All Products
            </Button>
            <Button href="mailto:hello@asquares.app" variant="ghost" icon={<Mail className="h-4 w-4" />}>
              Contact Us
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
