import { getFile, commitFile } from "./client";
import { Product } from "@/lib/types";

const FILE = "data/products.json";

export async function getProducts(): Promise<Product[]> {
  const { content } = await getFile(FILE);
  return JSON.parse(content) as Product[];
}

export async function saveProducts(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2) + "\n";
  await commitFile(FILE, json, "Atualizar produtos [admin]");
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<void> {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Produto não encontrado");
  products[idx] = { ...products[idx], ...data };
  await saveProducts(products);
}

export async function addProduct(product: Product): Promise<void> {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
}
