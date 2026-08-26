"use client";

import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type LauncherProps = {
  clerkConfigured: boolean;
  allowlistConfigured: boolean;
  allowed: boolean;
  reagentUrl: string;
};

function LauncherWithAuth({
  allowed,
  reagentUrl,
}: {
  allowed: boolean;
  reagentUrl: string;
}) {
  const { isLoaded, user } = useUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-primary">My apps</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Access your AsquareS products</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Sign in once to see the products enabled for your account. For the MVP, REagent access is
            allowlist-based so voice credits stay protected.
          </p>
        </div>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
              <Lock className="h-4 w-4" />
              Login to see my apps
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{email}</span>
            <UserButton />
          </div>
        </Show>
      </div>

      <Show when="signed-out">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Sign in to unlock your apps</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            We&apos;ll keep this minimal for the MVP: email or Google login, then you&apos;ll see which
            products are enabled for your account.
          </p>
        </div>
      </Show>

      <Show when="signed-in">
        {!isLoaded ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Loading your access…
          </div>
        ) : !allowed ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Your account is ready</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              We haven&apos;t enabled any live apps for <strong>{email}</strong> yet. For pitch week,
              access is granted manually so the voice demo stays private and free-tier usage remains capped.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductCard
              title="REagent"
              description="AI receptionist for real-estate leads. Take a live call, capture the enquiry, score it, and review it in a clean dashboard."
              href={reagentUrl}
              status="Demo access"
            />
            <ProductCard
              title="AR 3D Menu"
              description="Restaurant product launcher placeholder — shown here so the platform shape is clear, but not enabled in the MVP."
              status="Coming soon"
            />
          </div>
        )}
      </Show>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-5 w-5 text-primary" />
          <div className="text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">Why this launcher exists</p>
            <p className="mt-2">
              It lets the company site stay public while products live on their own subdomains. That gives
              you the right long-term shape now, without building billing or a full entitlement system yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  title,
  description,
  href,
  status,
}: {
  title: string;
  description: string;
  href?: string;
  status: "Demo access" | "Coming soon";
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
          {status}
        </span>
      </div>

      <div className="mt-6">
        {href ? (
          <Button href={href} variant="primary" showArrow>
            Open app
          </Button>
        ) : (
          <Button variant="secondary" className="cursor-not-allowed opacity-70">
            Coming soon
          </Button>
        )}
      </div>
    </div>
  );
}

export function AppsLauncher({
  clerkConfigured,
  allowlistConfigured,
  allowed,
  reagentUrl,
}: LauncherProps) {
  if (!clerkConfigured) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Login setup needed</p>
        <p className="mt-2 leading-6">
          Add Clerk keys in Vercel / <code>.env.local</code> first. Until then, the launcher is wired
          but sign-in stays disabled.
        </p>
      </div>
    );
  }

  if (!allowlistConfigured) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Allowlist not configured</p>
        <p className="mt-2 leading-6">
          Set <code>REAGENT_ALLOWED_EMAILS</code> before demos so only approved dealers can open
          REagent and burn voice credits.
        </p>
      </div>
    );
  }

  return <LauncherWithAuth allowed={allowed} reagentUrl={reagentUrl} />;
}
