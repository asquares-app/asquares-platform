import { Bot, Check, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";

const features = [
  "Hinglish call handling & transcript capture",
  "Lead score + summary in the dealer inbox",
  "Email alert for every new enquiry",
];

export function ProductRealEstate() {
  return (
    <div className="mx-auto grid items-center gap-8 px-8 py-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10">
      <div className="relative order-2 pt-6 lg:order-1">
        <div className="absolute -inset-3 rounded-3xl bg-blue-400/10 blur-2xl" />
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto rounded-md bg-slate-800 px-3 py-0.5 text-[11px] text-slate-400">
              asquares.app/reagent
            </div>
          </div>
          <div className="bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">REagent</p>
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
                <span className="pulse-live h-1.5 w-1.5 rounded-full bg-green-500" />
                Live
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white p-3 text-xs leading-relaxed text-slate-700 shadow-sm">
                  Namaste, main REagent hoon. Aap kis area mein property dekh rahe ho — budget aur BHK bhi bata dijiye.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-white">
                  Powai mein 2BHK, budget 1.2 Cr, 45 days mein move.
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Score 86", "Powai", "2BHK"].map((metric) => (
                <div key={metric} className="rounded-lg bg-white p-2 text-center shadow-sm">
                  <p className="text-xs font-semibold text-slate-800">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="float-badge absolute bottom-2 left-2 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-md">
          <Phone className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs font-bold text-slate-900">AI Answering</p>
            <p className="text-[10px] text-muted">Missed-call coverage</p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <SectionBadge icon={<Globe className="h-4 w-4" />} variant="blue">
          Artificial Intelligence
        </SectionBadge>
        <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">REagent</h3>
        <p className="mt-1 text-base font-medium text-slate-600">AI receptionist for real-estate calls</p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Never miss a buyer enquiry. REagent answers in Hinglish, captures locality, budget and timeline,
          scores the lead, and drops it into a clean dealer dashboard with an email alert.
        </p>
        <ul className="mt-5 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <Button href="/apps" variant="primary" showArrow>
            Open REagent demo
          </Button>
        </div>
      </div>
    </div>
  );
}
