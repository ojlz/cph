import type { Metadata } from "next";
import { getCategories } from "@/lib/services/category.service";
import { getProductsByCategory, getProducts } from "@/lib/services/product.service";
import { getSettings } from "@/lib/services/settings.service";
import CategoryTabs from "@/components/cardapio/CategoryTabs.client";
import CategoryShowcase from "@/components/cardapio/CategoryShowcase.client";
import CardapioSearchWrapper from "@/components/cardapio/CardapioSearchWrapper.client";
import SectionTitle from "@/components/shared/SectionTitle";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cardápio",
  description:
    "Confira o cardápio da Casa do Pastel da Hora em Porto Fictício�, MS. Pastéis, hambúrgueres, pastéis doces e bebidas.",
  openGraph: {
    title: "Cardápio | Casa do Pastel da Hora",
    description:
      "Confira o cardápio da Casa do Pastel da Hora. Pastéis, hambúrgueres e muito mais.",
    images: ["/images/og-image.jpg"],
  },
};

const categories = getCategories();
const defaultCategory = categories[0]?.id || "hamburgueres";
const settings = getSettings();

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.categoria || defaultCategory;
  const products = getProductsByCategory(activeCategory);
  const allProducts = getProducts();
  const productCounts: Record<string, number> = {};
  for (const p of allProducts) {
    productCounts[p.categoryId] = (productCounts[p.categoryId] || 0) + 1;
  }

  const menuItems = allProducts
    .filter((p) => p.available)
    .map((p) => ({
      "@type": "MenuItem",
      name: p.name,
      description: p.description || undefined,
      offers: {
        "@type": "Offer",
        price: p.variants?.[0]?.price ?? p.price,
        priceCurrency: "BRL",
      },
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Cardápio — Casa do Pastel da Hora",
    url: "https://casadopasteldahora.com.br/cardapio",
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: allProducts
        .filter((p) => p.categoryId === cat.id && p.available)
        .map((p) => ({
          "@type": "MenuItem",
          name: p.name,
          description: p.description || undefined,
          offers: {
            "@type": "Offer",
            price: p.variants?.[0]?.price ?? p.price,
            priceCurrency: "BRL",
          },
        })),
    })),
  };

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs items={[{ label: "Cardápio" }]} />

        <SectionTitle
          title="Nosso Cardápio"
          subtitle="Tudo feito com ingredientes frescos e muito carinho"
        />

        <div className="mb-10">
          <CategoryTabs categories={categories} />
        </div>

        <CategoryShowcase
          categories={categories}
          activeCategoryId={activeCategory}
          productCounts={productCounts}
          whatsapp={settings.whatsapp}
        />

        <CardapioSearchWrapper products={allProducts} activeCategoryId={activeCategory} />
      </div>
    </section>
  );
}
