// src/app/eventos/[id]/page.tsx
// Server Component shell: resuelve `id` para routing + metadata,
// luego delega la lectura de localStorage (cliente) a EventInvitationLoader.
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEventById } from "@/services/adminService";
import EventInvitationLoader from "@/components/events/EventInvitationLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render estática de metadatos: necesita el evento REAL.
// Nota: en servidor localStorage no existe → findEventById cae al evento
// default. La metadata del cliente se hidrata después y usa el evento real.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = findEventById(id);
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
  // El shell server valida que el id exista (default event o lista).
  const exists = !!findEventById(id);
  if (!exists) {
    // notFound() del servidor lanza 404 estático si el id no coincide al
    // menos al default. El loader cliente hará fetch real al montar.
    notFound();
  }
  // autoOpen=true → el sobre se abre con animación al navegar desde /eventos
  return <EventInvitationLoader eventId={id} autoOpen={true} />;
}
