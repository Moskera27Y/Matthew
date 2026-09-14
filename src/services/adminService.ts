// src/services/adminService.ts
// Persistencia REAL cross-device: Server Components y API routes usan Prisma
// directamente sobre Neon. Los client components (browser) usan fetch HTTP al
// endpoint /api/admin/state → Neon (con fallback localStorage para offline).
// Los datos default se seedean server-side cuando la DB está vacía.
import { Brother, DEFAULT_BROTHERS } from "@/types/brother";
import { EventDetails, DEFAULT_EVENT } from "@/types/event";
import { Photo } from "@/types/photo";
import { PHOTOS } from "@/data/photos";
import { Milestone } from "@/types/milestone";
import { MILESTONES } from "@/data/milestones";
import { GrowthRecord } from "@/types/growth";
import { GROWTH_RECORDS } from "@/data/growth";
import { Story } from "@/types/story";
import { STORIES } from "@/data/stories";
import { FamilyMember } from "@/types/family";
import { FAMILY_MEMBERS } from "@/data/family";

// Keys de localStorage — fallback OFFLINE para que el admin funcione sin red.
export const storageKeys = {
  milestones: "mj_admin_milestones",
  photos: "mj_admin_photos",
  growth: "mj_admin_growth",
  stories: "mj_admin_stories",
  brothers: "mj_admin_brothers",
  family: "mj_admin_family",
  settings: "mj_admin_settings",
  event: "mj_admin_event",
  events: "mj_admin_events",
  auth: "mj_admin_auth",
};

// ---------- Helpers de fallback (browser-only) ----------
function safeParse<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function safeSet(key: string, data: unknown) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data));
  } catch (err: any) {
    console.error(`[adminService] localStorage save("${key}") falló:`, err?.message || err);
  }
}

// ---------- HTTP helper (client-side → API route → Neon) ----------
const STATE_URL = "/api/admin/state";
// Lee estado completo desde Neon vía API route. Network-first, localStorage fallback.
async function loadFromServer(): Promise<any> {
  const res = await fetch(STATE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
// Persiste estado parcial a Neon vía API route.
// ⚠️ NO traga el error: propaga el throw para que la UI avise al usuario
// (antes se hacía console.warn → el admin creía que se guardaba y no se persistía).
async function saveToServer(patch: Record<string, unknown>): Promise<void> {
  const res = await fetch(STATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 200);
    throw new Error(`POST /api/admin/state falló (${res.status}): ${body}`);
  }
}
// DELETE explícito: borra UN row de Neon vía query params (no sync-delete).
// Evita el bug donde saveX(arrayFiltrado) no persistía el borrado (POST es upsert-only).
export async function deleteItem(table: "photos" | "brothers" | "family" | "growth" | "stories" | "milestones", id: string): Promise<void> {
  const res = await fetch(`${STATE_URL}?table=${table}&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`DELETE /api/admin/state falló (${res.status})`);
}

// ==================== BROTHERS ====================
export const loadBrothers = async (): Promise<Brother[]> => {
  try {
    const state = await loadFromServer();
    return (state.brothers as Brother[]) || DEFAULT_BROTHERS;
  } catch {
    return safeParse(storageKeys.brothers, DEFAULT_BROTHERS);
  }
};

export const saveBrothers = async (brothers: Brother[]): Promise<void> => {
  safeSet(storageKeys.brothers, brothers); // respaldo local inmediato
  await saveToServer({ brothers });        // propaga error si Neon falla (antes se tragaba)
};

// ==================== EVENTS ====================
export const loadEvent = async (): Promise<EventDetails> => {
  try {
    const state = await loadFromServer();
    return (state.event as EventDetails) || DEFAULT_EVENT;
  } catch {
    return safeParse(storageKeys.event, DEFAULT_EVENT);
  }
};

export const saveEvent = async (event: EventDetails): Promise<void> => {
  safeSet(storageKeys.event, event);
  await saveToServer({ event });
};

export const loadEvents = async (): Promise<EventDetails[]> => {
  try {
    const state = await loadFromServer();
    return (state.events as EventDetails[]) || [DEFAULT_EVENT];
  } catch {
    return safeParse(storageKeys.events, [DEFAULT_EVENT]);
  }
};

export const saveEvents = async (events: EventDetails[]): Promise<void> => {
  safeSet(storageKeys.events, events);
  await saveToServer({ events });
};

export const findEventById = async (id: string): Promise<EventDetails | null> => {
  try {
    // Busca en la lista de eventos desde Neon.
    const events = await loadEvents();
    return events.find((e) => e.id === id) || null;
  } catch {
    // Legacy ids del default
    if (id === "matthew-baptism" || id === DEFAULT_EVENT.id) return DEFAULT_EVENT;
    return null;
  }
};

// ==================== PHOTOS ====================
export const loadPhotos = async (): Promise<Photo[]> => {
  try {
    const state = await loadFromServer();
    return (state.photos as Photo[]) || PHOTOS;
  } catch {
    return safeParse(storageKeys.photos, PHOTOS);
  }
};

export const savePhotos = async (photos: Photo[]): Promise<void> => {
  safeSet(storageKeys.photos, photos); // respaldo local inmediato
  await saveToServer({ photos });      // propaga error si Neon falla
};

// ==================== MILESTONES ====================
export const loadMilestones = async (): Promise<Milestone[]> => {
  try {
    const state = await loadFromServer();
    return (state.milestones as Milestone[]) || MILESTONES;
  } catch {
    return safeParse(storageKeys.milestones, MILESTONES);
  }
};

export const saveMilestones = async (milestones: Milestone[]): Promise<void> => {
  safeSet(storageKeys.milestones, milestones);
  await saveToServer({ milestones });
};

// ==================== GROWTH ====================
export const loadGrowth = async (): Promise<GrowthRecord[]> => {
  try {
    const state = await loadFromServer();
    return (state.growth as GrowthRecord[]) || GROWTH_RECORDS;
  } catch {
    return safeParse(storageKeys.growth, GROWTH_RECORDS);
  }
};
export const saveGrowth = async (g: GrowthRecord[]): Promise<void> => {
  safeSet(storageKeys.growth, g);
  await saveToServer({ growth: g });
};

// ==================== STORIES (legacy — se preserva por compat) ====================
export const loadStories = async (): Promise<Story[]> => {
  try {
    const state = await loadFromServer();
    return (state.stories as Story[]) || STORIES;
  } catch {
    return safeParse(storageKeys.stories, STORIES);
  }
};
export const saveStories = async (s: Story[]): Promise<void> => {
  safeSet(storageKeys.stories, s);
  await saveToServer({ stories: s });
};

// ==================== FAMILY ====================
export const loadFamily = async (): Promise<FamilyMember[]> => {
  try {
    const state = await loadFromServer();
    return (state.family as FamilyMember[]) || FAMILY_MEMBERS;
  } catch {
    return safeParse(storageKeys.family, FAMILY_MEMBERS);
  }
};
export const saveFamily = async (f: FamilyMember[]): Promise<void> => {
  safeSet(storageKeys.family, f);
  await saveToServer({ family: f });
};

// ==================== SETTINGS ====================
export interface AdminSettings {
  babyPhoto?: string;
  babyName?: string;
  babyBirthDate?: string;
}
const DEFAULT_SETTINGS: AdminSettings = {};

export const loadSettings = async (): Promise<AdminSettings> => {
  try {
    const state = await loadFromServer();
    return (state.settings as AdminSettings) || DEFAULT_SETTINGS;
  } catch {
    return safeParse(storageKeys.settings, DEFAULT_SETTINGS);
  }
};
export const saveSettings = async (s: AdminSettings): Promise<void> => {
  safeSet(storageKeys.settings, s);
  await saveToServer({ settings: s });
};

// ==================== AUTH (preserva localStorage-based demo auth) ====================
export const auth = {
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKeys.auth) === "true";
  },
  login: (): void => {
    if (typeof window !== "undefined") localStorage.setItem(storageKeys.auth, "true");
  },
  logout: (): void => {
    if (typeof window !== "undefined") localStorage.removeItem(storageKeys.auth);
  },
};
