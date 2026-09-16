// middleware.ts — CSP por ruta.
// El journal se incrusta en otras páginas (iframe), así que el sitio público
// permite frame-ancestors *. PERO /admin/* queda con DENY: un login embebido
// invisible en un sitio externo es clickjacking clásico.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
    res.headers.set("X-Frame-Options", "DENY");
  } else {
    res.headers.set("Content-Security-Policy", "frame-ancestors *");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)"],
};
