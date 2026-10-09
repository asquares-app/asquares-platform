import { ReagentHome } from "@/components/reagent/ReagentHome";
import { getViewerContext } from "@/lib/auth";
import { getPlatformBaseUrl } from "@/lib/hosts";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ReagentPage() {
  const viewer = await getViewerContext();
  const host = (await headers()).get("host");
  const launcherUrl = `${getPlatformBaseUrl(host)}/apps`;

  return (
    <ReagentHome
      clerkConfigured={viewer.configured}
      signedIn={viewer.signedIn}
      allowed={viewer.allowed}
      email={viewer.email}
      userName={viewer.name}
      launcherUrl={launcherUrl}
      dashboardHref="/reagent/dashboard"
    />
  );
}
