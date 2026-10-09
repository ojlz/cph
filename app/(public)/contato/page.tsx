import type { Metadata } from "next";
import ScrollReveal from "@/components/shared/ScrollReveal.client";
import ContactInfo from "@/components/contato/ContactInfo";
import ContactForm from "@/components/contato/ContactForm.client";
import OpeningHours from "@/components/contato/OpeningHours";
import SectionTitle from "@/components/shared/SectionTitle";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Casa do Pastel da Hora em Porto Fictício/EX. Pedidos pelo WhatsApp, Instagram e telefone.",
  openGraph: {
    title: "Contato — Casa do Pastel da Hora",
    description:
      "Entre em contato conosco. Pedidos pelo WhatsApp, Instagram e telefone.",
    images: ["/images/og-image.jpg"],
  },
};

export default function ContatoPage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumbs items={[{ label: "Contato" }]} />

        <SectionTitle
          title="Contato"
          subtitle="Estamos prontos para atender você"
        />

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-3 space-y-6">
            <ContactInfo />
            <OpeningHours />
          </div>
          <ScrollReveal direction="right" className="md:col-span-2">
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
