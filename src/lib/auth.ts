import { auth, currentUser } from "@clerk/nextjs/server";

export function isClerkConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
}

export function getAllowedEmails() {
  return (process.env.REAGENT_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistConfigured() {
  return getAllowedEmails().length > 0;
}

/** Fail closed: empty allowlist means nobody gets in. */
export function isAllowedEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowed = getAllowedEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
}

export async function getViewerContext() {
  if (!isClerkConfigured()) {
    return {
      configured: false as const,
      signedIn: false as const,
      allowed: false as const,
      allowlistConfigured: isAllowlistConfigured(),
      email: null,
      name: null,
      userId: null,
    };
  }

  const session = await auth();
  if (!session.userId) {
    return {
      configured: true as const,
      signedIn: false as const,
      allowed: false as const,
      allowlistConfigured: isAllowlistConfigured(),
      email: null,
      name: null,
      userId: null,
    };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  return {
    configured: true as const,
    signedIn: true as const,
    allowed: isAllowedEmail(email),
    allowlistConfigured: isAllowlistConfigured(),
    email,
    name: user?.fullName ?? user?.firstName ?? null,
    userId: session.userId,
  };
}
