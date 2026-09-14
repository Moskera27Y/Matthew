// src/components/brothers/SiblingsSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Brother, BrotherRole, BrotherCategory, categoryLabels, DEFAULT_BROTHERS } from "@/types/brother";
import { Users, Sparkle, Heart, UserRound, Gift } from "lucide-react";

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

// Mapa de etiquetas legibles para el role
const roleLabels: Record<BrotherRole, string> = {
  primo: "Primo",
  prima: "Prima",
  hermano: "Hermano",
  hermana: "Hermana",
  amigo: "Amigo",
  amiga: "Amiga",
  otro: "Otro",
};

// Icono + color por categoría para los subtítulos
const categoryIcons: Record<BrotherCategory, React.ReactNode> = {
  hermanos: <Users size={22} className="text-fuchsia-500" />,
  primos: <UserRound size={22} className="text-sky-500" />,
  amigos: <Gift size={22} className="text-amber-500" />,
  familia: <Heart size={22} className="text-emerald-500" />,
};

// Sección galería de hermanos/primos — fotos agrupadas por categoría + mensaje overlay
export default function SiblingsSection({ brothers }: Props) {
  const data = brothers && brothers.length > 0 ? brothers : DEFAULT_BROTHERS;

  // Agrupar por categoría (en orden canónico: hermanos, primos, amigos, familia)
  const order: BrotherCategory[] = ["hermanos", "primos", "amigos", "familia"];
  const byCategory = (data || []).reduce<Record<BrotherCategory, Brother[]>>(
    (acc, b) => {
      const cat = b.category || "primos";
      if (!acc[cat]) (acc as Record<BrotherCategory, Brother[]>)[cat] = [];
      (acc as Record<BrotherCategory, Brother[]>)[cat].push(b);
      return acc;
    },
    {} as Record<BrotherCategory, Brother[]>
  );
  // Normalizo claves faltantes
  order.forEach((c) => {
    if (!byCategory[c]) (byCategory as Record<BrotherCategory, Brother[]>)[c] = [];
  });

  return (
    <section
      id="siblings"
      className="section-alt relative bg-gradient-to-br from-sky-50 via-fuchsia-50 to-amber-50 overflow-hidden"
    >
      {/* Partículas flotantes */}\n      <div className="absolute inset-0 pointer-events-none">
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

      {/* Glows difusos */}\n      <div className="absolute top-1/3 left-1/4 w-[280px] h-[280px] bg-gradient-to-r from-fuchsia-300/15 via-transparent to-sky-300/15 rounded-full blur-[70px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[260px] h-[260px] bg-gradient-to-r from-amber-300/15 via-transparent to-emerald-300/15 rounded-full blur-[60px]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header premium */}\n        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
          >
            <Users size={28} className="text-amber-500" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-400">
              Hermanos y Primos
            </h2>
            <Users size={28} className="text-fuchsia-500" />
          </motion.div>
          <p className="text-sm sm:text-base text-charcoal/75 max-w-2xl mx-auto">
            Nuestros pequeños compañeros de aventuras, siempre listos para
            compartir una sonrisa y descubrir el mundo a tu lado. Explora por
            categoría: hermanos, primos, amigos y familia.
          </p>
        </motion.div>

        {/* Galería agrupada por categoría */}\n        {order.map((category) => {
          const group = byCategory[category];
          if (!group || group.length === 0) return null;
          return (
            <motion.div
              key={category}
              className="mb-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Subtítulo de categoría */}\n              <motion.div
                className="flex items-center gap-2 mb-6"
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

              {/* Grid de fotos de esta categoría */}\n              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
        })}

        {/* Estado vacío */}\n        {data.length === 0 && (
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

// Tarjeta galería con foto grande + overlay de mensaje
interface CardProps {
  brother: Brother;
  index: number;
}

function SiblingPhotoCard({ brother, index }: CardProps) {
  const emoji = roleEmojis[brother.role] || "🧡";
  const [show, setShow] = useState(false);

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
      {/* Glow animado */}\n      <motion.div
        className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-r from-fuchsia-300 via-pink-300 via-amber-300 to-sky-300 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
        aria-hidden
      />

      <motion.div
        className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blush-pink/20 via-sky-100/30 to-amber-100/30"
      >
        {/* Foto del hermano/primo — GRANDE y central */}\n        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
          <img
            src={brother.photoUrl}
            alt={brother.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay oscuro con mensaje */}\n          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex flex-col justify-end p-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{emoji}</span>
              <h3 className="text-xl font-heading-bold">{brother.name}</h3>
              {brother.age && <span className="text-sm opacity-80">• {brother.age}</span>}
            </div>

            {/* Mensaje — alusión a la foto */}\n            <motion.p
              className="text-sm opacity-90 leading-relaxed italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
              transition={{ delay: 0.1 }}
            >
              "{brother.message}"
            </motion.p>
          </motion.div>
        </div>

        {/* Badge rol */}\n        <motion.div
          className="absolute top-3 right-3 bg-white/20 backdrop-blur rounded-full px-2 py-1 text-xs"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.12, type: "spring" }}
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
