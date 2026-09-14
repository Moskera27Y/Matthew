// src/services/admin.ts
import { Milestone } from "@/types/milestone";
import { MILESTONES } from "@/data/milestones";

const STORAGE_KEYS = {
  milestones: "mj_admin_milestones",
  isAuthenticated: "mj_admin_auth",
};

export function getStoredMilestones(): Milestone[] {
  if (typeof window === "undefined") return MILESTONES;
  const stored = localStorage.getItem(STORAGE_KEYS.milestones);
  if (!stored) return MILESTONES;
  try {
    return JSON.parse(stored);
  } catch {
    return MILESTONES;
  }
}

export function saveMilestones(milestones: Milestone[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.milestones, JSON.stringify(milestones));
}

export function authAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true";
}

export function loginAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.isAuthenticated, "true");
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.isAuthenticated);
}
