"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Promotion } from "@/lib/types";

interface PromotionsContextType {
  promotions: Promotion[];
  loading: boolean;
}

const PromotionsContext = createContext<PromotionsContextType>({
  promotions: [],
  loading: true,
});

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/promocoes")
      .then((r) => r.json())
      .then((list: Promotion[]) => {
        setPromotions(list.filter((p) => p.active));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PromotionsContext.Provider value={{ promotions, loading }}>
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  return useContext(PromotionsContext);
}
