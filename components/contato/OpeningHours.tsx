import { Clock } from "lucide-react";
import { getOpeningHours, isCurrentlyOpen } from "@/lib/services/settings.service";
import ScrollReveal from "@/components/shared/ScrollReveal.client";

export default function OpeningHours() {
  const hours = getOpeningHours();
  const open = isCurrentlyOpen();

  return (
    <ScrollReveal className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          Horários
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            open
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              open ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {open ? "Aberto agora" : "Fechado"}
        </span>
      </div>

      <ul className="space-y-3">
        {hours.days.map((day) => (
          <li key={day.day} className="flex justify-between items-start gap-4">
            <span className="text-sm text-foreground shrink-0">
              {day.day}
            </span>
            <span className="text-sm text-muted-foreground text-right">
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
        <p className="mt-4 text-xs text-muted-foreground">{hours.notes}</p>
      )}
    </ScrollReveal>
  );
}
