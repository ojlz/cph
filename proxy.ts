import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (raw) return new TextEncoder().encode(raw);
  if (process.env.LOCAL === "true" || process.env.NODE_ENV === "development") {
    return new TextEncoder().encode("dev-only-secret");
  }
  throw new Error("JWT_SECRET não configurado. Defina a variável de ambiente.");
}

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Origin check for mutating admin requests (CSRF protection)
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const host = req.headers.get("host");

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json({ error: "Origin inválida" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Origin inválida" }, { status: 403 });
      }
    } else if (referer) {
      try {
        const refererHost = new URL(referer).host;
        if (refererHost !== host) {
          return NextResponse.json({ error: "Referer inválido" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Referer inválido" }, { status: 403 });
      }
    }
  }

  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const secret = getSecret();
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
