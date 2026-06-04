import { Box, Check, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";

const features = [
  "Photorealistic 3D food models",
  "Works on any smartphone — no app required",
  "Easy restaurant onboarding & management",
];

export function ProductARMenu() {
  return (
    <div className="mx-auto grid items-center gap-8 px-8 py-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10">
      <div>
        <SectionBadge icon={<Box className="h-4 w-4" />} variant="green">
          Augmented Reality
        </SectionBadge>
        <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">AR 3D Menu</h3>
        <p className="mt-1 text-base font-medium text-slate-600">Dining Reimagined</p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Transform your restaurant experience with our AR 3D Menu. Customers can visualize dishes in
          stunning 3D before ordering — boosting confidence, reducing returns, and increasing average
          order value.
        </p>
        <ul className="mt-5 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <Button href="#" variant="dark" showArrow>
            Learn More
          </Button>
        </div>
      </div>

      <div className="relative pt-6">
        <div className="absolute -inset-3 rounded-3xl bg-green-400/10 blur-2xl" />
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto rounded-md bg-white px-3 py-0.5 text-[11px] text-slate-500">
              ar-menu.AsquareS.app
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-semibold tracking-widest text-slate-500">LA BELLA CUCINA</p>
            <p className="text-sm font-medium text-slate-800">AR Menu Experience</p>
            <div className="relative mt-2.5 overflow-hidden rounded-xl">
              <Image
                src="/images/pasta.jpg"
                alt="Pasta dish preview"
                width={600}
                height={400}
                className="h-44 w-full object-cover sm:h-52"
              />
              <button
                type="button"
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold shadow-lg"
              >
                <Box className="h-3.5 w-3.5 text-accent-green" />
                View in AR
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {["Pizza", "Pasta", "Dessert"].map((item) => (
                <div
                  key={item}
                  className={`rounded-lg px-2 py-1.5 text-center text-xs font-medium ${
                    item === "Pasta" ? "bg-blue-50 text-primary" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="float-badge absolute top-2 right-2 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-md">
          <TrendingUp className="h-4 w-4 text-accent-green" />
          <div>
            <p className="text-xs font-bold text-slate-900">+34% Orders</p>
            <p className="text-[10px] text-muted">with AR preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
