import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminSettings, saveAdminSettings } from "@/lib/admin-storage";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getAdminSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  await saveAdminSettings(data as any);
  return NextResponse.json({ success: true });
}
