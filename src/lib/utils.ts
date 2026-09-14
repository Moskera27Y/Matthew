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

export function formatDateES(date: Date | string) {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
