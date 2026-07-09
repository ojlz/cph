import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > 1_000) {
    return NextResponse.json({ error: "Requisição muito grande" }, { status: 413 });
  }

  let currentPassword: unknown;
  let newPassword: unknown;
  try {
    const body = await req.json();
    currentPassword = body?.currentPassword;
    newPassword = body?.newPassword;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof currentPassword !== "string" || currentPassword.length < 1) {
    return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
  }

  if (typeof newPassword !== "string" || newPassword.length < 4) {
    return NextResponse.json({ error: "Nova senha deve ter no mínimo 4 caracteres" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  }

  if (isLocal) {
    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
    }
    return NextResponse.json({ success: true, message: "Altere a variável ADMIN_PASSWORD no .env.local manualmente" });
  }

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(currentPassword as string, adminPassword);
  if (!valid) {
    return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
  }

  await bcrypt.hash(newPassword as string, 12);
  return NextResponse.json({ success: true, message: "Senha alterada. Atualize a variável ADMIN_PASSWORD no Vercel." });
}
