// src/app/api/admin/state/route.ts
// GET /api/admin/state — devuelve el estado admin completo como JSON.
// En producción, el localStorage del browser admin no es accesible desde el server,
// por lo que este endpoint sirve los DEFAULTS (datos estáticos de build) para que
// cualquier dispositivo (móvil, desktop, web) vea contenido consistente.
//
// TODO: migrar a DB (PostgreSQL/SQLite) cuando el admin necesite persistencia
// cross-device real. Mientras tanto: datos default = fuente de verdad.
import { NextResponse } from "next/server";
import { DEFAULT_BROTHERS } from "@/types/brother";
import { DEFAULT_EVENT } from "@/types/event";
import { PHOTOS } from "@/data/photos";
import { MILESTONES } from "@/data/milestones";

export async function GET() {
  try {
    const state = {
      brothers: DEFAULT_BROTHERS,
      event: DEFAULT_EVENT,
      events: [DEFAULT_EVENT],
      photos: PHOTOS,
      milestones: MILESTONES,
      settings: {
        babyPhoto: PHOTOS[0]?.src || "",
        babyName: "Matthew",
        babyBirthDate: "2026-07-31",
      },
      // Indicamos a los clientes que este es el estado SERVER (defaults)
      source: "server-defaults",
    };
    return NextResponse.json(state, {
      // Cache breve: permite que edits en admin se propaguen rápido en prod (ISR 10s)
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" },
    });
  } catch (e) {
    return NextResponse.json({ error: "state unavailable" }, { status: 500 });
  }
}
