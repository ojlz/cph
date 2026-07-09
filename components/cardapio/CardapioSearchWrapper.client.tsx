"use client";

import { useState, useMemo, ReactNode } from "react";
import SearchBar from "./SearchBar.client";
import { Product } from "@/lib/types";

interface Props {
  products: Product[];
  children: (filtered: Product[]) => ReactNode;
}

export default function CardapioSearchWrapper({ products, children }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.group?.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div>
      <div className="mb-6">
        <SearchBar onSearch={setQuery} />
      </div>
      {children(filtered)}
    </div>
  );
}
