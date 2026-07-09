"use client";

import { useState, ReactNode } from "react";
import CartButton from "@/components/cart/CartButton.client";
import CartDrawer from "@/components/cart/CartDrawer.client";

export default function CartWrapper({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {children}
      <CartButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
