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
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
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
