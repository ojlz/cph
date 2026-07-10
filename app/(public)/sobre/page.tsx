import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/services/settings.service";
import SectionTitle from "@/components/shared/SectionTitle";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a história da Casa do Pastel da Hora em Porto Fictício�, MS. Tradição, sabor e qualidade desde 2024.",
  openGraph: {
    title: "Sobre — Casa do Pastel da Hora",
    description:
      "Conheça a história da Casa do Pastel da Hora. Tradição, sabor e qualidade desde 2024.",
    images: ["/images/og-image.jpg"],
  },
};

const settings = getSettings();

export default function SobrePage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumbs items={[{ label: "Sobre" }]} />

        <SectionTitle
          title="Nossa História"
          subtitle="Mais do que uma pastelaria — um pedaço de Porto Fictício�"
        />

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/fachada.jpg"
              alt="Fachada da Casa do Pastel da Hora"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <p className="text-lg">
            {settings.description}
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-card border border-border/50 p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">Desde {settings.foundedYear}</p>
              <p className="text-sm text-muted-foreground mt-1">Servindo Porto Fictício�</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/50 p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">{settings.rating}</p>
              <p className="text-sm text-muted-foreground mt-1">Avaliação média</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/50 p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Feito na hora</p>
            </div>
          </div>

          <p>
            Nosso compromisso é com a qualidade. Cada pastel é aberto na hora, com massa crocante e recheios generosos.
            Os hambúrgueres são artesanais, feitos comBlend de carne selecionada e ingredientes frescos.
          </p>

          <p>
            Venha nos conhecer na Rua Fictícia, 327, no centro de Porto Fictício�.
            Estamos todos os dias das 18h às 23h, prontos para receber você!
          </p>
        </div>
      </div>
    </section>
  );
}
