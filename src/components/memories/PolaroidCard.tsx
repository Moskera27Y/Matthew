// src/components/memories/PolaroidCard.tsx
// Polaroid individual: frente con foto + cinta, clic → voltea y muestra el recuerdo.
"use client";

import { motion } from "framer-motion";
import { Milestone } from "@/types/milestone";
import { ageString } from "@/data/milestones";
import { formatDateES } from "@/lib/utils";
import { MapPin, CalendarHeart } from "lucide-react";
import { useState } from "react";

interface PolaroidCardProps {
  milestone: Milestone;
  index: number;
}

// Rotaciones deterministas (sin Math.random en render)
const TILTS = [-3, 2.2, -1.6, 3, -2.4, 1.8, -3.4, 2.6];
const TAPES = [-8, 6, -4, 9, -6, 4];

const categoryDots: Record<string, string> = {
  health: "bg-emerald-400",
  milestone: "bg-dusty-rose",
  travel: "bg-sky-soft",
  food: "bg-amber-400",
  family: "bg-lavender-soft",
};

export default function PolaroidCard({ milestone, index }: PolaroidCardProps) {
  const [flipped, setFlipped] = useState(false);
  const tilt = TILTS[index % TILTS.length];
  const tapeTilt = TAPES[index % TAPES.length];
  const photo = milestone.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 8) * 0.07, type: "spring", stiffness: 120, damping: 16 }}
      whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
      onClick={() => setFlipped((v) => !v)}
      className="cursor-pointer break-inside-avoid mb-5"
      style={{ perspective: 900 }}
      title={flipped ? "Clic para ver la foto" : "Clic para leer el recuerdo"}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0.2, 0.2, 1] }}
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ===== FRENTE ===== */}
        <div
          className="relative bg-white rounded-sm shadow-subtle hover:shadow-strong transition-shadow duration-300 pt-3 px-3 pb-4"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Cinta adhesiva */}
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-200/70 border-x border-dashed border-amber-300/60 shadow-sm z-10"
            style={{ transform: `translateX(-50%) rotate(${tapeTilt}deg)` }}
          />
          {/* Foto */}
          <div className="relative aspect-square overflow-hidden bg-blush-pink/10">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={milestone.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blush-pink/30 via-soft-cream to-sky-soft/20">
                <CalendarHeart size={36} className="text-dusty-rose/60" />
                <span className="text-xs text-taupe/60 px-4 text-center">
                  {milestone.title}
                </span>
              </div>
            )}
          </div>
          {/* Pie manuscrito */}
          <div className="pt-2.5 pb-0.5 text-center">
            <p className="font-decorative text-lg text-charcoal leading-tight line-clamp-2">
              {milestone.title}
            </p>
            <p className="text-[11px] text-mist-gray mt-0.5">
              {formatDateES(milestone.date)}
            </p>
          </div>
          {/* Punto de categoría */}
          <span
            className={`absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full ${categoryDots[milestone.category] || "bg-mist-gray"}`}
          />
        </div>

        {/* ===== REVERSO ===== */}
        <div
          className="absolute inset-0 bg-pearl-white rounded-sm shadow-strong p-4 flex flex-col overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center border-b border-dashed border-mist-gray/25 pb-2 mb-2">
            <p className="font-decorative text-xl text-charcoal leading-tight line-clamp-1">
              {milestone.title}
            </p>
            <p className="text-[11px] text-dusty-rose font-semibold mt-0.5">
              {formatDateES(milestone.date)} • {ageString(milestone.babyAge)}
            </p>
          </div>
          <p className="text-[13px] text-taupe leading-relaxed overflow-y-auto flex-1">
            {milestone.description || "Un momento hermoso de Matthew."}
          </p>
          {milestone.location && (
            <p className="flex items-center gap-1 text-[11px] text-mist-gray mt-2">
              <MapPin size={11} /> {milestone.location}
            </p>
          )}
          {milestone.parentNote && (
            <p className="text-[11px] text-taupe italic mt-1.5 border-l-2 border-dusty-rose/30 pl-2 line-clamp-3">
              “{milestone.parentNote}”
            </p>
          )}
          <p className="text-center text-[10px] text-mist-gray/70 mt-2">
            Clic para volver a la foto
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
