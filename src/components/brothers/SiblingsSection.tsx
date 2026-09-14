// src/components/brothers/SiblingsSection.tsx — galería homepage mobile-first
"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Brother, BrotherRole, BrotherCategory, categoryLabels, DEFAULT_BROTHERS } from "@/types/brother";
import { Users, Sparkle, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";

interface Props {
  brothers?: Brother[];
}

const roleEmojis: Record<BrotherRole, string> = {
  primo: "👦",
  prima: "👧",
  hermano: "👦",
  hermana: "👧",
  amigo: "🤝",
  amiga: "🤗",
  otro: "🧡",
};

const roleLabels: Record<BrotherRole, string> = {
  primo: "Primo",
  prima: "Prima",
  hermano: "Hermano",
  hermana: "Hermana",
  amigo: "Amigo",
  amiga: "Amiga",
  otro: "Otro",
};

// Orden canónico de categorías para los subtítulos
const CATEGORY_ORDER: BrotherCategory[] = ["hermanos", "primos", "amigos", "familia"];

// Icono por categoría
const categoryIcons: Record<BrotherCategory, React.ReactElement> = {
  hermanos: <Users size={20} className="text-fuchsia-500" />,
  primos: <Users size={20} className="text-sky-500" />,
  amigos: <HeartHandshake size={20} className="text-amber-500" />,
  familia: <Users size={20} className="text-mint-500" />,
};

export default function SiblingsSection({ brothers }: Props) {
  const data: Brother[] = brothers && brothers.length > 0 ? brothers : DEFAULT_BROTHERS;

  // Agrupar por categoría en orden canónico
  const byCategory = data.reduce<Partial<Record<BrotherCategory, Brother[]>>>(
    (acc, b) => {
      const cat: BrotherCategory = b.category || "primos";
      if (!cat) return acc;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(b);
      return acc;
    },
    {}
  );

  const hasAny = CATEGORY_ORDER.some((c) => (byCategory[c] || []).length > 0);

  return (
    <section
      id="siblings"
      className="section-alt relative bg-gradient-to-br from-sky-50 via-fuchsia-50 to-amber-50 overflow-hidden py-16 sm:py-20"
    >
      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-300/25 to-pink-300/20 animate-pulse"
            style={{
              width: `${4 + Math.random() * 3}px`,
              height: `${4 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Glows difusos */}
      <div className="absolute top-1/3 left-1/4 w-[280px] h-[280px] bg-gradient-to-r from-fuchsia-300/15 via-transparent to-sky-300/15 rounded-full blur-[70px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[260px] h-[260px] bg-gradient-to-r from-amber-300/15 via-transparent to-emerald-300/15 rounded-full blur-[60px]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header unificado */}
        <SectionHeading
          eyebrow="Compañeros"
          title="Hermanos y Primos"
          description="Nuestros pequeños compañeros de aventuras, siempre listos para compartir una sonrisa y descubrir el mundo a tu lado. Explora por categoría."
          icon={<Users size={16} />}
        />

        {/* Galería agrupada por categoría */}
        {hasAny ? (
          CATEGORY_ORDER.map((category) => {
            const group = byCategory[category] || [];
            if (group.length === 0) return null;
            return (
              <motion.div
                key={category}
                className="mb-10 sm:mb-12"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Subtítulo de categoría */}
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 px-1"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {categoryIcons[category]}
                  <h3 className="text-xl sm:text-2xl font-heading-bold text-charcoal">
                    {categoryLabels[category]}
                  </h3>
                  <div className="flex-1 h-px bg-mist-gray/20" />
                  <span className="text-xs text-mist-gray/60">
                    {group.length} foto{group.length > 1 ? "s" : ""}
                  </span>
                </motion.div>

                {/* Grid responsive: 1 / 2 / 3 */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                >
                  {group.map((brother, i) => (
                    <SiblingPhotoCard key={brother.id} brother={brother} index={i} />
                  ))}
                </motion.div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="text-center py-16 text-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users size={48} className="mx-auto mb-4" />
            <p>Aún no hay hermanos registrados.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Tarjeta galería: foto grande + overlay de mensaje — responsive y robusta
interface CardProps {
  brother: Brother;
  index: number;
}

function SiblingPhotoCard({ brother, index }: CardProps) {
  const emoji = roleEmojis[brother.role] || "🧡";
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imgSrc =
    (imgError ? "" : brother.photoUrl) || "/images/placeholder-brother-1.svg";

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        type: "spring",
        stiffness: 90,
        damping: 16,
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* Glow animado */}
      <motion.div
        className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-r from-fuchsia-300 via-pink-300 via-amber-300 to-sky-300 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
        aria-hidden
      />

      <motion.div
        className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blush-pink/20 via-sky-100/30 to-amber-100/30"
      >
        {/* Foto grande, central, responsive */}
        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
          <img
            src={imgSrc}
            alt={brother.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />

          {/* Overlay mensaje */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{emoji}</span>
              <h3 className="text-xl font-heading-bold">{brother.name}</h3>
              {brother.age && <span className="text-sm opacity-80">• {brother.age}</span>}
            </div>
            <motion.p
              className="text-sm opacity-90 leading-relaxed italic line-clamp-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
              transition={{ delay: 0.1 }}
            >
              "{brother.message}"
            </motion.p>
          </motion.div>
        </div>

        {/* Badge rol top-right */}
        <motion.div
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/20 backdrop-blur rounded-full px-2 py-1 text-xs"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="flex items-center gap-1">
            <Sparkle size={10} className="text-amber-300 fill-current" />
            {roleLabels[brother.role]}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
