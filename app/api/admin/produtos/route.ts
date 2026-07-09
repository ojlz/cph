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
  const data: Product = await req.json();
  const products = await getAdminProducts();
  products.push(data);
  await saveAdminProducts(products);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data: Product = await req.json();
  const products = await getAdminProducts();
  const idx = products.findIndex((p) => p.id === data.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  products[idx] = data;
  await saveAdminProducts(products);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const products = await getAdminProducts();
  await saveAdminProducts(products.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
