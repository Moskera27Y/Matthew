// src/components/events/EventInvitationClient.tsx
// Versión rehecha: sobre 3D colorido + apertura espectacular + toda la info REAL del evento.
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Download,
  ArrowLeft,
} from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  event: EventDetails;
  babyPhoto: string;
  autoOpen?: boolean;
}

// Colores vibrantes para confeti + glows
const CONFETTI_COLORS = [
  "#FF3E96", "#00D1FF", "#7AFF64", "#FFD166",
  "#FF72D5", "#06FFA5", "#FF6B6B", "#7B61FF",
];

export default function EventInvitationClient({ event, babyPhoto, autoOpen = false }: Props) {
  const [isOpened, setIsOpened] = useState(false);

  // Partículas de fondo (reduced para mobile: 25 en vez de 40)
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      })),
    []
  );

  // Confeti de apertura (reduced: 30 en vez de 80 — previene jank mobile)
  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.8 + Math.random() * 0.6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 8,
      })),
    []
  );

  useEffect(() => {
    if (!autoOpen) return;
    const timer = setTimeout(() => setIsOpened(true), 300);
    return () => clearTimeout(timer);
  }, [autoOpen]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-100 via-pink-50 to-amber-100 px-4 py-12">
      {/* Partículas flotantes vibrantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Confeti al abrir */}
      <AnimatePresence>
        {isOpened &&
          confetti.map((c) => (
            <motion.div
              key={`confetti-${c.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${c.x}%`,
                top: "40%",
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
              }}
              initial={{ opacity: 0, y: -20, scale: 0.5, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 600],
                rotate: 720,
                scale: [0.5, 1, 0.5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "easeOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Glows difusos */}
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-gradient-to-r from-fuchsia-300/25 via-transparent to-sky-300/25 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-gradient-to-r from-amber-300/25 via-transparent to-emerald-300/25 rounded-full blur-[70px]" />

      {/* Back arrow */}
      <Link href="/eventos" passHref>
        <motion.div
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-charcoal hover:text-fuchsia-700 transition-colors cursor-pointer font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Volver a eventos</span>
        </motion.div>
      </Link>

      <motion.div
        className="relative max-w-2xl w-full mx-auto z-10"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Glows envolventes */}
        <motion.div
          className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-amber-300 via-white via-fuchsia-300 to-sky-300 opacity-0 blur-2xl"
          animate={{ opacity: isOpened ? 0.6 : 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.div
          className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r from-fuchsia-400 via-amber-300 to-sky-400 opacity-0 blur-[3px]"
          animate={{ opacity: isOpened ? 0.4 : 0 }}
          transition={{ duration: 1, delay: 0.85 }}
        />

        {/* SOBRE 3D con solapa que se abre + carta deslizante */}
        <div
          className="relative w-full h-[28rem] [perspective:1600px] [transform-style:preserve-3d]"
          onClick={() => setIsOpened((prev) => !prev)}
        >
          {/* Cuerpo del sobre — 3D */}
          <motion.div
            className="absolute inset-0 mx-auto w-4/5 h-full bg-gradient-to-br from-blush-pink via-dusty-rose to-warm-gold rounded-[3rem] shadow-strong border-8 border-pearl-white [transform-style:preserve-3d]"
            style={{ left: "0", right: "0" }}
            animate={{ rotateY: isOpened ? -6 : 0 }}
            transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1], delay: isOpened ? 0.2 : 0 }}
          >
            {/* SOLAPA superior — rotateX(180) 3D al abrir */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-dusty-rose via-blush-pink to-warm-gold origin-bottom border-b-4 border-pearl-white rounded-t-[3rem]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", zIndex: 10 }}
              initial={{ rotateX: 0, zIndex: 10 }}
              animate={{ rotateX: isOpened ? 180 : 0, zIndex: isOpened ? 1 : 10 }}
              transition={{
                duration: 1,
                delay: isOpened ? 0.3 : 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
            {/* Overlay difuminado tras la solapa */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-white/10 backdrop-blur origin-bottom"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: isOpened ? 0 : 0.2 }}
              transition={{ duration: 0.6 }}
            />

            {/* Foto del bebé dentro del sobre (visible antes de abrir) */}
            {!isOpened && babyPhoto && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-28 h-28 rounded-full overflow-hidden border-4 border-white/90 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: isOpened ? 0 : 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150, duration: 0.8 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={babyPhoto} alt="Matthew" className="object-cover w-full h-full" />
              </motion.div>
            )}
          </motion.div>

          {/* CARTA — se desliza hacia arriba + hace zoom al abrir */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 mx-6 mb-4 bg-gradient-to-br from-pearl-white via-amber-50/60 to-pearl-white rounded-[2.5rem] border-2 border-white border-opacity-60 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: "100%", scale: 0.85 }}
            animate={{
              opacity: isOpened ? 1 : 0,
              y: isOpened ? "0%" : "100%",
              scale: isOpened ? 1 : 0.85,
            }}
            transition={{ duration: 1, delay: isOpened ? 0.8 : 0, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="p-8 text-center text-charcoal">
              {/* Título del evento — info REAL */}
              <motion.h2
                className="text-4xl sm:text-5xl font-heading-bold mb-3 text-fuchsia-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 12 }}
                transition={{ delay: isOpened ? 1.0 : 0 }}
              >
                {event.title}
              </motion.h2>

              {/* Emoji + fecha destacada */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isOpened ? 1 : 0, scale: isOpened ? 1 : 0 }}
                transition={{ delay: isOpened ? 1.1 : 0, type: "spring" }}
              >
                <Calendar size={20} className="text-fuchsia-600" />
                <span className="text-xl font-medium text-charcoal">
                  {formatDateES(event.date)}
                </span>
              </motion.div>

              {/* Hora */}
              <motion.p
                className="text-lg text-sky-700 mb-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 10 }}
                transition={{ delay: isOpened ? 1.2 : 0 }}
              >
                <Clock size={18} className="text-sky-600" />
                <span>Hora: {event.time}</span>
              </motion.p>

              {/* Descripción */}
              {event.description && (
                <motion.p
                  className="text-lg text-charcoal/85 mb-7 leading-relaxed max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 10 }}
                  transition={{ delay: isOpened ? 1.3 : 0 }}
                >
                  {event.description}
                </motion.p>
              )}

              {/* Detalles: fecha, hora, lugar — info REAL */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-7 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpened ? 1 : 0 }}
                transition={{ delay: isOpened ? 1.4 : 0 }}
              >
                <motion.div
                  className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isOpened ? 1 : 0, x: isOpened ? 0 : -20 }}
                  transition={{ delay: isOpened ? 1.45 : 0 }}
                >
                  <Calendar size={18} className="text-fuchsia-600" />
                  <div>
                    <span className="text-xs text-mist-gray">Fecha</span>
                    <p className="text-sm font-medium">{formatDateES(event.date)}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 p-3 bg-sky-50/60 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isOpened ? 1 : 0, x: isOpened ? 0 : 20 }}
                  transition={{ delay: isOpened ? 1.45 : 0 }}
                >
                  <Clock size={18} className="text-sky-600" />
                  <div>
                    <span className="text-xs text-mist-gray">Hora</span>
                    <p className="text-sm font-medium">{event.time}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="sm:col-span-2 flex items-start gap-3 p-3 bg-mint-50/60 rounded-xl"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 15 }}
                  transition={{ delay: isOpened ? 1.55 : 0 }}
                >
                  <MapPin size={18} className="text-amber-600 mt-0.5" />
                  <div>
                    <span className="text-xs text-mist-gray">Lugar</span>
                    <p className="text-sm font-medium">{event.location}</p>
                    {event.address && (
                      <p className="text-sm text-charcoal/70">{event.address}</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Mensaje de agradecimiento — info REAL */}
              {event.thankYouMessage && (
                <motion.div
                  className="bg-gradient-to-br from-amber-100/60 via-white to-sky-100/60 rounded-2xl p-5 mb-7 border-2 border-dashed border-amber-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 10 }}
                  transition={{ delay: isOpened ? 1.7 : 0 }}
                >
                  <p className="text-base italic text-charcoal/90 leading-relaxed">
                    "{event.thankYouMessage}"
                  </p>
                </motion.div>
              )}

              {/* Botones: Compartir + Imprimir */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 15 }}
                transition={{ delay: isOpened ? 1.85 : 0 }}
              >
                <Button
                  variant="outline"
                  size="md"
                  className="border-2 border-sky-300 text-sky-700 hover:bg-sky-50 font-medium"
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: event.title, url });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("¡Link copiado! Compártelo 🎉");
                    }
                  }}
                >
                  <Share2 size={16} className="mr-1" />
                  Compartir
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium"
                  onClick={() => window.print()}
                >
                  <Download size={16} className="mr-1" />
                  Imprimir
                </Button>
              </motion.div>

              {/* Firma */}
              <motion.div
                className="mt-6 flex items-center justify-center gap-2 text-sky-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpened ? 1 : 0 }}
                transition={{ delay: isOpened ? 2.0 : 0 }}
              >
                <Heart size={14} fill="currentColor" className="text-fuchsia-500 animate-pulse" />
                <span className="text-sm font-medium">con amor de Matthew 💙</span>
                <Heart size={14} fill="currentColor" className="text-sky-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </motion.div>
            </div>
          </motion.div>

          {/* Hint "click para abrir / cerrar" */}
          <AnimatePresence>
            {!isOpened && (
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white/80 font-medium flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Haz click para abrir 💌
              </motion.div>
            )}
            {isOpened && (
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white/80 font-medium flex items-center gap-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Haz click para cerrar ✕
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
