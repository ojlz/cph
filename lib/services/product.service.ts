import { Product } from "@/lib/types";
import productsData from "@/data/products.json";

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.id === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured && p.available);
}

export function getAvailableProducts(): Product[] {
  return getProducts().filter((p) => p.available);
}
