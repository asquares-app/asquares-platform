import { desc, eq } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { db } from "@/db/client";
import { leads } from "@/db/schema";
import { getViewerContext } from "@/lib/auth";
import { toPublicLead } from "@/lib/public-lead";

export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getViewerContext();

  if (!viewer.configured || !viewer.signedIn || !viewer.allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ leads: [] });
  }

  try {
    // Pitch MVP is single-tenant: any allowlisted dealer sees the inbox.
    const rows = await db().select().from(leads).orderBy(desc(leads.createdAt)).limit(50);
    return Response.json({ leads: rows.map(toPublicLead) });
  } catch (err) {
    console.error("[leads] GET failed", err);
    return Response.json({ leads: [], error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  const viewer = await getViewerContext();

  if (!viewer.configured || !viewer.signedIn || !viewer.allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { id?: string; status?: string };
  const validStatuses = ["new", "contacted", "closed", "spam"];
  const id = (body.id ?? "").trim();

  if (!id || id.length > 128 || !body.status || !validStatuses.includes(body.status)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const [existing] = await db().select({ id: leads.id }).from(leads).where(eq(leads.id, id)).limit(1);
  if (!existing) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }

  await db()
    .update(leads)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(leads.id, id));

  return Response.json({ ok: true });
}
