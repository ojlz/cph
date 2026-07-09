"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight, Star, MapPin, Clock, Award } from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 md:pb-24">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-primary text-primary" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {settings.rating} — Porto Fictício�
            </span>
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none text-white max-w-3xl"
        >
          O Pastel
          <br />
          que conquistou
          <br />
          <span className="text-primary">Porto Fictício�.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
        >
          {settings.shortDescription}
        </motion.p>

        <motion.div
          {...fadeUp(0.45)}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <CTAButton
            href={`https://wa.me/${settings.whatsapp}`}
            external
            data-track="whatsapp"
            data-track-label="hero"
          >
            Pedir pelo WhatsApp
            <ArrowRight size={18} />
          </CTAButton>
          <CTAButton href="/cardapio" variant="outline" data-track="cardapio" data-track-label="hero">
            Ver Cardápio
          </CTAButton>
        </motion.div>

        <motion.div
          {...fadeUp(0.6)}
          className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Porto Fictício�
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} /> Todos os dias, 18h às 23h
          </span>
          <span className="flex items-center gap-2">
            <Award size={14} /> Desde {settings.foundedYear}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
