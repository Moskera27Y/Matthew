// src/app/api/upload/route.ts
// POST /api/upload — recibe una foto (File o base64 dataURL), la sube a Vercel Blob
// y persiste solo la URL + metadata en Neon (via @neondatabase/serverless, no Prisma Client).
// Esto evita timeouts de Prisma TCP en Vercel Edge y sirve fotos en todos los dispositivos.
// Body multipart: field "file" (File)
// Body JSON:      { src: "data:image/...;base64,...", alt?, caption?, category? }
// Response: { ok: true, id, src: "<blob-url>" }
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";

let _sql: ReturnType<typeof neon> | null = null;
const getSQL = (): ReturnType<typeof neon> => {
  if (!_sql) _sql = neon(connectionString);
  return _sql;
};

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB hard limit por upload

export const config = {
  api: { bodyParser: { sizeLimit: "6mb" } },
};

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
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });

    let buffer: Buffer;
    let ext = "webp";
    let alt = "";
    let caption = "";
    let category = "familia";

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
      category = (form.get("category") as string) || "familia";
    } else {
      const body = await req.json();
      const { src, alt: a, caption: c, category: cat }: { src: string; alt?: string; caption?: string; category?: string } = body;
      if (!src) return NextResponse.json({ error: "missing src" }, { status: 400 });
      const parsed = toBuffer(src);
      buffer = parsed.buf;
      ext = parsed.mime.replace("image/", "").replace("jpeg", "jpg");
      alt = a || "";
      caption = c || "";
      category = cat || "familia";
    }

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: `Imagen demasiado grande (máx ${MAX_BYTES / 1024 / 1024}MB).` }, { status: 413 });
    }

    // Subir a Vercel Blob
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const blob = await put(filename, buffer, {
      token: BLOB_TOKEN,
      access: "public",
    });
    // Vercel Blob SDK: en algunas versiones el campo es .url o .href → normalizar.
    const url = (blob as any).url || (blob as any).href || "";
    if (!url) throw new Error("Vercel Blob no devolvió URL (put() vacío)");

    // Persistir URL + metadata en Neon (serverless-safe, no Prisma)
    const sql = getSQL();
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await sql`INSERT INTO "Photo" (id, src, alt, caption, category, "createdAt", "updatedAt")
                VALUES (${id}, ${url}, ${alt}, ${caption}, ${category}, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET src=${url}, alt=${alt}, caption=${caption}, category=${category}`;

    // devolver AMBAS props (url + src) para compat con todos los frontends
    return NextResponse.json({ ok: true, id, url, src: url }, { status: 200 });
  } catch (e: any) {
    console.error("[api/upload] failed:", e?.message || e);
    return NextResponse.json({ error: e?.message?.slice(0, 150) || "upload failed" }, { status: 500 });
  }
}
