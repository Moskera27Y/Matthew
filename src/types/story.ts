// src/types/story.ts
import { BabyAge } from "./milestone";

export interface Story {
  id: string;
  title: string;
  content: string; // Markdown
  date: string; // ISO date
  babyAge: BabyAge;
  images?: string[];
  isFeatured: boolean;
  author?: string; // "Mamá" | "Papá" | etc.
  createdAt: string;
  updatedAt: string;
}
