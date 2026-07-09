import Link from "next/link";
import Image from "next/image";
import { getSettings, getOpeningHours } from "@/lib/services/settings.service";

export default function Footer() {
  const settings = getSettings();
  const hours = getOpeningHours();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <Image
              src="/images/logo.png"
              alt="Casa do Pastel da Hora"
              width={216}
              height={58}
              className="h-12 w-auto mb-6"
            loading="eager"
            />
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {settings.description}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                data-track="instagram"
                data-track-label="footer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-sm">@{settings.instagram}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-primary mb-4">
              Horários
            </h3>
            <ul className="space-y-2">
              {hours.days.map((day) => (
                <li key={day.day} className="flex justify-between text-sm gap-4">
                  <span className="text-foreground shrink-0">
                    {day.day}
                  </span>
                  <span className="text-muted-foreground text-right">
                    {day.isOpen ? (
                      day.open2 ? (
                        <>{day.open} — {day.close} | {day.open2} — {day.close2}</>
                      ) : (
                        <>{day.open} — {day.close}</>
                      )
                    ) : "Fechado"}
                  </span>
                </li>
              ))}
            </ul>
            {hours.notes && (
              <p className="text-xs text-muted-foreground mt-3">{hours.notes}</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {"\u00A9"} {new Date().getFullYear()} Casa do Pastel da Hora. Todos os direitos reservados.
          </p>
          <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
