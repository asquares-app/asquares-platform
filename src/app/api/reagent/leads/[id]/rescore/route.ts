import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { leads } from "@/db/schema";
import { getViewerContext } from "@/lib/auth";
import { scoreLead } from "@/lib/scorer";
import { sendLeadAlert } from "@/lib/alert";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const viewer = await getViewerContext();
  if (!viewer.configured || !viewer.signedIn || !viewer.allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [lead] = await db().select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }

  await db()
    .update(leads)
    .set({ scoringStatus: "pending", updatedAt: new Date() })
    .where(eq(leads.id, id));

  try {
    const scored = await scoreLead(lead.transcript ?? "");
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
      .where(eq(leads.id, id));

    const [updated] = await db().select().from(leads).where(eq(leads.id, id)).limit(1);
    if (updated && !updated.alertSent) {
      const alertTo = process.env.REAGENT_ALERT_TARGET || updated.dealerEmail;
      if (alertTo) {
        const sent = await sendLeadAlert(updated, alertTo);
        if (sent) {
          await db().update(leads).set({ alertSent: true }).where(eq(leads.id, id));
        }
      }
    }

    return Response.json({ ok: true, lead: updated });
  } catch (err) {
    console.error("[rescore] failed", err);
    await db()
      .update(leads)
      .set({ scoringStatus: "failed", updatedAt: new Date() })
      .where(eq(leads.id, id));
    return Response.json({ error: "Scoring failed" }, { status: 502 });
  }
}
