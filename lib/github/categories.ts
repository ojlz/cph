import { getFile, commitFile } from "./client";
import { Category } from "@/lib/types";

const FILE = "data/categories.json";

export async function getCategories(): Promise<Category[]> {
  const { content } = await getFile(FILE);
  return JSON.parse(content) as Category[];
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const json = JSON.stringify(categories, null, 2) + "\n";
  await commitFile(FILE, json, "Atualizar categorias [admin]");
}
