"use client";

import Hero from "@/components/home/Hero.client";
import Destaques from "@/components/home/Destaques";
import SobrePreview from "@/components/home/SobrePreview";

export default function HomeContent() {
  return (
    <>
      <Hero />
      <Destaques />
      <SobrePreview />
    </>
  );
}
