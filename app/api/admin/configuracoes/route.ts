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
  const data = await req.json();
  await saveAdminSettings(data);
  return NextResponse.json({ success: true });
}
