import { AppsLauncher } from "@/components/apps/AppsLauncher";
import { Navbar } from "@/components/layout/Navbar";
import { isClerkConfigured, getViewerContext } from "@/lib/auth";
import { getReagentAppUrl } from "@/lib/hosts";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const host = (await headers()).get("host");
  const viewer = await getViewerContext();
  const allowed = viewer.signedIn ? viewer.allowed : false;

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 pt-28">
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <AppsLauncher
            clerkConfigured={isClerkConfigured()}
            allowed={allowed}
            reagentUrl={getReagentAppUrl(host)}
          />
        </section>
      </main>
    </>
  );
}
