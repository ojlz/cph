import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminOrders, saveAdminOrders } from "@/lib/admin-storage";
import { Order } from "@/lib/types";

function orderPeriod(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await getAdminOrders();
  return NextResponse.json(orders);
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { id, status } = (data || {}) as Record<string, unknown>;
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  if (status !== "confirmado" && status !== "cancelado") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  const orders = await getAdminOrders();
  const idx = orders.findIndex((o: Order) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  orders[idx].status = status;
  const period = orderPeriod(orders[idx].date);
  const periodOrders = await getAdminOrders(period);
  const pIdx = periodOrders.findIndex((o: Order) => o.id === id);
  if (pIdx !== -1) periodOrders[pIdx].status = status;
  await saveAdminOrders(periodOrders, period);
  return NextResponse.json({ success: true });
}
