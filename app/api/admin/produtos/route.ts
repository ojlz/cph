import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminProducts, saveAdminProducts } from "@/lib/admin-storage";
import { Product } from "@/lib/types";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await getAdminProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const products = await getAdminProducts();
  products.push(data as Product);
  await saveAdminProducts(products);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const d = data as Product;
  if (!d.id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  const products = await getAdminProducts();
  const idx = products.findIndex((p) => p.id === d.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  products[idx] = d;
  await saveAdminProducts(products);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { id } = (data || {}) as Record<string, unknown>;
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  const products = await getAdminProducts();
  await saveAdminProducts(products.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
