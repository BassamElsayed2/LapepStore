import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/app/i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // Get response from i18n middleware
  const response = intlMiddleware(req);

  // Add security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Remove server identification
  response.headers.delete("X-Powered-By");

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
