import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminCategories, saveAdminCategories } from "@/lib/admin-storage";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await getAdminCategories();
  return NextResponse.json(categories);
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!Array.isArray(data)) return NextResponse.json({ error: "Formato inválido — array esperado" }, { status: 400 });
  await saveAdminCategories(data);
  return NextResponse.json({ success: true });
}
