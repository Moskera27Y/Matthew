// src/lib/types/admin.ts
import { Milestone } from "@/types/milestone";

export interface SessionState {
  isAuthenticated: boolean;
  user: { name: string; email?: string } | null;
}

export type AdminSection =
  | "milestones"
  | "gallery"
  | "growth"
  | "brothers"
  | "family"
  | "event"
  | "events"
  | "settings";

export interface AdminMilestone extends Omit<Milestone, "id"> {
  id?: string;
}
