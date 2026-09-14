// src/hooks/useAdminData.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { Milestone } from "@/types/milestone";
import { Photo } from "@/types/photo";
import { GrowthRecord } from "@/types/growth";
import { Story } from "@/types/story";
import { Brother } from "@/types/brother";
import { FamilyMember } from "@/types/family";
import { EventDetails } from "@/types/event";
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

export function useAdminData() {
  const [milestones, setMilestones] = useState<Milestone[]>(() => loadMilestones());
  const [photos, setPhotos] = useState<Photo[]>(() => loadPhotos());
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(() => loadGrowth());
  const [stories, setStories] = useState<Story[]>(() => loadStories());
  const [brothers, setBrothers] = useState<Brother[]>(() => loadBrothers());
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => loadFamily());
  const [babyPhoto, setBabyPhoto] = useState<string>(() => loadSettings().babyPhoto || "");
  const [event, setEvent] = useState<EventDetails>(() => loadEvent());

  const loadAll = useCallback(() => {
    setMilestones(loadMilestones());
    setPhotos(loadPhotos());
    setGrowthRecords(loadGrowth());
    setStories(loadStories());
    setBrothers(loadBrothers());
    setFamilyMembers(loadFamily());
    setEvent(loadEvent());
    setBabyPhoto(loadSettings().babyPhoto || "");
  }, []);

  // Cargar datos inicialmente + escuchar cambios
  useEffect(() => {
    loadAll();
    // Escuchar cambios en localStorage en tiempo real (otra pestaña/admin)
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
    refresh: loadAll,
  };
}
