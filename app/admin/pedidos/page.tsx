"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Search, Check, X } from "lucide-react";

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then((r) => r.json())
      .then((list: Order[]) => setOrders(list))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: "confirmado" | "cancelado") => {
    await fetch("/api/admin/pedidos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = search
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.nome.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  if (loading) return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Pedidos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de pedidos feitos pelos clientes
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por #ID ou nome..."
          className="w-full rounded-xl bg-card border border-border/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        )}

        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelected(selected?.id === order.id ? null : order)}
            className={`rounded-2xl bg-card border p-4 cursor-pointer transition-all hover:border-primary/30 ${
              selected?.id === order.id ? "border-primary/40" : "border-border/50"
            } ${order.status === "cancelado" ? "opacity-50" : ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm font-semibold text-white">
                    #{order.id}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === "pendente"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : order.status === "confirmado"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-destructive/10 text-destructive"
                  }`}>
                    {order.status === "pendente" ? "Pendente" : order.status === "confirmado" ? "Confirmado" : "Cancelado"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.nome} &middot; {order.items.length} item(ns) &middot; {formatCurrency(order.total)}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {new Date(order.date).toLocaleString("pt-BR")} &middot; {order.mode === "retirada" ? "Retirada" : "Entrega"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {order.status === "pendente" && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatus(order.id, "confirmado"); }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                      title="Confirmar"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatus(order.id, "cancelado"); }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Cancelar"
                    >
                      <X size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {selected?.id === order.id && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Itens</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">
                        {item.quantity}x {item.productName}
                        {item.variantLabel && <span className="text-muted-foreground"> ({item.variantLabel})</span>}
                      </span>
                      <span className="text-primary font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
                </div>

                {order.couponCode && (
                  <p className="text-xs text-muted-foreground">Cupom: {order.couponCode} ({order.discountPercent}% off)</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Opção</span>
                    <p className="text-white capitalize">{order.mode === "retirada" ? "Retirada" : "Entrega"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pagamento</span>
                    <p className="text-white capitalize">{order.pagamento}</p>
                  </div>
                </div>

                {order.endereco && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Endereço</span>
                    <p className="text-white">
                      {order.endereco.rua}, {order.endereco.numero} — {order.endereco.bairro}
                      {order.endereco.referencia && <> ({order.endereco.referencia})</>}
                    </p>
                  </div>
                )}

                {order.observacoes && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Observações</span>
                    <p className="text-white">{order.observacoes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
