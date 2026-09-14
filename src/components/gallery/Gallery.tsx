// src/components/gallery/Gallery.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/types/photo";
import PhotoCard from "./PhotoCard";
import Lightbox from "./Lightbox";
import GalleryFilters from "./GalleryFilters";
import Container from "@/components/ui/Container";
import { Images } from "lucide-react";

interface GalleryProps {
  photos: Photo[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCategory =
        !activeCategory || photo.category === activeCategory;
      const matchesMonth = !activeMonth || photo.date.includes("-0");

      // Simple month match by checking the month name in date
      const monthMatch =
        !activeMonth ||
        (activeMonth === "agosto" && photo.date.includes("-08-")) ||
        (activeMonth === "septiembre" && photo.date.includes("-09-")) ||
        (activeMonth === "octubre" && photo.date.includes("-10-"));

      return matchesCategory && monthMatch;
    });
  }, [photos, activeCategory, activeMonth]);

  const sortedPhotos = useMemo(() => {
    return [...filteredPhotos].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredPhotos]);

  const openLightbox = (photo: Photo) => {
    setCurrentPhoto(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setCurrentPhoto(null), 300);
  };

  const showNext = () => {
    if (!currentPhoto) return;
    const idx = sortedPhotos.findIndex((p) => p.id === currentPhoto.id);
    if (idx < sortedPhotos.length - 1) {
      setCurrentPhoto(sortedPhotos[idx + 1]);
    }
  };

  const showPrev = () => {
    if (!currentPhoto) return;
    const idx = sortedPhotos.findIndex((p) => p.id === currentPhoto.id);
    if (idx > 0) {
      setCurrentPhoto(sortedPhotos[idx - 1]);
    }
  };

  return (
    <Container id="gallery" size="lg" className="section-alt-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
          Galería de Fotos
        </h2>
        <p className="text-sm sm:text-base text-mist-gray max-w-2xl mx-auto">
          Cada instantánea captura un pedacito del corazón de Matthew.
          Explora por mes, categoría, o déjate llevar por el recuerdo.
        </p>
      </motion.div>

      {/* Filtros */}
      <GalleryFilters
        activeCategory={activeCategory}
        activeMonth={activeMonth}
        onFilterCategory={setActiveCategory}
        onFilterMonth={setActiveMonth}
      />

      {/* Contador de fotos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <p className="text-sm text-mist-gray">
          {sortedPhotos.length} {sortedPhotos.length === 1 ? "foto" : "fotos"} •{" "}
          {filteredPhotos.length !== photos.length && "filtradas"}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-mist-gray">
          <Images size={14} />
          <span>{photos.length} fotos en total</span>
        </div>
      </motion.div>

      {/* Grid Masonry (Desktop) / Carousel (Mobile) */}
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          layout
        >
          {sortedPhotos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-mist-gray">
                No se encontraron fotos con esos filtros.
              </p>
            </motion.div>
          ) : (
            sortedPhotos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onClick={openLightbox}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxOpen && currentPhoto && (
        <Lightbox
          photo={currentPhoto}
          allPhotos={sortedPhotos}
          onClose={closeLightbox}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}
    </Container>
  );
}
