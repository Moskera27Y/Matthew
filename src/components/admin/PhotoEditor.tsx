// src/components/admin/PhotoEditor.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Upload, Trash2, ZoomIn } from "lucide-react";
import { loadSettings, saveSettings, AdminSettings } from "@/services/adminService";
import Button from "@/components/ui/Button";

export default function PhotoEditor() {
  const [babyPhoto, setBabyPhoto] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((settings) => {
      if (!cancelled && settings?.babyPhoto) setBabyPhoto(settings.babyPhoto);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadImage = async (file: File) => {
    try {
      // Subir a server: FormData → /api/upload → Vercel Blob → URL pública
      const form = new FormData();
      form.append("file", file);
      form.append("alt", "Foto de Matthew");
      form.append("caption", "Foto de Matthew");
      form.append("category", "familia");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      // Vercel Blob put() devuelve HTTP 201 con JSON {url,...}. El chequeo ">204" viejo
      // lo salteaba → data quedaba {} → "no se recibió URL de Blob". Forzamos parse en cualquier 2xx.
      const text = await res.text();
      let data: any = {};
      if (text) {
        try { data = JSON.parse(text); } catch { /* empty body */ }
      }
      if (!res.ok) throw new Error(data?.error || `upload failed (${res.status})`);
      const blobUrl = data.url || data.src;
      if (!blobUrl) throw new Error("upload OK pero no se recibió URL de Blob");
      setBabyPhoto(blobUrl);
      console.log("[PhotoEditor] foto subida a Blob:", data.id);
      // Guardar SOLO la URL en settings (Neon). Nada de base64.
      const prev = await loadSettings();
      await saveSettings({ ...prev, babyPhoto: blobUrl });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error("[PhotoEditor] upload falló:", (e as Error)?.message?.slice(0, 80));
      // NO base64 localStorage fallback: evita el error #418 / "This page couldn't load".
      alert("Error subiendo la foto: " + ((e as Error)?.message || "inténtalo de nuevo"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    loadImage(file);
  };

  const handleRemovePhoto = async () => {
    setBabyPhoto("");
    const prev = await loadSettings();
    await saveSettings({ ...prev, babyPhoto: "" });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
    >
      <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
        <Upload size={20} className="text-dusty-rose" />
        Foto de Matthew
      </h2>

      <p className="text-sm text-mist-gray mb-4">
        Sube una foto del bebé para usarla en la portada y sobre de invitación.
        Soporte: JPG, PNG, WebP. Recomendado: 400x400px.
      </p>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          dragOver
            ? "border-dusty-rose bg-blush-pink/5"
            : "border-mist-gray/30 hover:border-mist-gray/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {babyPhoto ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-card">
              {babyPhoto?.startsWith("data:") ? (
                // dataURL base64: <img> nativo (Next/Image no optimiza base64 → #418)
                // eslint-disable-next-line @next/next/no-img-suffix
                <img
                  src={babyPhoto}
                  alt="Foto de Matthew"
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={babyPhoto}
                  alt="Foto de Matthew"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              )}
              {/* Zoom overlay */}
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} className="mr-1" />
                Cambiar foto
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} className="text-mist-gray/40" />
            <p className="text-sm text-mist-gray">
              Haz click para subir o arrastra la foto aquí
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {isSaved && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-green-600 mt-3"
        >
          Foto guardada correctamente
        </motion.p>
      )}
    </motion.div>
  );
}
