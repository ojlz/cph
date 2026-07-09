import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  }

  if (isLocal) {
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }
  } else {
    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(password, adminPassword);
    if (!valid) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }
  }

  await setSession();
  return NextResponse.json({ success: true });
}
