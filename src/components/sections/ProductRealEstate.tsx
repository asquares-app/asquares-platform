import { Bot, Check, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";

const features = [
  "Natural language call handling & transcription",
  "Real-time analytics dashboard",
  "CRM integration & lead scoring",
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
              realestate.AsquareS.app
            </div>
          </div>
          <div className="bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Real Estate Agent</p>
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
                  Hi! I&apos;m your AI real estate agent. I see you&apos;re interested in 3-bedroom
                  properties in Austin. Shall I schedule viewings?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-white">
                  Yes, please! Budget is $450k.
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["24 Calls Today", "8 Leads", "92% Resolved"].map((metric) => (
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
            <p className="text-[10px] text-muted">24/7 availability</p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <SectionBadge icon={<Globe className="h-4 w-4" />} variant="blue">
          Artificial Intelligence
        </SectionBadge>
        <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">Real Estate Call Agent</h3>
        <p className="mt-1 text-base font-medium text-slate-600">AI That Closes Deals</p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Never miss a lead again. Our AI-powered call attending agent handles inbound real estate
          inquiries 24/7, qualifies prospects, schedules viewings, and feeds a beautiful analytics
          dashboard.
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
          <Button href="#" variant="primary" showArrow>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
