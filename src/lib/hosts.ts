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

/**
 * Prefer NEXT_PUBLIC_APP_URL only when it matches the current environment.
 * Never let a localhost value leak into production links.
 */
export function getPlatformBaseUrl(host?: string | null) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const local = isLocalHost(host) || process.env.NODE_ENV !== "production";

  if (configured) {
    const configuredIsLocal = /localhost|127\.0\.0\.1/.test(configured);
    if (local === configuredIsLocal) return configured;
  }

  return local ? "http://localhost:3000" : "https://asquares.app";
}

export function getReagentBaseUrl(host?: string | null) {
  // Product lives at same-origin /reagent until Clerk satellite is configured
  // for a true multi-domain session handoff.
  return `${getPlatformBaseUrl(host)}/reagent`;
}

/** URL used by launcher / CTAs to open the product. */
export function getReagentAppUrl(host?: string | null) {
  return getReagentBaseUrl(host);
}

export function getReagentDashboardUrl(host?: string | null) {
  return `${getReagentBaseUrl(host)}/dashboard`;
}
