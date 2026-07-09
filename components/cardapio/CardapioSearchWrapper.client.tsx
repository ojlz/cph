"use client";

import { useState, useMemo } from "react";
import SearchBar from "./SearchBar.client";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import { getCategories } from "@/lib/services/category.service";

const categories = getCategories();

const groupLabels: Record<string, string> = {
  tradicionais: "Tradicionais",
  combinados: "Combinados",
  especiais: "Especiais",
  doces: "Doces",
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface Props {
  products: Product[];
  activeCategoryId: string;
}

export default function CardapioSearchWrapper({ products, activeCategoryId }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return products.filter((p) => p.categoryId === activeCategoryId);
    const q = normalize(query);
    const matchedCategoryIds = new Set(
      categories.filter((c) => normalize(c.name).includes(q)).map((c) => c.id),
    );
    return products.filter(
      (p) =>
        matchedCategoryIds.has(p.categoryId) ||
        normalize(p.name).includes(q) ||
        normalize(p.description || "").includes(q) ||
        normalize(p.group || "").includes(q),
    );
  }, [products, activeCategoryId, query]);

  let currentGroup = "";

  return (
    <div>
      <div className="mb-6">
        <SearchBar onSearch={setQuery} />
      </div>
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
    </div>
  );
}
