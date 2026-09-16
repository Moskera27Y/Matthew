// src/services/auth.ts
// Login contra /api/admin/login (verificación en SERVIDOR contra ADMIN_TOKEN).
// La contraseña NUNCA vive en el bundle cliente. El token firmado (12h) se guarda
// en sessionStorage y lo adjunta adminService + uploads como Bearer.
import { AuthUser, DEMO_USERS, AUTH_CONFIG, PrivacySettings, PrivacyMode } from "@/lib/auth/config";

const TOKEN_KEY = "mj_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data?.ok || !data?.token) return null;
  sessionStorage.setItem(TOKEN_KEY, data.token);
  return (data.user as AuthUser) || DEMO_USERS[0];
}

export function saveSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_CONFIG.storageKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_CONFIG.storageKey);
  clearAdminToken();
}

export function getPrivacySettings(): PrivacySettings | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_CONFIG.privacyKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PrivacySettings;
  } catch {
    return null;
  }
}

export function savePrivacySettings(settings: PrivacySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_CONFIG.privacyKey, JSON.stringify(settings));
}

export function getDefaultPrivacy(): PrivacySettings {
  return {
    mode: "public",
    password: "",
  };
}
