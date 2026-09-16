// src/lib/auth/config.ts
// Configuración de autenticación
// Versión MVP: localStorage para persistencia
// Migración futura: NextAuth.js + Prisma adapter

export const AUTH_CONFIG = {
  // Clave para localStorage
  storageKey: "matthew_journal_auth",
  // Clave para settings de privacidad
  privacyKey: "matthew_journal_privacy",
  // Roles permitidos
  roles: ["admin", "editor", "viewer"] as const,
  // Email del admin (para demo)
  adminEmail: "admin@matthew-journal.com",
};

export type PrivacyMode = "public" | "private" | "protected";

export interface PrivacySettings {
  mode: PrivacyMode;
  password: string;
}

// Datos de usuarios (mock temporal)
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  image?: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: "1",
    name: "Cristian Mosquera",
    email: "admin@matthew-journal.com",
    role: "admin",
    image: "/images/placeholder-gallery.svg",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@matthew-journal.com",
    role: "editor",
    image: "/images/placeholder-gallery.svg",
  },
];

// Email del admin para el login (la CONTRASEÑA vive solo en el servidor:
// env ADMIN_TOKEN. Nunca hardcodear secretos en este archivo — llega al bundle).
export const DEMO_CREDENTIALS = {
  email: "admin@matthew-journal.com",
};
