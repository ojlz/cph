"use client";

import { useState, FormEvent } from "react";
import { Product, ProductVariant, Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  product?: Product;
  categories: Category[];
  onSave: (data: Product) => Promise<void>;
}

export default function ProductForm({ product, categories, onSave }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || "");
  const [available, setAvailable] = useState(product?.available ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
  const [saving, setSaving] = useState(false);

  const addVariant = () => {
    setVariants((prev) => [...prev, { label: "", price: 0 }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data: Product = {
      id: product?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name,
      description,
      price: Number(price),
      categoryId,
      available,
      featured,
      variants: variants.length > 0 ? variants.filter((v) => v.label) : undefined,
    };

    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1.5 block">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-muted-foreground">Disponível</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-muted-foreground">Destaque</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground">Variantes</label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus size={12} /> Adicionar variante
          </button>
        </div>
        {variants.length > 0 && (
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={v.label}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i] = { ...next[i], label: e.target.value };
                    setVariants(next);
                  }}
                  placeholder="Ex: Normal, Pastelão"
                  className="flex-1 rounded-xl bg-card border border-border/50 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  type="number"
                  step="0.01"
                  value={v.price}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i] = { ...next[i], price: Number(e.target.value) };
                    setVariants(next);
                  }}
                  placeholder="Preço"
                  className="w-28 rounded-xl bg-card border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setVariants((prev) => prev.filter((_, j) => j !== i))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/admin/produtos"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
