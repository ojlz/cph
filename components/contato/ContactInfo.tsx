import { MapPin, Phone, MessageCircle } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal.client";
import { getSettings } from "@/lib/services/settings.service";

const settings = getSettings();

function InstagramIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: settings.phone,
    href: `https://wa.me/${settings.whatsapp}`,
    track: "whatsapp",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: `@${settings.instagram}`,
    href: `https://instagram.com/${settings.instagram}`,
    track: "instagram",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: settings.phone,
    href: `tel:${settings.phone}`,
    track: "phone",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: settings.address,
    track: "address",
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      {contactItems.map((item, i) => (
        <ScrollReveal key={item.label} delay={i * 0.05}>
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-track={item.track}
              data-track-label="contato"
              className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-5 transition-all duration-300 hover:bg-secondary hover:border-border group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}
