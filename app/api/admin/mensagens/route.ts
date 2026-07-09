import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminMessages } from "@/lib/admin-storage";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await getAdminMessages();
  return NextResponse.json(messages);
}
