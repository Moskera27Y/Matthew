// src/components/events/HomeEventPreview.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";

interface Props {
  event: EventDetails;
}

// Mini vista previa del sobre en la homepage — abre /eventos en nueva pestaña
export default function HomeEventPreview({ event }: Props) {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-fuchsia-50 to-sky-50 relative overflow-hidden">
      {/* Partículas sutiles de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-300/40 to-pink-300/30"
            style={{
              width: `${6 + Math.random() * 4}px`,
              height: `${6 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 text-amber-600 mb-3"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Star size={24} className="fill-current" />
            <span className="text-sm font-bold tracking-widest uppercase">Evento Especial</span>
            <Star size={24} className="fill-current" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-heading-bold text-charcoal mb-3">
            {event.title}
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            {event.description}
          </p>
        </motion.div>

        {/* Vista previa del sobre + detalles */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {/* Mini sobre */}
          <motion.div
            className="relative w-48 h-32 [perspective:800px] [transform-style:preserve-3d]"
            whileHover={{ scale: 1.05, rotateY: 3 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <div className="absolute inset-0 mx-auto w-full h-full bg-gradient-to-br from-blush-pink via-warm-gold to-dusty-rose rounded-[1.5rem] shadow-strong border-4 border-pearl-white [transform-style:preserve-3d]">
              {/* Solapa */}
              <div
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-dusty-rose via-blush-pink to-warm-gold origin-bottom border-b-3 border-pearl-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Detalle dorado */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full shadow-glow" />
            </div>
          </motion.div>

          {/* Detalles del evento */}
          <motion.div
            className="flex-1 max-w-lg text-center md:text-left space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-3">
              <motion.div
                className="flex items-center md:justify-start gap-3 text-charcoal"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-300 flex items-center justify-center"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <Calendar size={20} className="text-fuchsia-700" />
                </motion.div>
                <span className="text-lg font-medium">{formatDateES(event.date)}</span>
              </motion.div>

              <motion.div
                className="flex items-center md:justify-start gap-3 text-charcoal"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center"
                  whileHover={{ scale: 1.15, rotate: -5 }}
                >
                  <Clock size={20} className="text-sky-700" />
                </motion.div>
                <span className="text-lg font-medium">{event.time}</span>
              </motion.div>

              <motion.div
                className="flex items-center md:justify-start gap-3 text-charcoal"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <MapPin size={20} className="text-amber-700" />
                </motion.div>
                <span className="text-lg font-medium">{event.location}</span>
              </motion.div>
            </div>

            {/* CTA — abre /eventos en nueva pestaña */}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.75 }}
            >
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 text-white font-bold py-4 px-8 rounded-2xl shadow-glow hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open("/eventos", "_blank", "noopener,noreferrer");
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-pink-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(90deg, var(--tw-gradient-stops))" }}
                />
                <span className="relative z-10">Abrir invitación</span>
                <motion.span
                  className="relative z-10 text-xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  💌
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mensaje inferior */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.85 }}
        >
          <p className="text-sm text-charcoal/60">
            ¡Comparte la invitación y celebra con nosotros!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
