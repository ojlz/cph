"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";

interface CategoryShowcaseProps {
  categories: { id: string; name: string; description?: string; highlight?: string; image?: string }[];
  activeCategoryId: string;
  productCounts: Record<string, number>;
  whatsapp: string;
}

const defaultContent: Record<string, { lines: string[]; highlight: string }> = {
  hamburgueres: {
    lines: ["Artesanais.", "Suculentos.", "Ingredientes selecionados."],
    highlight: "Mais pedido",
  },
  pasteis: {
    lines: ["Feitos na hora.", "Massa crocante.", "Muito recheio."],
    highlight: "Categoria mais pedida",
  },
  bebidas: {
    lines: ["Refrigerantes gelados.", "Água e energéticos."],
    highlight: "Perfeito para acompanhar",
  },
  sucos: {
    lines: ["Naturais.", "Refrescantes.", "Fruta de verdade."],
    highlight: "500ml ou 1L",
  },
  sorvetes: {
    lines: ["Cremosos.", "Geladinhos.", "Variedade de sabores."],
    highlight: "A melhor sobremesa",
  },
};

const defaultImages: Record<string, string> = {
  hamburgueres: "/images/categories/burger.jpg",
  pasteis: "/images/categories/pastel.jpg",
  bebidas: "/images/categories/drinks.jpg",
  sucos: "/images/categories/juice.jpg",
  sorvetes: "/images/categories/icecream.jpg",
};

export default function CategoryShowcase({
  categories,
  activeCategoryId,
  productCounts,
  whatsapp,
}: CategoryShowcaseProps) {
  const category = categories.find((c) => c.id === activeCategoryId);
  const catData = category as { description?: string; highlight?: string; image?: string } | undefined;
  const data = catData?.description
    ? { lines: [catData.description], highlight: catData.highlight || "" }
    : defaultContent[activeCategoryId];
  const img = catData?.image || defaultImages[activeCategoryId];
  const count = productCounts[activeCategoryId] || 0;

  return (
    <section className="relative mb-16">
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] items-stretch gap-0 md:gap-8 lg:gap-12">
        <div className="relative h-[40vh] md:h-[65vh] lg:h-[75vh] overflow-hidden rounded-2xl bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategoryId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "brightness(0.6)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 group"
            >
              <Image
                src={img}
                alt={category?.name || ""}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center px-4 md:px-0 pt-6 md:pt-0">
          <div className="text-center md:text-left">
            <motion.p
              key={`tag-${activeCategoryId}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4"
            >
              Categoria
            </motion.p>

            <motion.h3
              key={`title-${activeCategoryId}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white mb-6"
            >
              {category?.name}
            </motion.h3>

            <motion.div
              key={`desc-${activeCategoryId}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-1 mb-6"
            >
              {data?.lines.map((line, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                  {line}
                </p>
              ))}
            </motion.div>

            <motion.div
              key={`meta-${activeCategoryId}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap gap-4 items-center justify-center md:justify-start mb-8"
            >
              <span className="text-sm text-muted-foreground">
                {count} {count === 1 ? "opção disponível" : "opções disponíveis"}
              </span>
              {data?.highlight && (
                <span className="text-sm text-primary font-medium">
                  {data.highlight}
                </span>
              )}
            </motion.div>

            <motion.div
              key={`btn-${activeCategoryId}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex justify-center md:justify-start"
            >
              <CTAButton href={`https://wa.me/${whatsapp}`} external data-track="whatsapp" data-track-label="showcase">
                Pedir pelo WhatsApp
                <ArrowRight size={18} />
              </CTAButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
