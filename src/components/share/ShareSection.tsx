// src/components/share/ShareSection.tsx
// Franja final: un solo CTA premium "Ver evento" (Stripe: sombra en capas
// con tinte de marca + elevación en hover + brillo sweep).
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MailOpen, Heart, Sparkles } from "lucide-react";
import { EventDetails } from "@/types/event";

interface Props {
  babyPhoto: string;
  event: EventDetails;
}

export default function ShareSection({ babyPhoto, event }: Props) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: "linear-gradient(135deg, #701A75 0%, #BE185D 35%, #D97706 70%, #0369A1 100%)" }}>
      {/* Shimmer ambiental */}
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-18deg] pointer-events-none"
        animate={{ x: ["-120%", "420%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
      />
      {/* Estrellitas */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-white/50 animate-twinkle-soft pointer-events-none"
          style={{
            left: `${6 + ((i * 37) % 88)}%`,
            top: `${10 + ((i * 53) % 75)}%`,
            animationDelay: `${(i % 5) * 0.7}s`,
          }}
        >
          <Sparkles size={14 + (i % 3) * 5} />
        </span>
      ))}
      <div className="absolute -top-20 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 14 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white/80"
          style={{ boxShadow: "0 18px 40px -12px rgba(0,0,0,0.45), 0 0 0 6px rgba(255,255,255,0.15)" }}
        >
          {babyPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={babyPhoto} alt="Matthew" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/20">
              <Heart size={36} className="text-white" fill="currentColor" />
            </div>
          )}
        </motion.div>

        <motion.p
          className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-amber-200 mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Celebremos juntos
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-heading-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          {event.title}
        </motion.h2>
        <motion.p
          className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-9"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
        >
          Tenemos una invitación animada preparada con amor para ti y tu familia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 160, damping: 15 }}
        >
          <Link href={`/eventos/${event.id}`} className="inline-block">
            <motion.span
              className="group relative inline-flex items-center gap-3 text-fuchsia-800 font-bold text-lg px-10 py-4 rounded-full bg-white overflow-hidden cursor-pointer"
              style={{ boxShadow: "0 20px 45px -12px rgba(80,10,50,0.55), 0 4px 14px -2px rgba(0,0,0,0.25)" }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {/* Brillo sweep en hover */}
              <span className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-fuchsia-200/70 to-transparent skew-x-[-18deg] -translate-x-[220%] group-hover:translate-x-[320%] transition-transform duration-700 pointer-events-none" />
              <motion.span
                className="relative"
                animate={{ rotate: [0, 18, -14, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6 }}
              >
                <MailOpen size={22} />
              </motion.span>
              <span className="relative">Ver evento</span>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
