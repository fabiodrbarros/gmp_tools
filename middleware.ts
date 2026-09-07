import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page itself is always reachable
  if (pathname === "/gmp-panel-admin/login") return NextResponse.next();

  const token = req.cookies.get("gmp_admin")?.value;
  if (token && token === process.env.ADMIN_TOKEN) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/gmp-panel-admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/gmp-panel-admin", "/gmp-panel-admin/:path*"],
};
