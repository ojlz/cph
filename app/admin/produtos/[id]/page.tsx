"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Product, Category } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProduto({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/produtos/${id}`),
        fetch("/api/admin/categorias"),
      ]);
      setProduct(await prodRes.json());
      setCategories(await catRes.json());
    };
    load();
  }, [params]);

  const handleSave = async (data: Product) => {
    const res = await fetch("/api/admin/produtos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/produtos");
  };

  if (!product) {
    return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <h1 className="font-display text-2xl font-semibold text-white">Editar Produto</h1>
      <ProductForm product={product} categories={categories} onSave={handleSave} />
    </div>
  );
}
