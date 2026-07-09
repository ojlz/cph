import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminPromotions, saveAdminPromotions } from "@/lib/admin-storage";
import { Promotion } from "@/lib/types";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const promotions = await getAdminPromotions();
  return NextResponse.json(promotions);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const promotions = await getAdminPromotions();
  promotions.push(data as Promotion);
  await saveAdminPromotions(promotions);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const d = data as Promotion;
  if (!d.id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  const promotions = await getAdminPromotions();
  const idx = promotions.findIndex((p) => p.id === d.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  promotions[idx] = d;
  await saveAdminPromotions(promotions);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { id } = (data || {}) as Record<string, unknown>;
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  const promotions = await getAdminPromotions();
  await saveAdminPromotions(promotions.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
