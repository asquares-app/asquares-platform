import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isReagentHost } from "@/lib/hosts";

export default clerkMiddleware((_auth, request) => {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host");

  if (!isReagentHost(host)) {
    return NextResponse.next();
  }

  // Already under /reagent, or shared/static/api paths — pass through.
  if (
    pathname.startsWith("/reagent") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/site.webmanifest") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  // reagent.asquares.app/ → /reagent/, /dashboard → /reagent/dashboard
  const rewritten = new URL(`/reagent${pathname}${search}`, request.url);
  return NextResponse.rewrite(rewritten);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
