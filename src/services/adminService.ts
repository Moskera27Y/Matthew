// src/services/adminService.ts
import { Milestone } from "@/types/milestone";
import { Photo } from "@/types/photo";
import { GrowthRecord } from "@/types/growth";
import { Story } from "@/types/story";
import { FamilyMember } from "@/types/family";
import { Brother, DEFAULT_BROTHERS } from "@/types/brother";
import { EventDetails, DEFAULT_EVENT } from "@/types/event";

export const storageKeys = {
  milestones: "mj_admin_milestones",
  photos: "mj_admin_photos",
  growth: "mj_admin_growth",
  stories: "mj_admin_stories",
  brothers: "mj_admin_brothers",
  family: "mj_admin_family",
  settings: "mj_admin_settings",
  event: "mj_admin_event",       // evento único (legacy / admin)
  events: "mj_admin_events",     // lista de eventos (para /eventos)
  auth: "mj_admin_auth",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err: any) {
    // QuotaExceededError (base64 de imágenes grandes) u otros fallos de localStorage
    console.error(`[adminService] save("${key}") falló:`, err?.message || err);
    alert(
      "No se pudo guardar: la imagen es demasiado grande o localStorage está lleno. " +
        "Reduce el tamaño de la foto e intenta de nuevo."
    );
  }
}

// Milestones
import { MILESTONES } from "@/data/milestones";
export const loadMilestones = (): Milestone[] => load(storageKeys.milestones, MILESTONES);
export const saveMilestones = (m: Milestone[]): void => save(storageKeys.milestones, m);

// Photos
import { PHOTOS } from "@/data/photos";
export const loadPhotos = (): Photo[] => load(storageKeys.photos, PHOTOS);
export const savePhotos = (p: Photo[]): void => save(storageKeys.photos, p);

// Growth
import { GROWTH_RECORDS } from "@/data/growth";
export const loadGrowth = (): GrowthRecord[] => load(storageKeys.growth, GROWTH_RECORDS);
export const saveGrowth = (g: GrowthRecord[]): void => save(storageKeys.growth, g);

// Stories
import { STORIES } from "@/data/stories";
export const loadStories = (): Story[] => load(storageKeys.stories, STORIES);
export const saveStories = (s: Story[]): void => save(storageKeys.stories, s);

// Brothers (nuevos hermanos)
export const loadBrothers = (): Brother[] => load(storageKeys.brothers, DEFAULT_BROTHERS);
export const saveBrothers = (b: Brother[]): void => save(storageKeys.brothers, b);

// Family
import { FAMILY_MEMBERS } from "@/data/family";
export const loadFamily = (): FamilyMember[] => load(storageKeys.family, FAMILY_MEMBERS);
export const saveFamily = (f: FamilyMember[]): void => save(storageKeys.family, f);

// Event (único — admin)
export const loadEvent = (): EventDetails => load(storageKeys.event, DEFAULT_EVENT);
export const saveEvent = (e: EventDetails): void => {
  save(storageKeys.event, e);
  // Sync con la lista de eventos (upsert por id)
  syncSingleEventToList(e);
};

// Events — lista múltiple (para /eventos)
// Sincronizada con el evento único: el evento admin se refleja en la lista
const syncSingleEventToList = (event: EventDetails): void => {
  let list = load<EventDetails[] | null>(storageKeys.events, null);
  if (!list) list = [];
  const idx = list.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    list[idx] = event;
  } else {
    list = [...list, event];
  }
  save(storageKeys.events, list);
};

export const loadEvents = (): EventDetails[] => {
  const list = load<EventDetails[] | null>(storageKeys.events, null);
  if (list && list.length > 0) return list;
  // Si no hay lista, migrar el evento único como primer evento
  const single = loadEvent();
  syncSingleEventToList(single);
  return [single];
};
export const saveEvents = (events: EventDetails[]): void => {
  save(storageKeys.events, events);
};

// Buscar evento por ID (para routing /eventos/[id]) — verifica ambos stores
export const findEventById = (id: string): EventDetails | null => {
  const list = load<EventDetails[] | null>(storageKeys.events, null);
  if (list) {
    const found = list.find((e) => e.id === id);
    if (found) return found;
  }
  // Fallback: evento único (legacy) — mapear "matthew-baptism" o el id del default
  const single = loadEvent();
  if (single.id === id) return single;
  return null;
};

// Settings (baby photo, etc.)
export interface AdminSettings {
  babyPhoto?: string;
  babyName?: string;
  babyBirthDate?: string;
}
const DEFAULT_SETTINGS: AdminSettings = {};
export const loadSettings = (): AdminSettings => load(storageKeys.settings, DEFAULT_SETTINGS);
export const saveSettings = (s: AdminSettings): void => save(storageKeys.settings, s);

// Auth
export const auth = {
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKeys.auth) === "true";
  },
  login: (): void => save(storageKeys.auth, true),
  logout: (): void => localStorage.removeItem(storageKeys.auth),
};
