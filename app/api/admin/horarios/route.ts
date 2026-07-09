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
  const data = await req.json();
  await saveAdminHours(data);
  return NextResponse.json({ success: true });
}
