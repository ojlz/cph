"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, List, ArrowRight, Eye, MousePointerClick, TrendingUp, CalendarDays, Megaphone, Clock, Settings, Lock } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics/types";

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/track")
      .then((r) => r.json())
      .then((r: { today: any; history: any }) => {
        setData({ days: r.history });
      });
  }, []);

  const today = data?.days?.find((d) => d.date === new Date().toISOString().split("T")[0]);
  const totalVisits = data?.days?.reduce((s, d) => s + d.visits, 0) || 0;
  const totalEvents = data?.days?.reduce((s, d) => s + Object.values(d.events).reduce((a, b) => a + b, 0), 0) || 0;
  const todayVisits = today?.visits || 0;
  const todayEvents = Object.values(today?.events || {}).reduce((a, b) => a + b, 0);

  const eventBreakdown = data?.days?.flatMap((d) => Object.entries(d.events)).reduce<Record<string, number>>(
    (acc, [key, val]) => {
      acc[key] = (acc[key] || 0) + val;
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do site</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {eventBreakdown && Object.keys(eventBreakdown).length > 0 && (
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="font-display text-base font-semibold text-white mb-4">Eventos</h2>
          <div className="space-y-3">
            {Object.entries(eventBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([key, count]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/:/g, " — ")}
                  </span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {(!eventBreakdown || Object.keys(eventBreakdown).length === 0) && (
        <div className="rounded-2xl bg-card border border-border/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum evento registrado ainda. Navegue pelo site para começar.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/produtos"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Package size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Produtos</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Gerenciar cardapio</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/categorias"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <List size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Categorias</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Ordenar e renomear</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/promocoes"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Megaphone size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Promocoes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Ofertas e cupons</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/horarios"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Horarios</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Dias e horarios</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/configuracoes"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Settings size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Configuracoes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Dados da empresa</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/senha"
          className="rounded-2xl bg-card border border-border/50 p-6 transition-all hover:bg-secondary hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Lock size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Senha</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Alterar acesso</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
}
