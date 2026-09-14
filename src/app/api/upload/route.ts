// src/app/api/upload/route.ts
// POST /api/upload — recibe una foto (File o base64 dataURL) y la sube a Vercel Blob.
// ⚠️ NO persiste en Neon aquí. El INSERT en Neon lo hace el POST /api/admin/state (savePhotos).
// Antes, este endpoint hacía el INSERT → si Neon tenía cold-start/devolvía error, el upload
// devolvía 500 "no se pudo subir foto" AUNQUE el blob subió OK → doble registro (upload-* + photo-*)
// + el full-sync del POST admin borraba el upload-* → foto "desaparecía".
// Al subir sólo a Blob: upload es 100% confiable; el POST admin persiste UNA sola vez.
// Body multipart: field "file" (File)
// Body JSON:      { src: "data:image/...;base64,...", alt?, caption?, category? }
// Response: { ok: true, id: "upload-...", src: "<blob-url>", url: "<blob-url>" }
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB hard limit por upload

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function fileExt(name: string): string {
  const m = name.match(/\.(png|jpe?g|gif|webp|avif|svg)$/i);
  return (m ? m[1].toLowerCase() : "webp").replace("jpeg", "jpg");
}

function toBuffer(src: string): { buf: Buffer; mime: string } {
  const m = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!m) throw new Error("Formato dataURL inválido");
  return { buf: Buffer.from(m[2], "base64"), mime: m[1] };
}

export async function POST(req: NextRequest) {
  try {
    if (!BLOB_TOKEN) return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN missing" }, { status: 500 });

    let buffer: Buffer;
    let ext = "webp";
    let alt = "";
    let caption = "";
    let category = "family";

    const type = req.headers.get("content-type") || "";

    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });
      const arrayBuf = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
      ext = fileExt(file.name || "");
      alt = (form.get("alt") as string) || "";
      caption = (form.get("caption") as string) || "";
      const rawCat = (form.get("category") as string) || "family";
      category = rawCat === "familia" ? "family" : rawCat;
    } else {
      const body = await req.json();
      const { src, alt: a, caption: c, category: cat }: { src: string; alt?: string; caption?: string; category?: string } = body;
      if (!src) return NextResponse.json({ error: "missing src" }, { status: 400 });
      const parsed = toBuffer(src);
      buffer = parsed.buf;
      ext = parsed.mime.replace("image/", "").replace("jpeg", "jpg");
      alt = a || "";
      caption = c || "";
      category = cat === "familia" ? "family" : (cat || "family");
    }

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: `Imagen demasiado grande (máx ${MAX_BYTES / 1024 / 1024}MB).` }, { status: 413 });
    }

    // Subir a Vercel Blob — única responsabilidad del endpoint (Neon no toca aquí).
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const blob = await put(filename, buffer, {
      token: BLOB_TOKEN,
      access: "public",
    });
    const url = (blob as any).url || (blob as any).href || "";
    if (!url) throw new Error("Vercel Blob no devolvió URL (put() vacío)");

    return NextResponse.json({ ok: true, id: `upload-${Date.now()}`, src: url, url, alt, caption, category }, { status: 200 });
  } catch (e: any) {
    console.error("[api/upload] failed:", e?.message || e);
    return NextResponse.json({ error: e?.message?.slice(0, 150) || "upload failed" }, { status: 500 });
  }
}
