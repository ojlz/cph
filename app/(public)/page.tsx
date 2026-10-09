import type { Metadata } from "next";
import Hero from "@/components/home/Hero.client";
import Destaques from "@/components/home/Destaques";

export const metadata: Metadata = {
  title: "Casa do Pastel da Hora — O Pastel que Conquistou Porto Fictício",
  description:
    "Pastelaria em Porto Fictício/EX. Pastéis crocantes feitos na hora, hambúrgueres artesanais e muito mais. Peça pelo WhatsApp.",
  openGraph: {
    title: "Casa do Pastel da Hora — Pastelaria em Porto Fictício",
    description:
      "Pastéis crocantes, hambúrgueres artesanais e o melhor atendimento de Porto Fictício. Peça pelo WhatsApp!",
    images: ["/images/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Destaques />
    </>
  );
}
