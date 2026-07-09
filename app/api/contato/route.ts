import { NextResponse } from "next/server";
import { getAdminMessages, saveAdminMessages } from "@/lib/admin-storage";
import { ContactMessage } from "@/lib/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, { max: 5, windowMinutes: 15 }, "contato")) {
    return NextResponse.json(
      { error: "Muitas mensagens enviadas. Tente novamente em 15 minutos." },
      { status: 429 },
    );
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > 10_000) {
    return NextResponse.json({ error: "Mensagem muito grande" }, { status: 413 });
  }

  let data: unknown;
  try { data = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const body = (data || {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const subject = String(body.subject || "");
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const rating = typeof body.rating === "number" ? body.rating : undefined;

  if (name.length < 2) {
    return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Mensagem deve ter pelo menos 10 caracteres" }, { status: 400 });
  }
  if (!["avaliacao", "sugestao", "critica", "outro"].includes(subject)) {
    return NextResponse.json({ error: "Assunto inválido" }, { status: 400 });
  }

  const messages = await getAdminMessages();
  const id = "MSG" + Date.now().toString(36).toUpperCase();
  const newMsg: ContactMessage = {
    id,
    date: new Date().toISOString(),
    name,
    email: email.length > 0 ? email : undefined,
    subject,
    rating,
    message,
  };

  messages.unshift(newMsg);
  await saveAdminMessages(messages);

  return NextResponse.json({ success: true, id });
}
