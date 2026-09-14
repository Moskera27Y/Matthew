// src/lib/serverState.ts
import "server-only";
import { neon } from "@neondatabase/serverless";
import { EventDetails, DEFAULT_EVENT } from "@/types/event";

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";
let _sql: ReturnType<typeof neon> | null = null;
const getSQL = (): ReturnType<typeof neon> => {
  if (!_sql) _sql = neon(connectionString);
  return _sql;
};

export async function getEventServer(): Promise<EventDetails> {
  if (!connectionString) return DEFAULT_EVENT;
  try {
    const sql = getSQL();
    const rows = (await sql`SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 1`) as any[];
    const r = rows[0];
    if (!r) return DEFAULT_EVENT;
    return {
      id: r.id, title: r.title, date: r.date, time: r.time || "",
      location: r.location || "", address: r.address || "",
      description: r.description || "", thankYouMessage: r.thankYouMessage || "",
      type: r.type, photoUrl: r.photoUrl || "", isPublic: r.isPublic ?? true, isEnabled: r.isEnabled ?? true,
    };
  } catch (e: any) {
    console.error("[serverState] getEventServer failed:", e?.message);
    return DEFAULT_EVENT;
  }
}

// Busca evento por id (usado por /eventos/[id] → invitación con token único)
export async function findEventByIdServer(id: string): Promise<EventDetails | null> {
  if (!connectionString) return id === DEFAULT_EVENT.id ? DEFAULT_EVENT : null;
  try {
    const sql = getSQL();
    const rows = (await sql`SELECT * FROM "Event" WHERE id = ${id}`) as any[];
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id, title: r.title, date: r.date, time: r.time || "",
      location: r.location || "", address: r.address || "",
      description: r.description || "", thankYouMessage: r.thankYouMessage || "",
      type: r.type, photoUrl: r.photoUrl || "", isPublic: r.isPublic ?? true, isEnabled: r.isEnabled ?? true,
    };
  } catch (e: any) {
    console.error("[serverState] findEventByIdServer failed:", e?.message);
    if (id === DEFAULT_EVENT.id) return DEFAULT_EVENT;
    return null;
  }
}

// Genera el link público de invitación (usado por /eventos/[id])
export function generateInvitationLink(id: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "https://matthew-journal.vercel.app";
  return `${base}/invite/${encodeURIComponent(id)}`;
}

export async function getSettingsServer(): Promise<Record<string, string>> {
  if (!connectionString) return {};
  try {
    const sql = getSQL();
    const rows = (await sql`SELECT key, value FROM "Setting"`) as any[];
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value ?? "";
    return map;
  } catch (e: any) {
    console.error("[serverState] getSettingsServer failed:", e?.message);
    return {};
  }
}
