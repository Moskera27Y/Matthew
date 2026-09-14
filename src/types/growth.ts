// src/types/growth.ts
import { BabyAge } from "./milestone";

export type GrowthCategory = "weight" | "height" | "head";

export interface GrowthRecord {
  id: string;
  date: string; // ISO date
  babyAge: BabyAge;
  weight: number; // kg (1 decimal)
  height: number; // cm
  headCircumference?: number; // cm (opcional hasta 6 meses)
  notes?: string;
  createdAt: string;
}
