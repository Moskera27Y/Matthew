// src/components/events/EventInvitationLoader.tsx
// Client Component: resuelve el evento REAL desde localStorage (cliente)
// y lo pasa al EventInvitationClient. Reacciona a cambios del admin (storage event).
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { findEventById, loadSettings } from "@/services/adminService";
import EventInvitationClient from "@/components/events/EventInvitationClient";
import { EventDetails } from "@/types/event";

interface Props {
  eventId: string;
  autoOpen?: boolean;
}

export default function EventInvitationLoader({ eventId, autoOpen = true }: Props) {
  const [event, setEvent] = useState<EventDetails | null>(() => findEventById(eventId));
  const [babyPhoto, setBabyPhoto] = useState<string>(() => loadSettings().babyPhoto || "");

  useEffect(() => {
    // Cargar en cliente (localStorage disponible) — esto garantiza el evento REAL
    const evt = findEventById(eventId);
    if (evt) {
      setEvent(evt);
    } else {
      // Si el id no existe en cliente (ej: default al cargar), refrescar al storage event
      setEvent(findEventById(eventId) ?? null);
    }
    setBabyPhoto(loadSettings().babyPhoto || "");

    // Escuchar cambios: cuando el admin guarda el evento, refrescamos
    const onStorage = (e: StorageEvent) => {
      if (
        e.key &&
        (e.key === "mj_admin_event" || e.key === "mj_admin_events" || e.key === "mj_admin_settings")
      ) {
        const fresh = findEventById(eventId);
        // Sólo actualizamos si el evento real existe para este id
        if (fresh) setEvent(fresh);
        setBabyPhoto(loadSettings().babyPhoto || "");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [eventId]);

  // Si no hay evento (ni default ni lista), 404 cliente
  if (!event) {
    notFound();
  }

  return <EventInvitationClient event={event} babyPhoto={babyPhoto} autoOpen={autoOpen} />;
}
