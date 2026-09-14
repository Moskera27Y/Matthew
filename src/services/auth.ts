// src/services/auth.ts
import { AuthUser, DEMO_USERS, DEMO_CREDENTIALS, AUTH_CONFIG, PrivacySettings, PrivacyMode } from "@/lib/auth/config";

export function authenticate(email: string, password: string): AuthUser | null {
  if (
    email === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    return DEMO_USERS[0];
  }
  return null;
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
    password: "matthew123",
  };
}
