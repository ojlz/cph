# Casa do Pastel da Hora (projeto fictício)

> **Aviso:** site 100% fictício criado para portfólio. Nome, endereço
> (Rua Fictícia, 327 — Porto Fictício/EX), telefone `(00) 90000-0008`,
> WhatsApp, preços e mapas são inventados. Nenhum dado é real e não
> representa nenhuma empresa.

🌐 **Demo no ar:** https://cph-pxzys-projects.vercel.app

Site de pastelaria fictícia (Next.js): cardápio, carrinho com pedido via
WhatsApp, contato, sobre + painel admin completo (pedidos, produtos,
promoções, config).

## Demo pública (sem backend)

A vitrine (cardápio, páginas) funciona direto dos dados embutidos. Pedidos,
mensagens e admin precisam de variáveis de ambiente na Vercel:

| Var | Para quê |
| --- | --- |
| `JWT_SECRET` | sessões do admin (obrigatória p/ login) |
| `ADMIN_PASSWORD` | senha do admin |
| `GITHUB_TOKEN` / `GITHUB_REPO` / `GITHUB_BRANCH` | persistência (pedidos, produtos, config) |

Sem elas, checkout e admin retornam erro — o site continua navegável.

## Rodar local

```bash
npm install
cp .env.example .env.local   # LOCAL=true usa os JSONs de data/
npm run dev
```

## Deploy

Hospedado na Vercel. Push na branch principal = redeploy.
