"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product, ProductVariant } from "@/lib/types";

export interface CartItem {
  productId: string;
  productName: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, overridePrice?: number) => void;
  updateQuantity: (productId: string, variantLabel: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, variant?: ProductVariant, overridePrice?: number) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.variantLabel === variant?.label,
      );
      const price = overridePrice ?? (variant ? variant.price : product.price);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.variantLabel === variant?.label
            ? { ...i, quantity: i.quantity + 1, price }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          variantLabel: variant?.label,
          price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantLabel: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) => !(i.productId === productId && i.variantLabel === variantLabel),
          ),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantLabel === variantLabel
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
