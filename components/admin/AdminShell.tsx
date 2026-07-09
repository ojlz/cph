"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, List, LayoutDashboard, Home, Megaphone, Clock, Settings, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: List },
  { href: "/admin/promocoes", label: "Promocoes", icon: Megaphone },
  { href: "/admin/horarios", label: "Horarios", icon: Clock },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
  { href: "/admin/senha", label: "Senha", icon: Lock },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
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
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between border-b border-border/50 px-4 py-3 bg-card">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-display text-base font-semibold text-white">
              Painel
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Home size={14} />
              Ver site
            </Link>
          </div>
          <div className="flex gap-2">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
