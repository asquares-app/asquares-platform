import { after } from "next/server";
import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { leads } from "@/db/schema";
import { scoreLead } from "@/lib/scorer";
import { sendLeadAlert } from "@/lib/alert";
import { getAllowedEmails } from "@/lib/auth";

export const maxDuration = 60;

type VapiPayload = {
  message?: {
    type?: string;
    call?: {
      id?: string;
      customer?: { number?: string };
      metadata?: Record<string, unknown>;
    };
    artifact?: {
      transcript?: string;
      recording?: { url?: string; stereoUrl?: string } | string;
      recordingUrl?: string;
    };
    analysis?: { summary?: string };
    transcript?: string;
    recordingUrl?: string;
    summary?: string;
    metadata?: Record<string, unknown>;
  };
};

function extractTranscript(message: NonNullable<VapiPayload["message"]>) {
  return (
    message.artifact?.transcript ||
    message.transcript ||
    ""
  ).trim();
}

function sanitizeRecordingUrl(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractRecordingUrl(message: NonNullable<VapiPayload["message"]>) {
  const recording = message.artifact?.recording;
  let raw: string | null = null;
  if (typeof recording === "string") raw = recording;
  else if (recording && typeof recording === "object") {
    raw = recording.url || recording.stereoUrl || null;
  } else {
    raw = message.artifact?.recordingUrl || message.recordingUrl || null;
  }
  return sanitizeRecordingUrl(raw);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifySignature(req: NextRequest, body: string): Promise<boolean> {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    // Local demos can skip. Production must set a secret.
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const hmacHeader = req.headers.get("x-vapi-signature");
  const sharedHeader =
    req.headers.get("x-vapi-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (sharedHeader && timingSafeEqual(sharedHeader, secret)) return true;
  if (!hmacHeader) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  try {
    const sigBytes = Buffer.from(hmacHeader, "hex");
    return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
  } catch {
    return false;
  }
}

function extractSummary(message: NonNullable<VapiPayload["message"]>) {
  return message.analysis?.summary || message.summary || null;
}

function extractDealerEmail(message: NonNullable<VapiPayload["message"]>) {
  const meta = {
    ...(message.metadata ?? {}),
    ...(message.call?.metadata ?? {}),
  } as Record<string, unknown>;

  const fromMeta =
    (typeof meta.dealerEmail === "string" && meta.dealerEmail) ||
    (typeof meta.dealer_email === "string" && meta.dealer_email) ||
    null;

  return (
    fromMeta ||
    process.env.REAGENT_ALERT_TARGET ||
    getAllowedEmails()[0] ||
    "demo@asquares.app"
  ).toLowerCase();
}

async function processLead(callId: string, transcript: string, dealerEmail: string) {
  try {
    const scored = await scoreLead(transcript);
    await db()
      .update(leads)
      .set({
        callerName: scored.callerName,
        callerPhone: scored.callerPhone,
        locality: scored.locality,
        budget: scored.budget,
        propertyType: scored.propertyType,
        timeline: scored.timeline,
        summary: scored.summary,
        score: scored.score,
        scoringStatus: "done",
        updatedAt: new Date(),
      })
      .where(eq(leads.id, callId));

    const [updated] = await db().select().from(leads).where(eq(leads.id, callId)).limit(1);
    if (!updated) return;

    const alertTo = process.env.REAGENT_ALERT_TARGET || dealerEmail;
    if (alertTo) {
      const sent = await sendLeadAlert(updated, alertTo);
      if (sent) {
        await db().update(leads).set({ alertSent: true }).where(eq(leads.id, callId));
      }
    }
  } catch (err) {
    console.error("[vapi-webhook] scoring failed for call", callId, err);
    await db()
      .update(leads)
      .set({ scoringStatus: "failed", updatedAt: new Date() })
      .where(eq(leads.id, callId));
  }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text();

  if (!(await verifySignature(req, bodyText))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: VapiPayload;
  try {
    payload = JSON.parse(bodyText) as VapiPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = payload.message;
  if (!message || message.type !== "end-of-call-report") {
    return Response.json({ ok: true, skipped: true });
  }

  const callId = message.call?.id;
  if (!callId) {
    return Response.json({ error: "Missing call id" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DATABASE_URL not configured" }, { status: 503 });
  }

  const dealerEmail = extractDealerEmail(message);
  const transcript = extractTranscript(message);
  const recordingUrl = extractRecordingUrl(message);
  const summary = extractSummary(message);

  const existing = await db()
    .select({ id: leads.id, scoringStatus: leads.scoringStatus })
    .from(leads)
    .where(eq(leads.id, callId))
    .limit(1);

  if (existing.length > 0) {
    if (existing[0].scoringStatus === "pending" || existing[0].scoringStatus === "failed") {
      after(() => processLead(callId, transcript, dealerEmail));
    }
    return Response.json({ ok: true, duplicate: true });
  }

  await db().insert(leads).values({
    id: callId,
    dealerEmail,
    transcript: transcript || null,
    recordingUrl,
    summary,
    scoringStatus: "pending",
    rawPayload: payload as unknown as Record<string, unknown>,
  });

  after(() => processLead(callId, transcript, dealerEmail));

  return Response.json({ ok: true });
}
