"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus, Award, Heart, Shield } from "lucide-react";
import { getFeaturedProducts } from "@/lib/services/product.service";
import { getSettings } from "@/lib/services/settings.service";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Promotion } from "@/lib/types";
import ScrollReveal from "@/components/shared/ScrollReveal.client";
import SectionTitle from "@/components/shared/SectionTitle";

const settings = getSettings();
const products = getFeaturedProducts();

const values = [
  {
    icon: Award,
    title: "Qualidade",
    desc: "Ingredientes frescos selecionados todos os dias.",
  },
  {
    icon: Heart,
    title: "Paixão",
    desc: `Amor pelo que fazemos desde ${settings.foundedYear}.`,
  },
  {
    icon: Shield,
    title: "Confiança",
    desc: "Atendimento que faz você voltar sempre.",
  },
];

export default function Destaques() {
  const { items, addItem, updateQuantity } = useCart();
  const [promocoes, setPromocoes] = useState<Promotion[]>([]);

  useEffect(() => {
    fetch("/api/admin/promocoes")
      .then((r) => r.json())
      .then((list: Promotion[]) =>
        setPromocoes(
          list.filter(
            (p) =>
              p.active &&
              p.type === "direct" &&
              (!p.validUntil || p.validUntil >= new Date().toISOString().slice(0, 10)),
          ),
        ),
      )
      .catch(() => {});
  }, []);

  const getPromotion = (productId: string) =>
    promocoes.find((p) => p.productId === productId);

  const getQty = (productId: string, variantLabel?: string) => {
    return (
      items.find(
        (i) => i.productId === productId && i.variantLabel === variantLabel,
      )?.quantity || 0
    );
  };

  return (
    <>
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            title="Nossos Destaques"
            subtitle="Os favoritos da casa que todo mundo pede"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1} className="h-full">
                <div className="group flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-auto pt-4">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-2">
                          {(() => {
                            const promo = getPromotion(product.id);
                            return product.variants.map((v) => {
                              const qty = getQty(product.id, v.label);
                              const varPrice = promo?.newPrice ?? v.price;
                              return (
                                <div
                                  key={v.label}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span className="text-sm text-muted-foreground">
                                    {v.label}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-primary">
                                      {promo && (
                                        <span className="line-through text-muted-foreground/60 font-normal mr-1.5">
                                          {formatCurrency(v.price)}
                                        </span>
                                      )}
                                      {formatCurrency(varPrice)}
                                    </span>
                                    {qty > 0 ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              product.id,
                                              v.label,
                                              qty - 1,
                                            )
                                          }
                                          className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                          <Minus size={13} />
                                        </button>
                                        <span className="w-5 text-center text-sm font-semibold text-white">
                                          {qty}
                                        </span>
                                      </>
                                    ) : null}
                                    <button
                                      onClick={() => addItem(product, v, promo?.newPrice)}
                                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
                                    >
                                      <Plus size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {(() => {
                            const promo = getPromotion(product.id);
                            const price = promo?.newPrice ?? product.price;
                            return (
                              <>
                                <span className="text-lg font-semibold text-primary">
                                  {promo && (
                                    <span className="line-through text-muted-foreground/60 font-normal mr-1.5">
                                      {formatCurrency(product.price)}
                                    </span>
                                  )}
                                  {formatCurrency(price)}
                                </span>
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const qty = getQty(product.id);
                                    return (
                                      <>
                                        {qty > 0 ? (
                                          <>
                                            <button
                                              onClick={() =>
                                                updateQuantity(
                                                  product.id,
                                                  undefined,
                                                  qty - 1,
                                                )
                                              }
                                              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                              <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-white">
                                              {qty}
                                            </span>
                                          </>
                                        ) : null}
                                        <button
                                          onClick={() => addItem(product, undefined, promo?.newPrice)}
                                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
                                        >
                                          <Plus size={14} />
                                        </button>
                                      </>
                                    );
                                  })()}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-12">
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/5 hover:border-white/40 active:scale-[0.98]"
            >
              Ver Cardápio Completo
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} direction="scale" delay={i * 0.1}>
                <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
