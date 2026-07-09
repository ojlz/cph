import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter_Tight } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import CartProviderGlobal from "@/components/cart/CartProviderGlobal.client";
import { PromotionsProvider } from "@/lib/promotions-context";
import AnalyticsProvider from "@/components/layout/AnalyticsProvider";
import { getSettings } from "@/lib/services/settings.service";

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
    default: "Casa do Pastel da Hora — O Pastel que Conquistou Porto Fictício�",
    template: "%s | Casa do Pastel da Hora",
  },
  description:
    "Pastelaria em Porto Fictício�, MS. Pastéis crocantes, hambúrgueres artesanais e muito mais. Pedido pelo WhatsApp.",
  openGraph: {
    title: "Casa do Pastel da Hora",
    description:
      "O Pastel que conquistou Porto Fictício�. Peça pelo WhatsApp.",
    locale: "pt_BR",
    type: "website",
    siteName: "Casa do Pastel da Hora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa do Pastel da Hora",
    description:
      "O Pastel que conquistou Porto Fictício�. Peça pelo WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo-icon.png",
  },
};

const settings = getSettings();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: settings.name,
  image: "https://casadopasteldahora.com.br/images/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Fictícia, 327",
    addressLocality: "Porto Fictício�",
    addressRegion: "MS",
    addressCountry: "BR",
  },
  telephone: settings.phone,
  servesCuisine: ["Pastel", "Hambúrguer", "Food"],
  priceRange: "$$",
  url: "https://casadopasteldahora.com.br",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} font-body antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <PromotionsProvider>
            <CartProviderGlobal>
              {children}
              <AnalyticsProvider />
            </CartProviderGlobal>
          </PromotionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
