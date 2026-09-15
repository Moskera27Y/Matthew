// src/lib/image.ts
// Compresión en el cliente ANTES de subir: las fotos de móvil (3-12MB) superan
// el límite del endpoint (5MB) y el body máximo de Vercel → 413 "Imagen
// demasiado grande". Redimensionar a máx 1600px JPEG 0.82 las deja en
// ~200-500KB: suben rápido hasta con datos móviles. También normaliza
// HEIC/iPhone a JPEG y corrige orientación EXIF (createImageBitmap fromImage).

export interface PreparedImage {
  blob: Blob;
  name: string;
}

export async function prepareUploadImage(
  file: File,
  maxDim = 1600,
  quality = 0.82
): Promise<PreparedImage> {
  const asIs = { blob: file as Blob, name: file.name || "foto.jpg" };
  // Fast path: ya liviana y en formato web → no tocar (conserva calidad)
  if (file.size <= 1024 * 1024 && /jpe?g|png|webp/.test(file.type || "")) {
    return asIs;
  }
  try {
    let w = 0;
    let h = 0;
    let source: ImageBitmap | HTMLImageElement;
    if (typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      w = bmp.width;
      h = bmp.height;
      source = bmp;
    } else {
      const url = URL.createObjectURL(file);
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = url;
        });
        w = img.naturalWidth;
        h = img.naturalHeight;
        source = img;
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    if (!w || !h) return asIs;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return asIs;
    ctx.drawImage(source, 0, 0, cw, ch);
    if (typeof (source as ImageBitmap).close === "function") {
      (source as ImageBitmap).close();
    }
    const out = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!out) return asIs;
    const base = (file.name || "foto").replace(/\.[a-z0-9]+$/i, "");
    return { blob: out, name: `${base || "foto"}.jpg` };
  } catch {
    return asIs;
  }
}
