// src/data/growth.ts
import { GrowthRecord } from "@/types/growth";
import { BIRTH_DATE } from "@/lib/constants";
import { addDays } from "date-fns";
import { calculateAge } from "@/lib/utils";

function makeRecord(
  id: string,
  daysAfterBirth: number,
  weight: number,
  height: number,
  head: number | undefined,
  notes?: string
): GrowthRecord {
  const date = addDays(BIRTH_DATE, daysAfterBirth);
  return {
    id,
    date: date.toISOString().split("T")[0],
    babyAge: calculateAge(date),
    weight,
    height,
    headCircumference: head,
    notes,
    createdAt: date.toISOString(),
  };
}

export const GROWTH_RECORDS: GrowthRecord[] = [
  makeRecord("g1", 3, 3.2, 48.5, 35.0, "Pesas lo esperado para tu edad."),
  makeRecord("g2", 7, 3.4, 49.8, 35.8),
  makeRecord("g3", 14, 3.7, 51.2, 36.5),
  makeRecord("g4", 21, 4.0, 52.5, 37.2),
  makeRecord("g5", 28, 4.3, 53.8, 38.0),
  makeRecord("g6", 35, 4.6, 55.0, 38.8),
  makeRecord("g7", 42, 4.9, 56.2, 39.5),
  makeRecord("g8", 49, 5.2, 57.5, 40.0),
  makeRecord("g9", 56, 5.5, 58.8, undefined),
  makeRecord("g10", 63, 5.8, 60.0, undefined),
  makeRecord("g11", 70, 6.1, 61.2, undefined),
  makeRecord("g12", 90, 6.8, 63.5, undefined, "¡Crece como una espiga!"),
];

export const BABY_NAME = "Matthew";
