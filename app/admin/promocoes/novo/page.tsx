"use client";

import { useRouter } from "next/navigation";
import PromotionForm from "@/components/admin/PromotionForm";

export default function NovaPromocao() {
  const router = useRouter();

  const handleSave = async (data: any) => {
    const res = await fetch("/api/admin/promocoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/promocoes");
  };

  return <PromotionForm onSave={handleSave} />;
}
