import { Category } from "@/lib/types";
import categoriesData from "@/data/categories.json";

export function getCategories(): Category[] {
  return (categoriesData as Category[]).sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}
