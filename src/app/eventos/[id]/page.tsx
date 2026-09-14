// src/app/eventos/[id]/page.tsx
// Server Component shell: resuelve `id` para routing + metadata,
// luego delega la lectura de DB (Prisma/Neon) al EventInvitationLoader (cliente).
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEventById } from "@/services/adminService";
import { DEFAULT_EVENT } from "@/types/event";
import EventInvitationLoader from "@/components/events/EventInvitationLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render estática de metadatos: necesita el evento REAL desde la DB.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await findEventById(id);
  if (!event) {
    return { title: "Evento no encontrado" };
  }
  return {
    title: event.title,
    description: event.description || "Invitación de Matthew Journal",
  };
}

export default async function EventInvitationPage({ params }: PageProps) {
  const { id } = await params;
  // El shell server valida que el id exista (default event or DB).
  // findEventById es async (Prisma + fallback offline).
  const event = await findEventById(id);
  if (!event && id !== "matthew-baptism" && id !== DEFAULT_EVENT.id) {
    // 404 estático si el id no existe ni como default.
    notFound();
  }
  // autoOpen=true → el sobre se abre con animación al navegar desde /eventos
  return <EventInvitationLoader eventId={id} autoOpen={true} />;
}
