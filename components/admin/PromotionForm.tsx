"use client";

import { useState, useEffect, FormEvent } from "react";
import { Promotion, Product } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  promotion?: Promotion;
  onSave: (data: Promotion) => Promise<void>;
}

export default function PromotionForm({ promotion, onSave }: Props) {
  const [title, setTitle] = useState(promotion?.title || "");
  const [description, setDescription] = useState(promotion?.description || "");
  const [type, setType] = useState<"direct" | "coupon">(promotion?.type || "direct");
  const [productId, setProductId] = useState(promotion?.productId || "");
  const [oldPrice, setOldPrice] = useState(String(promotion?.oldPrice || ""));
  const [newPrice, setNewPrice] = useState(String(promotion?.newPrice || ""));
  const [couponCode, setCouponCode] = useState(promotion?.couponCode || "");
  const [discountPercent, setDiscountPercent] = useState(String(promotion?.discountPercent || ""));
  const [active, setActive] = useState(() => {
    if (!promotion) return true;
    if (promotion.validUntil && promotion.validUntil < new Date().toISOString().slice(0, 10)) return false;
    return promotion.active;
  });
  const [validUntil, setValidUntil] = useState(promotion?.validUntil || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/produtos")
      .then((r) => r.json())
      .then((list: Product[]) => {
        setProducts(list);
      });
  }, []);

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    if (type === "direct" && selectedProduct && !promotion) {
      setOldPrice(String(selectedProduct.price));
    }
  }, [productId, type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data: Promotion = {
      id: promotion?.id || `promo-${Date.now()}`,
      title,
      description,
      type,
      productId: type === "direct" ? productId : undefined,
      oldPrice: type === "direct" ? Number(oldPrice) : undefined,
      newPrice: type === "direct" ? Number(newPrice) : undefined,
      couponCode: type === "coupon" ? couponCode : undefined,
      discountPercent: type === "coupon" ? Number(discountPercent) : undefined,
      active,
      validUntil: validUntil || undefined,
    };

    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <Link
        href="/admin/promocoes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <h1 className="font-display text-2xl font-semibold text-white">
        {promotion ? "Editar Promoção" : "Nova Promoção"}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Tipo</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setType("direct")} className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${type === "direct" ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:text-foreground"}`}>
              Preço direto
            </button>
            <button type="button" onClick={() => setType("coupon")} className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${type === "coupon" ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:text-foreground"}`}>
              Cupom
            </button>
          </div>
        </div>

        {type === "direct" && (
          <div className="space-y-4 rounded-2xl bg-card border border-border/50 p-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Produto</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors">
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Preço original (R$)</label>
                <input type="number" step="0.01" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Preço promocional (R$)</label>
                <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
          </div>
        )}

        {type === "coupon" && (
          <div className="space-y-4 rounded-2xl bg-card border border-border/50 p-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Código do cupom</label>
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} required placeholder="EX: PROMO10" className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors uppercase" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Desconto (%)</label>
              <input type="number" step="1" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-primary" />
            <span className="text-sm text-muted-foreground">Ativa</span>
          </label>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Válida até</label>
            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full rounded-xl bg-card border border-border/50 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
          </div>
        </div>
        {promotion && promotion.validUntil && promotion.validUntil < new Date().toISOString().slice(0, 10) && (
          <p className="text-xs text-orange-400">Esta promoção expirou. Marque "Ativa" para reativá-la permanentemente (a data será ignorada).</p>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/admin/promocoes" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors">
          Cancelar
        </Link>
        <button type="submit" disabled={saving} className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
