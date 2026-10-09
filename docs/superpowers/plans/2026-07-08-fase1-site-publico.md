# Fase 1 — Site Publico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete public-facing website for Casa do Pastel da Hora (7 pages: Home, Cardapio, Promocoes, Galeria, Sobre, Contato, Privacidade) with premium dark theme, smooth animations, and full responsiveness.

**Architecture:** Next.js 15 App Router with Server Components by default, isolated client components for interactivity. Data sourced from JSON files via a service layer. Motion design via Framer Motion. Styling via TailwindCSS + shadcn/ui.

**Tech Stack:** Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Framer Motion (motion/react), React Hook Form + Zod, Lucide Icons, next-themes

## Global Constraints

- All text in pt-BR Portuguese
- Dark theme only (#111111 background, #F4B400 accent, white text)
- No AI-generated copy patterns — write natural, human copy
- Every page must have dynamic metadata + Open Graph
- All images must use next/image with alt text
- All animations must respect prefers-reduced-motion
- Section padding: py-24 to py-32
- Hero top padding max pt-24
- Server Components by default, "use client" only where interactivity is needed
- Mobile: every section must have explicit < 768px fallback layout
- Banned: Fragments shortcut syntax `<></>`, Inter font, generic spinners, emojis in code

---

## File Structure

```
casa-do-pastel/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── cardapio/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── promocoes/
│   │   └── page.tsx
│   ├── galeria/
│   │   └── page.tsx
│   ├── sobre/
│   │   └── page.tsx
│   ├── contato/
│   │   └── page.tsx
│   ├── privacidade/
│   │   └── page.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                    (shadcn/ui)
│   ├── layout/
│   │   ├── Navbar.client.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   ├── home/
│   │   ├── Hero.client.tsx
│   │   └── Destaques.tsx
│   ├── cardapio/
│   │   ├── CategoryTabs.client.tsx
│   │   └── ProductCard.tsx
│   ├── promocoes/
│   │   └── PromotionCard.tsx
│   ├── galeria/
│   │   ├── GalleryGrid.tsx
│   │   └── Lightbox.client.tsx
│   ├── contato/
│   │   ├── ContactInfo.tsx
│   │   ├── ContactForm.client.tsx
│   │   └── OpeningHours.tsx
│   └── shared/
│       ├── ScrollReveal.client.tsx
│       ├── CTAButton.tsx
│       ├── Badge.tsx
│       └── SectionTitle.tsx
├── lib/
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── promotion.service.ts
│   │   ├── gallery.service.ts
│   │   └── settings.service.ts
│   └── utils.ts
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── promotions.json
│   ├── gallery.json
│   ├── settings.json
│   └── opening-hours.json
├── public/
│   └── images/
│       ├── products/
│       ├── gallery/
│       ├── promotions/
│       └── banner/
└── next.config.ts
```

---

### Task 1: Inicializar Projeto + Dependencias

**Files:**
- Create: `package.json` (via npx create-next-app)
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Create Next.js project**

Run:
```bash
cd C:\Users\px\Documents\Projects\Casa do Pastel
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
Choose: No for `src/` directory, Yes for import alias @/*

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion lucide-react next-themes @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-tabs class-variance-authority clsx tailwind-merge zod react-hook-form @hookform/resolvers
```

- [ ] **Step 3: Install shadcn/ui and init**

```bash
npx shadcn@latest init
```
Choose: Default style, Zinc base color, CSS variables for theming.

- [ ] **Step 4: Configure next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

---

### Task 2: Design System + Globals + Fonts

**Files:**
- Modify: `app/globals.css`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx` (shadcn button — customize it)
- Create: `components/ui/badge.tsx` (shadcn badge)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Set globals.css with custom theme**

```css
@import "tailwindcss";

:root {
  --background: #111111;
  --foreground: #ffffff;
  --card: #1a1a1a;
  --card-foreground: #ffffff;
  --popover: #1a1a1a;
  --popover-foreground: #ffffff;
  --primary: #f4b400;
  --primary-foreground: #111111;
  --secondary: #222222;
  --secondary-foreground: #ffffff;
  --muted: #222222;
  --muted-foreground: #a0a0a0;
  --accent: #f4b400;
  --accent-foreground: #111111;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #2a2a2a;
  --input: #2a2a2a;
  --ring: #f4b400;
  --radius: 1rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 0.5rem);
  --radius-md: calc(var(--radius) - 0.25rem);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 0.25rem);
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@utility container {
  margin-inline: auto;
  padding-inline: 1rem;
  @media (width >= 640px) {
    padding-inline: 1.5rem;
  }
  @media (width >= 1024px) {
    padding-inline: 2rem;
  }
  @media (width >= 1280px) {
    padding-inline: 2rem;
  }
}
```

- [ ] **Step 2: Install and configure fonts**

In `app/layout.tsx`, import and configure fonts:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter_Tight } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Casa do Pastel da Hora — O Melhor Pastel de Porto Fictício",
    template: "%s | Casa do Pastel da Hora",
  },
  description:
    "Pastelaria em Porto Fictício/EX. Pasteis crocantes, hamburgueres artesanais e muito mais. Pedido pelo WhatsApp.",
  openGraph: {
    title: "Casa do Pastel da Hora",
    description:
      "O melhor pastel de Porto Fictício. Crocancia que conquista. Tradicao que alimenta.",
    locale: "pt_BR",
    type: "website",
    siteName: "Casa do Pastel da Hora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa do Pastel da Hora",
    description:
      "O melhor pastel de Porto Fictício. Pedido pelo WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} font-body antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
```

- [ ] **Step 4: Add tailwind fonts to tailwind.config.ts**

Read the current `tailwind.config.ts` and add fontFamily:

```ts
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
},
```

---

### Task 3: JSON Data Layer + Services

**Files:**
- Create: `data/products.json`
- Create: `data/categories.json`
- Create: `data/promotions.json`
- Create: `data/gallery.json`
- Create: `data/settings.json`
- Create: `data/opening-hours.json`
- Create: `lib/types.ts`
- Create: `lib/services/product.service.ts`
- Create: `lib/services/category.service.ts`
- Create: `lib/services/promotion.service.ts`
- Create: `lib/services/gallery.service.ts`
- Create: `lib/services/settings.service.ts`

- [ ] **Step 1: Create type definitions**

```ts
// lib/types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  ingredients: string[];
  available: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export interface OpeningHours {
  days: DaySchedule[];
  notes?: string;
}

export interface DaySchedule {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface BusinessSettings {
  name: string;
  description: string;
  shortDescription: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  foundedYear: number;
  rating: number;
}
```

- [ ] **Step 2: Create data JSON files**

```json
// data/settings.json
{
  "name": "Casa do Pastel da Hora",
  "description": "Tradicao em fazer pasteis crocantes e hamburgueres artesanais em Porto Fictício. Nosso compromisso e oferecer comida de qualidade com ingredientes frescos e muito sabor.",
  "shortDescription": "Crocancia que conquista. Tradicao que alimenta.",
  "phone": "(00) 90000-0008",
  "whatsapp": "5500090000008",
  "instagram": "pasteldahora.site",
  "address": "Rua Fictícia, 327 — Centro, Porto Fictício — EX",
  "foundedYear": 2022,
  "rating": 4.9
}
```

```json
// data/categories.json
[
  { "id": "pasteis", "name": "Pasteis", "slug": "pasteis", "order": 1 },
  { "id": "hamburgueres", "name": "Hamburgueres", "slug": "hamburgueres", "order": 2 },
  { "id": "pasteis-doces", "name": "Pasteis Doces", "slug": "pasteis-doces", "order": 3 },
  { "id": "bebidas", "name": "Bebidas", "slug": "bebidas", "order": 4 }
]
```

```json
// data/products.json
[
  {
    "id": "pastel-carne",
    "name": "Pastel de Carne",
    "description": "Pastel crocante recheado com carne moida temperada, ovo cozido e azeitona.",
    "price": 12.90,
    "image": "/images/products/pastel-carne.jpg",
    "categoryId": "pasteis",
    "ingredients": ["Carne moida", "Ovo", "Azeitona", "Massa especial"],
    "available": true,
    "featured": true
  },
  {
    "id": "pastel-frango",
    "name": "Pastel de Frango",
    "description": "Pastel crocante recheado com frango desfiado temperado com catupiry.",
    "price": 13.90,
    "image": "/images/products/pastel-frango.jpg",
    "categoryId": "pasteis",
    "ingredients": ["Frango desfiado", "Catupiry", "Massa especial"],
    "available": true,
    "featured": true
  },
  {
    "id": "pastel-pizza",
    "name": "Pastel Pizza",
    "description": "Pastel recheado com molho de tomate, mussarela, oregano e calabresa.",
    "price": 14.90,
    "image": "/images/products/pastel-pizza.jpg",
    "categoryId": "pasteis",
    "ingredients": ["Mussarela", "Calabresa", "Molho de tomate", "Oregano"],
    "available": true,
    "featured": false
  },
  {
    "id": "hamburguer-artesanal",
    "name": "Hamburguer Artesanal",
    "description": "Hamburguer 180g com queijo cheddar, alface, tomate e molho especial da casa.",
    "price": 22.90,
    "image": "/images/products/hamburguer-artesanal.jpg",
    "categoryId": "hamburgueres",
    "ingredients": ["Hamburguer 180g", "Cheddar", "Alface", "Tomate", "Molho especial"],
    "available": true,
    "featured": true
  },
  {
    "id": "pastel-nutella",
    "name": "Pastel de Nutella",
    "description": "Pastel doce recheado com Nutella e morangos frescos.",
    "price": 18.90,
    "image": "/images/products/pastel-nutella.jpg",
    "categoryId": "pasteis-doces",
    "ingredients": ["Nutella", "Morangos", "Massa especial doce"],
    "available": true,
    "featured": true
  },
  {
    "id": "suco-laranja",
    "name": "Suco de Laranja Natural",
    "description": "Suco de laranja natural fresquinho.",
    "price": 8.90,
    "image": "/images/products/suco-laranja.jpg",
    "categoryId": "bebidas",
    "ingredients": ["Laranja natural"],
    "available": true,
    "featured": false
  },
  {
    "id": "cone-pizza",
    "name": "Cone Pizza",
    "description": "Cone crocante recheado com camadas de mussarela, calabresa e molho especial.",
    "price": 15.90,
    "image": "/images/products/cone-pizza.jpg",
    "categoryId": "pasteis",
    "ingredients": ["Mussarela", "Calabresa", "Molho especial", "Massa de cone"],
    "available": true,
    "featured": true
  }
]
```

```json
// data/promotions.json
[
  {
    "id": "combo-pastel-suco",
    "title": "Combo Pastel + Suco",
    "description": "Qualquer pastel salgado + suco de laranja natural por apenas R$ 18,90.",
    "image": "/images/promotions/combo-pastel-suco.jpg",
    "validUntil": "2026-12-31",
    "active": true
  }
]
```

```json
// data/gallery.json
[
  {
    "id": "gallery-1",
    "src": "/images/gallery/fachada.jpg",
    "alt": "Fachada da Casa do Pastel da Hora",
    "order": 1
  },
  {
    "id": "gallery-2",
    "src": "/images/gallery/interior.jpg",
    "alt": "Area interna aconchegante",
    "order": 2
  }
]
```

```json
// data/opening-hours.json
{
  "days": [
    { "day": "Segunda", "open": "17:00", "close": "23:00", "isOpen": false },
    { "day": "Terca", "open": "17:00", "close": "23:00", "isOpen": true },
    { "day": "Quarta", "open": "17:00", "close": "23:00", "isOpen": true },
    { "day": "Quinta", "open": "17:00", "close": "23:00", "isOpen": true },
    { "day": "Sexta", "open": "17:00", "close": "00:00", "isOpen": true },
    { "day": "Sabado", "open": "16:00", "close": "00:00", "isOpen": true },
    { "day": "Domingo", "open": "16:00", "close": "22:00", "isOpen": true }
  ],
  "notes": "Horarios podem variar em feriados"
}
```

- [ ] **Step 3: Create service layer**

```ts
// lib/services/product.service.ts
import { Product } from "@/lib/types";
import productsData from "@/data/products.json";

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.id === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured && p.available);
}

export function getAvailableProducts(): Product[] {
  return getProducts().filter((p) => p.available);
}
```

```ts
// lib/services/category.service.ts
import { Category } from "@/lib/types";
import categoriesData from "@/data/categories.json";

export function getCategories(): Category[] {
  return (categoriesData as Category[]).sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}
```

```ts
// lib/services/promotion.service.ts
import { Promotion } from "@/lib/types";
import promotionsData from "@/data/promotions.json";

export function getActivePromotions(): Promotion[] {
  return (promotionsData as Promotion[]).filter((p) => p.active);
}
```

```ts
// lib/services/gallery.service.ts
import { GalleryItem } from "@/lib/types";
import galleryData from "@/data/gallery.json";

export function getGalleryItems(): GalleryItem[] {
  return (galleryData as GalleryItem[]).sort((a, b) => a.order - b.order);
}
```

```ts
// lib/services/settings.service.ts
import { BusinessSettings, OpeningHours } from "@/lib/types";
import settingsData from "@/data/settings.json";
import hoursData from "@/data/opening-hours.json";

export function getSettings(): BusinessSettings {
  return settingsData as BusinessSettings;
}

export function getOpeningHours(): OpeningHours {
  return hoursData as OpeningHours;
}

export function isCurrentlyOpen(): boolean {
  const hours = getOpeningHours();
  const now = new Date();
  // Brazilian timezone context
  const dayNames = [
    "Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado",
  ];
  const currentDayName = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const today = hours.days.find((d) => d.day === currentDayName);
  if (!today || !today.isOpen) return false;

  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  // Handle midnight crossovers
  if (closeMinutes <= openMinutes) closeMinutes += 1440;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
```

---

### Task 4: Shared Components

**Files:**
- Create: `components/shared/ScrollReveal.client.tsx`
- Create: `components/shared/CTAButton.tsx`
- Create: `components/shared/Badge.tsx`
- Create: `components/shared/SectionTitle.tsx`

- [ ] **Step 1: Create ScrollReveal (motion wrapper)**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create CTAButton**

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export default function CTAButton({
  href,
  variant = "primary",
  children,
  className,
  external,
  ...props
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 ease-out active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20",
    outline:
      "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
    ghost: "text-muted-foreground hover:text-foreground",
  };

  const classes = cn(base, variants[variant], className);

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Create SectionTitle**

```tsx
import ScrollReveal from "@/components/shared/ScrollReveal";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <ScrollReveal className={`mb-16 text-center ${className || ""}`}>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-[65ch] mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
```

- [ ] **Step 4: Create Badge**

```tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
```

---

### Task 5: Layout Components — Navbar + Footer + Theme

**Files:**
- Create: `components/layout/Navbar.client.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/ThemeProvider.tsx`
- Modify: `app/layout.tsx` (add Navbar and Footer)

- [ ] **Step 1: Create ThemeProvider**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create Navbar.client.tsx**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cardapio", label: "Cardapio" },
  { href: "/promocoes", label: "Promocoes" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

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
            src="/images/logo-horizontal.png"
            alt="Casa do Pastel da Hora"
            width={180}
            height={48}
            className="h-10 w-auto"
            priority
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
            href="https://wa.me/5500090000008"
            target="_blank"
            rel="noopener noreferrer"
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
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[5] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-6"
          >
            <nav className="flex flex-col items-center gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.1 + i * 0.05, duration: 0.4 }}
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
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.35, duration: 0.4 }}
                className="mt-4"
              >
                <Link
                  href="https://wa.me/5500090000008"
                  target="_blank"
                  rel="noopener noreferrer"
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
```

- [ ] **Step 3: Create Footer.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Clock, Phone } from "lucide-react";
import { getSettings, getOpeningHours } from "@/lib/services/settings.service";

export default function Footer() {
  const settings = getSettings();
  const hours = getOpeningHours();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Image
              src="/images/logo-horizontal.png"
              alt="Casa do Pastel da Hora"
              width={180}
              height={48}
              className="h-10 w-auto mb-6"
            />
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {settings.description}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram size={18} />
                <span className="text-sm">@{settings.instagram}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Horarios
            </h3>
            <ul className="space-y-2">
              {hours.days.map((day) => (
                <li key={day.day} className="flex justify-between text-sm">
                  <span className={day.isOpen ? "text-foreground" : "text-muted-foreground"}>
                    {day.day}
                  </span>
                  <span className="text-muted-foreground">
                    {day.isOpen
                      ? `${day.open} — ${day.close}`
                      : "Fechado"}
                  </span>
                </li>
              ))}
            </ul>
            {hours.notes && (
              <p className="text-xs text-muted-foreground mt-3">{hours.notes}</p>
            )}
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/cardapio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cardapio
              </Link>
              <Link href="/promocoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Promocoes
              </Link>
              <Link href="/galeria" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Galeria
              </Link>
              <Link href="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Casa do Pastel da Hora. Todos os direitos reservados.
          </p>
          <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Politica de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update layout.tsx to include Navbar, Footer, ThemeProvider**

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter_Tight } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import Navbar from "@/components/layout/Navbar.client";
import Footer from "@/components/layout/Footer";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Casa do Pastel da Hora — O Melhor Pastel de Porto Fictício",
    template: "%s | Casa do Pastel da Hora",
  },
  description:
    "Pastelaria em Porto Fictício/EX. Pasteis crocantes, hamburgueres artesanais e muito mais. Pedido pelo WhatsApp.",
  openGraph: {
    title: "Casa do Pastel da Hora",
    description:
      "O melhor pastel de Porto Fictício. Crocancia que conquista. Tradicao que alimenta.",
    locale: "pt_BR",
    type: "website",
    siteName: "Casa do Pastel da Hora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa do Pastel da Hora",
    description:
      "O melhor pastel de Porto Fictício. Pedido pelo WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} font-body antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Task 6: Home Page — Hero + Destaques

**Files:**
- Create: `components/home/Hero.client.tsx`
- Create: `components/home/Destaques.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Hero.client.tsx**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Clock, Award } from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

export default function Hero() {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/banner/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 md:pb-24">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-primary text-primary" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {settings.rating} — Porto Fictício/EX
            </span>
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none text-white max-w-3xl"
        >
          O Melhor Pastel
          <br />
          <span className="text-primary">de Porto Fictício</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
        >
          {settings.shortDescription}
        </motion.p>

        <motion.div
          {...fadeUp(0.45)}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <CTAButton
            href={`https://wa.me/${settings.whatsapp}`}
            external
          >
            Pedir pelo WhatsApp
            <ArrowRight size={18} />
          </CTAButton>
          <CTAButton href="/cardapio" variant="outline">
            Ver Cardapio
          </CTAButton>
        </motion.div>

        <motion.div
          {...fadeUp(0.6)}
          className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Porto Fictício/EX
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} /> Terca a Domingo
          </span>
          <span className="flex items-center gap-2">
            <Award size={14} /> Desde {settings.foundedYear}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Destaques.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/services/product.service";
import { formatCurrency } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/shared/SectionTitle";

export default function Destaques() {
  const products = getFeaturedProducts();

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          title="Nossos Destaques"
          subtitle="Os favoritos da casa que todo mundo pede"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <Link
                href={`/cardapio/${product.id}`}
                className="group block rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      Ver mais <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-12">
          <Link
            href="/cardapio"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/5 hover:border-white/40 active:scale-[0.98]"
          >
            Ver Cardapio Completo
            <ArrowRight size={18} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create page.tsx (Home)**

Modify `app/page.tsx`:

```tsx
import Hero from "@/components/home/Hero.client";
import Destaques from "@/components/home/Destaques";
import SobrePreview from "@/components/home/SobrePreview";

export default function Home() {
  return (
    <>
      <Hero />
      <Destaques />
      <SobrePreview />
    </>
  );
}
```

- [ ] **Step 4: Create SobrePreview.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

export default function SobrePreview() {
  return (
    <section className="py-24 md:py-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/interior.jpg"
              alt="Espaco Casa do Pastel da Hora"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter leading-none text-white">
              Nossa Historia
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {settings.description}
            </p>
            <div className="mt-8">
              <CTAButton href="/sobre" variant="outline">
                Conheca Mais
                <ArrowRight size={18} />
              </CTAButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 7: Cardapio Page

**Files:**
- Create: `components/cardapio/CategoryTabs.client.tsx`
- Create: `components/cardapio/ProductCard.tsx`
- Create: `app/cardapio/page.tsx`
- Create: `app/cardapio/[slug]/page.tsx`

- [ ] **Step 1: Create CategoryTabs.client.tsx**

```tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "relative rounded-full px-6 py-3 text-sm font-medium transition-colors",
            active === cat.id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-secondary"
          )}
        >
          {active === cat.id && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ProductCard.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <ScrollReveal delay={index * 0.05}>
      <Link
        href={`/cardapio/${product.id}`}
        className="group block rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <h3 className="font-display text-lg font-semibold text-white">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(product.price)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
              Detalhes <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
```

- [ ] **Step 3: Create app/cardapio/page.tsx**

```tsx
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug } from "@/lib/services/category.service";
import { getProductsByCategory, getAvailableProducts } from "@/lib/services/product.service";
import CategoryTabs from "@/components/cardapio/CategoryTabs.client";
import ProductCard from "@/components/cardapio/ProductCard";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Cardapio",
  description:
    "Confira o cardapio da Casa do Pastel da Hora em Porto Fictício/EX. Pasteis, hamburgueres, pasteis doces e bebidas.",
  openGraph: {
    title: "Cardapio | Casa do Pastel da Hora",
    description:
      "Confira o cardapio da Casa do Pastel da Hora. Pasteis, hamburgueres e muito mais.",
  },
};

export default function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  // Will be resolved via searchParams — this is a pattern
  // For now render client-side or use a simpler approach
}
```

Since searchParams is async in Next.js 15, we need to handle this. Let me write it properly:

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getCategoryBySlug } from "@/lib/services/category.service";
import { getProductsByCategory, getAvailableProducts } from "@/lib/services/product.service";
import { Product } from "@/lib/types";
import CategoryTabs from "@/components/cardapio/CategoryTabs.client";
import ProductCard from "@/components/cardapio/ProductCard";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Cardapio",
  description:
    "Confira o cardapio da Casa do Pastel da Hora em Porto Fictício/EX. Pasteis, hamburgueres, pasteis doces e bebidas.",
};

const categories = getCategories();
const defaultCategory = categories[0]?.id || "pasteis";

async function ProductGrid({ categoryId }: { categoryId: string }) {
  const products = categoryId
    ? getProductsByCategory(categoryId)
    : getAvailableProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.categoria || defaultCategory;

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          title="Nosso Cardapio"
          subtitle="Tudo feito com ingredientes frescos e muito carinho"
        />

        <div className="mb-10">
          <CategoryTabs
            categories={categories}
            active={activeCategory}
          />
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-card border border-border/50 animate-pulse p-6"
                >
                  <div className="aspect-[4/3] bg-secondary rounded-xl mb-4" />
                  <div className="h-5 bg-secondary rounded w-3/4 mb-3" />
                  <div className="h-4 bg-secondary rounded w-full mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/3" />
                </div>
              ))}
            </div>
          }
        >
          <ProductGrid categoryId={activeCategory} />
        </Suspense>
      </div>
    </section>
  );
}
```

Wait, the CategoryTabs is a client component but the page is a server component. The `active` prop needs to be passed from server. That's fine. But the CategoryTabs onChange handler needs to navigate — I should update it to use router with search params.

Let me adjust CategoryTabs to be self-contained with navigation:

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function CategoryTabs({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria") || categories[0]?.id;

  const handleChange = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categoria", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleChange(cat.id)}
          className={cn(
            "relative rounded-full px-6 py-3 text-sm font-medium transition-colors",
            active === cat.id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-secondary"
          )}
        >
          {active === cat.id && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
```

And the server component becomes simpler — it just renders the tabs directly, no need to pass active as prop.

- [ ] **Step 4: Create app/cardapio/[slug]/page.tsx**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/services/product.service";
import { formatCurrency } from "@/lib/utils";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Casa do Pastel da Hora`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/cardapio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Voltar ao Cardapio
        </Link>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tighter leading-none text-white">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>

            {product.ingredients.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold mb-3 text-white">
                  Ingredientes
                </h2>
                <ul className="space-y-2">
                  {product.ingredients.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <Check size={12} className="text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <CTAButton
                href={`https://wa.me/${settings.whatsapp}?text=Olá! Gostaria de pedir o ${product.name}.`}
                external
              >
                Pedir pelo WhatsApp
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 8: Promocoes Page

**Files:**
- Create: `components/promocoes/PromotionCard.tsx`
- Create: `app/promocoes/page.tsx`

- [ ] **Step 1: Create PromotionCard.tsx**

```tsx
import Image from "next/image";
import { Clock } from "lucide-react";
import { Promotion } from "@/lib/types";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface PromotionCardProps {
  promotion: Promotion;
  index: number;
}

export default function PromotionCard({ promotion, index }: PromotionCardProps) {
  const validDate = new Date(promotion.validUntil).toLocaleDateString("pt-BR");

  return (
    <ScrollReveal delay={index * 0.1}>
      <article className="group rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={promotion.image}
            alt={promotion.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-6 md:p-8">
          <h3 className="font-display text-xl font-semibold text-white">
            {promotion.title}
          </h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {promotion.description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>Valido ate {validDate}</span>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
```

- [ ] **Step 2: Create app/promocoes/page.tsx**

```tsx
import type { Metadata } from "next";
import { getActivePromotions } from "@/lib/services/promotion.service";
import PromotionCard from "@/components/promocoes/PromotionCard";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Promocoes",
  description:
    "Confira as promocoes imperdiveis da Casa do Pastel da Hora em Porto Fictício/EX. Ofertas por tempo limitado.",
  openGraph: {
    title: "Promocoes | Casa do Pastel da Hora",
    description:
      "Promocoes imperdiveis da Casa do Pastel da Hora.",
  },
};

export default function PromocoesPage() {
  const promotions = getActivePromotions();

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          title="Promocoes"
          subtitle="Ofertas especiais por tempo limitado"
        />

        {promotions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhuma promocao no momento. Fique de olho!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {promotions.map((promo, i) => (
              <PromotionCard key={promo.id} promotion={promo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

---

### Task 9: Galeria Page

**Files:**
- Create: `components/galeria/GalleryGrid.tsx`
- Create: `components/galeria/Lightbox.client.tsx`
- Create: `app/galeria/page.tsx`

- [ ] **Step 1: Create GalleryGrid.tsx**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/lib/types";
import Lightbox from "@/components/galeria/Lightbox.client";
import { motion } from "motion/react";

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => setSelectedIndex(i)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
          </motion.button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          items={items}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Create Lightbox.client.tsx**

```tsx
"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface LightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  items,
  initialIndex,
  onClose,
}: LightboxProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const [index, setIndex] = useState(initialIndex);
  // Actually, let me use useCallback and useState properly
  
  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);
  
  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);
  
  // Wait — I can't use hooks after early return. Let me restructure.
}
```

Let me restructure Lightbox properly:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface LightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  items,
  initialIndex,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const reduce = useReducedMotion();

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, goNext, goPrev]);

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Fechar"
      >
        <X size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Proximo"
      >
        <ChevronRight size={22} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl aspect-[4/3] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={items[index].src}
            alt={items[index].alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 text-sm text-muted-foreground">
        {index + 1} / {items.length}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create app/galeria/page.tsx**

```tsx
import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/services/gallery.service";
import GalleryGrid from "@/components/galeria/GalleryGrid";
import SectionTitle from "@/components/shared/SectionTitle";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Veja as fotos da Casa do Pastel da Hora em Porto Fictício/EX. Conheca nosso espaco e nossos produtos.",
};

export default function GaleriaPage() {
  const items = getGalleryItems();

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          title="Galeria"
          subtitle="Conheca nosso espaco e nossos produtos"
        />

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Em breve fotos do nosso espaco!
            </p>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
      </div>
    </section>
  );
}
```

Wait, `GalleryGrid` is a client component (uses useState for lightbox) — I should add "use client" to it. Let me fix that.

---

### Task 10: Sobre Page

**Files:**
- Create: `app/sobre/page.tsx`

- [ ] **Step 1: Create app/sobre/page.tsx**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { Award, Heart, Shield } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheca a historia da Casa do Pastel da Hora em Porto Fictício/EX. Tradicao em fazer pasteis crocantes e hamburgueres artesanais.",
};

const values = [
  {
    icon: Award,
    title: "Qualidade",
    desc: "Ingredientes frescos selecionados todos os dias.",
  },
  {
    icon: Heart,
    title: "Paixao",
    desc: "Amor pelo que fazemos desde 2022.",
  },
  {
    icon: Shield,
    title: "Confianca",
    desc: "Atendimento que faz voce voltar sempre.",
  },
];

export default function SobrePage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-5xl px-4">
        <ScrollReveal className="text-center mb-20">
          <h1 className="font-display text-5xl md:text-7xl tracking-tighter leading-none text-white">
            Nossa Historia
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {settings.description}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20">
          <ScrollReveal className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 md:order-1">
            <Image
              src="/images/gallery/interior.jpg"
              alt="Interior da Casa do Pastel da Hora"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="order-1 md:order-2">
            <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-white">
              Nascida em Porto Fictício
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Desde {settings.foundedYear}, a Casa do Pastel da Hora vem conquistando
              coracoes com pasteis crocantes e hamburgueres artesanais. Nosso
              segredo e simples: ingredientes de qualidade, receitas feitas na
              hora e muito carinho em cada prato.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Localizada na Rua Fictícia, 327 — Centro, somos ponto de
              encontro de quem valoriza uma comida bem feita em Porto Fictício.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 0.1}>
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

        <ScrollReveal className="text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-white mb-4">
            Quer fazer seu pedido?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Entre em contato pelo WhatsApp e peca ja o seu!
          </p>
          <CTAButton
            href={`https://wa.me/${settings.whatsapp}`}
            external
          >
            Pedir pelo WhatsApp
          </CTAButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

---

### Task 11: Contato Page

**Files:**
- Create: `components/contato/ContactInfo.tsx`
- Create: `components/contato/ContactForm.client.tsx`
- Create: `components/contato/OpeningHours.tsx`
- Create: `app/contato/page.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create ContactInfo.tsx**

```tsx
import { MapPin, Phone, Instagram, MessageCircle } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: settings.phone,
    href: `https://wa.me/${settings.whatsapp}`,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: `@${settings.instagram}`,
    href: `https://instagram.com/${settings.instagram}`,
  },
  {
    icon: Phone,
    label: "Telefone",
    value: settings.phone,
    href: `tel:${settings.phone}`,
  },
  {
    icon: MapPin,
    label: "Endereco",
    value: settings.address,
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      {contactItems.map((item, i) => (
        <ScrollReveal key={item.label} delay={i * 0.05}>
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-5 transition-all duration-300 hover:bg-secondary hover:border-border group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create OpeningHours.tsx**

```tsx
import { Clock } from "lucide-react";
import { getOpeningHours, isCurrentlyOpen } from "@/lib/services/settings.service";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function OpeningHours() {
  const hours = getOpeningHours();
  const open = isCurrentlyOpen();

  return (
    <ScrollReveal className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          Horarios
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            open
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              open ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {open ? "Aberto agora" : "Fechado"}
        </span>
      </div>

      <ul className="space-y-3">
        {hours.days.map((day) => (
          <li key={day.day} className="flex justify-between items-center">
            <span
              className={`text-sm ${
                day.isOpen ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {day.day}
            </span>
            <span className="text-sm text-muted-foreground">
              {day.isOpen ? `${day.open} — ${day.close}` : "Fechado"}
            </span>
          </li>
        ))}
      </ul>

      {hours.notes && (
        <p className="mt-4 text-xs text-muted-foreground">{hours.notes}</p>
      )}
    </ScrollReveal>
  );
}
```

- [ ] **Step 3: Create ContactForm.client.tsx**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email invalido").optional().or(z.literal("")),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate send — in Phase 1 it's a static site
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
        <CheckCircle size={40} className="text-primary mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          Mensagem enviada!
        </h3>
        <p className="text-muted-foreground">
          Obrigado pelo contato. Responderemos em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-5"
    >
      <h3 className="font-display text-lg font-semibold text-white">
        Envie sua mensagem
      </h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Nome
        </label>
        <input
          id="name"
          {...register("name")}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
            errors.name && "ring-2 ring-destructive"
          )}
          placeholder="Seu nome"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
            errors.email && "ring-2 ring-destructive"
          )}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Mensagem
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none",
            errors.message && "ring-2 ring-destructive"
          )}
          placeholder="Sua mensagem..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            Enviar Mensagem
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create app/contato/page.tsx**

```tsx
import type { Metadata } from "next";
import ContactInfo from "@/components/contato/ContactInfo";
import ContactForm from "@/components/contato/ContactForm.client";
import OpeningHours from "@/components/contato/OpeningHours";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Casa do Pastel da Hora em Porto Fictício/EX. Pedidos pelo WhatsApp, Instagram e telefone.",
};

export default function ContatoPage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          title="Contato"
          subtitle="Estamos prontos para atender voce"
        />

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-3 space-y-6">
            <ContactInfo />
            <OpeningHours />
          </div>
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 12: Privacidade Page

**Files:**
- Create: `app/privacidade/page.tsx`

- [ ] **Step 1: Create app/privacidade/page.tsx**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade",
  description:
    "Politica de privacidade da Casa do Pastel da Hora em Porto Fictício/EX.",
};

export default function PrivacidadePage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-display text-4xl md:text-5xl tracking-tighter leading-none text-white mb-8">
          Politica de Privacidade
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>
            A Casa do Pastel da Hora, localizada em Porto Fictício/EX, valoriza
            a privacidade dos seus clientes. Esta politica descreve como
            coletamos, usamos e protegemos suas informacoes.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Informacoes que coletamos
          </h2>
          <p>
            Coletamos informacoes fornecidas voluntariamente por voce ao
            preencher formularios de contato, como nome, email e mensagem.
            Nao coletamos informacoes sensiveis ou dados bancarios.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Uso das informacoes
          </h2>
          <p>
            As informacoes coletadas sao usadas exclusivamente para responder
            a suas duvidas e contato. Nao compartilhamos seus dados com
            terceiros sem seu consentimento explicito.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Cookies
          </h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site.
            Nao utilizamos cookies de rastreamento ou publicidade sem
            seu consentimento.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Contato
          </h2>
          <p>
            Para duvidas sobre esta politica, entre em contato pelo
            WhatsApp (00) 90000-0008.
          </p>

          <p className="text-sm mt-8">
            Ultima atualizacao: Julho de 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 13: SEO + Performance + NotFound + Sitemap

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/not-found.tsx`
- Create: `app/manifest.ts`

- [ ] **Step 1: Create sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/services/product.service";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://casadopasteldahora.com.br";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/cardapio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/promocoes`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/galeria`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/privacidade`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const productPages = getProducts().map((product) => ({
    url: `${baseUrl}/cardapio/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
```

- [ ] **Step 2: Create robots.ts**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://casadopasteldahora.com.br/sitemap.xml",
  };
}
```

- [ ] **Step 3: Create not-found.tsx**

```tsx
import Link from "next/link";
import CTAButton from "@/components/shared/CTAButton";

export default function NotFound() {
  return (
    <section className="min-h-[100dvh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl font-display font-bold text-primary mb-4">404</p>
        <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-white mb-4">
          Pagina nao encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          A pagina que voce procurou nao existe ou foi movida.
        </p>
        <CTAButton href="/">Voltar ao Inicio</CTAButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add JSON-LD structured data to layout.tsx**

Add a JSON-LD script to the layout:

```tsx
// Inside RootLayout, after the body tag but before {children}
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: settings.name,
  image: "https://casadopasteldahora.com.br/images/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Fictícia, 327",
    addressLocality: "Porto Fictício",
    addressRegion: "MS",
    addressCountry: "BR",
  },
  telephone: settings.phone,
  servesCuisine: ["Pastel", "Hamburguer", "Food"],
  priceRange: "$$",
  url: "https://casadopasteldahora.com.br",
};

// Add to the body:
{/* <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/> */}
```

---

### Task 14: Copy Assets + Final Integration

**Files:**
- Copy: logo files to `public/images/`
- Copy: product photos to `public/images/products/`
- Copy: gallery photos to `public/images/gallery/`

- [ ] **Step 1: Create image directory structure**

```bash
mkdir -p "public/images/products" "public/images/gallery" "public/images/promotions" "public/images/banner"
```

- [ ] **Step 2: Copy logo files**

```bash
copy "..\..\horizontal navbar e hero.png" "public\images\logo-horizontal.png"
copy "..\..\favicon e mobile.png" "public\images\logo-icon.png"
```

- [ ] **Step 3: Copy product images**

For each product, copy the relevant image from the parent folder:
```bash
copy "..\..\Surpreenda seu paladar*.jpg" "public\images\products\cone-pizza.jpg"
copy "..\..\Pastel suuuuper crocante*.jpg" "public\images\products\pastel-carne.jpg"
copy "..\..\Pastel quentinho + suco*.jpg" "public\images\products\pastel-suco.jpg"
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: No TypeScript errors, build completes successfully.

---

## Self-Review Checklist

After writing the plan, verify:
- [ ] Every spec requirement maps to at least one task
- [ ] No placeholders (TBD, TODO, etc.)
- [ ] Type consistency across tasks
- [ ] All file paths are exact
- [ ] All component names match across imports
- [ ] All service functions are defined before they're used
