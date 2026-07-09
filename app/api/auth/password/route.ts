import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminPasswordHash, saveAdminPasswordHash } from "@/lib/admin-storage";

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

  const bcrypt = await import("bcryptjs");

  // Busca hash atual (salvo ou variável de ambiente)
  const storedHash = await getAdminPasswordHash();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const currentHash = storedHash || adminPassword;

  if (!currentHash) {
    return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  }

  // Valida senha atual
  const valid = isLocal
    ? currentPassword === currentHash
    : await bcrypt.compare(currentPassword, currentHash);

  if (!valid) {
    return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
  }

  // Gera hash da nova senha e salva
  const newHash = await bcrypt.hash(newPassword, 12);
  await saveAdminPasswordHash(newHash);

  return NextResponse.json({ success: true, message: "Senha alterada com sucesso!" });
}
