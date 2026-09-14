// scripts/migrate-base64-blob.js
// Limpia fotos tipo data:base64 de Neon → sube a Vercel Blob → guarda URL.
// Previene el "This page couldn't load" (SyntaxError #418 + RangeError) causado
// por base64 gigantes renderizados en next/image.
const { neon } = require("@neondatabase/serverless");
const { put } = require("@vercel/blob");
const fs = require("fs");

const DATABASE_URL = process.env.DATABASE_URL;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!DATABASE_URL) { console.error("❌ DATABASE_URL missing"); process.exit(1); }
if (!BLOB_TOKEN)   { console.error("❌ BLOB_READ_WRITE_TOKEN missing"); process.exit(1); }

const sql = neon(DATABASE_URL);
const API = "https://matthew-journal.vercel.app/api/upload";

async function toBlob(dataUrl, name) {
  // Upload directo a Vercel Blob con el SDK (evita doble fetch HTTP).
  const ext = dataUrl.match(/^data:image\/([a-zA-Z]*)/)?.[1] || "png";
  const mime = `image/${ext === "svg" ? "svg+xml" : ext}`;
  const b64 = dataUrl.replace(/^data:image\/[a-zA-Z]*;base64,/, "");
  const buffer = Buffer.from(b64, "base64");
  const blob = await put(`migrate-${Date.now()}-${name}.${ext}`, buffer, {
    token: BLOB_TOKEN,
    access: "public",
    contentType: mime,
  });
  return blob.url;
}

function isBase64(s) { return typeof s === "string" && s.startsWith("data:"); }

async function main() {
  let fixed = { brothers:0, familia:0, photos:0, settings:0 };

  // --- Brother.photoUrl ---
  const brothers = await sql`SELECT id, "name", "photoUrl" FROM "Brother" WHERE "photoUrl" LIKE 'data:%'`;
  for (const b of brothers.rows || brothers) {
    try {
      const url = await toBlob(b.photoUrl, b.name || b.id);
      await sql`UPDATE "Brother" SET "photoUrl" = ${url} WHERE id = ${b.id}`;
      fixed.brothers++;
      console.log(`  ✅ Brother ${b.name} → ${url.slice(0,60)}...`);
    } catch (e) {
      await sql`UPDATE "Brother" SET "photoUrl" = '' WHERE id = ${b.id}`;
      console.error(`  ⚠️ Brother ${b.name} falló → vacío`, e.message?.slice(0,80));
    }
  }

  // --- FamilyMember.photoUrl ---
  const familia = await sql`SELECT id, "name", "photoUrl" FROM "FamilyMember" WHERE "photoUrl" LIKE 'data:%'`;
  for (const m of familia.rows || familia) {
    try {
      const url = await toBlob(m.photoUrl, m.name || m.id);
      await sql`UPDATE "FamilyMember" SET "photoUrl" = ${url} WHERE id = ${m.id}`;
      fixed.familia++;
    } catch (e) {
      await sql`UPDATE "FamilyMember" SET "photoUrl" = '' WHERE id = ${m.id}`;
      console.error(`  ⚠️ Family ${m.name} falló → vacío`, e.message?.slice(0,80));
    }
  }

  // --- Photo.src ---
  const photos = await sql`SELECT id, "alt", "src" FROM "Photo" WHERE "src" LIKE 'data:%'`;
  for (const p of photos.rows || photos) {
    try {
      const url = await toBlob(p.src, p.alt || p.id);
      await sql`UPDATE "Photo" SET "src" = ${url} WHERE id = ${p.id}`;
      fixed.photos++;
    } catch (e) {
      await sql`UPDATE "Photo" SET "src" = '' WHERE id = ${p.id}`;
      console.error(`  ⚠️ Photo ${p.alt} falló → vacío`, e.message?.slice(0,80));
    }
  }

  // --- Setting.babyPhoto ---
  const settings = await sql`SELECT id, "key", "value" FROM "Setting" WHERE "key" = 'babyPhoto' AND "value" LIKE 'data:%'`;
  for (const s of settings.rows || settings) {
    try {
      const url = await toBlob(s.value, "baby-photo");
      await sql`UPDATE "Setting" SET "value" = ${url} WHERE id = ${s.id}`;
      fixed.settings++;
    } catch (e) {
      await sql`UPDATE "Setting" SET "value" = '' WHERE id = ${s.id}`;
      console.error(`  ⚠️ Setting babyPhoto falló → vacío`, e.message?.slice(0,80));
    }
  }

  console.log("\n=== Resumen migrate-base64-blob ===");
  console.log(JSON.stringify(fixed));
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
