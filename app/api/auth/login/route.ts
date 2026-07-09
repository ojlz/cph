import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { getAdminPasswordHash } from "@/lib/admin-storage";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, { max: 5, windowMinutes: 15 }, "auth-login")) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em 15 minutos." },
      { status: 429 },
    );
  }

  let password: unknown;
  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 3) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }

  const bcrypt = await import("bcryptjs");

  // Checa hash salvo no GitHub/locaL primeiro
  const storedHash = await getAdminPasswordHash();
  if (storedHash) {
    const ok = await bcrypt.compare(password, storedHash);
    if (ok) {
      resetRateLimit(ip, "auth-login");
      await setSession();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }

  // Fallback: variável de ambiente
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  }

  const ok = isLocal
    ? password === adminPassword
    : await bcrypt.compare(password, adminPassword);

  if (!ok) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }

  resetRateLimit(ip, "auth-login");
  await setSession();
  return NextResponse.json({ success: true });
}
