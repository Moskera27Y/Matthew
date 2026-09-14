// src/app/api/upload/route.ts
// POST /api/upload — recibe una foto (base64 dataURL o file) y la persiste en
// la DB (Neon) como Photo. Sirve para que fotos subidas desde admin se vean
// en CUALQUIER dispositivo (no solo el browser del admin).
// Body: { src: "data:image/...;base64,...", alt?, caption?, category? }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB hard limit (base64 ~ 2.7MB encoded)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { src, alt, caption, category }: { src: string; alt?: string; caption?: string; category?: string } = body;

    if (!src) return NextResponse.json({ error: "missing src" }, { status: 400 });

    // Calcular tamaño real (decodificar base64) para validar límite
    const b64 = src.split(",").pop() || src;
    if (b64.length > MAX_BYTES * 2) {
      // mensaje de QuotaExceeded consistente
      return NextResponse.json(
        { error: "Imagen demasiado grande (máx 2MB). Reduce el peso e intenta de nuevo." },
        { status: 413 }
      );
    }

    // id único estable (para upsert idempotente)
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const photo = await prisma.photo.upsert({
      where: { id },
      update: { src, alt, caption, category: category || "familia" },
      create: { id, src, alt, caption, category: category || "familia" },
    });

    return NextResponse.json({ ok: true, id: photo.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message?.slice(0, 120) || "upload failed" },
      { status: 500 }
    );
  }
}
