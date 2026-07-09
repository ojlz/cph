"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Tag, Loader2 } from "lucide-react";
import { useCart, CartItem } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { getSettings } from "@/lib/services/settings.service";
import { trackEvent } from "@/lib/analytics";
import { usePromotions } from "@/lib/promotions-context";
import { Promotion } from "@/lib/types";

type PaymentMethod = "pix" | "dinheiro" | "cartao";

const settings = getSettings();

const paymentLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
};

interface ValidatedItem {
  productName: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, totalPrice: rawTotal } = useCart();
  const { promotions: allPromotions } = usePromotions();
  const [mode, setMode] = useState<"retirada" | "entrega">("retirada");
  const [nome, setNome] = useState("");
  const [pagamento, setPagamento] = useState<PaymentMethod>("pix");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const coupons = allPromotions.filter(
    (p) =>
      p.type === "coupon" &&
      p.couponCode &&
      (!p.validUntil || p.validUntil >= new Date().toISOString().slice(0, 10)),
  );
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Promotion | null>(null);
  const [couponError, setCouponError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const discountPercent = appliedCoupon?.discountPercent || 0;
  const totalPrice = rawTotal - (rawTotal * discountPercent) / 100;
  const hasDiscount = discountPercent > 0;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const match = coupons.find((c) => c.couponCode === code);
    if (match) {
      setAppliedCoupon(match);
      setCouponError("");
      trackEvent("coupon", code);
    } else {
      setCouponError("Cupom inválido");
      setAppliedCoupon(null);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setSendError("");

    try {
      const payload = {
        products: items.map((i: CartItem) => ({
          productId: i.productId,
          variantLabel: i.variantLabel,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.couponCode,
        nome: nome.trim(),
        mode,
        pagamento,
        bairro: bairro.trim(),
        rua: rua.trim(),
        numero: numero.trim(),
        referencia: referencia.trim(),
        observacoes: observacoes.trim(),
      };

      const res = await fetch("/api/order/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha na validação");

      const data = await res.json();
      mountMessage(data);
    } catch {
      setSendError("Erro ao validar pedido. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const mountMessage = (data: {
    orderId: string;
    items: ValidatedItem[];
    total: number;
    couponCode?: string;
    name: string;
    whatsapp: string;
  }) => {
    trackEvent("whatsapp", "cart");

    const sep = "\n";
    const block = "\n\n";
    let msg = `*Pedido - ${data.name}*\n#${data.orderId}${block}`;
    msg += `*Nome:* ${nome}${block}`;
    msg += `*Itens:*${sep}`;
    msg += data.items
      .map((i: ValidatedItem) => {
        let line = `${i.quantity}x ${i.productName}`;
        if (i.variantLabel) line += ` (${i.variantLabel})`;
        return line;
      })
      .join(sep);

    msg += `${block}*Total:* ${formatCurrency(data.total)}`;
    if (data.couponCode) {
      msg += `${sep}*Cupom:* ${data.couponCode}`;
    }

    msg += `${block}*${mode === "retirada" ? "Retirada no local" : "Entrega"}*`;
    if (mode === "entrega") {
      msg += `${sep}Bairro: ${bairro}${sep}Rua: ${rua}, ${numero}`;
      if (referencia) msg += `${sep}Referência: ${referencia}`;
    }
    msg += `${block}*Pagamento:* ${paymentLabels[pagamento]}`;
    if (pagamento !== "pix") {
      msg += `${sep}Pago em dinheiro ou cartão no momento da ${mode === "entrega" ? "entrega" : "retirada"}.`;
    }
    if (observacoes) {
      msg += `${block}*Observações:*${sep}${observacoes}`;
    }

    window.open(`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border/50 overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-display text-lg font-semibold text-white">
                  Carrinho
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((i) => (
                      <div
                        key={`${i.productId}-${i.variantLabel ?? ""}`}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-card border border-border/50 p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {i.productName}
                          </p>
                          {i.variantLabel && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {i.variantLabel}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-1">
                            {formatCurrency(i.price * i.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              updateQuantity(i.productId, i.variantLabel, i.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">
                            {i.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(i.productId, i.variantLabel, i.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className={`text-lg font-bold ${hasDiscount ? "text-muted-foreground line-through" : "text-primary"}`}>
                      {formatCurrency(rawTotal)}
                    </span>
                  </div>

                  {hasDiscount && (
                    <div className="flex items-center justify-between -mt-4">
                      <span className="text-sm text-green-400">
                        Desconto ({discountPercent}%)
                      </span>
                      <span className="text-lg font-bold text-green-400">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Tag size={12} />
                      Cupom de desconto
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                        placeholder="Digite o cupom"
                        className="flex-1 rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors uppercase"
                      />
                      <button
                        type="button"
                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponInput(""); } : applyCoupon}
                        className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                          appliedCoupon
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "bg-primary text-primary-foreground hover:brightness-110"
                        }`}
                      >
                        {appliedCoupon ? "Remover" : "Aplicar"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-400 mt-1">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-xs text-green-400 mt-1">
                        Cupom {appliedCoupon.couponCode} aplicado — {discountPercent}% de desconto
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Seu nome
                    </label>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como prefere ser chamado?"
                      className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white mb-3">Opção</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMode("retirada")}
                        className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                          mode === "retirada"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Retirada
                      </button>
                      <button
                        onClick={() => setMode("entrega")}
                        className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                          mode === "entrega"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Entrega
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white mb-3">
                      Forma de pagamento
                    </p>
                    <div className="flex gap-2">
                      {(["pix", "dinheiro", "cartao"] as PaymentMethod[]).map(
                        (metodo) => (
                          <button
                            key={metodo}
                            onClick={() => setPagamento(metodo)}
                            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                              pagamento === metodo
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {paymentLabels[metodo]}
                          </button>
                        ),
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {pagamento === "pix"
                        ? "Pague antecipado via Pix. O pedido só será enviado após a confirmação do pagamento."
                        : mode === "entrega"
                          ? "Pague em dinheiro ou cartão diretamente com o entregador."
                          : "Pague em dinheiro ou cartão no momento da retirada."}
                    </p>
                  </div>

                  {mode === "entrega" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Bairro
                        </label>
                        <input
                          value={bairro}
                          onChange={(e) => setBairro(e.target.value)}
                          placeholder="Centro"
                          className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">
                            Rua
                          </label>
                          <input
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            placeholder="Emilio Mascoli"
                            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">
                            Número
                          </label>
                          <input
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="327"
                            className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Referência{" "}
                          <span className="text-muted-foreground/50">
                            (opcional)
                          </span>
                        </label>
                        <input
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                          placeholder="ao lado do mercado, na esquina da..."
                          className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Observações{" "}
                      <span className="text-muted-foreground/50">
                        (opcional)
                      </span>
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="sem cebola, bem passado..."
                      rows={3}
                      className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                  </div>

                  {sendError && (
                    <p className="text-xs text-red-400 text-center">{sendError}</p>
                  )}

                  <button
                    onClick={handleSend}
                    disabled={!nome.trim() || sending}
                    className="w-full rounded-full bg-primary text-primary-foreground py-4 text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Validando...
                      </>
                    ) : (
                      "Enviar para WhatsApp"
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
