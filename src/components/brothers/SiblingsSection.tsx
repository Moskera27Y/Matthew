// src/components/brothers/SiblingsSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Brother, BrotherRole, DEFAULT_BROTHERS } from "@/types/brother";
import { Users, Sparkle } from "lucide-react";

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

// Sección galería de hermanos/primos — fotos + mensaje overlay
export default function SiblingsSection({ brothers }: Props) {
  const data = brothers && brothers.length > 0 ? brothers : DEFAULT_BROTHERS;

  return (
    <section id="siblings" className="section-alt relative bg-gradient-to-br from-sky-50 via-fuchsia-50 to-amber-50 overflow-hidden">
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
        {/* Header premium */}
        <motion.div
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
            Nuestros pequeños compañeros de aventuras, siempre listos para compartir
            una sonrisa y descubrir el mundo a tu lado.
          </p>
        </motion.div>

        {/* Galería de fotos — grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {data.map((brother, i) => (
            <SiblingPhotoCard key={brother.id} brother={brother} index={i} />
          ))}
        </motion.div>
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
      {/* Glow animado */}
      <motion.div
        className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-r from-fuchsia-300 via-pink-300 via-amber-300 to-sky-300 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
        aria-hidden
      />

      <motion.div
        className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blush-pink/20 via-sky-100/30 to-amber-100/30"
      >
        {/* Foto del hermano/primo — GRANDE y central */}
        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
          <img
            src={brother.photoUrl}
            alt={brother.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay oscuro con mensaje */}
          <motion.div
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

            {/* Mensaje — alusión a la foto */}
            <motion.p
              className="text-sm opacity-90 leading-relaxed italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
              transition={{ delay: 0.1 }}
            >
              "{brother.message}"
            </motion.p>
          </motion.div>
        </div>

        {/* Badge rol */}
        <motion.div
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
