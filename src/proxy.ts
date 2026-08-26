import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getPlatformBaseUrl, isReagentHost } from "@/lib/hosts";

export default clerkMiddleware((_auth, request) => {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host");

  // Subdomain visitors are sent to the primary app path so Clerk session cookies work.
  // (True satellite auth can replace this later.)
  if (isReagentHost(host)) {
    if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname === "/favicon.ico" ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/site.webmanifest")
    ) {
      return NextResponse.next();
    }

    const platform = getPlatformBaseUrl(host);
    const targetPath = pathname.startsWith("/reagent")
      ? `${pathname}${search}`
      : `/reagent${pathname === "/" ? "" : pathname}${search}`;
    return NextResponse.redirect(new URL(targetPath, platform), 308);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
