// src/hooks/useAdminData.ts
// Hook cliente: data de admin desde Prisma/Neon (async) con fallback offline.
// First-paint usa constants estáticas (no loaders async), evitando renders
// de loading. El fetch async corrige a datos reales DB en mount.
"use client";

import { useState, useEffect, useCallback } from "react";
import { Milestone } from "@/types/milestone";
import { MILESTONES } from "@/data/milestones";
import { Photo } from "@/types/photo";
import { PHOTOS } from "@/data/photos";
import { GrowthRecord } from "@/types/growth";
import { GROWTH_RECORDS } from "@/data/growth";
import { Story } from "@/types/story";
import { STORIES } from "@/data/stories";
import { Brother, DEFAULT_BROTHERS } from "@/types/brother";
import { FamilyMember } from "@/types/family";
import { FAMILY_MEMBERS } from "@/data/family";
import { EventDetails, DEFAULT_EVENT } from "@/types/event";
import {
  loadMilestones,
  loadPhotos,
  loadGrowth,
  loadStories,
  loadBrothers,
  loadFamily,
  loadSettings,
  loadEvent,
  storageKeys,
} from "@/services/adminService";
import type { AdminSettings } from "@/services/adminService";

export function useAdminData() {
  // First-paint: constants estáticas (offline fallback determinista)
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [photos, setPhotos] = useState<Photo[]>(PHOTOS);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(GROWTH_RECORDS);
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [brothers, setBrothers] = useState<Brother[]>(DEFAULT_BROTHERS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(FAMILY_MEMBERS);
  const [babyPhoto, setBabyPhoto] = useState<string>("");
  const [event, setEvent] = useState<EventDetails>(DEFAULT_EVENT);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [m, p, g, s, b, f, e, st] = await Promise.all([
        loadMilestones(),
        loadPhotos(),
        loadGrowth(),
        loadStories(),
        loadBrothers(),
        loadFamily(),
        loadEvent(),
        loadSettings(),
      ]);
      setMilestones(m);
      setPhotos(p);
      setGrowthRecords(g);
      setStories(s);
      setBrothers(b);
      setFamilyMembers(f);
      setEvent(e);
      setBabyPhoto((st as AdminSettings)?.babyPhoto || "");
    } catch {
      // keep defaults on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const handleStorageChange = (e: StorageEvent) => {
      if (Object.values(storageKeys).includes(e.key!)) {
        loadAll();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadAll]);

  return {
    milestones,
    photos,
    growthRecords,
    stories,
    brothers,
    familyMembers,
    babyPhoto,
    event,
    isLoading,
    refresh: loadAll,
  };
}

// Hook light para events-list (solo eventos)
export function useEvents() {
  const [events, setEvents] = useState<EventDetails[]>([DEFAULT_EVENT]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const e = await loadEvents();
        if (!cancelled) setEvents(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  return { events, loading };
}

// import al final del archivo (no conflict con uso arriba)
import { loadEvents } from "@/services/adminService";
