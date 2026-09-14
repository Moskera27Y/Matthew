// src/data/milestones.ts
import { Milestone, MilestoneCategory } from "@/types/milestone";
import { BIRTH_DATE } from "@/lib/constants";
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, addDays, format } from "date-fns";
import { es } from "date-fns/locale";

function calcBabyAge(targetDate: Date): { days: number; weeks: number; months: number; years: number } {
  const days = differenceInDays(targetDate, BIRTH_DATE);
  const weeks = differenceInWeeks(targetDate, BIRTH_DATE);
  const months = differenceInMonths(targetDate, BIRTH_DATE);
  const years = differenceInYears(targetDate, BIRTH_DATE);
  return { days, weeks, months, years };
}

function ageStr(age: { days: number; weeks: number; months: number; years: number }): string {
  if (age.years > 0) return `${age.years}a ${age.months}m`;
  if (age.months > 0) return `${age.months}m ${age.weeks}w`;
  if (age.weeks > 0) return `${age.weeks}w ${age.days}d`;
  return `${age.days}d`;
}

export const MILESTONES: Milestone[] = [
  {
    id: "1",
    title: "Primer suspiro",
    description: "El primer suspiro profundo de Matthew, un momento de paz absoluta.",
    date: format(BIRTH_DATE, "yyyy-MM-dd"),
    babyAge: calcBabyAge(BIRTH_DATE),
    category: "milestone" as MilestoneCategory,
    location: "Casa",
    parentNote: "Fue a las 3:42am del 31 de julio. Lo escuchamos desde la habitación contigua.",
    images: ["/images/placeholder-milestone.svg"],
    order: 1,
  },
  {
    id: "2",
    title: "Primera sonrisa",
    description: "Esa sonrisa que ilumina todo el dormitorio y hace derretir los corazones.",
    date: format(addDays(BIRTH_DATE, 8), "yyyy-MM-dd"),
    babyAge: calcBabyAge(addDays(BIRTH_DATE, 8)),
    category: "milestone" as MilestoneCategory,
    location: "Sala de estar",
    parentNote: "Fue inesperada, justo cuando estábamos cambiándole el pañal.",
    images: ["/images/placeholder-milestone.svg"],
    order: 2,
  },
  {
    id: "3",
    title: "Primer baño completo",
    description: "Bailando en el agüito tibio, todos los juguetes a la vista.",
    date: format(addDays(BIRTH_DATE, 21), "yyyy-MM-dd"),
    babyAge: calcBabyAge(addDays(BIRTH_DATE, 21)),
    category: "milestone" as MilestoneCategory,
    location: "Baño de la casa",
    parentNote: "Se le cerró el agua y empezó a cantar. No paró hasta que se enfrió.",
    images: ["/images/placeholder-milestone.svg"],
    order: 3,
  },
  {
    id: "4",
    title: "Primer viaje al parque",
    description: "La primera salida al mundo exterior, con el carrito recién estrenado.",
    date: format(addDays(BIRTH_DATE, 52), "yyyy-MM-dd"),
    babyAge: calcBabyAge(addDays(BIRTH_DATE, 52)),
    category: "travel" as MilestoneCategory,
    location: "Parque de los Girasoles",
    parentNote: "Se quedó dormido en el carrusel. Fue mágico verlo entre flores.",
    images: ["/images/placeholder-milestone.svg"],
    order: 4,
  },
  {
    id: "5",
    title: "Primer diente",
    description: "El primer pezón de diente de leche, ¡ya es un verdadero campeón!",
    date: format(addDays(BIRTH_DATE, 180), "yyyy-MM-dd"),
    babyAge: calcBabyAge(addDays(BIRTH_DATE, 180)),
    category: "health" as MilestoneCategory,
    location: "Casa",
    parentNote: "Masticó el granero de madera del tren de madera. ¡Qué valentón!",
    images: ["/images/placeholder-milestone.svg"],
    order: 5,
  },
];

export const ageString = ageStr;
export const calculateBabyAge = calcBabyAge;
