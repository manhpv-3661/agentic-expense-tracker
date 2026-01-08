// Middleware disabled - using client-side auth checks
// Because we use localStorage (client-side only) instead of cookies
// See: frontend/app/page.tsx and frontend/app/(dashboard)/layout.tsx

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Let client-side handle auth redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/transactions/:path*",
    "/login",
    "/register",
  ],
};
