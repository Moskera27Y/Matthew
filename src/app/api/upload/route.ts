// src/app/api/upload/route.ts
// POST /api/upload — recibe una foto (File o base64 dataURL) y la sube a Vercel Blob.
// 🔒 Requiere token admin (Bearer, firmado por /api/admin/login).
// Seguridad: solo jpeg/png/webp/gif/avif/heic verificados por BYTES MÁGICOS
// (nunca por extensión/nombre) — SVG y resto rechazados (XSS persistente).
// Rate-limit en memoria: 30 uploads / 10 min por IP. Límite 5MB + tope al base64
// crudo antes de decodificar (evita OOM).
// ⚠️ NO persiste en Neon aquí. El INSERT lo hace POST /api/admin/state.
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { verifyAdminToken, bearerFrom } from "@/lib/adminAuth";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB por upload
const MAX_B64_CHARS = 7_000_000; // ~5.2MB decodificados, antes de Buffer.from

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ---------- rate limit en memoria (best-effort por instancia) ----------
const RL_WINDOW = 10 * 60 * 1000;
const RL_MAX = 30;
const rlHits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rlHits.get(ip) || []).filter((t) => now - t < RL_WINDOW);
  arr.push(now);
  rlHits.set(ip, arr);
  if (rlHits.size > 2000) rlHits.clear(); // no crecer sin cota
  return arr.length > RL_MAX;
}

// ---------- detección por bytes mágicos (mime real, no extensión) ----------
type AllowedMime = "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "image/avif" | "image/heic";
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/heic": "heic",
};

function detectMime(buf: Buffer): AllowedMime | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WEBP: RIFF....WEBP
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  // AVIF/HEIC: ....ftyp + marca
  if (buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return "image/avif";
    if (["mif1", "msf1", "heic", "heix", "hevc", "hevx"].includes(brand)) return "image/heic";
  }
  return null; // svg, bmp, tiff, exe disfrazado, etc. → fuera
}

function toBuffer(src: string): Buffer {
  const m = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]*)$/);
  if (!m) throw new Error("Formato dataURL inválido");
  if (m[2].length > MAX_B64_CHARS) throw new Error("Imagen demasiado grande");
  return Buffer.from(m[2], "base64");
}

export async function POST(req: NextRequest) {
  try {
    // 🔒 Solo admin autenticado.
    if (!verifyAdminToken(bearerFrom(req))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!BLOB_TOKEN) return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN missing" }, { status: 500 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Demasiadas subidas, espera unos minutos" }, { status: 429 });
    }

    let buffer: Buffer;
    let alt = "";
    let caption = "";
    let category = "family";

    const type = req.headers.get("content-type") || "";

    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });
      buffer = Buffer.from(await file.arrayBuffer());
      alt = String(form.get("alt") || "").slice(0, 200);
      caption = String(form.get("caption") || "").slice(0, 300);
      const rawCat = String(form.get("category") || "family");
      category = rawCat === "familia" ? "family" : rawCat.slice(0, 30);
    } else {
      const body = await req.json();
      const { src, alt: a, caption: c, category: cat } = body ?? {};
      if (!src || typeof src !== "string") return NextResponse.json({ error: "missing src" }, { status: 400 });
      buffer = toBuffer(src);
      alt = String(a || "").slice(0, 200);
      caption = String(c || "").slice(0, 300);
      category = (cat === "familia" ? "family" : String(cat || "family")).slice(0, 30);
    }

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: `Imagen demasiado grande (máx ${MAX_BYTES / 1024 / 1024}MB).` }, { status: 413 });
    }

    // Tipo real por contenido. Rechaza SVG (script ejecutable), BMP/TIFF y
    // archivos disfrazados con extensión falsa.
    const mime = detectMime(buffer);
    if (!mime) {
      return NextResponse.json({ error: "Tipo de imagen no permitido (solo JPG, PNG, WebP, GIF, AVIF, HEIC)." }, { status: 415 });
    }
    const ext = MIME_EXT[mime];

    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const blob = await put(filename, buffer, {
      token: BLOB_TOKEN,
      access: "public",
      contentType: mime,
    });
    const url = (blob as any).url || (blob as any).href || "";
    if (!url) throw new Error("Vercel Blob no devolvió URL (put() vacío)");

    return NextResponse.json({ ok: true, id: `upload-${Date.now()}`, src: url, url, alt, caption, category }, { status: 200 });
  } catch (e: any) {
    console.error("[api/upload] failed:", e?.message || e);
    const msg = process.env.NODE_ENV === "production" ? "upload failed" : e?.message?.slice(0, 150) || "upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
