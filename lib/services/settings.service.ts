import { BusinessSettings, OpeningHours } from "@/lib/types";
import settingsData from "@/data/settings.json";
import hoursData from "@/data/opening-hours.json";

export function getSettings(): BusinessSettings {
  return settingsData as BusinessSettings;
}

export function getOpeningHours(): OpeningHours {
  return hoursData as OpeningHours;
}

function isWithinShift(currentMinutes: number, open: string, close: string): boolean {
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);
  let openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  if (closeMinutes <= openMinutes) closeMinutes += 1440;
  if (openMinutes < currentMinutes && closeMinutes >= 1440) openMinutes -= 1440;
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function isCurrentlyOpen(): boolean {
  const hours = getOpeningHours();
  const now = new Date();
  const dayNames = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
  ];
  const currentDayName = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const today = hours.days.find((d) => d.day === currentDayName);
  if (!today || !today.isOpen) return false;

  if (isWithinShift(currentMinutes, today.open, today.close)) return true;
  if (today.open2 && today.close2 && isWithinShift(currentMinutes, today.open2, today.close2)) return true;

  return false;
}
