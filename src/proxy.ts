import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

// Create i18n middleware
const intlMiddleware = createMiddleware(routing);

// 1. Specify protected and public routes
const protectedRoutes = ["/profile", "/dashboard", "/settings"];
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/otp",
];

// Helper to check if path matches routes (ignoring locale prefix)
function matchesRoute(pathname: string, routes: string[]): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, "") || "/";
  return routes.some((route) => pathWithoutLocale.startsWith(route));
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check if the current route is protected or public
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // 3. Get session from cookie (optimistic check)
  const token = await getToken({ req });

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    const locale = pathname.match(/^\/(en|ja)/)?.[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Redirect to /profile if the user is authenticated
  if (isAuthRoute && token) {
    const locale = pathname.match(/^\/(en|ja)/)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
  }

  // 6. Handle i18n routing
  return intlMiddleware(req);
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
