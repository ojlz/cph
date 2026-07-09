"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/cart-context";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { totalItems } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-primary text-primary-foreground pl-6 pr-5 py-3 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          <ShoppingBag size={20} />
          <span className="text-sm font-semibold">{totalItems}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
