"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

const links = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Casa do Pastel da Hora"
            width={216}
            height={58}
            className="h-12 w-auto"
            priority
            loading="eager"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
            <Link
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-track-label="navbar"
              className="ml-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              Pedir pelo WhatsApp
            </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="relative z-10 flex md:hidden items-center justify-center w-10 h-10 text-foreground"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[5] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-6"
          >
            <nav className="flex flex-col items-center gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-center text-2xl font-medium text-foreground transition-colors hover:text-primary py-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-4"
              >
                <Link
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp"
                  data-track-label="navbar-mobile"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:brightness-110"
                >
                  Pedir pelo WhatsApp
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
