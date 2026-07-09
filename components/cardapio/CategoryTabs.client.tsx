"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function CategoryTabs({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria") || categories[0]?.id || "";

  const handleChange = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categoria", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleChange(cat.id)}
          className={cn(
            "relative rounded-full px-6 py-3 text-sm font-medium transition-colors",
            active === cat.id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-secondary"
          )}
        >
          {active === cat.id && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
