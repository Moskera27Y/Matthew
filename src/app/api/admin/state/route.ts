// src/app/api/admin/state/route.ts
// CRUD cross-device REAL vía Neon PostgreSQL usando @neondatabase/serverless.
// No usa Prisma Client en serverless (evita el pg-TCP pool broken en Edge/Neon).
// Usa sql`...` tagged templates → conexión HTTP a Neon (serverless-friendly).
// GET /api/admin/state  → estado completo desde Neon (o seed defaults si DB vacía).
// POST /api/admin/state → upsert batch de estado admin → Neon.
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { DEFAULT_BROTHERS } from "@/types/brother";
import { DEFAULT_EVENT } from "@/types/event";
import { PHOTOS } from "@/data/photos";
import { MILESTONES } from "@/data/milestones";

const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || "";

let _sql: ReturnType<typeof neon> | null = null;
const getSQL = (): ReturnType<typeof neon> => {
  if (!_sql) _sql = neon(connectionString);
  return _sql;
};

// ---------- Seed idempotente (server-only) ----------
let _seeded = false;
async function ensureSeeded(sql: ReturnType<typeof neon>) {
  if (_seeded) return;
  const [{ count }] = (await sql`SELECT COUNT(*)::int AS count FROM "Brother"`) as any[];
  if (Number(count) === 0) {
    for (const b of DEFAULT_BROTHERS) {
      const { id, name, role, age, photoUrl, message, category, order } = b;
      await sql`INSERT INTO "Brother" (id, name, role, age, "photoUrl", message, category, "order", "createdAt", "updatedAt")
                  VALUES (${id}, ${name}, ${role}, ${age}, ${photoUrl}, ${message}, ${category}, ${order}, NOW(), NOW())
                  ON CONFLICT (id) DO UPDATE SET name=${name}, role=${role}, age=${age}, "photoUrl"=${photoUrl}, message=${message}, category=${category}, "order"=${order}`;
    }
    const { id, title, date, time, location, address, description, thankYouMessage, type: etype, photoUrl } = DEFAULT_EVENT;
    await sql`INSERT INTO "Event" (id, title, date, time, location, address, description, "thankYouMessage", type, "photoUrl", "createdAt", "updatedAt")
                VALUES (${id}, ${title}, ${date}, ${time}, ${location}, ${address}, ${description}, ${thankYouMessage}, ${etype || "bautizo"}, ${photoUrl}, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET title=${title}, date=${date}, time=${time}, location=${location}, address=${address}, description=${description}, "thankYouMessage"=${thankYouMessage}`;
    for (const p of PHOTOS) {
      if (!p.id || !p.src) continue; // skip fotos generadas con src null/undefined
      const { id, src, alt, caption, category } = p;
      await sql`INSERT INTO "Photo" (id, src, alt, caption, category, "createdAt", "updatedAt")
                  VALUES (${id}, ${src}, ${alt || ""}, ${caption || ""}, ${category || "familia"}, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET src=${src}, alt=${alt || ""}, caption=${caption || ""}, category=${category || "familia"}`;
    }
    for (const m of MILESTONES) {
      const { id, title, date: mdate, description, icon } = m;
      await sql`INSERT INTO "Milestone" (id, title, date, description, icon, "createdAt")
                  VALUES (${id}, ${title}, ${mdate}, ${description}, ${icon}, NOW()) ON CONFLICT (id) DO UPDATE SET title=${title}, date=${mdate}, description=${description}, icon=${icon}`;
    }
    for (const [k, v] of Object.entries({ babyPhoto: PHOTOS[0]?.src || "", babyName: "Matthew", babyBirthDate: "2026-07-31" })) {
      await sql`INSERT INTO "Setting" (key, value) VALUES (${k}, ${v ?? ""}) ON CONFLICT (key) DO UPDATE SET value=${v ?? ""}`;
    }
  }
  _seeded = true;
}

export async function GET() {
  try {
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });
    const sql = getSQL();
    await ensureSeeded(sql);
    const brothers: any[] = (await sql`SELECT * FROM "Brother" ORDER BY "createdAt" DESC`) as any[];
    const eventRows: any[] = (await sql`SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 1`) as any[];
    const event = (eventRows[0] && {
      id: eventRows[0].id, title: eventRows[0].title, date: eventRows[0].date, time: eventRows[0].time || "", location: eventRows[0].location || "", address: eventRows[0].address || "", description: eventRows[0].description || "", thankYouMessage: eventRows[0].thankYouMessage || "", type: eventRows[0].type, photoUrl: eventRows[0].photoUrl || "",
    }) || DEFAULT_EVENT;
    const photos: any[] = (await sql`SELECT * FROM "Photo" ORDER BY "createdAt" DESC`) as any[];
    const milestones: any[] = (await sql`SELECT * FROM "Milestone" ORDER BY date ASC`) as any[];
    const settingsRows: any[] = (await sql`SELECT key, value FROM "Setting"`) as any[];
    const brothersMapped = brothers.map((r: any) => ({ id: r.id, name: r.name, role: r.role, age: r.age, photoUrl: r.photoUrl, message: r.message, category: r.category, order: r.order }));
    const photosMapped = photos.map((r: any) => ({ id: r.id, src: r.src, alt: r.alt, caption: r.caption, category: r.category }));
    const milestonesMapped = milestones.map((r: any) => ({ id: r.id, title: r.title, date: r.date, description: r.description, icon: r.icon }));
    const settingMap: Record<string, string> = {};
    for (const s of settingsRows) settingMap[s.key] = s.value ?? "";

    return NextResponse.json(
      {
        brothers: brothersMapped.length ? brothersMapped : DEFAULT_BROTHERS,
        event,
        events: [event],
        photos: photosMapped.length ? photosMapped : PHOTOS,
        milestones: milestonesMapped.length ? milestonesMapped : MILESTONES,
        settings: settingMap,
        source: "server-neon",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    console.error("[api/admin/state] GET failed:", e?.message || e);
    return NextResponse.json({ error: "state unavailable", detail: (e as Error)?.message?.slice(0, 120) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });
    const sql = getSQL();
    await ensureSeeded(sql);
    const body = await req.json();

    if (body.brothers) {
      for (const b of body.brothers) {
        await sql`INSERT INTO "Brother" (id, name, role, age, "photoUrl", message, category, "order", "createdAt", "updatedAt")
                    VALUES (${b.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${b.name}, ${b.role}, ${b.age}, ${b.photoUrl}, ${b.message}, ${b.category}, ${b.order}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET name=${b.name}, role=${b.role}, age=${b.age}, "photoUrl"=${b.photoUrl}, message=${b.message}, category=${b.category}, "order"=${b.order}`;
      }
    }
    if (body.photos) {
      for (const p of body.photos) {
        await sql`INSERT INTO "Photo" (id, src, alt, caption, category, "createdAt", "updatedAt")
                    VALUES (${p.id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${p.src}, ${p.alt}, ${p.caption}, ${p.category}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET src=${p.src}, alt=${p.alt}, caption=${p.caption}, category=${p.category}`;
      }
    }
    if (body.milestones) {
      for (const m of body.milestones) {
        await sql`INSERT INTO "Milestone" (id, title, date, description, icon, "createdAt", "updatedAt")
                    VALUES (${m.id || `m-${Date.now()}`}, ${m.title}, ${m.date}, ${m.description}, ${m.icon}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET title=${m.title}, date=${m.date}, description=${m.description}, icon=${m.icon}`;
      }
    }
    if (body.event) {
      const e = body.event;
      const eid = e.id || DEFAULT_EVENT.id;
      await sql`INSERT INTO "Event" (id, title, date, time, location, address, description, "thankYouMessage", type, "photoUrl", "createdAt", "updatedAt")
                  VALUES (${eid}, ${e.title}, ${e.date}, ${e.time || ""}, ${e.location || ""}, ${e.address || ""}, ${e.description || ""}, ${e.thankYouMessage || ""}, ${e.type || "bautizo"}, ${e.photoUrl || ""}, NOW(), NOW())
                  ON CONFLICT (id) DO UPDATE SET title=${e.title}, date=${e.date}, time=${e.time || ""}, location=${e.location || ""}, address=${e.address || ""}, description=${e.description || ""}, "thankYouMessage"=${e.thankYouMessage || ""}, type=${e.type || "bautizo"}, "photoUrl"=${e.photoUrl || ""}`;
    }
    if (body.settings) {
      for (const [k, v] of Object.entries(body.settings)) {
        await sql`INSERT INTO "Setting" (key, value) VALUES (${k}, ${String(v ?? "")}) ON CONFLICT (key) DO UPDATE SET value=${String(v ?? "")}`;
      }
    }
    if (body.growth) {
      for (const r of body.growth) {
        await sql`INSERT INTO "GrowthRecord" (id, date, "ageString", category, value, unit, percentile, "createdAt")
                    VALUES (${r.id || `g-${Date.now()}`}, ${r.date}, ${r.ageString || null}, ${r.category || null}, ${r.value || null}, ${r.unit || null}, ${r.percentile || null}, NOW())
                    ON CONFLICT (id) DO UPDATE SET "ageString"=${r.ageString || null}, category=${r.category || null}, value=${r.value || null}, unit=${r.unit || null}, percentile=${r.percentile || null}`;
      }
    }
    if (body.family) {
      for (const f of body.family) {
        await sql`INSERT INTO "FamilyMember" (id, name, role, "photoUrl", "createdAt")
                    VALUES (${f.id || `f-${Date.now()}`}, ${f.name}, ${f.role || ""}, ${f.photoUrl || ""}, NOW())
                    ON CONFLICT (id) DO UPDATE SET name=${f.name}, role=${f.role || ""}, "photoUrl"=${f.photoUrl || ""}`;
      }
    }
    _seeded = true;
    return NextResponse.json({ ok: true, source: "server-neon" });
  } catch (e: any) {
    console.error("[api/admin/state] POST failed:", e?.message || e);
    return NextResponse.json({ error: "state save failed", detail: (e as Error)?.message?.slice(0, 120) }, { status: 500 });
  }
}
