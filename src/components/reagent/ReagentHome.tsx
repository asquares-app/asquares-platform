"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Bot, Building2, Mic, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ReagentHomeProps = {
  clerkConfigured: boolean;
  allowed: boolean;
  signedIn: boolean;
  email: string | null;
  userName: string | null;
  launcherUrl: string;
  dashboardHref: string;
};

const features = [
  "Natural Hinglish call greeting for buyer leads",
  "Post-call summary + lead score in seconds",
  "Instant email alert to the dealer",
];

export function ReagentHome({
  clerkConfigured,
  allowed,
  signedIn,
  email,
  userName,
  launcherUrl,
  dashboardHref,
}: ReagentHomeProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 pb-16 pt-10 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0%,rgba(15,23,42,0)_45%)] opacity-50" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <a
              href={launcherUrl.replace(/\/apps$/, "")}
              className="text-sm font-semibold tracking-wide text-white/80"
            >
              AsquareS
            </a>

            <div className="flex items-center gap-3">
              <a href={launcherUrl} className="text-sm text-white/70 hover:text-white">
                My apps
              </a>

              {!clerkConfigured ? null : signedIn ? (
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-white/70 sm:inline">{email}</span>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    Login
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
                <Sparkles className="h-4 w-4" />
                REagent
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                REagent — AI receptionist for real-estate buyer calls.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Catch missed enquiries, qualify the caller in Hinglish, and hand the dealer a clean lead
                summary with a score.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {allowed ? (
                  <Button href={dashboardHref} variant="white" showArrow>
                    Open demo dashboard
                  </Button>
                ) : clerkConfigured ? (
                  <Button href={launcherUrl} variant="white" showArrow>
                    Go to app launcher
                  </Button>
                ) : (
                  <Button href={`${launcherUrl.replace(/\/apps$/, "")}/#contact`} variant="white" showArrow>
                    Request demo setup
                  </Button>
                )}
                <Button href="#how-it-works" variant="ghost">
                  See how it works
                </Button>
              </div>

              <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-300" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Demo status</p>
                  <p className="text-sm text-slate-300">
                    {allowed
                      ? `Ready for ${userName ?? email ?? "demo user"}`
                      : "Private MVP access only"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <PhoneCall className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">Call entry</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Web Call first for zero recurring cost. Dedicated phone number later, after a paid pilot.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <Mic className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">Hinglish agent</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Short, warm, trust-building script with clear AI disclosure and callback capture.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <Building2 className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">Dealer-ready</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Inbox, score, summary, recording, and one-tap callback — nothing extra.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">Pitch-safe</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Access stays allowlisted so free-tier credits do not get burned by random traffic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section id="how-it-works" className="mt-20 grid gap-6 lg:grid-cols-3">
            {[
              ["1. Caller talks", "Buyer explains area, budget, BHK, and timeline in natural Hinglish."],
              ["2. AI qualifies", "The agent collects the details, stays concise, and avoids fake commitments."],
              ["3. Dealer acts", "The dealer gets a scored lead email and opens the dashboard to call back fast."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
