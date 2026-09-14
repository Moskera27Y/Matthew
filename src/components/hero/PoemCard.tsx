// src/components/hero/PoemCard.tsx
// Tarjeta poema premium — reemplaza al contador numérico "Matthew tiene:".
"use client";

import { motion } from "framer-motion";
import { Quote, Heart } from "lucide-react";

const VERSES = [
  "Pequeño milagro, latido a latido,",
  "tu risa ilumina hasta el último rincón.",
  "Cada arrullo, cada suspiro, un verso",
  "que el corazón escribe sin pausa, sin retorno.",
  "Matthew, eres el sueño que no quiero despertar.",
];

export default function PoemCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mt-12"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-md shadow-card border border-white/60 px-7 py-8 sm:px-10 text-center">
        {/* Borde superior degradado */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: "linear-gradient(90deg, #D946EF, #F59E0B, #0EA5E9)" }}
        />
        {/* Glows internos */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-fuchsia-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <p className="relative text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-fuchsia-700 mb-4">
          Un poema para Matthew
        </p>

        <Quote size={28} className="relative mx-auto mb-3 text-amber-400" fill="currentColor" />

        <div className="relative space-y-1.5">
          {VERSES.map((verse, i) => (
            <motion.p
              key={i}
              className={`font-decorative italic leading-snug ${
                i === VERSES.length - 1
                  ? "text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 font-semibold pt-2"
                  : "text-lg sm:text-xl text-charcoal/85"
              }`}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.9 + i * 0.18, duration: 0.7, ease: "easeOut" }}
            >
              {verse}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="relative mt-5 flex items-center justify-center gap-2 text-sky-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + VERSES.length * 0.18 }}
        >
          <Heart size={13} fill="currentColor" className="text-fuchsia-500 animate-pulse" />
          <span className="text-xs font-medium tracking-wide">con amor, para siempre</span>
          <Heart size={13} fill="currentColor" className="text-amber-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
