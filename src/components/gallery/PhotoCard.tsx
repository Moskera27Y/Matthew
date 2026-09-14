// src/components/gallery/PhotoCard.tsx
"use client";

import { motion } from "framer-motion";
import { Photo } from "@/types/photo";
import { calculateAge } from "@/lib/utils";
import { photoCategoryLabels } from "@/data/photos";
import { formatDateES } from "@/lib/utils";
import { useState, memo } from "react";

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  index: number;
}

export default memo(function PhotoCard({ photo, onClick, index }: PhotoCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const safeDate = photo.date || "2026-07-31";
  const age = calculateAge(new Date(safeDate));
  const w = Number.isFinite(age.weeks) ? age.weeks : 0;
  const d = Number.isFinite(age.days) ? age.days % 7 : 0;
  const ageStr = `${w}w ${d}d`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
    >
      <motion.div
        layoutId={`lightbox-${photo.id}`}
        whileHover={{ y: -4, scale: 1.01 }}
        onClick={() => onClick(photo)}
        className="group relative cursor-pointer rounded-xl overflow-hidden border border-mist-gray/10 shadow-subtle hover:shadow-strong transition-all duration-300"
      >
        {/* Aspect ratio placeholder */}
        <div className="relative aspect-[4/3] overflow-hidden bg-blush-pink/10">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/20 to-soft-cream animate-pulse rounded-xl" />
          )}
          {/* <img> nativo — robusto con fotos base64/local */}
          <img
            src={photo.src}
            alt={photo.alt}
            className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={index < 12 ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Meta overlay (bottom): caption + categoría + fecha + edad */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-white">
            <p className="text-xs font-light opacity-90 line-clamp-1">
              {photo.caption || photo.alt}
            </p>
            <div className="flex justify-between items-center text-xs opacity-80 mt-1">
              <span>{formatDateES(photo.date).slice(0, 11)}</span>
              <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-sm">
                {photoCategoryLabels[photo.category] || photo.category}
              </span>
              <span>{ageStr}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
