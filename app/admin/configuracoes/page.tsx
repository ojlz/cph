"use client";

import { useEffect, useState, FormEvent } from "react";
import { BusinessSettings } from "@/lib/types";
import { Save } from "lucide-react";

export default function AdminConfiguracoes() {
  const [data, setData] = useState<BusinessSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/configuracoes")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const update = (field: keyof BusinessSettings, value: string | number | boolean) => {
    setData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    await fetch("/api/admin/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
  };

  if (!data) return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">Informações da empresa</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
        >
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1.5 block">Nome do estabelecimento</label>
          <input value={data.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
          <textarea value={data.description} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1.5 block">Descrição curta (slogan)</label>
          <input value={data.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Telefone</label>
          <input value={data.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">WhatsApp (código do país + número)</label>
          <input value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="5500090000008" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Instagram (usuário)</label>
          <input value={data.instagram} onChange={(e) => update("instagram", e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Endereço</label>
          <input value={data.address} onChange={(e) => update("address", e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Ano de fundação</label>
          <input type="number" value={data.foundedYear} onChange={(e) => update("foundedYear", Number(e.target.value))} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
      </div>
    </form>
  );
}
