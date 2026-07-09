"use client";

import { useEffect, useState, useCallback } from "react";
import { Category } from "@/lib/types";
import { Save, GripVertical, Plus, X } from "lucide-react";

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((r) => r.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...categories];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setCategories(next);
  };

  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const next = [...categories];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setCategories(next);
  };

  const addCategory = () => {
    const id = `nova-${Date.now()}`;
    setCategories((prev) => [
      ...prev,
      { id, name: "", slug: id, order: prev.length + 1 },
    ]);
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof Category, value: string | number) => {
    const next = [...categories];
    (next[index] as any)[field] = value;
    if (field === "name") {
      next[index].slug = value.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    setCategories(next);
  };

  const handleSave = async () => {
    setSaving(true);
    const reordered = categories.map((c, i) => ({ ...c, order: i + 1 }));
    await fetch("/api/admin/categorias", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered),
    });
    setSaving(false);
  };

  if (loading) {
    return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Arraste ou use as setas para ordenar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addCategory}
            className="flex items-center gap-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Adicionar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/50 px-4 py-3"
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-20"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === categories.length - 1}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-20"
              >
                ▼
              </button>
            </div>

            <input
              value={cat.name}
              onChange={(e) => updateCategory(i, "name", e.target.value)}
              placeholder="Nome da categoria"
              className="flex-1 rounded-xl bg-background border border-border/50 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
            />

            {categories.length > 1 && (
              <button
                onClick={() => removeCategory(i)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-red-400 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
