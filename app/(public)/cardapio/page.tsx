import type { Metadata } from "next";
import { getCategories } from "@/lib/services/category.service";
import { getProductsByCategory, getProducts } from "@/lib/services/product.service";
import { getSettings } from "@/lib/services/settings.service";
import CategoryTabs from "@/components/cardapio/CategoryTabs.client";
import CategoryShowcase from "@/components/cardapio/CategoryShowcase.client";
import ProductCard from "@/components/cardapio/ProductCard";
import SectionTitle from "@/components/shared/SectionTitle";
import CardapioSearchWrapper from "@/components/cardapio/CardapioSearchWrapper.client";
import { Product } from "@/lib/types";

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

const groupLabels: Record<string, string> = {
  tradicionais: "Tradicionais",
  combinados: "Combinados",
  especiais: "Especiais",
  doces: "Doces",
};

function ProductList({ products }: { products: Product[] }) {
  let currentGroup = "";

  return (
    <CardapioSearchWrapper products={products}>
      {(filtered) => (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum produto encontrado</p>
          )}
          {filtered.map((product, i) => {
            const showGroup = product.group && product.group !== currentGroup;
            if (product.group) currentGroup = product.group;

            return (
              <div key={product.id}>
                {showGroup && (
                  <h3 className={`font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider ${i > 0 ? "pt-8" : ""} mb-3`}>
                    {groupLabels[product.group!] || product.group}
                  </h3>
                )}
                <ProductCard product={product} index={i} />
              </div>
            );
          })}
        </div>
      )}
    </CardapioSearchWrapper>
  );
}

function CategorySection({ categoryId }: { categoryId: string }) {
  const products = getProductsByCategory(categoryId);

  return (
    <ProductList products={products} />
  );
}

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.categoria || defaultCategory;
  const products = getProducts();
  const productCounts: Record<string, number> = {};
  for (const p of products) {
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

          <CategorySection categoryId={activeCategory} />
      </div>
    </section>
  );
}
