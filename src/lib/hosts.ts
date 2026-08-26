export const REAGENT_HOST = "reagent.asquares.app";
export const REAGENT_DEV_HOST = "reagent.localhost";

export function normalizeHost(host: string | null | undefined) {
  return (host ?? "").toLowerCase().replace(/:\d+$/, "");
}

export function isReagentHost(host: string | null | undefined) {
  const normalized = normalizeHost(host);
  return normalized === REAGENT_HOST || normalized === REAGENT_DEV_HOST;
}

export function isLocalHost(host?: string | null) {
  const normalized = normalizeHost(host);
  return (
    normalized.includes("localhost") ||
    normalized === "127.0.0.1" ||
    normalized.endsWith(".local")
  );
}

export function getPlatformBaseUrl(host?: string | null) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return isLocalHost(host) ? "http://localhost:3000" : "https://asquares.app";
}

export function getReagentBaseUrl(host?: string | null) {
  if (process.env.NEXT_PUBLIC_REAGENT_URL) {
    return process.env.NEXT_PUBLIC_REAGENT_URL.replace(/\/$/, "");
  }
  return isLocalHost(host) ? "http://reagent.localhost:3000" : "https://reagent.asquares.app";
}

/**
 * Best URL to open REagent from the marketing site / launcher.
 * Locally we prefer same-origin `/reagent` so Clerk cookies keep working
 * without satellite-domain setup. Production uses the product subdomain.
 */
export function getReagentAppUrl(host?: string | null) {
  if (isLocalHost(host)) {
    return `${getPlatformBaseUrl(host)}/reagent`;
  }
  return getReagentBaseUrl(host);
}

export function getReagentDashboardUrl(host?: string | null) {
  if (isLocalHost(host)) {
    return `${getPlatformBaseUrl(host)}/reagent/dashboard`;
  }
  return `${getReagentBaseUrl(host)}/dashboard`;
}
