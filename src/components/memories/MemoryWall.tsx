// src/components/memories/MemoryWall.tsx
// Muro de polaroids que reemplaza la línea de tiempo: recuerdos en formato
// instantánea con cinta, rotación editorial y volteo al clic.
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Milestone } from "@/types/milestone";
import PolaroidCard from "./PolaroidCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Camera } from "lucide-react";

interface MemoryWallProps {
  milestones: Milestone[];
}

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "milestone", label: "Logros" },
  { id: "family", label: "Familia" },
  { id: "health", label: "Salud" },
  { id: "travel", label: "Viajes" },
  { id: "food", label: "Comida" },
] as const;

export default function MemoryWall({ milestones }: MemoryWallProps) {
  const [filter, setFilter] = useState<string>("all");

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const visible =
    filter === "all" ? sorted : sorted.filter((m) => m.category === filter);

  return (
    <Container id="recuerdos" size="lg" className="section-alt-1">
      <SectionHeading
        eyebrow="Su historia"
        title="Muro de Recuerdos"
        description="Cada instantánea guarda un pedacito de Matthew. Toca una polaroid para voltearla y leer el recuerdo."
        icon={<Camera size={16} />}
      />

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              filter === f.id
                ? "bg-charcoal text-pearl-white shadow-subtle scale-105"
                : "bg-pearl-white text-taupe border border-mist-gray/20 hover:border-dusty-rose/40 hover:scale-105"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Muro: 1 columna grande en móvil, masonry en pantallas grandes */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 [column-fill:_balance] max-w-sm sm:max-w-none mx-auto">
        <AnimatePresence mode="popLayout">
          {visible.map((m, i) => (
            <PolaroidCard key={m.id} milestone={m} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-center text-mist-gray py-10 text-sm">
          No hay recuerdos en esta categoría todavía.
        </p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-10 text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-mist-gray">
          <Camera size={16} />
          <span>{sorted.length} recuerdos en el muro</span>
        </div>
      </motion.div>
    </Container>
  );
}
