// src/app/invite/[token]/page.tsx
import EventInvitationClient from "@/components/events/EventInvitationClient";
import { loadEvent, loadSettings } from "@/services/adminService";
import { validateInvitationToken } from "@/services/invitationService";
import { Metadata } from "next";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { token } = await params;
  const event = loadEvent();
  if (!event || !event.title) {
    return { title: "Invitación no válida" };
  }
  return {
    title: event.title,
    description: event.description || "Invitación de Matthew Journal",
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  if (!validateInvitationToken(token)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-heading-bold text-charcoal">Invitación no válida</h1>
      </div>
    );
  }

  const event = loadEvent();

  if (!event || !event.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-heading-bold text-charcoal">Evento no encontrado</h1>
      </div>
    );
  }

  const settings = loadSettings();

  // Renderiza el sobre animado premium — conecta con el admin
  // autoOpen={false} → sobre inicia cerrado; el usuario da click para abrir la animación
  return <EventInvitationClient event={event} babyPhoto={settings?.babyPhoto || ""} autoOpen={false} />;
}
