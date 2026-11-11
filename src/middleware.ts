import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login");
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/doctors") ||
    pathname.startsWith("/patients");

  // If trying to access protected route without token, redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting /login, redirect to /
  if (isAuthRoute && token) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/doctors/:path*",
    "/patients/:path*",
    "/login",
  ],
};
