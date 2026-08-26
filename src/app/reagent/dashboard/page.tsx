import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { DashboardShell } from "@/components/reagent/DashboardShell";
import { getViewerContext } from "@/lib/auth";
import { getPlatformBaseUrl, isReagentHost } from "@/lib/hosts";
import { db } from "@/db/client";
import { leads, type Lead } from "@/db/schema";

export const dynamic = "force-dynamic";

async function getLeads(): Promise<Lead[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db().select().from(leads).orderBy(desc(leads.createdAt)).limit(50);
  } catch (err) {
    console.error("[dashboard] failed to load leads", err);
    return [];
  }
}

export default async function ReagentDashboardPage() {
  const viewer = await getViewerContext();
  const host = (await headers()).get("host");
  const launcherUrl = `${getPlatformBaseUrl(host)}/apps`;
  const productHomeHref = isReagentHost(host) ? "/" : "/reagent";

  if (!viewer.configured || !viewer.signedIn || !viewer.allowed) {
    redirect(launcherUrl);
  }

  const dbLeads = await getLeads();

  return (
    <DashboardShell
      email={viewer.email}
      initialLeads={dbLeads}
      launcherUrl={launcherUrl}
      productHomeHref={productHomeHref}
    />
  );
}
