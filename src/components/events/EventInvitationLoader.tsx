// src/components/events/EventInvitationLoader.tsx
// Client Component: resuelve el evento REAL desde Prisma/Neon (async) con
// fallback offline (localStorage). Refresca al admin guardar (storage event).
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { findEventById, loadSettings } from "@/services/adminService";
import { DEFAULT_EVENT } from "@/types/event";
import EventInvitationClient from "@/components/events/EventInvitationClient";
import { EventDetails } from "@/types/event";

interface Props {
  eventId: string;
  autoOpen?: boolean;
}

export default function EventInvitationLoader({ eventId, autoOpen = true }: Props) {
  const [event, setEvent] = useState<EventDetails | null>(() => DEFAULT_EVENT);
  const [babyPhoto, setBabyPhoto] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // findEventById ahora es async (Prisma + fallback localStorage)
        const evt = await findEventById(eventId);
        const resolved =
          evt ?? (eventId === "matthew-baptism" ? DEFAULT_EVENT : null);
        if (!cancelled) {
          if (!resolved) {
            notFound();
          } else {
            setEvent(resolved);
          }
        }
        // babyPhoto del evento o de settings
        const settings = await loadSettings();
        if (!cancelled) setBabyPhoto(settings.babyPhoto || resolved?.photoUrl || "");
      } catch {
        // fallback total al default
        if (!cancelled) setEvent(DEFAULT_EVENT);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    // Refrescar cuando el admin guarda (storage event en otra pestaña)
    const onStorage = (e: StorageEvent) => {
      if (
        e.key &&
        (e.key === "mj_admin_event" ||
          e.key === "mj_admin_events" ||
          e.key === "mj_admin_settings")
      ) {
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, [eventId]);

  // Mientras carga el evento REAL, no renderizamos (el evento default está en state)
  if (loading) {
    // Renderizamos con DEFAULT_EVENT sin animación de apertura aún
    return <EventInvitationClient event={DEFAULT_EVENT} babyPhoto={babyPhoto} autoOpen={false} />;
  }

  if (!event) {
    notFound();
  }

  return <EventInvitationClient event={event} babyPhoto={babyPhoto} autoOpen={autoOpen} />;
}
