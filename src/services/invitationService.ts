// src/services/invitationService.ts
import { EventDetails } from "@/types/event";
import { loadSettings, saveSettings, AdminSettings } from "@/services/adminService";

const INVITATION_TOKEN_KEY = "mj_admin_invitation_token";

/**
 * Genera un token único para la invitación
 */
export function generateInvitationToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const random2 = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}-${random2}`.toUpperCase();
}

/**
 * Guarda el token de invitación en localStorage
 */
export function saveInvitationToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INVITATION_TOKEN_KEY, token);
}

/**
 * Carga el token de invitación guardado
 */
export function loadInvitationToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INVITATION_TOKEN_KEY);
}

/**
 * Genera un link de invitación con el token
 */
export function generateInvitationLink(token: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/invite/${token}`;
}

/**
 * Valida un token (formato básico)
 */
export function validateInvitationToken(token: string): boolean {
  return /^[A-Z0-9]+-[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(token);
}
