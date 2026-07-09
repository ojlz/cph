import { Beef, Sandwich, CupSoda, Apple, IceCream } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Beef: <Beef size={32} />,
  Sandwich: <Sandwich size={32} />,
  CupSoda: <CupSoda size={32} />,
  Apple: <Apple size={32} />,
  IceCream: <IceCream size={32} />,
};

const gradients: Record<string, string> = {
  hamburgueres: "from-amber-900/40 to-transparent",
  pasteis: "from-orange-900/30 to-transparent",
  bebidas: "from-blue-900/30 to-transparent",
  sucos: "from-green-900/30 to-transparent",
  sorvetes: "from-purple-900/30 to-transparent",
};

const subtitles: Record<string, string> = {
  hamburgueres: "Hambúrgueres artesanais 120g",
  pasteis: "Tradicionais, combinados, especiais e doces",
  bebidas: "Refrigerantes, água e energéticos",
  sucos: "Naturais — 500ml ou 1L",
  sorvetes: "Picolés e sorvetes",
};

interface CategoryBannerProps {
  name: string;
  icon?: string;
  categoryId: string;
}

export default function CategoryBanner({ name, icon, categoryId }: CategoryBannerProps) {
  const gradient = gradients[categoryId] || "from-amber-900/40 to-transparent";
  const subtitle = subtitles[categoryId] || "";

  return (
    <div className={`relative rounded-2xl bg-card border border-border/50 overflow-hidden mb-8 bg-gradient-to-r ${gradient}`}>
      <div className="relative z-10 p-8 md:p-10 flex items-center gap-5">
        {icon && iconMap[icon] && (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            {iconMap[icon]}
          </div>
        )}
        <div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-white">
            {name}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
