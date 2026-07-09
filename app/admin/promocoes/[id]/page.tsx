"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PromotionForm from "@/components/admin/PromotionForm";
import { Promotion } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPromocao({ params }: Props) {
  const router = useRouter();
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const all: Promotion[] = await fetch("/api/admin/promocoes").then((r) => r.json());
      setPromotion(all.find((p) => p.id === id) || null);
    };
    load();
  }, [params]);

  const handleSave = async (data: Promotion) => {
    const res = await fetch("/api/admin/promocoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/promocoes");
  };

  if (!promotion) return <div className="h-48 rounded-2xl bg-card border border-border/50 animate-pulse" />;

  return <PromotionForm promotion={promotion} onSave={handleSave} />;
}
