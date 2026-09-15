// src/app/api/admin/state/route.ts
// CRUD cross-device REAL vía Neon PostgreSQL usando @neondigital/serverless.
// No usa Prisma Client en serverless (evita el pg-TCP pool broken en Edge/Neon).
// Usa sql`...` tagged templates → conexión HTTP a Neon (serverless-friendly).
// GET /api/admin/state  → estado completo desde Neon (o seed defaults si DB vacía).
// POST /api/admin/state → UPSERT batch de estado admin → Neon (NO sync-delete:
// el borrado explícito se hace vía DELETE /api/admin/state?id=X&table=photos).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { DEFAULT_BROTHERS } from "@/types/brother";
import { DEFAULT_EVENT } from "@/types/event";
import { PHOTOS } from "@/data/photos";
import { MILESTONES } from "@/data/milestones";
import { FAMILY_MEMBERS } from "@/data/family";

const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || "";

let _sql: ReturnType<typeof neon> | null = null;
const getSQL = (): ReturnType<typeof neon> => {
  if (!_sql) _sql = neon(connectionString);
  return _sql;
};

// ---------- Seed idempotente POR TABLA (verifica cada tabla individualmente) ----------
let _seeded = false;
async function ensureSeeded(sql: ReturnType<typeof neon>) {
  if (_seeded) return;
  // BROTHERS
  const bc = (await sql`SELECT COUNT(*)::int AS c FROM "Brother"` as any[])[0]?.c ?? "0";
  if (Number(bc) === 0) {
    for (const b of DEFAULT_BROTHERS) {
      const { id, name, role, age, photoUrl, message, category, order } = b;
      await sql`INSERT INTO "Brother" (id, name, role, age, "photoUrl", message, category, "order", "createdAt", "updatedAt")
                  VALUES (${id}, ${name}, ${role}, ${age}, ${photoUrl}, ${message}, ${category}, ${order}, NOW(), NOW())
                  ON CONFLICT (id) DO UPDATE SET name=${name}, role=${role}, age=${age}, "photoUrl"=${photoUrl}, message=${message}, category=${category}, "order"=${order}`;
    }
  }
  // EVENT
  const ec = (await sql`SELECT COUNT(*)::int AS c FROM "Event"` as any[])[0]?.c ?? "0";
  if (Number(ec) === 0) {
    const { id, title, date, time, location, address, description, thankYouMessage, type: etype, photoUrl } = DEFAULT_EVENT;
    await sql`INSERT INTO "Event" (id, title, date, time, location, address, description, "thankYouMessage", type, "photoUrl", "isPublic", "isEnabled", "createdAt", "updatedAt")
                VALUES (${id}, ${title}, ${date}, ${time}, ${location}, ${address}, ${description}, ${thankYouMessage}, ${etype || "bautizo"}, ${photoUrl}, true, true, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET title=${title}, date=${date}, time=${time}, location=${location}, address=${address}, description=${description}, "thankYouMessage"=${thankYouMessage}`;
  }
  // PHOTOS: NO seedear placeholders (confunde al user). La galería usa el fallback
  // /data/photos en el cliente cuando Neon está empty; el admin sube → POST persiste Blob URLs.
  // Si la tabla Photo está empty, no insertamos nada → homepage fallback a PHOTOS estático.
  // (Anteriormente seedeaba PHOTOS que eran placeholders → aparecían "fotos" falsas.)
  // MILESTONES
  const mc = (await sql`SELECT COUNT(*)::int AS c FROM "Milestone"` as any[])[0]?.c ?? "0";
  if (Number(mc) === 0) {
    for (const m of MILESTONES) {
      const { id, title, date: mdate, description, icon } = m;
      await sql`INSERT INTO "Milestone" (id, title, date, description, icon, "createdAt")
                  VALUES (${id}, ${title}, ${mdate}, ${description}, ${icon}, NOW()) ON CONFLICT (id) DO UPDATE SET title=${title}, date=${mdate}, description=${description}, icon=${icon}`;
    }
  }
  // FAMILY
  const fc = (await sql`SELECT COUNT(*)::int AS c FROM "FamilyMember"` as any[])[0]?.c ?? "0";
  if (Number(fc) === 0) {
    for (const f of FAMILY_MEMBERS) {
      const { id, name, relationship, role, photoUrl, quote, order } = f;
      await sql`INSERT INTO "FamilyMember" (id, name, relationship, role, "photoUrl", quote, "order", "createdAt", "updatedAt")
                  VALUES (${id}, ${name}, ${relationship || ""}, ${role || ""}, ${photoUrl || ""}, ${quote || ""}, ${order || 0}, NOW(), NOW())
                  ON CONFLICT (id) DO UPDATE SET name=${name}, relationship=${relationship || ""}, role=${role || ""}, "photoUrl"=${photoUrl || ""}, quote=${quote || ""}, "order"=${order || 0}, "updatedAt"=NOW()`;
    }
  }
  // SETTINGS
  const sc = (await sql`SELECT COUNT(*)::int AS c FROM "Setting"` as any[])[0]?.c ?? "0";
  if (Number(sc) === 0) {
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
      isPublic: eventRows[0].isPublic ?? true, isEnabled: eventRows[0].isEnabled ?? true,
    }) || DEFAULT_EVENT;
    const photos: any[] = (await sql`SELECT * FROM "Photo" ORDER BY "createdAt" DESC`) as any[];
    const milestones: any[] = (await sql`SELECT * FROM "Milestone" ORDER BY date ASC`) as any[];
    const growth: any[] = (await sql`SELECT * FROM "GrowthRecord" ORDER BY date ASC`) as any[];
    const family: any[] = (await sql`SELECT * FROM "FamilyMember" ORDER BY "createdAt" DESC`) as any[];
    const stories: any[] = (await sql`SELECT * FROM "Story" ORDER BY "createdAt" DESC`) as any[];
    const settingsRows: any[] = (await sql`SELECT key, value FROM "Setting"`) as any[];
    const brothersMapped = brothers.map((r: any) => ({ id: r.id, name: r.name, role: r.role, age: r.age, photoUrl: r.photoUrl, message: r.message, category: r.category, order: r.order }));
    const photosMapped = photos.map((r: any) => ({
      id: r.id, src: r.src, alt: r.alt, caption: r.caption, category: r.category,
      date: r.date || "2026-07-31",
      babyAge: { days: r.babyAgeDays ?? 0, weeks: r.babyAgeWeeks ?? 0, months: r.babyAgeMonths ?? 0, years: r.babyAgeYears ?? 0 },
      order: r.order ?? 0,
    }));
    const milestonesMapped = milestones.map((r: any) => ({
      id: r.id, title: r.title, date: r.date, description: r.description, icon: r.icon,
      category: r.category || "milestone", order: r.order ?? 0,
      location: r.location || "", parentNote: r.parentNote || "", images: r.images || [],
      babyAge: { days: r.babyAgeDays ?? 0, weeks: r.babyAgeWeeks ?? 0, months: r.babyAgeMonths ?? 0, years: r.babyAgeYears ?? 0 },
    }));
    const growthMapped = growth.map((r: any) => ({
      id: r.id, date: r.date,
      babyAge: { days: r.babyAgeDays || 0, weeks: r.babyAgeWeeks || 0, months: r.babyAgeMonths || 0, years: r.babyAgeYears || 0 },
      weight: r.weight || 0, height: r.height || 0, headCircumference: r.headCircumference || undefined, notes: r.notes || "", createdAt: r.createdAt,
    }));
    const familyMapped = family.map((r: any) => ({ id: r.id, name: r.name, relationship: r.relationship || "", role: r.role || "", photoUrl: r.photoUrl || "", quote: r.quote || "", order: r.order || 0 }));
    const storiesMapped = stories.map((r: any) => ({ id: r.id, title: r.title, content: r.content || "", date: r.date || "", photoUrl: r.photoUrl || "", createdAt: r.createdAt, updatedAt: r.updatedAt }));
    const settingMap: Record<string, string> = {};
    for (const s of settingsRows) settingMap[s.key] = s.value ?? "";

    return NextResponse.json(
      {
        brothers: brothersMapped.length ? brothersMapped : DEFAULT_BROTHERS,
        event,
        events: [event],
        photos: photosMapped,
        milestones: milestonesMapped.length ? milestonesMapped : MILESTONES,
        growth: growthMapped,
        family: familyMapped,
        stories: storiesMapped,
        settings: settingMap,
        source: "server-neon",
      },
      { headers: { "Cache-Control": "no-store", "CDN-Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    console.error("[api/admin/state] GET failed:", e?.message || e);
    return NextResponse.json({ error: "state unavailable", detail: (e as Error)?.message?.slice(0, 120) }, { status: 500 });
  }
}

// Helper: array de ids para neon ANY() tagged template (v0.10.4 soporta arrays como argumentos)
function anyIds(ids: string[]) {
  return ids.length ? ids : [null];
}

export async function POST(req: Request) {
  try {
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });
    const sql = getSQL();
    await ensureSeeded(sql);
    const body = await req.json();

    // BROTHERS: upsert (NOT sync-delete — evita data loss si browser tiene estado parcial)
    if (body.brothers) {
      for (const b of body.brothers as any[]) {
        await sql`INSERT INTO "Brother" (id, name, role, age, "photoUrl", message, category, "order", "createdAt", "updatedAt")
                    VALUES (${b.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${b.name}, ${b.role}, ${b.age}, ${b.photoUrl || ""}, ${b.message || ""}, ${b.category || "primos"}, ${b.order || 0}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET name=${b.name}, role=${b.role}, age=${b.age}, "photoUrl"=${b.photoUrl || ""}, message=${b.message || ""}, category=${b.category || "primos"}, "order"=${b.order || 0}`;
      }
    }

    // EVENT
    if (body.event) {
      const e = body.event;
      const eid = e.id || DEFAULT_EVENT.id;
      await sql`INSERT INTO "Event" (id, title, date, time, location, address, description, "thankYouMessage", type, "photoUrl", "isPublic", "isEnabled", "createdAt", "updatedAt")
                  VALUES (${eid}, ${e.title}, ${e.date}, ${e.time || ""}, ${e.location || ""}, ${e.address || ""}, ${e.description || ""}, ${e.thankYouMessage || ""}, ${e.type || "bautizo"}, ${e.photoUrl || ""}, ${e.isPublic ?? true}, ${e.isEnabled ?? true}, NOW(), NOW())
                  ON CONFLICT (id) DO UPDATE SET title=${e.title}, date=${e.date}, time=${e.time || ""}, location=${e.location || ""}, address=${e.address || ""}, description=${e.description || ""}, "thankYouMessage"=${e.thankYouMessage || ""}, type=${e.type || "bautizo"}, "photoUrl"=${e.photoUrl || ""}, "isPublic"=${e.isPublic ?? true}, "isEnabled"=${e.isEnabled ?? true}`;
    }

    // PHOTOS: upsert (NO sync-delete — borrado via DELETE explícito)
    if (body.photos) {
      for (const p of body.photos as any[]) {
        const pba = p.babyAge || { days: 0, weeks: 0, months: 0, years: 0 };
        const pcat = p.category === "familia" ? "family" : (p.category || "family");
        await sql`INSERT INTO "Photo" (id, src, alt, caption, category, date, "babyAgeDays", "babyAgeWeeks", "babyAgeMonths", "babyAgeYears", "order", "createdAt", "updatedAt")
                    VALUES (${p.id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}, ${p.src}, ${p.alt || ""}, ${p.caption || ""}, ${pcat}, ${p.date || "2026-07-31"}, ${pba.days ?? null}, ${pba.weeks ?? null}, ${pba.months ?? null}, ${pba.years ?? null}, ${p.order ?? 0}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET src=${p.src}, alt=${p.alt || ""}, caption=${p.caption || ""}, category=${pcat}, date=${p.date || "2026-07-31"}, "babyAgeDays"=${pba.days ?? null}, "babyAgeWeeks"=${pba.weeks ?? null}, "babyAgeMonths"=${pba.months ?? null}, "babyAgeYears"=${pba.years ?? null}, "order"=${p.order ?? 0}`;
      }
    }

    // MILESTONES: upsert
    if (body.milestones) {
      for (const m of body.milestones as any[]) {
        const mba = m.babyAge || { days: 0, weeks: 0, months: 0, years: 0 };
        await sql`INSERT INTO "Milestone" (id, title, date, description, icon, category, "order", location, "parentNote", images, "babyAgeDays", "babyAgeWeeks", "babyAgeMonths", "babyAgeYears", "createdAt", "updatedAt")
                    VALUES (${m.id || `m-${Date.now()}`}, ${m.title}, ${m.date}, ${m.description || ""}, ${m.icon || ""}, ${m.category || "milestone"}, ${m.order ?? 0}, ${m.location || ""}, ${m.parentNote || ""}, ${m.images || []}, ${mba.days ?? null}, ${mba.weeks ?? null}, ${mba.months ?? null}, ${mba.years ?? null}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET title=${m.title}, date=${m.date}, description=${m.description || ""}, icon=${m.icon || ""}, category=${m.category || "milestone"}, "order"=${m.order ?? 0}, location=${m.location || ""}, "parentNote"=${m.parentNote || ""}, images=${m.images || []}, "babyAgeDays"=${mba.days ?? null}, "babyAgeWeeks"=${mba.weeks ?? null}, "babyAgeMonths"=${mba.months ?? null}, "babyAgeYears"=${mba.years ?? null}`;
      }
    }

    // SETTINGS
    if (body.settings) {
      for (const [k, v] of Object.entries(body.settings)) {
        await sql`INSERT INTO "Setting" (key, value) VALUES (${k}, ${String(v ?? "")}) ON CONFLICT (key) DO UPDATE SET value=${String(v ?? "")}`;
      }
    }

    // GROWTH: upsert (NO sync-delete)
    if (body.growth !== undefined) {
      for (const r of body.growth as any[]) {
        const ba = r.babyAge || { days: 0, weeks: 0, months: 0, years: 0 };
        await sql`INSERT INTO "GrowthRecord" (id, date, "babyAgeDays", "babyAgeWeeks", "babyAgeMonths", "babyAgeYears", weight, height, "headCircumference", notes, "createdAt")
                    VALUES (${r.id || `g-${Date.now()}`}, ${r.date}, ${ba.days || null}, ${ba.weeks || null}, ${ba.months || null}, ${ba.years || null}, ${r.weight || null}, ${r.height || null}, ${r.headCircumference || null}, ${r.notes || ""}, NOW())
                    ON CONFLICT (id) DO UPDATE SET date=${r.date}, "babyAgeDays"=${ba.days || null}, "babyAgeWeeks"=${ba.weeks || null}, "babyAgeMonths"=${ba.months || null}, "babyAgeYears"=${ba.years || null}, weight=${r.weight || null}, height=${r.height || null}, "headCircumference"=${r.headCircumference || null}, notes=${r.notes || ""}`;
      }
    }

    // FAMILY: upsert — INCLUYE updatedAt (columna NOT NULL sin default en Neon;
    // omitirlo daba 500 "null value in column updatedAt" y el miembro nunca
    // llegaba al homepage aunque el admin lo mostrara como guardado)
    if (body.family !== undefined) {
      for (const f of body.family as any[]) {
        await sql`INSERT INTO "FamilyMember" (id, name, relationship, role, "photoUrl", quote, "order", "createdAt", "updatedAt")
                    VALUES (${f.id || `f-${Date.now()}`}, ${f.name}, ${f.relationship || ""}, ${f.role || ""}, ${f.photoUrl || ""}, ${f.quote || ""}, ${f.order || 0}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET name=${f.name}, relationship=${f.relationship || ""}, role=${f.role || ""}, "photoUrl"=${f.photoUrl || ""}, quote=${f.quote || ""}, "order"=${f.order || 0}, "updatedAt"=NOW()`;
      }
    }

    // STORIES: upsert
    if (body.stories) {
      for (const s of body.stories as any[]) {
        await sql`INSERT INTO "Story" (id, title, content, date, "photoUrl", "createdAt", "updatedAt")
                    VALUES (${s.id}, ${s.title}, ${s.content || ""}, ${s.date || ""}, ${s.photoUrl || ""}, NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET title=${s.title}, content=${s.content || ""}, date=${s.date || ""}, "photoUrl"=${s.photoUrl || ""}, "updatedAt"=NOW()`;
      }
    }

    _seeded = true;
    try {
      revalidatePath("/");
      revalidatePath("/eventos");
      revalidatePath("/invite");
    } catch { /* revalidate solo disponible en request server — no crítico */ }
    return NextResponse.json({ ok: true, source: "server-neon" });
  } catch (e: any) {
    console.error("[api/admin/state] POST failed:", e?.message || e);
    return NextResponse.json({ error: "state save failed", detail: (e as Error)?.message?.slice(0, 120) }, { status: 500 });
  }
}

// DELETE /api/admin/state?table=photos&id=xyz → borrado EXPLÍCITO de un row
export async function DELETE(req: Request) {
  try {
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });
    const sql = getSQL();
    const url = new URL(req.url);
    const table = url.searchParams.get("table");
    const id = url.searchParams.get("id");
    if (!table || !id) return NextResponse.json({ error: "table+id required" }, { status: 400 });
    const allowed: Record<string, string> = { photos: "Photo", brothers: "Brother", family: "FamilyMember", growth: "GrowthRecord", stories: "Story", milestones: "Milestone" };
    const qTable = allowed[table.toLowerCase()] || allowed[table];
    if (!qTable) return NextResponse.json({ error: "table not allowed" }, { status: 400 });
    // neon v0.10.4 NO tiene .unsafe → usar tagged template con ${id} que neon bindea como valor (no concat)
    switch (qTable) {
      case "Photo": await sql`DELETE FROM "Photo" WHERE id = ${id}`; break;
      case "Brother": await sql`DELETE FROM "Brother" WHERE id = ${id}`; break;
      case "FamilyMember": await sql`DELETE FROM "FamilyMember" WHERE id = ${id}`; break;
      case "GrowthRecord": await sql`DELETE FROM "GrowthRecord" WHERE id = ${id}`; break;
      case "Story": await sql`DELETE FROM "Story" WHERE id = ${id}`; break;
      case "Milestone": await sql`DELETE FROM "Milestone" WHERE id = ${id}`; break;
    }
    return NextResponse.json({ ok: true, deleted: id, table: qTable });
  } catch (e: any) {
    console.error("[api/admin/state] DELETE failed:", e?.message || e);
    return NextResponse.json({ error: "delete failed", detail: (e as Error)?.message?.slice(0, 120) }, { status: 500 });
  }
}
