import { BookOpen, Quote, Rocket } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { founders } from "@/lib/content";

export function OriginStory() {
  return (
    <div className="border-t border-slate-100 bg-section-alt py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ScrollReveal direction="left">
          <SectionBadge icon={<BookOpen className="h-4 w-4" />} variant="blue">
            The Origin Story
          </SectionBadge>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Born from a <span className="text-primary">Bold Conversation</span>
          </h2>
          <div className="mt-6 space-y-4 font-mono text-sm leading-relaxed text-muted">
            <p>
              In early 2024, a group of friends sat around a table with one question: what if we
              built the products we wished existed? Designers, engineers, and dreamers — united by a
              shared obsession with craft.
            </p>
            <p>
              That conversation became AsquareS. We started with three bets: an AR dining experience
              that makes menus come alive, an AI agent that never misses a real estate lead, and a
              social platform where authenticity beats algorithmic noise.
            </p>
            <p>
              One year later, all three are live — and we&apos;re just getting started.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {founders.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Founding team member ${i + 1}`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <p className="font-semibold text-slate-900">A tight-knit founding team</p>
              <p className="text-sm text-muted">Designers, engineers & dreamers</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10">
              <Image
                src="/images/team.jpg"
                alt="AsquareS founding team collaborating"
                width={800}
                height={600}
                className="h-[400px] w-full object-cover lg:h-[480px]"
              />
            </div>
            <div className="float-badge absolute -top-4 right-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Launched 2024</p>
                <p className="text-xs text-muted">3 products in year 1</p>
              </div>
            </div>
            <div className="glass-quote absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/60 p-5 shadow-xl">
              <div className="flex gap-3">
                <Quote className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <p className="text-sm italic leading-relaxed text-slate-700">
                    &ldquo;We build products we&apos;d actually want to use ourselves.&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-medium text-muted">— AsquareS Founding Team</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
