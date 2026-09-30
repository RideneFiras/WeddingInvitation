import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminPassword, adminToken, safeEqual } from "@/lib/admin-auth";

/** Gate /admin behind ADMIN_PASSWORD (when set). The login page itself stays reachable. */
export async function proxy(request: NextRequest) {
  const password = adminPassword();
  if (!password || request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (cookie && safeEqual(cookie, await adminToken(password))) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
