// src/services/adminService.ts
// Persistencia REAL: Prisma Client → Neon PostgreSQL (cross-device).
// Migrado de localStorage. Los datos default se hacen seed en caliente
// cuando la DB está vacía (upsert), así móvil y desktop ven lo mismo.
import { PrismaClient } from "@prisma/client";
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

// Singleton de Prisma (instancia única en serverless / dev)
declare global {
  // eslint-disable-next-line no-var
  var __prismaAdminDB: PrismaClient | undefined;
}

let _db: PrismaClient | null = null;
const getDB = (): PrismaClient => {
  // En serverless (Vercel) no se reutiliza conexión entre invocaciones,
  // pero el singleton evita recrear engine en dev.
  if (process.env.NODE_ENV !== "production") {
    if (globalThis.__prismaAdminDB) return globalThis.__prismaAdminDB;
  }
  if (!_db) {
    _db = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") globalThis.__prismaAdminDB = _db;
  }
  return _db;
};

// Keys de localStorage — se conservan como fallback OFFLINE (browser) para que
// el admin local siga funcionando si Neon no responde (network fallback).
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

// ---------- Seed automático ----------
// Si la DB está vacía, inserta los datos defaults (idempotente upsert).
let _seeded = false;
async function ensureSeeded() {
  if (_seeded) return;
  const db = getDB();
  const brothersCount = await db.brother.count();
  if (brothersCount === 0) {
    // Upsert DEFAULT_BROTHERS + DEFAULT_EVENT + DEFAULT_PHOTOS
    for (const b of DEFAULT_BROTHERS) {
      await db.brother.upsert({
        where: { id: b.id },
        update: { ...b, id: b.id },
        create: { ...b },
      });
    }
    // Evento default
    await db.event.upsert({
      where: { id: DEFAULT_EVENT.id },
      update: { ...DEFAULT_EVENT },
      create: { ...DEFAULT_EVENT },
    });
    // Fotos default
    for (const p of PHOTOS) {
      await db.photo.upsert({
        where: { id: p.id },
        update: { ...p, id: p.id },
        create: { ...p },
      });
    }
    // Milestones, growth, family, settings
    await db.milestone.createMany({ data: MILESTONES, skipDuplicates: true });
    await db.growthRecord.createMany({ data: GROWTH_RECORDS, skipDuplicates: true });
    await db.familyMember.createMany({ data: FAMILY_MEMBERS, skipDuplicates: true });
    await db.setting.upsert({
      where: { key: "babyPhoto" },
      update: { value: PHOTOS[0]?.src || "" },
      create: { key: "babyPhoto", value: PHOTOS[0]?.src || "" },
    });
    await db.setting.upsert({
      where: { key: "babyName" },
      update: { value: "Matthew" },
      create: { key: "babyName", value: "Matthew" },
    });
    await db.setting.upsert({
      where: { key: "babyBirthDate" },
      update: { value: "2026-07-31" },
      create: { key: "babyBirthDate", value: "2026-07-31" },
    });
  }
  _seeded = true;
}

// Wrapper con fallback offline: si Prisma/DB falla, usamos localStorage
// (browser-side). Esto mantiene el admin funcional offline.
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
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (err: any) {
    console.error(`[adminService] localStorage save("${key}") falló:`, err?.message || err);
  }
}

// ---------- Helpers de fallback online/offline ----------
async function fetchDB<T>(
  fn: () => Promise<T>,
  fallbackKey: string,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[adminService] DB fallback → localStorage (${(err as Error)?.message?.slice(0, 80)})`);
    return safeParse(fallbackKey, fallback);
  }
}

// ==================== BROTHERS ====================
export const loadBrothers = async (): Promise<Brother[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const rows = await getDB().brother.findMany({ orderBy: { createdAt: "desc" } });
      return rows as unknown as Brother[];
    },
    storageKeys.brothers,
    DEFAULT_BROTHERS
  );
};

export const saveBrothers = async (brothers: Brother[]): Promise<void> => {
  // Persistir a DB
  try {
    await ensureSeeded();
    const db = getDB();
    await db.$transaction(async (tx) => {
      // Upsert cada hermano (preserva ids existentes)
      for (const b of brothers) {
        await tx.brother.upsert({
          where: { id: b.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
          update: { name: b.name, role: b.role, age: b.age, photoUrl: b.photoUrl, message: b.message, category: b.category },
          create: { id: b.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: b.name, role: b.role, age: b.age, photoUrl: b.photoUrl, message: b.message, category: b.category },
        });
      }
    });
  } catch (err) {
    console.warn("[adminService] saveBrothers DB failed → fallback localStorage", (err as Error)?.message?.slice(0, 80));
  }
  // Siempre mirror a localStorage (offline cache)
  safeSet(storageKeys.brothers, brothers);
};

// ==================== EVENTS ====================
export const loadEvent = async (): Promise<EventDetails> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const evt = await getDB().event.findFirst({ orderBy: { createdAt: "desc" } });
      return (evt as unknown as EventDetails) || DEFAULT_EVENT;
    },
    storageKeys.event,
    DEFAULT_EVENT
  );
};

export const saveEvent = async (event: EventDetails): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    await db.event.upsert({
      where: { id: event.id || DEFAULT_EVENT.id },
      update: {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        address: event.address,
        description: event.description,
        thankYouMessage: event.thankYouMessage,
        type: event.type,
        photoUrl: event.photoUrl,
      },
      create: {
        id: event.id || DEFAULT_EVENT.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        address: event.address,
        description: event.description,
        thankYouMessage: event.thankYouMessage,
        type: event.type || "bautizo",
        photoUrl: event.photoUrl,
      },
    });
  } catch (err) {
    console.warn("[adminService] saveEvent DB failed → fallback", (err as Error)?.message?.slice(0, 80));
  }
  safeSet(storageKeys.event, event);
};

export const loadEvents = async (): Promise<EventDetails[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const rows = await getDB().event.findMany({ orderBy: { date: "desc" } });
      return rows as unknown as EventDetails[];
    },
    storageKeys.events,
    [DEFAULT_EVENT]
  );
};

export const saveEvents = async (events: EventDetails[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    await db.$transaction(async (tx) => {
      for (const e of events) {
        await tx.event.upsert({
          where: { id: e.id || DEFAULT_EVENT.id },
          update: { title: e.title, date: e.date, time: e.time, location: e.location, address: e.address, description: e.description, thankYouMessage: e.thankYouMessage, type: e.type, photoUrl: e.photoUrl },
          create: { id: e.id || DEFAULT_EVENT.id, title: e.title, date: e.date, time: e.time, location: e.location, address: e.address, description: e.description, thankYouMessage: e.thankYouMessage, type: e.type || "bautizo", photoUrl: e.photoUrl },
        });
      }
    });
  } catch (err) {
    console.warn("[adminService] saveEvents DB failed → fallback", (err as Error)?.message?.slice(0, 80));
  }
  safeSet(storageKeys.events, events);
};

export const findEventById = async (id: string): Promise<EventDetails | null> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const evt = await getDB().event.findUnique({ where: { id } });
      if (evt) return evt as unknown as EventDetails;
      // Map legacy ids del default
      if (id === "matthew-baptism" || id === DEFAULT_EVENT.id) return DEFAULT_EVENT;
      return null;
    },
    storageKeys.events,
    null
  );
};

// ==================== PHOTOS ====================
export const loadPhotos = async (): Promise<Photo[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const rows = await getDB().photo.findMany({ orderBy: { createdAt: "desc" } });
      return rows as unknown as Photo[];
    },
    storageKeys.photos,
    PHOTOS
  );
};

export const savePhotos = async (photos: Photo[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    await db.$transaction(async (tx) => {
      for (const p of photos) {
        await tx.photo.upsert({
          where: { id: p.id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
          update: { src: p.src, alt: p.alt, caption: p.caption, category: p.category },
          create: { id: p.id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, src: p.src, alt: p.alt, caption: p.caption, category: p.category },
        });
      }
    });
  } catch (err) {
    console.warn("[adminService] savePhotos DB failed → fallback", (err as Error)?.message?.slice(0, 80));
  }
  safeSet(storageKeys.photos, photos);
};

// ==================== MILESTONES ====================
export const loadMilestones = async (): Promise<Milestone[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      return (await getDB().milestone.findMany({ orderBy: { date: "asc" } })) as unknown as Milestone[];
    },
    storageKeys.milestones,
    MILESTONES
  );
};

export const saveMilestones = async (milestones: Milestone[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    for (const m of milestones) {
      await db.milestone.upsert({
        where: { id: m.id || `m-${Date.now()}` },
        update: { title: m.title, date: m.date, description: m.description, icon: m.icon },
        create: { id: m.id || `m-${Date.now()}`, title: m.title, date: m.date, description: m.description, icon: m.icon },
      });
    }
  } catch (err) {
    console.warn("[adminService] saveMilestones fallback");
  }
  safeSet(storageKeys.milestones, milestones);
};

// ==================== GROWTH ====================
export const loadGrowth = async (): Promise<GrowthRecord[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      return (await getDB().growthRecord.findMany({ orderBy: { date: "asc" } })) as unknown as GrowthRecord[];
    },
    storageKeys.growth,
    GROWTH_RECORDS
  );
};
export const saveGrowth = async (g: GrowthRecord[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    for (const r of g) {
      await db.growthRecord.upsert({
        where: { id: r.id || `g-${Date.now()}` },
        update: { ...r },
        create: { ...r, id: r.id || `g-${Date.now()}` },
      });
    }
  } catch { /* fallback */ }
  safeSet(storageKeys.growth, g);
};

// ==================== STORIES (legacy — se preserva por compat) ====================
export const loadStories = async (): Promise<Story[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      return (await getDB().story.findMany({ orderBy: { createdAt: "desc" } })) as unknown as Story[];
    },
    storageKeys.stories,
    STORIES
  );
};
export const saveStories = async (s: Story[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    for (const r of s) {
      await db.story.upsert({
        where: { id: r.id || `s-${Date.now()}` },
        update: { ...r },
        create: { ...r, id: r.id || `s-${Date.now()}` },
      });
    }
  } catch { /* fallback */ }
  safeSet(storageKeys.stories, s);
};

// ==================== FAMILY ====================
export const loadFamily = async (): Promise<FamilyMember[]> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      return (await getDB().familyMember.findMany({ orderBy: { name: "asc" } })) as unknown as FamilyMember[];
    },
    storageKeys.family,
    FAMILY_MEMBERS
  );
};
export const saveFamily = async (f: FamilyMember[]): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    for (const r of f) {
      await db.familyMember.upsert({
        where: { id: r.id || `f-${Date.now()}` },
        update: { ...r },
        create: { ...r, id: r.id || `f-${Date.now()}` },
      });
    }
  } catch { /* fallback */ }
  safeSet(storageKeys.family, f);
};

// ==================== SETTINGS ====================
export interface AdminSettings {
  babyPhoto?: string;
  babyName?: string;
  babyBirthDate?: string;
}
const DEFAULT_SETTINGS: AdminSettings = {};

export const loadSettings = async (): Promise<AdminSettings> => {
  return fetchDB(
    async () => {
      await ensureSeeded();
      const rows = await getDB().setting.findMany();
      const out: AdminSettings = {};
      for (const r of rows) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (out as any)[r.key] = r.value;
      }
      return out;
    },
    storageKeys.settings,
    DEFAULT_SETTINGS
  );
};
export const saveSettings = async (s: AdminSettings): Promise<void> => {
  try {
    await ensureSeeded();
    const db = getDB();
    for (const [k, v] of Object.entries(s)) {
      await db.setting.upsert({
        where: { key: k },
        update: { value: v ?? "" },
        create: { key: k, value: v ?? "" },
      });
    }
  } catch { /* fallback */ }
  safeSet(storageKeys.settings, s);
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
