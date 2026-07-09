import { Product, Category, Promotion, BusinessSettings, OpeningHours } from "@/lib/types";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

async function localRead<T>(file: string): Promise<T> {
  const fs = await import("fs/promises");
  const raw = await fs.readFile(process.cwd() + "/" + file, "utf-8");
  return JSON.parse(raw) as T;
}

async function localWrite(file: string, data: unknown): Promise<void> {
  const fs = await import("fs/promises");
  const json = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(process.cwd() + "/" + file, json, "utf-8");
}

async function gitHubModule() {
  const [products, categories] = await Promise.all([
    import("@/lib/github/products"),
    import("@/lib/github/categories"),
  ]);
  return { products, categories };
}

export async function getAdminProducts(): Promise<Product[]> {
  if (isLocal) return localRead<Product[]>("data/products.json");
  const mod = await gitHubModule();
  return mod.products.getProducts();
}

export async function saveAdminProducts(products: Product[]): Promise<void> {
  if (isLocal) return localWrite("data/products.json", products);
  const mod = await gitHubModule();
  return mod.products.saveProducts(products);
}

export async function getAdminCategories(): Promise<Category[]> {
  if (isLocal) return localRead<Category[]>("data/categories.json");
  const mod = await gitHubModule();
  return mod.categories.getCategories();
}

export async function saveAdminCategories(categories: Category[]): Promise<void> {
  if (isLocal) return localWrite("data/categories.json", categories);
  const mod = await gitHubModule();
  return mod.categories.saveCategories(categories);
}

export async function getAdminPromotions(): Promise<Promotion[]> {
  if (isLocal) return localRead<Promotion[]>("data/promotions.json");
  const mod = await import("@/lib/github/client");
  const { content } = await mod.getFile("data/promotions.json");
  return JSON.parse(content);
}

export async function saveAdminPromotions(promotions: Promotion[]): Promise<void> {
  if (isLocal) return localWrite("data/promotions.json", promotions);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/promotions.json", JSON.stringify(promotions, null, 2) + "\n", "Atualizar promoções [admin]");
}

export async function getAdminSettings(): Promise<BusinessSettings> {
  if (isLocal) return localRead<BusinessSettings>("data/settings.json");
  const mod = await import("@/lib/github/client");
  const { content } = await mod.getFile("data/settings.json");
  return JSON.parse(content);
}

export async function saveAdminSettings(settings: BusinessSettings): Promise<void> {
  if (isLocal) return localWrite("data/settings.json", settings);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/settings.json", JSON.stringify(settings, null, 2) + "\n", "Atualizar configurações [admin]");
}

export async function getAdminHours(): Promise<OpeningHours> {
  if (isLocal) return localRead<OpeningHours>("data/opening-hours.json");
  const mod = await import("@/lib/github/client");
  const { content } = await mod.getFile("data/opening-hours.json");
  return JSON.parse(content);
}

export async function saveAdminHours(hours: OpeningHours): Promise<void> {
  if (isLocal) return localWrite("data/opening-hours.json", hours);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/opening-hours.json", JSON.stringify(hours, null, 2) + "\n", "Atualizar horários [admin]");
}
