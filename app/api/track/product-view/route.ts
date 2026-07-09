import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

interface ViewsData {
  [productId: string]: number;
}

async function readViews(): Promise<ViewsData> {
  try {
    const fs = await import("fs/promises");
    const raw = await fs.readFile(process.cwd() + "/data/product-views.json", "utf-8");
    return JSON.parse(raw);
  } catch { return {}; }
}

async function writeViews(data: ViewsData): Promise<void> {
  const fs = await import("fs/promises");
  await fs.writeFile(process.cwd() + "/data/product-views.json", JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, { max: 300, windowMinutes: 15 }, "product-view")) {
    return NextResponse.json({ error: "Muitas requisições" }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { body = {}; }
  const productId = (body as Record<string, unknown>)?.productId;
  if (typeof productId !== "string" || !productId) {
    return NextResponse.json({ error: "productId obrigatório" }, { status: 400 });
  }

  const views = await readViews();
  views[productId] = (views[productId] || 0) + 1;
  await writeViews(views);

  return NextResponse.json({ success: true });
}

export async function GET() {
  const views = await readViews();
  return NextResponse.json(views);
}
