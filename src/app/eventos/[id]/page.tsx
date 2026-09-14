// src/app/eventos/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEventById, loadSettings } from "@/services/adminService";
import EventInvitationClient from "@/components/events/EventInvitationClient";
import { EventDetails } from "@/types/event";

// Server Component: loads event from localStorage on server via headers fallback
export const dynamic = "force-dynamic"; // para leer localStorage del cliente

interface PageProps {
  params: Promise<{ id: string }>;
}

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
  const event = findEventById(id);

  if (!event) {
    notFound();
  }

  const settings = loadSettings();

  // autoOpen=true (default) → el sobre se abre con animación al navegar desde /eventos
  return <EventInvitationClient event={event} babyPhoto={settings?.babyPhoto || ""} autoOpen={true} />;
}
