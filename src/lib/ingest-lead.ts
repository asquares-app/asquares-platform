import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { leads, type Lead } from "@/db/schema";
import { sendLeadAlert } from "@/lib/alert";
import { scoreLead } from "@/lib/scorer";

type IngestInput = {
  callId: string;
  dealerEmail: string;
  transcript: string;
  recordingUrl?: string | null;
  summary?: string | null;
};

function isDone(lead: Lead | undefined) {
  return lead?.scoringStatus === "done" && Boolean(lead.summary);
}

export async function ingestCallReport(input: IngestInput): Promise<Lead> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const callId = input.callId.trim().slice(0, 128);
  const transcript = input.transcript.trim().slice(0, 20000);
  const dealerEmail = input.dealerEmail.trim().toLowerCase();
  if (!callId) throw new Error("Missing call id");

  const [existing] = await db().select().from(leads).where(eq(leads.id, callId)).limit(1);
  if (isDone(existing) && existing) return existing;

  if (!existing) {
    try {
      await db().insert(leads).values({
        id: callId,
        dealerEmail,
        transcript: transcript || null,
        recordingUrl: input.recordingUrl ?? null,
        summary: input.summary ?? null,
        scoringStatus: "pending",
      });
    } catch (err) {
      const [raced] = await db().select().from(leads).where(eq(leads.id, callId)).limit(1);
      if (isDone(raced) && raced) return raced;
      if (!raced) throw err;
    }
  } else if (transcript && transcript !== existing.transcript) {
    await db()
      .update(leads)
      .set({ transcript, updatedAt: new Date() })
      .where(eq(leads.id, callId));
  }

  const [current] = await db().select().from(leads).where(eq(leads.id, callId)).limit(1);
  const sourceTranscript = transcript || current?.transcript || "";
  const scored = await scoreLead(sourceTranscript);

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
  if (!updated) throw new Error("Lead disappeared after scoring");

  if (!updated.alertSent) {
    const alertTo = process.env.REAGENT_ALERT_TARGET || dealerEmail;
    if (alertTo) {
      const sent = await sendLeadAlert(updated, alertTo);
      if (sent) {
        await db().update(leads).set({ alertSent: true }).where(eq(leads.id, callId));
        updated.alertSent = true;
      }
    }
  }

  return updated;
}
