"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/produtos").then((r) => r.json()),
      fetch("/api/track/product-view").then((r) => r.json()),
    ]).then(([prods, v]) => {
      setProducts(prods);
      setViews(v);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    await fetch("/api/admin/produtos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-card border border-border/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} produto(s)</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          Novo
        </Link>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-2xl bg-card border border-border/50 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {p.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 mr-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye size={12} />
                {views[p.id] || 0}
              </span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(p.price)}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/produtos/${p.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 size={14} />
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
