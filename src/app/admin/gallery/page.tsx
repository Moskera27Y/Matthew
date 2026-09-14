// src/app/admin/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload } from "lucide-react";
import { Photo } from "@/types/photo";
import { loadPhotos, savePhotos } from "@/services/adminService";
import { photoCategoryLabels } from "@/data/photos";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setPhotos(loadPhotos());
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

  const handleAddFromUrl = () => {
    const url = prompt("Ingresa la URL de la imagen:");
    if (url) {
      const newPhoto: Photo = {
        id: `temp-${Date.now()}`,
        src: url,
        alt: "Nueva foto",
        caption: "Nueva foto de Matthew",
        date: new Date().toISOString().split("T")[0],
        babyAge: { days: 0, weeks: 0, months: 0, years: 0 },
        category: "daily",
        order: photos.length + 1,
      };
      setPhotos([newPhoto, ...photos]);
      savePhotos([newPhoto, ...photos]);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading-bold text-charcoal">
            Gestión de Galería
          </h1>
          <Button variant="primary" size="md" onClick={handleAddFromUrl}>
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
          {filtered.length} {filtered.length === 1 ? "foto" : "fotos"}
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
    </AdminLayout>
  );
}
