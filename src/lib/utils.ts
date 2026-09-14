// src/lib/utils.ts
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, format } from "date-fns";
import { es } from "date-fns/locale";
import { BIRTH_DATE } from "./constants";

export function calculateAge(now: Date = new Date()) {
  const days = differenceInDays(now, BIRTH_DATE);
  const weeks = differenceInWeeks(now, BIRTH_DATE);
  const months = differenceInMonths(now, BIRTH_DATE);
  const years = differenceInYears(now, BIRTH_DATE);

  return { days, weeks, months, years };
}

export function formatDateES(date: Date | string | undefined | null) {
  try {
    const d = date ? new Date(date) : new Date();
    if (Number.isNaN(d.getTime())) return "Sin fecha";
    return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return "Sin fecha";
  }
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
