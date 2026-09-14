// src/app/invite/[token]/page.tsx
// Server Component: valida token + carga evento/settings desde DB (server-only, Neon directo).
// ⚠️ NO usar loadEvent()/loadSettings() (adminService) aquí: hacen fetch("/api/...") con
// URL relativa → falla en Server Components (Node sin contexto browser → 500 silent).
// serverState.ts consulta Neon directamente → funciona server-side.
import EventInvitationClient from "@/components/events/EventInvitationClient";
import { getEventServer, getSettingsServer } from "@/lib/serverState";
import { validateInvitationToken } from "@/services/invitationService";
import { Metadata } from "next";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { token } = await params;
  if (!validateInvitationToken(token)) return { title: "Invitación no válida" };
  const event = await getEventServer();
  if (!event || !event.title) return { title: "Invitación no válida" };
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

  // Lectura server-only directa a Neon → evento REAL + settings REAL (foto bebé)
  const [event, settings] = await Promise.all([getEventServer(), getSettingsServer()]);

  if (!event || !event.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-heading-bold text-charcoal">Evento no encontrado</h1>
      </div>
    );
  }

  // Renderiza el sobre animado premium — autoOpen={false}: sobre cerrado, click para abrir
  return <EventInvitationClient event={event} babyPhoto={settings?.babyPhoto || ""} autoOpen={false} />;
}
