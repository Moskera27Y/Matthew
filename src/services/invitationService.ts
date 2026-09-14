// src/services/invitationService.ts
// Server-safe validation: NO usa localStorage (rompe SSR en Server Components).
// El token de invitación es el event.id (ej: "matthew-baptism"). Valida contra Neon.
import { EventDetails } from "@/types/event";

const INVITATION_TOKEN_KEY = "mj_admin_invitation_token";

/** Genera un token único para invitación (usado en admin event save flow). */
export function generateInvitationToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const random2 = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}-${random2}`.toUpperCase();
}

/** Guarda el token de invitación en localStorage (browser-only). */
export function saveInvitationToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INVITATION_TOKEN_KEY, token);
}

/** Carga el token de invitación guardado (browser-only). */
export function loadInvitationToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INVITATION_TOKEN_KEY);
}

/** Link de invitación (SSR-safe: usa NEXT_PUBLIC_SITE_URL, no window). */
export function generateInvitationLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matthew-journal.vercel.app";
  return `${baseUrl}/invite/${token}`;
}

/**
 * Valida un token de invitación.
 * Server-safe: NO usa localStorage. El token puede ser:
 *  - un event.id (ej: "matthew-baptism"), o
 *  - un token UUID generado (TIMESTAMP-RANDOM-RANDOM).
 * En Server Component, el caller usa findEventByIdServer() para validar contra Neon;
 * aquí validamos el FORMATO UUID y también aceptamos event.ids alfanuméricos con guiones.
 */
export function validateInvitationToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  // UUID token generado: TIMESTAMP-RANDOM-RANDOM (6+ chars cada parte)
  const uuidPattern = /^[A-Za-z0-9]+-[A-Za-z0-9]{4,}-[A-Za-z0-9]{4,}$/;
  if (uuidPattern.test(token)) return true;
  // Event ID slug (ej: matthew-baptism, bautizo-matthew) — acepta letras, números, guiones
  const slugPattern = /^[A-Za-z0-9][A-Za-z0-9\-_]{2,62}[A-Za-z0-9]$/;
  return slugPattern.test(token);
}

