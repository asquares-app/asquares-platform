import { Bell, Check, Coffee, Flame, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";

const features = [
  "Anonymous & verified posting modes",
  "Interest-based community discovery",
  "AI-moderated safe spaces",
];

export function ProductSpillTheTea() {
  return (
    <div className="mx-auto grid items-center gap-8 px-8 py-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10">
      <div>
        <SectionBadge icon={<Coffee className="h-4 w-4" />} variant="pink">
          Social Platform
        </SectionBadge>
        <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">Spill the Tea</h3>
        <p className="mt-1 text-base font-medium text-slate-600">The App That Gets You</p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          A vibrant social app where authenticity reigns. Share hot takes, connect over shared
          interests, and build communities around the things you actually care about — no filters, no
          fluff.
        </p>
        <ul className="mt-5 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-pink" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <Button href="#" variant="gradient" showArrow>
            Learn More
          </Button>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[260px] pt-6 sm:max-w-[300px]">
        <div className="absolute -inset-4 rounded-3xl bg-pink-400/15 blur-2xl" />
        <div className="float-badge absolute top-2 -right-2 z-10 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-md">
          <Flame className="h-3.5 w-3.5 text-accent-pink" />
          <p className="text-xs font-bold text-slate-900">10K+ daily users</p>
        </div>
        <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-slate-900 bg-white shadow-2xl">
          <div className="gradient-tea px-3 pb-3 pt-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coffee className="h-4 w-4" />
                <span className="text-sm font-semibold">Spill the Tea</span>
              </div>
              <Bell className="h-4 w-4 opacity-80" />
            </div>
            <div className="mt-2 rounded-full bg-white/20 px-3 py-1.5 text-[10px] text-white/80">
              Search communities...
            </div>
          </div>
          <div className="space-y-2 bg-slate-50 p-2.5">
            <div className="rounded-xl bg-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-800">@coffeelover</span>
                <span className="text-slate-400">2m ago</span>
              </div>
              <span className="mt-0.5 inline-block rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-medium text-pink-600">
                Hot ☕
              </span>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-700">
                Okay spilling: oat milk lattes are genuinely overrated and I said what I said 👀
              </p>
              <div className="mt-1.5 flex gap-3 text-[9px] text-slate-400">
                <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" /> 482</span>
                <span className="flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> 94</span>
              </div>
            </div>
            <div className="rounded-xl bg-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-800">@techgossip</span>
                <span className="text-slate-400">15m ago</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-700">
                The AI bubble is about to pop and nobody wants to hear it ☕
              </p>
              <div className="mt-1.5 flex gap-3 text-[9px] text-slate-400">
                <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" /> 1.2k</span>
                <span className="flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> 231</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
