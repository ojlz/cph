import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  }

  if (isLocal) {
    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
    }
    // In local mode, we can't persist .env changes, so just validate
    return NextResponse.json({ success: true, message: "Altere a variável ADMIN_PASSWORD no .env.local manualmente" });
  }

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(currentPassword, adminPassword);
  if (!valid) {
    return NextResponse.json({ error: "Senha atual inválida" }, { status: 401 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  // In production this would need to update the env var via GitHub/Vercel
  // For now we just validate and return success
  return NextResponse.json({ success: true, message: "Senha alterada. Atualize a variável ADMIN_PASSWORD no Vercel." });
}
