import { NextResponse } from "next/server";
import { AnalyticsData, AnalyticsEvent } from "@/lib/analytics/types";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

async function readStats(): Promise<AnalyticsData> {
  try {
    const fs = await import("fs/promises");
    const raw = await fs.readFile(process.cwd() + "/data/analytics.json", "utf-8");
    return JSON.parse(raw);
  } catch {
    return { days: [] };
  }
}

async function writeStats(data: AnalyticsData): Promise<void> {
  const fs = await import("fs/promises");
  const json = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(process.cwd() + "/data/analytics.json", json, "utf-8");
}

export async function GET() {
  const data = await readStats();
  const today = getToday();
  const todayStats = data.days.find((d) => d.date === today);

  return NextResponse.json({
    today: todayStats || { date: today, visits: 0, pageViews: 0, events: {} },
    history: data.days,
  });
}

export async function POST(req: Request) {
  const { event, label }: AnalyticsEvent = await req.json();
  if (!event) return NextResponse.json({ error: "event required" }, { status: 400 });

  const data = await readStats();
  const today = getToday();
  let day = data.days.find((d) => d.date === today);

  if (!day) {
    day = { date: today, visits: 0, pageViews: 0, events: {} };
    data.days.push(day);
  }

  if (event === "session") {
    day.visits++;
  } else if (event === "pageview") {
    day.pageViews++;
  } else {
    const key = label ? `${event}:${label}` : event;
    day.events[key] = (day.events[key] || 0) + 1;
  }

  await writeStats(data);
  return NextResponse.json({ success: true });
}
