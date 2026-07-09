import { Promotion } from "@/lib/types";
import promotionsData from "@/data/promotions.json";

export function getActivePromotions(): Promotion[] {
  return (promotionsData as Promotion[]).filter((p) => p.active);
}
