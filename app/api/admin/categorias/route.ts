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
  const data = await req.json();
  await saveAdminCategories(data);
  return NextResponse.json({ success: true });
}
