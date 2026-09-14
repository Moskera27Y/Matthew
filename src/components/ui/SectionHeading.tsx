// src/components/ui/SectionHeading.tsx
// Encabezado unificado premium para todas las secciones del homepage:
// eyebrow + icono + título degradado + subrayado + descripción.
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function SectionHeading({ eyebrow, title, description, icon }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center mb-12 sm:mb-16"
    >
      <motion.p
        className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-fuchsia-700 mb-3"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, type: "spring", stiffness: 160 }}
      >
        {icon && <span className="text-amber-500">{icon}</span>}
        {eyebrow}
        {icon && <span className="text-amber-500">{icon}</span>}
      </motion.p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-700 via-rose-500 to-amber-500 pb-2">
        {title}
      </h2>
      <motion.div
        className="mx-auto mt-3 h-1 w-24 rounded-full"
        style={{ background: "linear-gradient(90deg, #D946EF, #F59E0B, #0EA5E9)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />
      {description && (
        <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto mt-4">
          {description}
        </p>
      )}
    </motion.div>
  );
}
