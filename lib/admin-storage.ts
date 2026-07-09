import { Product, Category, Promotion, BusinessSettings, OpeningHours, Order, ContactMessage } from "@/lib/types";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

async function localRead<T>(file: string): Promise<T> {
  const fs = await import("fs/promises");
  const raw = await fs.readFile(/*turbopackIgnore: true*/ process.cwd() + "/" + file, "utf-8");
  return JSON.parse(raw) as T;
}

async function localWrite(file: string, data: unknown): Promise<void> {
  const fs = await import("fs/promises");
  const json = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(/*turbopackIgnore: true*/ process.cwd() + "/" + file, json, "utf-8");
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

function orderPeriod(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function getAdminOrders(period?: string): Promise<Order[]> {
  if (isLocal) {
    if (period) return localRead<Order[]>(`data/orders/${period}.json`);
    const fs = await import("fs/promises");
    try {
      const files = await fs.readdir(/*turbopackIgnore: true*/ process.cwd() + "/data/orders");
      const all: Order[] = [];
      for (const f of files.sort().reverse()) {
        if (!f.endsWith(".json")) continue;
        const data: Order[] = JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ process.cwd() + "/data/orders/" + f, "utf-8"));
        all.push(...data);
      }
      return all;
    } catch { return []; }
  }
  const mod = await import("@/lib/github/client");
  const { content } = await mod.getFile(`data/orders/${period || orderPeriod(new Date())}.json`);
  return JSON.parse(content);
}

export async function saveAdminOrders(orders: Order[], period?: string): Promise<void> {
  const p = period || orderPeriod(new Date());
  const path = `data/orders/${p}.json`;
  if (isLocal) return localWrite(path, orders);
  const mod = await import("@/lib/github/client");
  await mod.commitFile(path, JSON.stringify(orders, null, 2) + "\n", `Atualizar pedidos ${p} [admin]`);
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  if (isLocal) return localRead<ContactMessage[]>("data/messages.json");
  const mod = await import("@/lib/github/client");
  const { content } = await mod.getFile("data/messages.json");
  return JSON.parse(content);
}

export async function saveAdminMessages(messages: ContactMessage[]): Promise<void> {
  if (isLocal) return localWrite("data/messages.json", messages);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/messages.json", JSON.stringify(messages, null, 2) + "\n", "Atualizar mensagens [admin]");
}

export async function saveAdminHours(hours: OpeningHours): Promise<void> {
  if (isLocal) return localWrite("data/opening-hours.json", hours);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/opening-hours.json", JSON.stringify(hours, null, 2) + "\n", "Atualizar horários [admin]");
}

export async function getAdminPasswordHash(): Promise<string | null> {
  if (isLocal) {
    const fs = await import("fs/promises");
    try {
      const raw = await fs.readFile(/*turbopackIgnore: true*/ process.cwd() + "/data/admin-password.json", "utf-8");
      return JSON.parse(raw).hash;
    } catch {
      return null;
    }
  }
  const mod = await import("@/lib/github/client");
  try {
    const { content } = await mod.getFile("data/admin-password.json");
    return JSON.parse(content).hash;
  } catch {
    return null;
  }
}

export async function saveAdminPasswordHash(hash: string): Promise<void> {
  const data = { hash };
  if (isLocal) return localWrite("data/admin-password.json", data);
  const mod = await import("@/lib/github/client");
  await mod.commitFile("data/admin-password.json", JSON.stringify(data, null, 2) + "\n", "Atualizar senha admin [admin]");
}
