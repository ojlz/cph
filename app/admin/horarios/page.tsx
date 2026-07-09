"use client";

import { useEffect, useState, FormEvent } from "react";
import { OpeningHours, DaySchedule } from "@/lib/types";
import { Save } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

const defaultDays = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo",
];

export default function AdminHorarios() {
  const [data, setData] = useState<OpeningHours | null>(null);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, ToastElement } = useToast();

  useEffect(() => {
    fetch("/api/admin/horarios")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const updateDay = (i: number, field: keyof DaySchedule, value: string | boolean) => {
    setData((prev) => {
      if (!prev) return prev;
      const days = [...prev.days];
      days[i] = { ...days[i], [field]: value };
      return { ...prev, days };
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/horarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) showSuccess("Horários salvos com sucesso!");
      else showError("Erro ao salvar horários");
    } catch {
      showError("Erro ao salvar horários");
    }
    setSaving(false);
  };

  if (!data) return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Horários</h1>
          <p className="text-sm text-muted-foreground mt-1">Dias e horários de funcionamento</p>
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

      <div className="space-y-3">
        {defaultDays.map((dayName, i) => {
          const day = data.days[i];
          return (
            <div key={dayName} className="rounded-2xl bg-card border border-border/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{dayName}</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={day?.isOpen ?? false}
                    onChange={(e) => updateDay(i, "isOpen", e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">Aberto</span>
                </label>
              </div>
              {day?.isOpen && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Abertura</label>
                    <input type="time" value={day.open || "18:00"} onChange={(e) => updateDay(i, "open", e.target.value)} className="w-full rounded-xl bg-background border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Fechamento</label>
                    <input type="time" value={day.close || "23:00"} onChange={(e) => updateDay(i, "close", e.target.value)} className="w-full rounded-xl bg-background border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  {day.open2 !== undefined && (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">2ª Abertura</label>
                        <input type="time" value={day.open2 || ""} onChange={(e) => updateDay(i, "open2", e.target.value)} className="w-full rounded-xl bg-background border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">2ª Fechamento</label>
                        <input type="time" value={day.close2 || ""} onChange={(e) => updateDay(i, "close2", e.target.value)} className="w-full rounded-xl bg-background border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Observações (ex: feriados)</label>
        <input value={data.notes || ""} onChange={(e) => setData((prev) => prev ? { ...prev, notes: e.target.value } : prev)} placeholder="Horários podem variar em feriados" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
      </div>

      {ToastElement}
    </form>
  );
}
