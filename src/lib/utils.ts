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

// Fecha calendario "YYYY-MM-DD" (o ISO) → Date LOCAL al mediodía.
// Evita el corrimiento de un día: new Date("2026-09-15") es medianoche UTC,
// que en Colombia (UTC-5) cae el 14 a las 7pm. Al mediodía local no hay
// zona horaria del mundo que lo mueva de día.
export function parseCalendarDate(iso: string | undefined | null): Date {
  const m = (iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  const d = iso ? new Date(iso) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

// Días de Matthew a la fecha del suceso (no a hoy): base de babyAge en
// crecimiento, hitos y galería. Siempre usa fecha calendario local.
export function daysSinceBirth(isoDate: string | undefined | null): number {
  const d = parseCalendarDate(isoDate);
  return Math.max(
    0,
    Math.floor((d.getTime() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function babyAgeForDate(isoDate: string | undefined | null) {
  const days = daysSinceBirth(isoDate);
  return {
    days,
    weeks: Math.floor(days / 7),
    months: Math.floor(days / 30),
    years: Math.floor(days / 365),
  };
}

export function formatDateES(date: Date | string | undefined | null) {
  try {
    if (!date) return "Sin fecha";
    if (typeof date === "string") {
      // "YYYY-MM-DD" o ISO con medianoche UTC (artefacto de timestamptz al guardar
      // solo-fecha en Neon): la fecha calendario es lo que vale. Construirla local
      // evita que en Colombia (UTC-5) se muestre el día anterior.
      const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const isMidnight =
        /^\d{4}-\d{2}-\d{2}$/.test(date) ||
        /T00:00(:00)?(\.0+)?(Z|[+-]00:?00?)?$/.test(date);
      if (m && isMidnight) {
        return format(parseCalendarDate(date), "d 'de' MMMM 'de' yyyy", { locale: es });
      }
    }
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "Sin fecha";
    return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return "Sin fecha";
  }
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
