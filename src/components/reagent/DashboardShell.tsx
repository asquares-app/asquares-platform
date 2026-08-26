"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bot,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Mic,
  MicOff,
  Phone,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import type { Lead } from "@/db/schema";

const SAMPLE_LEADS: Lead[] = [
  {
    id: "sample-001",
    dealerEmail: "",
    callerName: "Rahul Sharma",
    callerPhone: "+91 98XXXXXX21",
    locality: "Powai, Mumbai",
    budget: "₹1.1Cr – ₹1.3Cr",
    propertyType: "2BHK",
    timeline: "45 days",
    score: 86,
    status: "new",
    scoringStatus: "done",
    alertSent: false,
    summary:
      "Looking for a ready-to-move 2BHK in Powai within the next 45 days. Budget is flexible if parking and society quality are strong.",
    transcript: null,
    recordingUrl: null,
    rawPayload: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample-002",
    dealerEmail: "",
    callerName: "Priya Mehta",
    callerPhone: "+91 99XXXXXX74",
    locality: "Andheri East",
    budget: "₹55k/month",
    propertyType: "2BHK rental",
    timeline: "3 weeks",
    score: 71,
    status: "contacted",
    scoringStatus: "done",
    alertSent: false,
    summary:
      "Rental enquiry for a family of three. Needs a 2BHK close to metro access and prefers a weekday evening callback.",
    transcript: null,
    recordingUrl: null,
    rawPayload: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function scoreColor(score: number | null) {
  if (score === null) return "bg-slate-100 text-slate-500";
  if (score >= 75) return "bg-green-100 text-green-700";
  if (score >= 45) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function scoreLabel(score: number | null, scoringStatus: string) {
  if (scoringStatus === "pending") return "Scoring…";
  if (scoringStatus === "failed") return "Score failed";
  if (score === null) return "Unscored";
  return `Score ${score}`;
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
  spam: "Spam",
};

function WebCallWidget({
  dealerEmail,
  onCallEnded,
}: {
  dealerEmail: string | null;
  onCallEnded: () => void;
}) {
  const [state, setState] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [vapiInstance, setVapiInstance] = useState<InstanceType<typeof Vapi> | null>(null);

  const start = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!publicKey || !assistantId) {
      alert(
        "Vapi is not configured. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID in .env.local",
      );
      return;
    }

    setState("connecting");
    const vapi = new Vapi(publicKey);
    vapi.on("call-start", () => setState("active"));
    vapi.on("call-end", () => {
      setState("ended");
      setVapiInstance(null);
      onCallEnded();
    });
    vapi.on("error", (err) => {
      console.error("[vapi]", err);
      setState("idle");
      setVapiInstance(null);
    });

    try {
      await vapi.start(assistantId, {
        metadata: dealerEmail ? { dealerEmail } : undefined,
      });
      setVapiInstance(vapi);
    } catch (err) {
      console.error("[vapi] start failed", err);
      setState("idle");
    }
  }, [dealerEmail, onCallEnded]);

  const stop = useCallback(() => {
    vapiInstance?.stop();
  }, [vapiInstance]);

  if (state === "ended") {
    return (
      <div className="flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        Call ended — waiting for lead report…
      </div>
    );
  }

  if (state === "active") {
    return (
      <button
        onClick={stop}
        className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700"
      >
        <MicOff className="h-4 w-4" />
        End demo call
      </button>
    );
  }

  if (state === "connecting") {
    return (
      <div className="flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting…
      </div>
    );
  }

  return (
    <button
      onClick={start}
      className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
    >
      <Mic className="h-4 w-4" />
      Start demo Web Call
    </button>
  );
}

function LeadCard({
  lead,
  isSample,
  onChanged,
}: {
  lead: Lead;
  isSample: boolean;
  onChanged: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [rescoring, setRescoring] = useState(false);

  async function updateStatus(next: string) {
    if (isSample || updating) return;
    setUpdating(true);
    try {
      await fetch("/api/reagent/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: next }),
      });
      onChanged();
    } finally {
      setUpdating(false);
    }
  }

  async function rescore() {
    if (isSample || rescoring) return;
    setRescoring(true);
    try {
      await fetch(`/api/reagent/leads/${lead.id}/rescore`, { method: "POST" });
      onChanged();
    } finally {
      setRescoring(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200">
      {isSample && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Sample data — real leads appear after a demo call
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{lead.callerName ?? "Unknown caller"}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {[lead.locality, lead.budget].filter(Boolean).join(" · ") ||
              "No location / budget captured yet"}
          </p>
          {lead.propertyType && (
            <p className="mt-0.5 text-sm text-slate-500">
              {lead.propertyType}
              {lead.timeline ? ` · ${lead.timeline}` : ""}
            </p>
          )}
        </div>
        <div className="text-right">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreColor(lead.score)}`}
          >
            {lead.scoringStatus === "pending" ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Scoring…
              </span>
            ) : (
              scoreLabel(lead.score, lead.scoringStatus)
            )}
          </span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            {STATUS_LABELS[lead.status] ?? lead.status}
          </p>
        </div>
      </div>

      {lead.summary && <p className="mt-4 text-sm leading-6 text-slate-700">{lead.summary}</p>}

      {lead.transcript && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            {showTranscript ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
          {showTranscript && (
            <pre className="mt-2 max-h-48 overflow-auto rounded-xl bg-slate-50 p-3 text-xs leading-5 whitespace-pre-wrap text-slate-600">
              {lead.transcript}
            </pre>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {lead.callerPhone && (
          <a
            href={`tel:${lead.callerPhone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-300"
          >
            <Phone className="h-4 w-4" />
            Call back
          </a>
        )}
        {lead.recordingUrl && (
          <a
            href={lead.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-300"
          >
            <Mic className="h-4 w-4" />
            Recording
          </a>
        )}
        {!isSample && lead.scoringStatus === "failed" && (
          <button
            type="button"
            disabled={rescoring}
            onClick={rescore}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${rescoring ? "animate-spin" : ""}`} />
            {rescoring ? "Retrying…" : "Retry score"}
          </button>
        )}
        {!isSample && lead.status !== "contacted" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => updateStatus("contacted")}
            className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {updating ? "Saving…" : "Mark contacted"}
          </button>
        )}
        {!isSample && lead.status !== "closed" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => updateStatus("closed")}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Close
          </button>
        )}
      </div>
    </article>
  );
}

type DashboardShellProps = {
  email: string | null;
  initialLeads: Lead[];
  launcherUrl: string;
  productHomeHref: string;
};

export function DashboardShell({
  email,
  initialLeads,
  launcherUrl,
  productHomeHref,
}: DashboardShellProps) {
  const { user } = useUser();
  const dealerEmail =
    email ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [waitingForReport, setWaitingForReport] = useState(false);
  const [pollNote, setPollNote] = useState<string | null>(null);

  const refreshLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/reagent/leads", { cache: "no-store" });
      if (!res.ok) return [] as Lead[];
      const data = (await res.json()) as { leads: Lead[] };
      const next = data.leads ?? [];
      setLeads(next);
      return next;
    } catch {
      return [] as Lead[];
    }
  }, []);

  useEffect(() => {
    if (!waitingForReport) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 24; // ~72s

    const tick = async () => {
      attempts += 1;
      const latest = await refreshLeads();
      if (cancelled) return;

      if (latest.some((l) => l.scoringStatus === "done" || l.scoringStatus === "failed")) {
        setWaitingForReport(false);
        setPollNote(null);
        return;
      }

      if (attempts >= maxAttempts) {
        setWaitingForReport(false);
        setPollNote("Still waiting. If no lead appears, check the Vapi Server URL / tunnel.");
      }
    };

    const id = window.setInterval(() => {
      void tick();
    }, 3000);
    void tick();

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [waitingForReport, refreshLeads]);

  const isEmpty = leads.length === 0;
  const displayLeads = isEmpty ? SAMPLE_LEADS : leads;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">REagent dashboard</p>
            <h1 className="text-xl font-semibold text-slate-900">Lead inbox</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href={productHomeHref} className="text-sm text-slate-600 hover:text-slate-900">
              Product home
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Live demo call</p>
                <p className="text-sm text-slate-600">
                  Start a Web Call. Speak as a buyer — locality, budget, BHK, timeline — then watch the lead land here.
                </p>
              </div>
            </div>
            <WebCallWidget
              dealerEmail={dealerEmail}
              onCallEnded={() => {
                setPollNote("Waiting for Vapi end-of-call report and scoring…");
                setWaitingForReport(true);
              }}
            />
          </div>
          {pollNote && (
            <p className="mt-4 flex items-center gap-2 text-sm text-blue-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              {pollNote}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {isEmpty ? "Sample enquiries" : `Enquiries (${leads.length})`}
              </h2>
              {isEmpty ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Sample data
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void refreshLeads()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              )}
            </div>

            <div className="space-y-4">
              {displayLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  isSample={isEmpty}
                  onChanged={() => void refreshLeads()}
                />
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-semibold text-amber-900">Free-tier guardrails</p>
                  <p className="mt-2 text-sm leading-6 text-amber-900/80">
                    Access stays allowlisted. Use Web Call until a client signs. Do not publish a paid phone number yet.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-slate-900">Edge-case handling</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    <li>• Silent caller → saved, low score</li>
                    <li>• Webhook replay → deduped by Vapi call ID</li>
                    <li>• Gemini failure → Retry score button</li>
                    <li>• Expired recording → transcript still shown</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-slate-900">After a paid pilot</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    <li>• Dedicated PSTN number</li>
                    <li>• WhatsApp alerts</li>
                    <li>• Dealer property listings</li>
                    <li>• Agent suggests matching flats</li>
                  </ul>
                </div>
              </div>
            </div>

            <a href={launcherUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Back to launcher
              <ExternalLink className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
