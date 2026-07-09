"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Category } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoProduto() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const handleSave = async (data: any) => {
    const res = await fetch("/api/admin/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/produtos");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <h1 className="font-display text-2xl font-semibold text-white">Novo Produto</h1>
      <ProductForm categories={categories} onSave={handleSave} />
    </div>
  );
}
