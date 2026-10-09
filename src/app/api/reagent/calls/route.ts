import { type NextRequest } from "next/server";
import { getViewerContext } from "@/lib/auth";
import { ingestCallReport } from "@/lib/ingest-lead";
import { toPublicLead } from "@/lib/public-lead";
import { allowAction } from "@/lib/rate-limit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const viewer = await getViewerContext();
  if (!viewer.configured || !viewer.signedIn || !viewer.allowed || !viewer.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { callId?: string; transcript?: string };
  try {
    body = (await req.json()) as { callId?: string; transcript?: string };
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const callId = (body.callId ?? "").trim();
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(callId)) {
    return Response.json({ error: "Missing call id" }, { status: 400 });
  }

  if (!allowAction(`calls:${viewer.email}`, 30, 60 * 60 * 1000)) {
    return Response.json({ error: "Too many demo calls. Wait a bit and try again." }, { status: 429 });
  }

  try {
    const lead = await ingestCallReport({
      callId,
      dealerEmail: viewer.email,
      transcript: body.transcript ?? "",
    });
    return Response.json({ ok: true, lead: toPublicLead(lead) });
  } catch (err) {
    console.error("[calls] ingest failed", err);
    return Response.json({ error: "Could not save this lead" }, { status: 500 });
  }
}
