"use client";

import { useEffect, useState } from "react";
import { Product, Promotion } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    fetch("/api/admin/promocoes")
      .then((r) => r.json())
      .then((list: Promotion[]) => {
        const active = list.find(
          (p) =>
            p.active &&
            p.type === "direct" &&
            p.productId === product.id &&
            (!p.validUntil || p.validUntil >= new Date().toISOString().slice(0, 10)),
        );
        setPromotion(active || null);
      })
      .catch(() => {});
  }, [product.id]);

  const getQty = (variantLabel?: string) => {
    const item = items.find(
      (i) => i.productId === product.id && i.variantLabel === variantLabel,
    );
    return item?.quantity || 0;
  };

  const handleAdd = (variant?: NonNullable<Product["variants"]>[number]) => {
    addItem(product, variant, promotion?.newPrice);
  };

  const currentPrice = promotion?.newPrice ?? product.price;
  const oldPrice = promotion?.oldPrice;

  if (product.variants && product.variants.length > 0) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-5">
        <div className="mb-3">
          <h3 className="font-display text-base font-semibold text-white">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="space-y-2">
          {product.variants.map((v) => {
            const qty = getQty(v.label);
            const varOldPrice = promotion ? v.price : undefined;
            const varPrice = promotion?.newPrice ?? v.price;
            return (
              <div
                key={v.label}
                className="flex items-center justify-between gap-3 rounded-xl bg-background/50 px-4 py-2.5"
              >
                <span className="text-sm text-muted-foreground">{v.label}</span>
                <span className="text-sm font-semibold text-primary mr-auto ml-3">
                  {promotion && (
                    <span className="line-through text-muted-foreground/60 font-normal mr-1.5">
                      {formatCurrency(varOldPrice!)}
                    </span>
                  )}
                  {formatCurrency(varPrice)}
                </span>
                <div className="flex items-center gap-2">
                  {qty > 0 ? (
                    <>
                      <button
                        onClick={() => updateQuantity(product.id, v.label, qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-white">
                        {qty}
                      </span>
                    </>
                  ) : null}
                  <button
                    onClick={() => handleAdd(v)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const qty = getQty();

  return (
    <div className="group flex items-start justify-between gap-4 rounded-2xl bg-card border border-border/50 p-5 transition-all duration-300 hover:bg-secondary">
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base font-semibold text-white">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {qty > 0 ? (
          <>
            <button
              onClick={() => updateQuantity(product.id, undefined, qty - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus size={15} />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-white">
              {qty}
            </span>
          </>
        ) : null}
        <button
          onClick={() => handleAdd()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
        >
          <Plus size={15} />
        </button>
        <span className="text-sm font-semibold text-primary">
          {promotion && (
            <span className="line-through text-muted-foreground/60 font-normal mr-1.5">
              {formatCurrency(oldPrice!)}
            </span>
          )}
          {formatCurrency(currentPrice)}
        </span>
      </div>
    </div>
  );
}
