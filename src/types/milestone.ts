// src/types/milestone.ts
export type MilestoneCategory =
  | "health"
  | "milestone"
  | "travel"
  | "food"
  | "family";

export interface BabyAge {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  babyAge: BabyAge;
  category: MilestoneCategory;
  location?: string;
  parentNote?: string;
  images?: string[]; // Cloudinary URLs / local paths
  order: number;
  icon?: string;    // emoji/icono del milestone (opcional)
}

export interface TimelineProps {
  milestones: Milestone[];
}
