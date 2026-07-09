import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const authed = await getSession();
  return NextResponse.json({ authed });
}
