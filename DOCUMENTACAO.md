# Casa do Pastel da Hora — Documentação Técnica Completa

> Site de pastelaria com cardápio online, carrinho de compras, pedidos via WhatsApp e painel administrativo completo.
> Next.js 16 + React 19 + TypeScript + Tailwind CSS v4

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Tecnologias](#2-tecnologias)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Autenticação e Segurança](#4-autenticação-e-segurança)
5. [Sistema de Dados](#5-sistema-de-dados)
6. [Cardápio e Produtos](#6-cardápio-e-produtos)
7. [Carrinho e Pedidos](#7-carrinho-e-pedidos)
8. [Promoções e Cupons](#8-promoções-e-cupons)
9. [Analytics](#9-analytics)
10. [Painel Administrativo](#10-painel-administrativo)
11. [Fluxo de Pedido (WhatsApp)](#11-fluxo-de-pedido-whatsapp)
12. [Como Customizar para Outra Loja](#12-como-customizar-para-outra-loja)
13. [Implantação (Deploy)](#13-implantação-deploy)
14. [Variáveis de Ambiente](#14-variáveis-de-ambiente)
15. [Segurança Implementada](#15-segurança-implementada)

---

## 1. Visão Geral

Sistema completo para uma pastelaria (ou qualquer estabelecimento de comida) com:

- **Site público**: home com destaques, cardápio completo com categorias, contato com formulário, horários de funcionamento, galeria
- **Carrinho de compras**: adicionar/remover itens, variantes (tamanhos), cupom de desconto, escolha retirada ou entrega
- **Pedido via WhatsApp**: formulário de pedido → servidor valida preços → mensagem formatada no WhatsApp → pedido salvo no banco
- **Painel administrativo**: gerenciar produtos, categorias, promoções, horários, configurações, pedidos recebidos, senha
- **Analytics**: monitoramento de visitas, cliques em WhatsApp/Instagram/telefone, uso de cupons
- **Modo dual**: funciona com arquivos locais (desenvolvimento) ou GitHub API (produção)

---

## 2. Tecnologias

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Next.js | 16.2.10 | Framework React (App Router) |
| React | 19.2.4 | Biblioteca UI |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização utilitária |
| Framer Motion | 12.42.2 | Animações |
| bcryptjs | 3.0.3 | Hash de senha (produção) |
| jose | 6.2.3 | JWT (autenticação admin) |
| Zod | 4.4.3 | Validação de formulários |
| react-hook-form | 7.81.0 | Gerenciamento de formulários |
| Lucide React | 1.23.0 | Ícones |
| Vercel Analytics | 2.0.1 | Analytics opcional |
| Radix UI | — | Componentes acessíveis (dialog, select, tabs) |

### Diferenciais desta stack

- **Next.js 16 App Router**: rotas aninhadas, loading states, server components, API routes
- **Tailwind v4**: CSS-first config (sem `tailwind.config.js`), `@theme` directive
- **Framer Motion v12**: importado como `motion/react` (novo path)
- **Zod v4**: nova API com `z.object({...})`, parse seguro

---

## 3. Estrutura do Projeto

```
┌── app/                          # Next.js App Router
│   ├── (public)/                 # Rotas públicas (layout com Navbar + Footer)
│   │   ├── page.tsx              # Home (Hero + Destaques)
│   │   ├── cardapio/page.tsx     # Cardápio completo
│   │   ├── contato/page.tsx      # Contato (formulário salva mensagens)
│   │   ├── sobre/page.tsx        # Sobre (redireciona pra home)
│   │   ├── privacidade/page.tsx  # Política de privacidade
│   │   ├── layout.tsx            # Layout público (Navbar + Footer + CartWrapper)
│   │   └── not-found.tsx         # Página 404
│   ├── admin/                    # Rotas administrativas (protegidas por middleware)
│   │   ├── page.tsx              # Dashboard (analytics + pedidos)
│   │   ├── layout.tsx            # Layout admin (AdminShell)
│   │   ├── login/page.tsx        # Login
│   │   ├── produtos/             # CRUD produtos
│   │   ├── categorias/           # Gerenciar categorias
│   │   ├── promocoes/            # CRUD promoções
│   │   ├── mensagens/            # Mensagens do formulário de contato
│   │   ├── horarios/             # Editar horários
│   │   ├── configuracoes/        # Configurações da empresa
│   │   ├── pedidos/              # Lista de pedidos
│   │   └── senha/                # Alterar senha
│   ├── api/                      # API routes
│   │   ├── admin/                # CRUDs administrativos (com auth)
│   │   ├── auth/                 # Login, check, alterar senha
│   │   ├── contato/              # Envio de mensagens (público, rate-limited)
│   │   ├── track/product-view    # Visualizações de produtos
│   │   ├── order/validate        # Validar carrinho + salvar pedido
│   │   └── track/                # Analytics
│   ├── layout.tsx                # Root layout (fontes, tema, analytics)
│   ├── globals.css               # Estilos globais + variáveis CSS
│   ├── robots.ts                 # SEO
│   └── sitemap.ts                # SEO
│
├── components/
│   ├── admin/                    # AdminShell, ProductForm, PromotionForm
│   ├── cardapio/                 # ProductCard, CategoryTabs, CategoryBanner
│   ├── cart/                     # CartDrawer, CartButton, CartWrapper
│   ├── contato/                  # ContactForm, ContactInfo, OpeningHours
│   ├── galeria/                  # GalleryGrid, Lightbox
│   ├── home/                     # Hero, Destaques, SobrePreview
│   ├── layout/                   # Navbar, Footer, AnalyticsProvider, ThemeProvider
│   └── shared/                   # ScrollReveal, SectionTitle, Badge, CTAButton
│
├── lib/
│   ├── types.ts                  # Todas as interfaces TypeScript
│   ├── utils.ts                  # cn() + formatCurrency()
│   ├── auth.ts                   # JWT + cookies admin
│   ├── cart-context.tsx          # Context do carrinho
│   ├── admin-storage.ts          # Camada de dados (local fs | GitHub API)
│   ├── analytics/                # Tracking de eventos
│   ├── github/                   # Cliente GitHub API
│   └── services/                 # Serviços de leitura de dados
│
├── data/                         # Banco de dados JSON
│   ├── products.json             # Produtos
│   ├── categories.json           # Categorias
│   ├── promotions.json           # Promoções
│   ├── orders/                    # Pedidos (um arquivo por mês)
│   ├── settings.json             # Configurações
│   ├── opening-hours.json        # Horários
│   ├── gallery.json              # Galeria
│   ├── messages.json             # Mensagens do formulário de contato
│   ├── product-views.json        # Visualizações de produtos
│   └── analytics.json            # Analytics
│
├── public/images/                # Imagens
│
├── middleware.ts                 # Proteção das rotas /admin
├── next.config.ts                # Config Next.js + headers de segurança
└── .env.example                  # Variáveis de ambiente
```

### Convenções de código

- **Componentes**: PascalCase. Sufixo `.client.tsx` para client components (`"use client"`)
- **Funções/valores**: camelCase
- **Tipos/Interfaces**: PascalCase em `lib/types.ts`
- **Pastas**: kebab-case para rotas, camelCase para componentes
- **Tema**: dark mode fixo, bg `#111111`, accent `#F4B400`, cards `#1A1A1A`
- **CSS**: Tailwind v4 com CSS variables (`bg-background`, `text-primary`, etc.)

---

## 4. Autenticação e Segurança

### Admin Login

1. Usuário acessa `/admin/login` e digita a senha
2. `POST /api/auth/login` compara a senha:
   - **Modo local** (`LOCAL=true`): comparação direta de strings
   - **Modo produção**: bcrypt.compare (senha no .env é o hash)
3. Se correta: cria JWT com `jose` (HS256, 7 dias de validade)
4. Cookie `admin_session`: httpOnly, sameSite strict, secure em produção, priority high

### Logout

`POST /api/auth/logout` limpa a sessão (deleta o cookie). Botão "Sair" disponível na sidebar do admin (desktop) e no drawer (mobile).

### Middleware de Proteção

`middleware.ts` intercepta TODAS as rotas `/admin/*` (exceto `/admin/login`):
- Verifica se o cookie `admin_session` existe e é um JWT válido
- Se inválido ou ausente: redireciona para `/admin/login`
- Cada API route também chama `getSession()` como dupla verificação

### Proteção CSRF

- **Origin check no middleware**: requisições POST/PUT/DELETE para `/admin/*` verificam o header `Origin` (ou `Referer`) contra o host da aplicação. Bloqueia requests de origens externas.
- **SameSite Strict**: o cookie JWT não é enviado em requisições cross-site.
- **Cookie httpOnly**: token inacessível via JavaScript.

### Rate Limiting Global (lib/rate-limit.ts)

Todas as APIs públicas usam um rate limiter centralizado em memória:

| Rota | Limite | Janela | Motivo |
|------|--------|--------|--------|
| `POST /api/auth/login` | 5 | 15 min | Força bruta de senha |
| `POST /api/contato` | 5 | 15 min | Spam no formulário |
| `POST /api/order/validate` | 3 | 15 min | Criação de pedidos falsos |
| `POST /api/track` | 200 | 15 min | Inflar analytics |
| `POST /api/track/product-view` | 100 | 15 min | Visualizações de produtos |

Após exceder o limite, o IP é bloqueado temporariamente (status 429). O bloqueio é automático e reversível após o tempo da janela.

### Limite de Payload

APIs públicas rejeitam requisições com corpo muito grande antes de qualquer processamento:

| Rota | Limite |
|------|--------|
| `POST /api/order/validate` | 100 KB |
| `POST /api/contato` | 10 KB |
| `PUT /api/auth/password` | 1 KB |

---

## 5. Sistema de Dados

### Modo Dual (Local / GitHub)

O sistema funciona com arquivos JSON na pasta `data/`. O modo é controlado pela variável `LOCAL`:

| Modo | LOCAL | Funcionamento |
|------|-------|---------------|
| Desenvolvimento | `true` | Lê/escreve direto no sistema de arquivos (`fs/promises`) |
| Produção | não definido | Usa GitHub API (Contents API) para ler/commitar arquivos |

A camada de abstração está em `lib/admin-storage.ts`. Cada tipo de dado tem funções `get` e `save`:

```
getAdminProducts() / saveAdminProducts()
getAdminCategories() / saveAdminCategories()
getAdminPromotions() / saveAdminPromotions()
getAdminSettings() / saveAdminSettings()
getAdminHours() / saveAdminHours()
getAdminOrders() / saveAdminOrders()
getAdminMessages() / saveAdminMessages()
```

### Arquivos de Dados

| Arquivo | Tipo | Gerenciado por | Descrição |
|---------|------|----------------|-----------|
| `products.json` | `Product[]` | Admin (Produtos) | Cardápio completo |
| `categories.json` | `Category[]` | Admin (Categorias) | Agrupamento de produtos |
| `promotions.json` | `Promotion[]` | Admin (Promoções) | Descontos diretos e cupons |
| `orders/YYYY-MM.json` | `Order[]` | Sistema (automático) | Pedidos dos clientes (um arquivo por mês) |
| `messages.json` | `ContactMessage[]` | Cliente (automático) | Mensagens do formulário de contato |
| `settings.json` | `BusinessSettings` | Admin (Configurações) | Dados da empresa |
| `opening-hours.json` | `OpeningHours` | Admin (Horários) | Dias e horários |
| `gallery.json` | `GalleryItem[]` | Manual | Imagens da galeria |
| `analytics.json` | `AnalyticsData` | Sistema (automático) | Visitas e eventos |

### Serviços Estáticos (lib/services/)

Além dos dados dinâmicos do admin, existem serviços que leem os JSONs diretamente para uso nas páginas públicas:

- `product.service.ts` — filtrar por categoria, destaque, disponibilidade
- `category.service.ts` — listar ordenado, buscar por slug
- `settings.service.ts` — configurações + função `isCurrentlyOpen()` (calcula se está aberto agora com base nos horários)
- `gallery.service.ts` — listar imagens ordenadas
- `promotion.service.ts` — listar promoções ativas

---

## 6. Cardápio e Produtos

### Estrutura do Produto

```typescript
interface Product {
  id: string;           // slug: "hamburguer-artesanal"
  name: string;         // "Hambúrguer Artesanal"
  description: string;
  price: number;        // Preço base
  variants?: [{         // Variações de tamanho
    label: string;      // "Normal", "Pastelão"
    price: number;
  }];
  image?: string;       // "/images/products/..."
  categoryId: string;   // "hamburgueres"
  group?: string;       // "tradicionais", "combinados", "especiais"
  available: boolean;
  featured: boolean;    // Aparece nos destaques da home
}
```

### Se um produto tem variants, o preço base é ignorado — cada variante tem seu próprio preço.

### Cardápio (/cardapio)

- Aba superior com categorias (usando `?categoria=` na URL)
- Produtos agrupados por `group` dentro de cada categoria
- Cada produto tem botão de adicionar ao carrinho
- Se tem variantes, mostra cada uma com preço + botão próprio
- Se tem promoção ativa, mostra preço antigo riscado + novo em verde

### Destaques (Home)

- Mostra produtos com `featured: true`
- Mesma lógica de promoções do cardápio
- Botões de adicionar ao carrinho

---

## 7. Carrinho e Pedidos

### Contexto do Carrinho (`lib/cart-context.tsx`)

Estado global via React Context com:

```typescript
interface CartContextType {
  items: CartItem[];                              // Itens no carrinho
  addItem(product, variant?, overridePrice?): void; // Adicionar (com ou sem variação)
  updateQuantity(productId, variantLabel, qty): void; // Atualizar qtd
  clearCart(): void;                               // Limpar
  totalItems: number;                              // Qtd total de itens
  totalPrice: number;                              // Preço total
}
```

**Preço no carrinho**: quando um produto tem promoção ativa, o preço promocional é passado via `overridePrice`. Se o usuário incrementar um item existente, o preço é atualizado junto com a quantidade.

### Componentes do Carrinho

| Componente | Função |
|-----------|--------|
| `CartProviderGlobal` | Envolve a aplicação com o contexto do carrinho |
| `CartWrapper` | Componente que renderiza botão + drawer (usado no layout público) |
| `CartButton` | Botão flutuante (FAB) no canto inferior direito com contador |
| `CartDrawer` | Gaveta lateral com lista de itens, cupom, formulário de pedido |

---

## 8. Promoções e Cupons

### Tipos de Promoção

| Tipo | Descrição | Como funciona |
|------|-----------|---------------|
| **Direta** | Desconto no preço de um produto específico | Produto aparece com preço antigo riscado + novo preço em vermelho |
| **Cupom** | Código de desconto percentual | Cliente digita o código no carrinho, ganha X% de desconto |

### Como as Promoções Aparecem

- **ProductCard** (cardápio): busca promoções ativas na API, se encontrar uma direta para o produto, mostra preço promocional
- **Destaques** (home): mesma lógica — busca promoções e aplica
- **CartDrawer**: campo de cupom valida contra promoções do tipo "coupon"
- **Pedido**: servidor valida preços e cupons novamente antes de gerar o pedido

### Ciclo de Vida

- Promoções têm data de validade (`validUntil`)
- Funcionam o dia inteiro da validade (comparação `>=` com string ISO)
- Quando expiram: badge "Expirada" no admin, toggle desliga automaticamente
- Se o admin religar manualmente: a data é removida, promoção vira permanente

---

## 9. Analytics

### Sistema de Tracking

Três camadas de analytics:

1. **Vercel Analytics** (`@vercel/analytics`): page views automáticos
2. **Google Analytics 4** (opcional): via `NEXT_PUBLIC_GA_ID`
3. **Sistema próprio**: eventos customizados salvos em `data/analytics.json`

### Eventos Customizados

Tags `data-track` nos elementos HTML:

```html
<button data-track="whatsapp" data-track-label="hero">
  Pedir pelo WhatsApp
</button>
```

O `AnalyticsProvider` escuta cliques em `[data-track]` e dispara:
1. `gtag('event', ...)` se GA4 estiver configurado
2. `POST /api/track` (beacon) para salvar no analytics.json

### Eventos Trackeados

| Evento | Local |
|--------|-------|
| `whatsapp` | Navbar, Hero, Destaques, CartDrawer, Contato |
| `instagram` | Footer, Contato |
| `telefone` | Contato |
| `endereco` | Contato |
| `cardapio` | Hero |
| `coupon` | CartDrawer (com o código) |

### Session-based Visits

- Usa `localStorage` com chave `analytics_session`
- TTL de 30 minutos
- Só conta 1 visita por sessão (F5 entre páginas não incrementa)
- Rotas admin e API não contam como visita

---

## 10. Painel Administrativo

### Acesso

`/admin/login` → digita a senha → cookie JWT por 7 dias

### Páginas

| Página | Funcionalidades |
|--------|----------------|
| **Dashboard** `/admin` | Cards de analytics (visitas/ações hoje/total) + métricas de pedidos (hoje/semana/mês) + **faturamento**, **ticket médio**, **produto campeão** + listagem de pedidos |
| **Produtos** `/admin/produtos` | Listar todos (com contagem de visualizações), criar novo, editar, deletar |
| **Categorias** `/admin/categorias` | Reordenar (cima/baixo), renomear, adicionar, remover. Slug gerado automático |
| **Promoções** `/admin/promocoes` | Listar com toggle ativo/inativo, badge de expirada, criar direta ou cupom, editar, deletar |
| **Horários** `/admin/horarios` | Editar dia por dia: aberto/fechado, horário único ou dois turnos, observações |
| **Configurações** `/admin/configuracoes` | Nome, descrição, slogan, telefone, WhatsApp, Instagram, endereço |
| **Pedidos** `/admin/pedidos` | Listar todos, buscar por ID ou nome, expandir ver detalhes, confirmar ou cancelar |
| **Mensagens** `/admin/mensagens` | Lista de mensagens do formulário de contato, buscar por nome/texto, expandir detalhes |
| **Senha** `/admin/senha` | Alterar senha de acesso |

### AdminShell

Sidebar fixa (desktop) + header horizontal com links (mobile). "Ver site" no topo da sidebar. Links: Dashboard, Produtos, Categorias, Pedidos, Mensagens, Promoções, Horários, Configurações, Senha.

---

## 11. Fluxo de Pedido (WhatsApp)

### Segurança (CRÍTICO — lógica anti-fraude)

1. Cliente monta carrinho no site (preços já corrigidos com promoções)
2. Preenche nome, opção (retirada/entrega), endereço, pagamento
3. Clica **"Enviar para WhatsApp"**
4. **Cliente → Servidor**: `POST /api/order/validate` com IDs dos produtos + quantidades + cupom
5. **Servidor valida TUDO**:
   - Busca cada produto no banco (preço real)
   - Aplica promoções diretas se existirem
   - Valida cupom contra banco de promoções
   - Calcula total real
   - **Salva o pedido em `data/orders/YYYY-MM.json` com ID único**
6. Servidor retorna: `{ orderId: "ORD-20260709-XXXX", items, total, whatsapp }`
7. **Mensagem do WhatsApp contém APENAS**:
   - Número do pedido (#ORD-...)
   - Nome do cliente
   - Itens (só nome + quantidade — **sem preços individuais**)
   - Total (validado pelo servidor)
   - Cupom (só o código, sem valor de desconto)
   - Opção de entrega/retirada + endereço
   - Forma de pagamento + observações
8. Cliente abre WhatsApp (pode editar a mensagem — **não adianta, pois o servidor já salvou o pedido real**)
9. **Atendente abre o admin → Pedidos → confere #ORD → vê os preços REAIS** salvos no servidor

### Por que isso é seguro?

Mesmo que o cliente edite a mensagem no WhatsApp antes de enviar:
- O pedido já está salvo no servidor com os preços reais
- A atendente vê `#ORD-20260709-XXXX` no WhatsApp
- Abre o admin, busca pelo número, vê os valores verdadeiros
- Qualquer divergência entre o WhatsApp e o servidor → prevalece o servidor

---

## 12. Como Customizar para Outra Loja

### Passo a Passo

#### 1. Dados da Empresa

Editar `data/settings.json`:
```json
{
  "name": "Nome da Loja",
  "description": "Descrição...",
  "shortDescription": "Slogan curto",
  "phone": "(00) 90000-0008",
  "whatsapp": "5500090000008",
  "instagram": "seuinstagram",
  "address": "Rua Fictícia, 327 — Centro",
  "foundedYear": 2024,
  "rating": 4.9
}
```

#### 2. Produtos

- Editar `data/products.json` com os produtos da nova loja
- Ou usar o admin → Produtos para cadastrar um por um

#### 3. Categorias

- Editar `data/categories.json`
- Cada categoria precisa de: `id`, `name`, `slug`, `order`, `icon` (nome de ícone Lucide)
- Ou usar admin → Categorias

#### 4. Imagens

- `public/images/products/` — fotos dos produtos
- `public/images/categories/` — ícones/banners das categorias
- `public/images/gallery/` — fotos da loja
- `public/images/logo.png` e `public/images/logo-icon.png` — logotipos
- `public/images/hero.png` — imagem do hero

#### 5. Horários

Editar `data/opening-hours.json` ou usar admin → Horários.

#### 6. Tema (Cores)

Em `app/globals.css`, alterar as variáveis CSS:
```css
@theme {
  --color-background: #111111;   /* fundo */
  --color-primary: #F4B400;      /* cor principal */
  --color-card: #1A1A1A;         /* cards */
  --color-secondary: #1F1F1F;    /* hover/background secundário */
  --color-foreground: #F5F5F5;   /* texto principal */
  --color-muted-foreground: #A0A0A0; /* texto secundário */
  --color-border: #2A2A2A;       /* bordas */
}
```

#### 7. Imagens do Hero

Em `components/home/Hero.client.tsx`, alterar:
- Background image
- Textos (nome, slogan, stats)

#### 8. Informações Legais

Editar `app/(public)/privacidade/page.tsx` com os dados reais da empresa.

#### 9. Deploy

Ver seção [Implantação](#13-implantação-deploy).

### O que NÃO precisa mudar

- Toda a lógica de carrinho, pedidos, promoções, analytics
- Painel admin (já funciona pra qualquer loja)
- Sistema de autenticação
- API routes
- Componentes de layout (Navbar, Footer, Cart, etc.)

---

## 13. Implantação (Deploy)

### Opção 1: Vercel (Recomendada)

```bash
npm i -g vercel
vercel
```

Definir variáveis de ambiente no Vercel:
- `ADMIN_PASSWORD` — hash bcrypt da senha do admin
- `JWT_SECRET` — string aleatória segura
- (opicional) `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` — para persistência via GitHub
- (opicional) `NEXT_PUBLIC_GA_ID` — Google Analytics

### Opção 2: Servidor próprio

```bash
npm run build
npm start
```

Definir as mesmas variáveis de ambiente.

### Desenvolvimento Local

```bash
npm run dev
```

- `LOCAL=true` no `.env.local` — usa sistema de arquivos diretamente
- Dados salvos em `data/*.json`
- Admin: `admin123` (se for o valor configurado)

---

## 14. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `LOCAL` | Dev | `true` para usar sistema de arquivos local |
| `ADMIN_PASSWORD` | Sim | Senha do admin (plaintext em dev, bcrypt hash em prod) |
| `JWT_SECRET` | Sim | Chave secreta para JWT |
| `GITHUB_TOKEN` | Produção | Token do GitHub para persistência |
| `GITHUB_OWNER` | Produção | Dono do repositório |
| `GITHUB_REPO` | Produção | Nome do repositório |
| `GITHUB_BRANCH` | Opcional | Branch (default: main) |
| `NEXT_PUBLIC_GA_ID` | Opcional | ID do Google Analytics 4 |

---

## 15. Segurança Implementada

### Camadas

1. **JWT em cookie httpOnly**: token não acessível por JavaScript do navegador
2. **SameSite strict**: previne ataques CSRF
3. **Rate limiting em todas as APIs públicas**: limite de requisições por IP — login (5/15min), contato (5/15min), pedidos (3/15min), analytics (200/15min). Bloqueio automático temporário
4. **Limite de tamanho de corpo (payload)**: contato (10KB), pedidos (100KB), senha (1KB) — rejeita payloads grandes antes de processar
5. **Middleware protege /admin**: redireciona para login se não autenticado
6. **API routes verificam sessão**: dupla verificação (middleware + rota)
7. **Origin check (CSRF)**: middleware verifica header Origin/Referer em requisições POST/PUT/DELETE para `/admin/*`
8. **Validação de input**: todas as APIs (admin e públicas) verificam JSON, tipos, campos obrigatórios
8. **Preços validados no servidor**: pedido é salvo com preços reais antes do WhatsApp
8. **Path traversal sanitizado**: upload de imagens com regex `[^a-zA-Z0-9._-]`
9. **Headers de segurança**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Strict-Transport-Security` (2 anos)
   - `Permissions-Policy` (camera/mic/geolocation desativados)
   - `Referrer-Policy: strict-origin-when-cross-origin`
10. **Senha com bcrypt em produção**: hash seguro, não texto plano
11. **Fallback de JWT só em dev**: produção exige `JWT_SECRET` configurado

---

> Documentação gerada em 09/07/2026
> Projeto: Casa do Pastel da Hora — https://cph-pxzys-projects.vercel.app
