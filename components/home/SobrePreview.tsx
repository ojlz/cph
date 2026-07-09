import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal.client";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

export default function SobrePreview() {
  return (
    <section className="py-24 md:py-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/interior.jpg"
              alt="Espaco Casa do Pastel da Hora"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter leading-none text-white">
              Nossa Historia
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {settings.description}
            </p>
            <div className="mt-8">
              <CTAButton href="/sobre" variant="outline">
                Conheca Mais
                <ArrowRight size={18} />
              </CTAButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
