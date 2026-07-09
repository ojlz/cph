"use client";

import { useEffect, useState } from "react";
import { ContactMessage } from "@/lib/types";
import { MessageSquare, Star, Search, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

const subjectLabels: Record<string, string> = {
  avaliacao: "Avaliação",
  sugestao: "Sugestão",
  critica: "Crítica",
  outro: "Outro",
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/mensagens")
      .then((r) => r.json())
      .then(setMessages);
  }, []);

  const filtered = search
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.message.toLowerCase().includes(search.toLowerCase()) ||
          (m.email && m.email.toLowerCase().includes(search.toLowerCase())),
      )
    : messages;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Mensagens</h1>
        <p className="text-sm text-muted-foreground mt-1">Mensagens recebidas via formulário de contato</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-xl bg-card border border-border/50 pl-8 pr-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <span className="text-xs text-muted-foreground">{messages.length} mensagens</span>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
          <MessageSquare size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma mensagem encontrada</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-2xl bg-card border transition-all cursor-pointer",
              expanded === msg.id ? "border-primary/40" : "border-border/50",
            )}
            onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display text-sm font-semibold text-white">{msg.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {subjectLabels[msg.subject] || msg.subject}
                    </span>
                    {msg.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                        <Star size={12} fill="currentColor" /> {msg.rating}/5
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {new Date(msg.date).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {expanded === msg.id && (
              <div className="px-4 pb-4 pt-0 space-y-3">
                <div className="border-t border-border/50" />

                <div className="text-sm text-white whitespace-pre-wrap">{msg.message}</div>

                <div className="flex flex-wrap gap-4 text-xs">
                  {msg.email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail size={12} />
                      {msg.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User size={12} />
                    {msg.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
