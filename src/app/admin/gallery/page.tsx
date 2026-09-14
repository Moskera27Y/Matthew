// src/app/admin/gallery/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Photo, PhotoCategory } from "@/types/photo";
import { loadPhotos, savePhotos } from "@/services/adminService";
import { photoCategoryLabels } from "@/data/photos";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulario del modal
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("daily");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPhotos().then(setPhotos).catch(() => setPhotos([]));
  }, []);

  const filtered = photos.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("¿Eliminar esta foto?")) {
      const updated = photos.filter((p) => p.id !== id);
      setPhotos(updated);
      savePhotos(updated);
    }
  };

  const openAddModal = () => {
    setCaption("");
    setCategory("daily");
    setPreview(null);
    setShowAddModal(true);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (!preview) return;
    setIsSaving(true);
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      src: preview,
      alt: caption || "Foto de Matthew",
      caption: caption || "Foto de Matthew",
      date: new Date().toISOString().split("T")[0],
      babyAge: { days: 0, weeks: 0, months: 0, years: 0 },
      category: category,
      order: photos.length + 1,
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    try {
      savePhotos(updated);
      // Sincronizar storage event a la homepage en otro tab
      window.dispatchEvent(new Event("storage"));
      setShowAddModal(false);
      setPreview(null);
    } catch (err) {
      console.error("savePhotos falló:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading-bold text-charcoal">
            Gestión de Galería
          </h1>
          <Button variant="primary" size="md" onClick={openAddModal}>
            <Plus size={16} />
            <span className="ml-1">Agregar foto</span>
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Badge
            category={filter === "all" ? "family" : undefined}
            size="sm"
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            Todas
          </Badge>
          {Object.entries(photoCategoryLabels).map(([key, label]) => (
            <Badge
              key={key}
              category={key as any}
              size="sm"
              className="cursor-pointer"
              onClick={() => setFilter(key)}
            >
              {label}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-mist-gray mb-6">
          {filtered.length === 0
            ? "No hay fotos en esta categoría."
            : `${filtered.length} ${filtered.length === 1 ? "foto" : "fotos"}`
          }
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              className="bg-pearl-white rounded-xl p-3 shadow-subtle border border-mist-gray/10"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-1 bg-white/80 rounded transition-colors text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-charcoal truncate mb-1">
                {photo.caption || photo.alt}
              </h3>
              <p className="text-xs text-mist-gray">{photo.date}</p>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-mist-gray">
            <Upload size={48} className="mx-auto mb-2 opacity-30" />
            <p>No hay fotos en esta categoría.</p>
          </div>
        )}
      </div>

      {/* Modal: Subir foto desde PC */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-pearl-white rounded-2xl shadow-card border border-mist-gray/10 p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading-bold text-charcoal">
                  Agregar foto
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-mist-gray/10 rounded transition-colors"
                >
                  <X size={20} className="text-mist-gray" />
                </button>
              </div>

              {/* Preview de la foto */}
              {preview ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-mist-gray/20">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Upload size={24} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-mist-gray/30 rounded-xl p-6 text-center cursor-pointer hover:border-dusty-rose hover:bg-blush-pink/5 transition-all duration-200 mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} className="mx-auto mb-2 text-mist-gray/50" />
                  <p className="text-sm text-mist-gray">
                    Haz click para seleccionar una foto
                  </p>
                  <p className="text-xs text-mist-gray mt-1">
                    JPG, PNG, WebP — desde tu carpeta
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Campo texto */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Texto de la foto
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ej: Matthew sonriendo"
                  className="w-full px-3 py-2 border border-mist-gray/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 text-charcoal text-sm"
                />
              </div>

              {/* Campo categoría */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PhotoCategory)}
                  className="w-full px-3 py-2 border border-mist-gray/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 text-charcoal text-sm bg-white"
                >
                  {Object.entries(photoCategoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={!preview || isSaving}
                  onClick={handleAddPhoto}
                >
                  {isSaving ? "Guardando..." : "Guardar foto"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
