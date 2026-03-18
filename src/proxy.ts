import { Role } from "@/features/auth/types";
import { routing } from "@/i18n/routing";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Create i18n middleware
const intlMiddleware = createMiddleware(routing);

// 1. Specify protected and public routes
const appRoutes = ["/courses"];
const adminRoutes = ["/admin"];
const authRoutes = [
  "/login",
  "/login-admin",
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
  const isAppRoute = matchesRoute(pathname, appRoutes);
  const isAdminRoute = matchesRoute(pathname, adminRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // 3. Get session from cookie (optimistic check)
  const token = await getToken({ req });

  // 4. Redirect to /login if the user is not authenticated
  if (isAppRoute && (!token || token.role !== Role.STUDENT)) {
    const locale = pathname.match(/^\/(en|ja)/)?.[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Redirect to /login if the admin is not authenticated
  if (isAdminRoute && (!token || token.role !== Role.ADMIN)) {
    const locale = pathname.match(/^\/(en|ja)/)?.[1] || "en";
    const loginUrl = new URL(`/${locale}/login-admin`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Redirect to /profile if the user is authenticated
  if (isAuthRoute && token) {
    const locale = pathname.match(/^\/(en|ja)/)?.[1] || "en";
    if (token.role === Role.ADMIN)
      return NextResponse.redirect(
        new URL(`/${locale}/admin/courses`, req.url)
      );
    return NextResponse.redirect(new URL(`/${locale}/courses`, req.url));
  }

  // 6. Handle i18n routing
  return intlMiddleware(req);
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
