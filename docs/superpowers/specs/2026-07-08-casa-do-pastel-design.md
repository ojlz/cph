# Casa do Pastel da Hora — Design Document

## Overview

Premium website + administrative panel for "Casa do Pastel da Hora", a pastelaria/lanchonete in Porto Fictício/EX. The project is divided into 4 phases.

**Business:** Casa do Pastel da Hora
**Location:** Rua Fictícia, 327 - Centro, Porto Fictício/EX
**Phone:** (00) 90000-0008
**Instagram:** @pasteldahora.site
**Tagline:** Crocancia que conquista. Tradicao que alimenta.

---

## Phase 1 — Public Website (7 pages)

### Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion (Motion for React)
- React Hook Form + Zod
- Zustand (if needed)
- Lucide Icons
- next-themes

### Design System

#### Palette
- Background: `#111111`
- Surface: `#1A1A1A`, `#222222`
- Text primary: `#FFFFFF`
- Text secondary: `#A0A0A0`
- Accent: `#F4B400` (golden yellow)
- Borders: `#2A2A2A`

#### Typography
- Display: Satoshi / Cabinet Grotesk (via next/font, self-hosted)
- Body: Inter Tight (via next/font)
- Scale: headings `text-4xl` to `text-7xl`, body `text-base`

#### Spacing
- Section padding: `py-24` to `py-32`
- Card padding: `p-6` to `p-8`
- Border radius: `rounded-2xl` (16px) cards, `rounded-full` buttons/pills

#### Animations
- Framer Motion entry animations (fade-up, scale)
- Staggered delays per element
- Hover: cards lift -4px, images scale 1.05
- Navbar: shrink + blur on scroll
- Page transitions: fade
- Respect `prefers-reduced-motion`

### Pages

#### Home
- Hero fullscreen with food image background + overlay
  - Staggered animation: image (0s) -> title (0.2s) -> subtitle (0.4s) -> CTA (0.6s)
  - Primary CTA: "Pedir pelo WhatsApp" (yellow pill, rounded-full)
  - Secondary CTA: "Ver Cardapio" (outline)
  - Rating badges: 5 estrelas, cidade, horario, tempo de mercado
- Destaques / Produtos em destaque (grid de cards)
- Breve "Sobre" com CTA
- Footer

#### Cardapio
- Category tabs: Pasteis | Hamburgeres | Pasteis Doces | Bebidas
- Product cards: image, name, short description, price
- Click opens product detail page or modal
- Each product: name, description, price, image, category, ingredients, availability
- JSON-LD structured data per product

#### Promocoes
- Banner section
- Promotion cards: image, title, description, valid through
- Limited-time offers

#### Galeria
- Masonry/grid layout
- Lightbox on click (AnimatePresence)
- Photos of food and physical space

#### Sobre
- Split layout: image + text
- History, values, differentiators
- Team/store atmosphere

#### Contato
- Address (text, no Google Maps)
- Contact cards: WhatsApp, Instagram, Phone
- Opening hours with status indicator
- Contact form (React Hook Form + Zod)

#### Politica de Privacidade
- Standard privacy policy content

### Components Architecture

```
/components
  /ui          — shadcn/ui primitives
  /layout      — Navbar, Footer, SectionWrapper
  /home        — Hero, Destaques, SobrePreview
  /cardapio    — CategoryTabs, ProductCard, ProductDetail
  /promocoes   — PromotionCard, PromotionBanner
  /galeria     — GalleryGrid, Lightbox
  /contato     — ContactInfo, ContactForm, OpeningHours
  /shared      — AnimatedSection, CTAButton, Badge
```

### SEO Strategy
- Dynamic metadata per page
- Open Graph + Twitter Cards
- JSON-LD Schema.org Restaurant
- robots.txt + sitemap.xml
- Alt text on all images
- Friendly URLs (pt-BR)

### Performance Targets
- Lighthouse 100
- Server Components default
- next/image for all images
- Lazy loading below fold
- Code splitting

---

## Phase 2 — Admin Panel + CMS

### Authentication
- Next.js API Routes / Server Actions
- JWT with httpOnly cookies
- bcrypt password hashing
- Login page with same visual identity

### Data Persistence
- JSON files in `/data/` directory
- Service layer: `/lib/services/product.service.ts` etc.
- Never access JSON directly from components

### GitHub CMS
- Module: `/lib/github/`
  - github.client.ts — GitHub REST API client
  - github.commit.ts — commit creation
  - github.upload.ts — file upload (images)
  - github.json.ts — JSON read/write
- On save: update JSON -> commit via API -> wait for Vercel deploy
- Loading states: "Salvando alteracoes..." -> "Publicando..." -> "Site atualizado com sucesso."
- Error handling: user-friendly messages only, no technical errors

### Images
- Upload to `/public/images/{products,gallery,promotions,banner}/`
- Via GitHub API (commit + push)
- Automatic JSON update after upload

### Admin Pages
- Dashboard — analytics overview
- Produtos — CRUD with image upload
- Categorias — CRUD
- Promocoes — CRUD
- Galeria — upload + ordering + delete
- Banner Inicial — edit
- Horarios — edit opening hours
- Empresa — edit business info
- Redes Sociais — edit social links
- Minha Conta — password change

### Panel Design
- Same visual identity as public site
- Dark theme
- Mobile-first admin experience
- Responsive: feels like an app on mobile
- Visual feedback on all actions

---

## Phase 3 — Dashboard + Analytics

### Metrics
- Google Analytics 4 integration
- Vercel Analytics
- Dashboard showing: visitors today/month, WhatsApp clicks, Instagram clicks, Maps clicks, Cardapio clicks
- Most viewed products, most clicked promotions
- Device breakdown: desktop, mobile, tablet
- Traffic sources
- Average time on site

---

## Phase 4 — Documentation

### Deliverables
- Full project README
- Architecture overview
- Component documentation
- Service layer documentation
- GitHub CMS module documentation
- Deployment guide
- Environment variables reference
- Developer onboarding guide

---

## Environment Variables

```
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=
NEXTAUTH_SECRET=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_WHATSAPP=
NEXT_PUBLIC_INSTAGRAM=
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_ADDRESS=
```

## File Structure

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── cardapio/
│   ├── promocoes/
│   ├── galeria/
│   ├── sobre/
│   ├── contato/
│   └── privacidade/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── home/
│   ├── cardapio/
│   ├── promocoes/
│   ├── galeria/
│   ├── contato/
│   └── shared/
├── lib/
│   ├── services/
│   ├── github/
│   └── utils/
├── data/
├── public/
│   └── images/
└── docs/
    └── superpowers/
        └── specs/
```
