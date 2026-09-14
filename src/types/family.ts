// src/types/family.ts

export type FamilyRole = "mom" | "dad" | "grandma" | "grandpa" | "sibling" | "other";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  role: FamilyRole;
  photoUrl?: string;
  quote?: string;
  order: number;
}
