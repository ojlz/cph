"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Promotion } from "@/lib/types";
import { Plus, Pencil, Trash2, Tag, Percent } from "lucide-react";

export default function AdminPromocoes() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/admin/promocoes")
      .then((r) => r.json())
      .then(setPromotions);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/promocoes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = async (promo: Promotion) => {
    const today = new Date().toISOString().slice(0, 10);
    const expired = promo.validUntil && promo.validUntil < today;

    const updated: Promotion = {
      ...promo,
      active: !promo.active,
      validUntil: !promo.active && expired ? undefined : promo.validUntil,
    };

    await fetch("/api/admin/promocoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    await load();
  };

  const isExpired = (promo: Promotion) =>
    promo.validUntil && promo.validUntil < new Date().toISOString().slice(0, 10);

  if (loading) return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Promoções</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie ofertas e cupons</p>
        </div>
        <Link
          href="/admin/promocoes/novo"
          className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          Nova Promoção
        </Link>
      </div>

      <div className="space-y-3">
        {promotions.length === 0 && (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <Tag size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma promoção ainda</p>
            <Link href="/admin/promocoes/novo" className="inline-block mt-3 text-sm text-primary hover:underline">
              Criar primeira promoção
            </Link>
          </div>
        )}

        {promotions.map((promo) => {
          const expired = isExpired(promo);
          return (
            <div
              key={promo.id}
              className={`rounded-2xl bg-card border p-5 flex items-center justify-between gap-4 ${
                expired ? "border-destructive/20" : "border-border/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-display text-base font-semibold truncate ${
                    expired && !promo.active ? "text-muted-foreground" : "text-white"
                  }`}>
                    {promo.title}
                  </h3>
                  {promo.type === "coupon" ? (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-400 px-2.5 py-0.5 text-[11px] font-medium">
                      <Percent size={10} /> Cupom
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-500/10 text-green-400 px-2.5 py-0.5 text-[11px] font-medium">
                      Direta
                    </span>
                  )}
                  {expired && (
                    <span className="rounded-full bg-orange-500/10 text-orange-400 px-2.5 py-0.5 text-[11px] font-medium">
                      Expirada
                    </span>
                  )}
                  {!promo.active && !expired && (
                    <span className="rounded-full bg-destructive/10 text-destructive px-2.5 py-0.5 text-[11px] font-medium">
                      Inativa
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{promo.description}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[11px] text-muted-foreground/60">
                    {promo.type === "coupon"
                      ? `Cupom: ${promo.couponCode} — ${promo.discountPercent}% off`
                      : `R$ ${Number(promo.oldPrice).toFixed(2)} → R$ ${Number(promo.newPrice).toFixed(2)}`}
                  </span>
                  {promo.validUntil && (
                    <span className={`text-[11px] ${expired ? "text-orange-400/70" : "text-muted-foreground/60"}`}>
                      {expired ? "Expirou em" : "Válida até"} {new Date(promo.validUntil).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promo.active}
                    onChange={() => handleToggle(promo)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full peer bg-secondary peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <Link
                  href={`/admin/promocoes/${promo.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
