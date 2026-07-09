import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminHours, saveAdminHours } from "@/lib/admin-storage";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hours = await getAdminHours();
  return NextResponse.json(hours);
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  await saveAdminHours(data as any);
  return NextResponse.json({ success: true });
}
