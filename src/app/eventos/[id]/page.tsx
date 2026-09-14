// src/app/eventos/[id]/page.tsx
// Server Component shell: resuelve `id` para routing + metadata,
// luego delega la lectura de DB al EventInvitationLoader (cliente).
// ⚠️ generateMetadata corre en SERVER → NO usar findEventById (adminService):
// hace fetch("/api/...") con URL relativa → falla en Server Component.
// Usar findEventByIdServer (serverState.ts: Neon directo) → seguro server-side.
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEventByIdServer } from "@/lib/serverState";
import { DEFAULT_EVENT } from "@/types/event";
import EventInvitationLoader from "@/components/events/EventInvitationLoader";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render estática de metadatos: necesita el evento REAL desde la DB (server-only).
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await findEventByIdServer(id);
  if (!event) return { title: "Evento no encontrado" };
  return {
    title: event.title,
    description: event.description || "Invitación de Matthew Journal",
  };
}

export default async function EventInvitationPage({ params }: PageProps) {
  const { id } = await params;
  // El shell server valida que el id exista (default event or DB).
  // findEventByIdServer consulta Neon directamente → funciona server-side.
  const event = await findEventByIdServer(id);
  if (!event && id !== "matthew-baptism" && id !== DEFAULT_EVENT.id) {
    // 404 estático si el id no existe ni como default.
    notFound();
  }
  // autoOpen=false → sobre cerrado hasta click (profesional: el user abre voluntariamente)
  return <EventInvitationLoader eventId={id} autoOpen={false} />;
}
