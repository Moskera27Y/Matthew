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
  // Ritmo editorial: alturas variadas que se repiten cada 6 fotos
  const aspects = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[4/5]"];
  const aspect = aspects[index % aspects.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (index % 6) * 0.06,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="break-inside-avoid mb-4 sm:mb-5"
    >
      <motion.div
        layoutId={`lightbox-${photo.id}`}
        whileHover={{ y: -6 }}
        onClick={() => onClick(photo)}
        className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/50 shadow-subtle hover:shadow-strong transition-all duration-300"
      >
        {/* Aspecto variable editorial */}
        <div className={`relative ${aspect} overflow-hidden bg-blush-pink/10`}>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/20 to-soft-cream animate-pulse rounded-2xl" />
          )}
          {/* <img> nativo — robusto con fotos base64/local */}
          <img
            src={photo.src}
            alt={photo.alt}
            className={`object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-[0.5deg] ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={index < 12 ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Caption siempre visible (táctil-friendly) con gradiente */}
          <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 bg-gradient-to-t from-black/55 via-black/20 to-transparent text-white">
            <p className="text-xs font-medium line-clamp-1 drop-shadow">
              {photo.caption || photo.alt}
            </p>
            <div className="flex justify-between items-center text-[11px] opacity-90 mt-1">
              <span>{formatDateES(photo.date).slice(0, 11)}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm font-medium">
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
