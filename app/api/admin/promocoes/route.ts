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
  const data: Promotion = await req.json();
  const promotions = await getAdminPromotions();
  promotions.push(data);
  await saveAdminPromotions(promotions);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data: Promotion = await req.json();
  const promotions = await getAdminPromotions();
  const idx = promotions.findIndex((p) => p.id === data.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  promotions[idx] = data;
  await saveAdminPromotions(promotions);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const promotions = await getAdminPromotions();
  await saveAdminPromotions(promotions.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
