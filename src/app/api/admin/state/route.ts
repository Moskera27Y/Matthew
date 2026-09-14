// src/app/api/admin/state/route.ts
// CRUD cross-device real vía Prisma → Neon PostgreSQL.
// GET /api/admin/state   → devuelve estado completo desde DB (o defaults si DB vacía).
// POST /api/admin/state  → upsert de estado completo recibido del admin browser.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BROTHERS } from "@/types/brother";
import { DEFAULT_EVENT } from "@/types/event";
import { PHOTOS } from "@/data/photos";
import { MILESTONES } from "@/data/milestones";

// Seed idempotente: si la DB está vacía, inserta defaults. (Server-only.)
let _seeded = false;
async function ensureSeeded() {
  if (_seeded) return;
  const count = await prisma.brother.count();
  if (count === 0) {
    for (const b of DEFAULT_BROTHERS) await prisma.brother.upsert({ where: { id: b.id }, update: { ...b }, create: { ...b } });
    await prisma.event.upsert({ where: { id: DEFAULT_EVENT.id }, update: { ...DEFAULT_EVENT }, create: { ...DEFAULT_EVENT } });
    for (const p of PHOTOS) await prisma.photo.upsert({ where: { id: p.id }, update: { ...p }, create: { ...p } });
    for (const m of MILESTONES) await prisma.milestone.upsert({ where: { id: m.id }, update: { ...m }, create: { ...m } });
    for (const [k, v] of Object.entries({ babyPhoto: PHOTOS[0]?.src || "", babyName: "Matthew", babyBirthDate: "2026-07-31" })) {
      await prisma.setting.upsert({ where: { key: k }, update: { value: v ?? "" }, create: { key: k, value: v ?? "" } });
    }
  }
  _seeded = true;
}

export async function GET() {
  try {
    await ensureSeeded();
    const [brothers, event] = await Promise.all([
      prisma.brother.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.event.findFirst({ orderBy: { createdAt: "desc" } }),
    ]);
    const photos = await prisma.photo.findMany({ orderBy: { createdAt: "desc" } });
    const milestones = await prisma.milestone.findMany({ orderBy: { date: "asc" } });
    const settings = await prisma.setting.findMany();
    const settingMap: Record<string, string> = {};
    for (const s of settings) settingMap[s.key] = s.value ?? "";

    return NextResponse.json(
      {
        brothers: brothers.length ? brothers : DEFAULT_BROTHERS,
        event: event || DEFAULT_EVENT,
        events: event ? [event] : [DEFAULT_EVENT],
        photos: photos.length ? photos : PHOTOS,
        milestones: milestones.length ? milestones : MILESTONES,
        settings: settingMap.babyPhoto ? settingMap : { babyPhoto: PHOTOS[0]?.src || "", babyName: settingMap?.babyName || "Matthew", babyBirthDate: settingMap?.babyBirthDate || "2026-07-31" },
        source: "server-neon", // ✅ fuente de verdad real
      },
      { headers: { "Cache-Control": "no-store" } } // ❌ sin ISR cache cross-device
    );
  } catch (e: any) {
    console.error("[api/admin/state] GET failed:", e?.message || e);
    return NextResponse.json({ error: "state unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = await req.json();
    const tx = [];
    if (body.brothers) for (const b of body.brothers) tx.push(prisma.brother.upsert({ where: { id: b.id }, update: { ...b }, create: { ...b } }));
    if (body.photos) for (const p of body.photos) tx.push(prisma.photo.upsert({ where: { id: p.id }, update: { ...p }, create: { ...p } }));
    if (body.milestones) for (const m of body.milestones) tx.push(prisma.milestone.upsert({ where: { id: m.id }, update: { ...m }, create: { ...m } }));
    if (body.event) {
      const eid = (body.event.id || DEFAULT_EVENT.id || undefined) as string;
      await prisma.event.upsert({ where: { id: eid }, update: { ...body.event, id: eid }, create: { ...body.event, id: eid } });
    }
    if (body.settings) for (const [k, v] of Object.entries(body.settings)) await prisma.setting.upsert({ where: { key: k }, update: { value: String(v ?? "") }, create: { key: k, value: String(v ?? "") } });
    await Promise.all(tx);
    return NextResponse.json({ ok: true, source: "server-neon" });
  } catch (e: any) {
    console.error("[api/admin/state] POST failed:", e?.message || e);
    return NextResponse.json({ error: "state save failed" }, { status: 500 });
  }
}
