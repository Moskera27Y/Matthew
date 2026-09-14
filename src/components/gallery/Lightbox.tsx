// src/components/gallery/Lightbox.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/types/photo";
import { calculateAge } from "@/lib/utils";
import { formatDateES } from "@/lib/utils";
import { photoCategoryLabels } from "@/data/photos";
import { useEffect } from "react";

interface LightboxProps {
  photo: Photo;
  allPhotos: Photo[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  photo,
  allPhotos,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  const age = calculateAge(new Date(photo.date));
  const ageStr = `${age.weeks}w ${age.days % 7}d`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          layoutId={`lightbox-${photo.id}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative max-w-5xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image (nativo <img> — robusto con fotos base64/local) */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
            <img
              src={photo.src}
              alt={photo.alt}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Info overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white p-4 rounded-b-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                {photo.caption && (
                  <p className="text-sm font-light mb-1">{photo.caption}</p>
                )}
                <p className="text-xs opacity-80">
                  📅 {formatDateES(photo.date)} •👶 {ageStr}
                </p>
                {photo.category && (
                  <span className="text-xs opacity-70">
                    {photoCategoryLabels[photo.category]}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </motion.button>
          )}
          {currentIndex < allPhotos.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </motion.button>
          )}
        </motion.div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.3 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          aria-label="Cerrar galería"
        >
          <X size={20} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
