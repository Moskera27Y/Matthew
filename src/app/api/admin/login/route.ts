// POST /api/admin/login — verifica credenciales en SERVIDOR y firma un token (12h).
// Body: { email, password }. La contraseña se compara contra ADMIN_TOKEN (env,
// nunca en el cliente). Responde { ok, token, user } o 401 genérico (sin revelar
// si falló el email o la clave).
import { NextResponse } from "next/server";
import { checkAdminPassword, signAdminToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@matthew-journal.com";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (email !== ADMIN_EMAIL.toLowerCase() || !checkAdminPassword(password)) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }
    const token = signAdminToken();
    if (!token) {
      return NextResponse.json({ error: "ADMIN_TOKEN no configurado" }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      token,
      user: { id: "1", name: "Cristian Mosquera", email: ADMIN_EMAIL, role: "admin" },
    });
  } catch {
    return NextResponse.json({ error: "login failed" }, { status: 500 });
  }
}
