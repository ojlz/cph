import Link from "next/link";
import CTAButton from "@/components/shared/CTAButton";

export default function NotFound() {
  return (
    <section className="min-h-[100dvh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl font-display font-bold text-primary mb-4">404</p>
        <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-white mb-4">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          A página que você procurou não existe ou foi movida.
        </p>
        <CTAButton href="/">Voltar ao Início</CTAButton>
      </div>
    </section>
  );
}
