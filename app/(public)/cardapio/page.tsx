import type { Metadata } from "next";
import { getCategories } from "@/lib/services/category.service";
import { getProductsByCategory } from "@/lib/services/product.service";
import { getSettings } from "@/lib/services/settings.service";
import CategoryTabs from "@/components/cardapio/CategoryTabs.client";
import CategoryShowcase from "@/components/cardapio/CategoryShowcase.client";
import CardapioSearchWrapper from "@/components/cardapio/CardapioSearchWrapper.client";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Cardápio",
  description:
    "Confira o cardápio da Casa do Pastel da Hora em Porto Fictício�, MS. Pastéis, hambúrgueres, pastéis doces e bebidas.",
  openGraph: {
    title: "Cardápio | Casa do Pastel da Hora",
    description:
      "Confira o cardápio da Casa do Pastel da Hora. Pastéis, hambúrgueres e muito mais.",
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
  const allProducts = await import("@/lib/services/product.service").then((m) => m.getProducts());
  const productCounts: Record<string, number> = {};
  for (const p of allProducts) {
    productCounts[p.categoryId] = (productCounts[p.categoryId] || 0) + 1;
  }

  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-3xl px-4">
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
