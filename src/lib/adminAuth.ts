// src/lib/adminAuth.ts — SERVER ONLY (importar solo en route handlers).
// El secreto ADMIN_TOKEN vive en env (Vercel + .env.local), NUNCA en el bundle cliente.
// Login: POST /api/admin/login verifica la contraseña y firma un token con
// expiración (HMAC-SHA256). Los writes (POST/DELETE state, POST upload) lo exigen.
import { createHmac, timingSafeEqual, createHash } from "crypto";

const TOKEN = process.env.ADMIN_TOKEN || "";
const TTL_MS = 12 * 60 * 60 * 1000; // 12h

function hmac(data: string): string {
  return createHmac("sha256", TOKEN).update(data).digest("hex");
}

export function signAdminToken(): string | null {
  if (!TOKEN) return null;
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${hmac(exp)}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!TOKEN || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = hmac(exp);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

// Comparación timing-safe de la contraseña contra ADMIN_TOKEN.
export function checkAdminPassword(input: string): boolean {
  if (!TOKEN || !input) return false;
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(TOKEN, "utf8").digest();
  return timingSafeEqual(a, b);
}

export function bearerFrom(req: Request): string | null {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
