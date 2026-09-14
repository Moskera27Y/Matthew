// src/components/events/EventInvitationClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, MapPin, Heart, Share2, Download, ArrowLeft, Star } from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  event: EventDetails;
  babyPhoto: string;
  autoOpen?: boolean; // si es false, el sobre queda cerrado hasta el click del usuario
}

const GOLDEN_GRADIENT =
  "linear-gradient(135deg, #FFD8A8 0%, #FFE0D9 50%, #FFD8A8 100%)";

export default function EventInvitationClient({ event, babyPhoto, autoOpen = true }: Props) {
  const [isOpened, setIsOpened] = useState(false);

  // Partículas doradas flotantes de fondo
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
      })),
    []
  );

  // Confeti colorido al abrir (efecto infantil)
  const confettiColors = ["#FF3E96", "#00D1FF", "#7AFF64", "#FFD166", "#FF72D5", "#06FFA5"];
  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 120 - 10,
        delay: Math.random() * 1.5,
        duration: 1.2 + Math.random() * 0.8,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 6,
      })),
    []
  );

  // Abrir el sobre automáticamente tras unos milisegundos (solo si autoOpen)
  useEffect(() => {
    if (!autoOpen) return;
    const timer = setTimeout(() => setIsOpened(true), 500);
    return () => clearTimeout(timer);
  }, [autoOpen]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-fuchsia-100 via-sky-50 to-amber-50 flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Partículas doradas flotantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Confeti animado al abrir el sobre */}
      <AnimatePresence>
        {isOpened &&
          confetti.map((c) => (
            <motion.div
              key={`confetti-${c.id}`}
              className="absolute"
              style={{
                left: `${c.x}%`,
                top: "50%",
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                borderRadius: "50% 0",
              }}
              initial={{ opacity: 0, y: -30, rotate: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 500],
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

      {/* Glows difusos vibrantes */}
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-gradient-to-r from-fuchsia-300/20 via-transparent to-sky-300/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-gradient-to-r from-amber-300/20 via-transparent to-emerald-300/20 rounded-full blur-[70px]" />

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
        {/* Brillo envolvente al abrir */}
        <motion.div
          className="absolute -inset-3 rounded-[3rem] bg-gradient-to-r from-amber-200 via-white via-fuchsia-200 to-sky-200 opacity-0 blur-2xl"
          animate={{ opacity: isOpened ? 0.6 : 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.div
          className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r from-fuchsia-400 via-amber-300 to-sky-300 opacity-0 blur-[3px]"
          animate={{ opacity: isOpened ? 0.4 : 0 }}
          transition={{ duration: 1, delay: 0.85 }}
        />

        {/* SOBRE — con solapa que se abre y carta que se desliza */}
        <div
          className="relative w-full h-[26rem] [perspective:1400px] [transform-style:preserve-3d]"
          onClick={() => !isOpened && setIsOpened(true)}
        >
          {/* Base del sobre (cuerpo) */}
          <motion.div
            className="absolute inset-0 mx-auto w-4/5 h-full bg-gradient-to-br from-blush-pink via-warm-gold to-dusty-rose rounded-[2.5rem] shadow-strong border-8 border-pearl-white [transform-style:preserve-3d]"
            style={{ left: "0", right: "0" }}
            animate={{ rotateY: isOpened ? -8 : 0 }}
            transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1], delay: isOpened ? 0.2 : 0 }}
          >
            {/* SOLAPA superior — se pliega hacia atrás al abrir (rotateX) */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-dusty-rose via-blush-pink to-warm-gold origin-bottom border-b-4 border-pearl-white"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                zIndex: 10,
              }}
              initial={{ rotateX: 0, zIndex: 10 }}
              animate={{
                rotateX: isOpened ? 180 : 0,
                zIndex: isOpened ? 1 : 10,
              }}
              transition={{
                duration: 1,
                delay: isOpened ? 0.3 : 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />

            {/* Overlay difuminado tras la solapa al abrir */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-white/10 backdrop-blur origin-bottom"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: isOpened ? 0 : 0.2 }}
              transition={{ duration: 0.6 }}
            />

            {/* CARTA / tarjeta — se desliza hacia arriba y hace zoom al abrir */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 mx-6 mb-4 bg-gradient-to-br from-pearl-white via-amber-50/80 to-pearl-white rounded-3xl border-2 border-white border-opacity-60 overflow-hidden shadow-2xl"
              initial={{
                opacity: 0,
                y: "100%",
                scale: 0.85,
              }}
              animate={{
                opacity: isOpened ? 1 : 0,
                y: isOpened ? "0%" : "100%",
                scale: isOpened ? 1 : 0.85,
              }}
              transition={{
                duration: 1,
                delay: isOpened ? 0.8 : 0,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {/* Contenido de la carta */}
              <div className="p-8 text-center text-charcoal">
                {/* Foto del bebé */}
                <motion.div
                  className="mx-auto mb-5"
                  initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
                  animate={{
                    scale: isOpened ? 1 : 0.4,
                    opacity: isOpened ? 1 : 0,
                    rotate: isOpened ? 0 : -10,
                  }}
                  transition={{ delay: isOpened ? 1.0 : 0, duration: 0.7, type: "spring", stiffness: 120 }}
                >
                  {babyPhoto ? (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={babyPhoto}
                        alt="Matthew"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-100 to-blush-pink/40 border-4 border-white shadow-xl flex items-center justify-center">
                      <span className="text-5xl">💌</span>
                    </div>
                  )}
                </motion.div>

                {/* Título */}
                <motion.h2
                  className="text-4xl font-heading-bold mb-2 text-fuchsia-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 10 }}
                  transition={{ delay: isOpened ? 1.15 : 0 }}
                >
                  {event.title}
                </motion.h2>

                {/* Emoji decorativo */}
                <motion.div
                  className="flex justify-center gap-2 mb-3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isOpened ? 1 : 0, scale: isOpened ? 1 : 0 }}
                  transition={{ delay: isOpened ? 1.2 : 0, type: "spring" }}
                >
                  <Star size={18} className="text-amber-400 fill-current" />
                  <span className="text-2xl">🎉</span>
                  <Star size={18} className="text-sky-400 fill-current" />
                </motion.div>

                {/* Descripción */}
                {event.description && (
                  <motion.p
                    className="text-lg text-charcoal/90 mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)] leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 10 }}
                    transition={{ delay: isOpened ? 1.3 : 0 }}
                  >
                    {event.description}
                  </motion.p>
                )}

                {/* Detalles con iconos */}
                <motion.div
                  className="space-y-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpened ? 1 : 0 }}
                  transition={{ delay: isOpened ? 1.4 : 0 }}
                >
                  <motion.div
                    className="flex items-center justify-center gap-3 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isOpened ? 1 : 0, x: isOpened ? 0 : -20 }}
                    transition={{ delay: isOpened ? 1.45 : 0 }}
                  >
                    <Calendar size={20} className="text-fuchsia-600" />
                    <span className="font-medium">{formatDateES(event.date)}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center gap-3 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isOpened ? 1 : 0, x: isOpened ? 0 : -20 }}
                    transition={{ delay: isOpened ? 1.55 : 0 }}
                  >
                    <Clock size={20} className="text-sky-600" />
                    <span className="font-medium">{event.time}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center gap-3 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isOpened ? 1 : 0, x: isOpened ? 0 : -20 }}
                    transition={{ delay: isOpened ? 1.65 : 0 }}
                  >
                    <MapPin size={20} className="text-amber-600" />
                    <span className="text-right font-medium">
                      {event.location}
                      <br />
                      <span className="text-sm text-charcoal/70">{event.address}</span>
                    </span>
                  </motion.div>
                </motion.div>

                {/* Mensaje de agradecimiento */}
                {event.thankYouMessage && (
                  <motion.div
                    className="bg-gradient-to-br from-amber-100/70 via-white/80 to-sky-100/70 rounded-2xl p-5 mb-5 border-2 border-dashed border-amber-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isOpened ? 1 : 0,
                      y: isOpened ? 0 : 10,
                    }}
                    transition={{ delay: isOpened ? 1.75 : 0 }}
                  >
                    <p className="text-base italic text-charcoal/90 leading-relaxed">
                      "{event.thankYouMessage}"
                    </p>
                  </motion.div>
                )}

                {/* Botones */}
                <motion.div
                  className="flex gap-3 justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: isOpened ? 1 : 0,
                    y: isOpened ? 0 : 15,
                  }}
                  transition={{ delay: isOpened ? 1.9 : 0 }}
                >
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title: event.title, url });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert("¡Link copiado! Compártelo 🎉");
                      }
                    }}
                    className="border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:scale-105 transition-all font-medium text-base"
                  >
                    <Share2 size={16} className="mr-1" />
                    Compartir
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => window.print()}
                    className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:scale-105 transition-all font-medium text-base"
                  >
                    <Download size={16} className="mr-1" />
                    Imprimir
                  </Button>
                </motion.div>

                {/* Firma */}
                <motion.div
                  className="mt-4 flex items-center justify-center gap-2 text-sky-700"
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

            {/* Hint "click para abrir" — solo cuando está cerrado */}
            <AnimatePresence>
              {!isOpened && (
                <motion.div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white/80 font-medium flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Haz click para abrir →
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
