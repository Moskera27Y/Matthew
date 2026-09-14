// src/types/photo.ts
import { BabyAge } from "./milestone";

export type PhotoCategory =
  | "daily"
  | "milestone"
  | "sleep"
  | "play"
  | "food"
  | "family";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date: string; // ISO date
  babyAge: BabyAge;
  category: PhotoCategory;
  albumId?: string;
  width?: number;
  height?: number;
  order: number;
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  coverPhotoId?: string;
  coverPhoto?: Photo;
  month?: string;
  year?: number;
  order: number;
}
