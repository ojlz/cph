import ScrollReveal from "@/components/shared/ScrollReveal.client";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <ScrollReveal className={`mb-16 text-center ${className || ""}`}>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-[65ch] mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
