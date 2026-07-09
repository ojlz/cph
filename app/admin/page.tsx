"use client";

import { useEffect, useState } from "react";
import { Eye, MousePointerClick, CalendarDays, TrendingUp, ShoppingBag, DollarSign, Award, Star } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics/types";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Check, X, Search } from "lucide-react";

function isToday(date: string) {
  return date.startsWith(new Date().toISOString().split("T")[0]);
}

function isThisWeek(date: string) {
  const now = new Date();
  const d = new Date(date);
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return d >= start;
}

function isThisMonth(date: string) {
  const now = new Date();
  const d = new Date(date);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/track")
      .then((r) => r.json())
      .then((r: { today: any; history: any }) => {
        setData({ days: r.history });
      });
    fetch("/api/admin/pedidos")
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  const today = data?.days?.find((d) => d.date === new Date().toISOString().split("T")[0]);
  const totalVisits = data?.days?.reduce((s, d) => s + d.visits, 0) || 0;
  const totalEvents = data?.days?.reduce((s, d) => s + Object.values(d.events).reduce((a, b) => a + b, 0), 0) || 0;
  const todayVisits = today?.visits || 0;
  const todayEvents = Object.values(today?.events || {}).reduce((a, b) => a + b, 0);

  const confirmed = orders.filter((o) => o.status === "confirmado");
  const ordersToday = orders.filter((o) => isToday(o.date)).length;
  const ordersWeek = orders.filter((o) => isThisWeek(o.date)).length;
  const ordersMonth = orders.filter((o) => isThisMonth(o.date)).length;
  const revenue = confirmed.reduce((s, o) => s + o.total, 0);
  const avgTicket = confirmed.length > 0 ? revenue / confirmed.length : 0;

  const productCount = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((i) => {
    productCount.set(i.productName, (productCount.get(i.productName) || 0) + i.quantity);
  }));
  const topProduct = [...productCount.entries()].sort((a, b) => b[1] - a[1])[0];

  const handleStatus = async (id: string, status: "confirmado" | "cancelado") => {
    await fetch("/api/admin/pedidos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = search
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.nome.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do site</p>
      </div>

      {/* Row 1: Visits + Events */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Eye size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{todayVisits}</p>
              <p className="text-xs text-muted-foreground">Visitas hoje</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{totalVisits}</p>
              <p className="text-xs text-muted-foreground">Total de visitas</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MousePointerClick size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{todayEvents}</p>
              <p className="text-xs text-muted-foreground">Ações hoje</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{totalEvents}</p>
              <p className="text-xs text-muted-foreground">Total de ações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Orders + Revenue */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{ordersToday}</p>
              <p className="text-xs text-muted-foreground">Pedidos hoje</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{ordersWeek}</p>
              <p className="text-xs text-muted-foreground">Pedidos semana</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{ordersMonth}</p>
              <p className="text-xs text-muted-foreground">Pedidos mês</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <DollarSign size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{formatCurrency(revenue)}</p>
              <p className="text-xs text-muted-foreground">Faturamento</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Award size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{formatCurrency(avgTicket)}</p>
              <p className="text-xs text-muted-foreground">Ticket médio</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
              <Star size={18} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white truncate">{topProduct?.[0] || "—"}</p>
              <p className="text-xs text-muted-foreground">{topProduct?.[1] || 0} vendidos · Produto campeão</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-base font-semibold text-white">Pedidos</h2>
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full sm:w-52 rounded-xl bg-card border border-border/50 pl-8 pr-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum pedido ainda</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered.slice(0, 20).map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl bg-card border p-4 transition-all ${
                expanded === order.id ? "border-primary/40" : "border-border/50"
              } ${order.status === "cancelado" ? "opacity-50" : ""}`}
            >
              <div
                className="flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
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
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatus(order.id, "cancelado"); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expanded === order.id && (
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

                  {order.ip && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">IP</span>
                      <p className="text-white font-mono">{order.ip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
