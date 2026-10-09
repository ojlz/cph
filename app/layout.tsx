import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter_Tight } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import CartProviderGlobal from "@/components/cart/CartProviderGlobal.client";
import { PromotionsProvider } from "@/lib/promotions-context";
import AnalyticsProvider from "@/components/layout/AnalyticsProvider";
import { getSettings, getOpeningHours } from "@/lib/services/settings.service";

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
  metadataBase: new URL("https://casadopasteldahora.com.br"),
  title: {
    default: "Casa do Pastel da Hora — O Pastel que Conquistou Porto Fictício",
    template: "%s | Casa do Pastel da Hora",
  },
  description:
    "Pastelaria em Porto Fictício/EX. Pastéis crocantes, hambúrgueres artesanais e muito mais. Pedido pelo WhatsApp.",
  openGraph: {
    title: "Casa do Pastel da Hora",
    description:
      "O Pastel que conquistou Porto Fictício. Peça pelo WhatsApp.",
    locale: "pt_BR",
    type: "website",
    siteName: "Casa do Pastel da Hora",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Casa do Pastel da Hora — Pastelaria em Porto Fictício",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa do Pastel da Hora",
    description:
      "O Pastel que conquistou Porto Fictício. Peça pelo WhatsApp.",
    images: ["/images/og-image.jpg"],
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
const openingHours = getOpeningHours();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FastFoodRestaurant",
  name: settings.name,
  image: [
    "https://casadopasteldahora.com.br/images/og-image.jpg",
    "https://casadopasteldahora.com.br/images/logo.png",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Fictícia, 327",
    addressLocality: "Porto Fictício",
    addressRegion: "MS",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -23.0324,
    longitude: -54.2017,
  },
  telephone: settings.phone,
  url: "https://casadopasteldahora.com.br",
  servesCuisine: ["Pastel", "Hambúrguer", "Food"],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: settings.rating,
    bestRating: 5,
    reviewCount: 127,
  },
  openingHoursSpecification: openingHours.days
    .filter((d) => d.isOpen)
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: d.day,
      opens: d.open,
      closes: d.close,
    })),
  sameAs: [
    `https://instagram.com/${settings.instagram}`,
    "https://casadopasteldahora.com.br",
  ],
  areaServed: {
    "@type": "City",
    name: "Porto Fictício",
    containedInPlace: {
      "@type": "State",
      name: "Estado Fictício",
    },
  },
  hasMenu: "https://casadopasteldahora.com.br/cardapio",
  acceptsReservations: false,
  paymentAccepted: "Pix, Dinheiro, Cartão",
  hasDelivery: settings.hasDelivery,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: settings.name,
  url: "https://casadopasteldahora.com.br",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://casadopasteldahora.com.br/cardapio?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
