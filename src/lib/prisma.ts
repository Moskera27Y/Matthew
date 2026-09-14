// src/lib/prisma.ts
// Cliente Prisma singleton con Neon serverless adapter (HTTP).
// Sirve tanto en Server Components / API routes como en Server Actions.
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// En desarrollo reutilizamos instancia (Fast Refresh no recrea cliente).
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    // Puedes activar logs: logging: ["query"] en dev si lo necesitas.
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;
