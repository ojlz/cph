"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, List, LayoutDashboard, Home, Megaphone, Clock, Settings, Lock, ShoppingBag, MessageSquare, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: List },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/promocoes", label: "Promocoes", icon: Megaphone },
  { href: "/admin/horarios", label: "Horarios", icon: Clock },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
  { href: "/admin/senha", label: "Senha", icon: Lock },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const checkPending = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pedidos");
      if (!res.ok) return;
      const orders = await res.json();
      setPendingCount(orders.filter((o: { status: string }) => o.status === "pendente").length);
    } catch {}
  }, []);

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 30000);
    return () => clearInterval(interval);
  }, [checkPending]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const activeLabel = nav.find(
    (item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)),
  )?.label || "Painel";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border/50 bg-card p-4">
        <div className="mb-6 px-3">
          <Link href="/admin" className="font-display text-lg font-semibold text-white">
            Painel
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Casa do Pastel</p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-6"
        >
          <Home size={18} />
          Ver site
        </Link>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <item.icon size={18} />
                {item.label}
                {item.href === "/admin/pedidos" && pendingCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      {/* Mobile layout */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between border-b border-border/50 px-4 py-3 bg-card sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <span className="font-display text-sm font-semibold text-white truncate mx-2">
            {activeLabel}
          </span>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors shrink-0"
          >
            <Home size={13} />
            Site
          </Link>
        </header>

        {/* Mobile drawer overlay */}
        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className={cn(
            "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border/50 p-4 transition-transform duration-200",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between mb-6 px-3">
            <div>
              <Link href="/admin" className="font-display text-lg font-semibold text-white" onClick={() => setDrawerOpen(false)}>
                Painel
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">Casa do Pastel</p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          </div>

          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-6"
          >
            <Home size={18} />
            Ver site
          </Link>

          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => { setDrawerOpen(false); handleLogout(); }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2 w-full text-left"
          >
            <LogOut size={18} />
            Sair
          </button>
        </aside>

        <main className="flex-1 p-4 md:p-8 w-full md:max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
