// src/components/events/InvitationPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock, MapPin, Heart, Download, Share2 } from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import { loadSettings } from "@/services/adminService";
import Button from "@/components/ui/Button";

interface InvitationPageProps {
  token: string;
  event: EventDetails;
}

const GOLDEN = "var(--gold-soft)";
const ROSE = "var(--dusty-rose)";
const MINT = "var(--mint-soft)";

export default function InvitationPage({ token, event }: InvitationPageProps) {
  const [babyPhoto, setBabyPhoto] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    if (settings?.babyPhoto) setBabyPhoto(settings.babyPhoto);
    // Abrir el sobre automáticamente después de 0.6s con efecto cascada
    const timer = setTimeout(() => setIsOpened(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Partículas flotantes doradas detrás del sobre
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
      })),
    []
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: event.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("¡Link copiado!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-warm-gold/5 via-pearl-white to-soft-cream flex items-center justify-center py-10 px-4 overflow-hidden">
      {/* Partículas flotantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-300/40 to-yellow-200/20 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glows difusos */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blush-pink/15 via-transparent to-lavender-soft/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-mint-soft/10 via-transparent to-sky-soft/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative max-w-lg w-full mx-auto z-10"
      >
        {/* Overlaminado de brillo */}
        <motion.div
          className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-r from-amber-200 via-transparent to-pink-200 opacity-0"
          animate={{ opacity: isOpened ? 0.4 : 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Envelope card con plegado del flap */}
        <motion.div
          className="relative bg-gradient-to-br from-blush-pink via-dusty-rose to-blush-pink rounded-[2rem] shadow-strong overflow-hidden border-8 border-pearl-white"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Flap del sobre — se pliega hacia arriba al abrir */}
          <motion.div
            className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-dusty-rose via-blush-pink to-dusty-rose origin-top"
            style={{
              clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
              zIndex: isOpened ? 5 : 10,
            }}
            initial={{ rotateX: 0 }}
            animate={{
              rotateX: isOpened ? -180 : 0,
              opacity: isOpened ? 0.15 : 1,
            }}
            transition={{
              duration: 1.1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.3,
            }}
          />

          {/* Overlay de fondo blanco translúcido (cuando flap se abre) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-28 bg-white/5 backdrop-blur-[1px] pointer-events-none"
            style={{ zIndex: isOpened ? 0 : 5 }}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: isOpened ? 0 : 0.2 }}
            transition={{ duration: 0.6 }}
          />

          {/* Contenido del sobre (se revela al abrir) */}
          <motion.div
            className="relative pt-12 pb-12 px-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isOpened ? 1 : 0,
              y: isOpened ? 0 : 30,
            }}
            transition={{ duration: 0.7, delay: isOpened ? 0.7 : 0, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Foto del bebé */}
            <motion.div
              className="mx-auto mb-6 relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: isOpened ? 1 : 0.7,
                opacity: isOpened ? 1 : 0,
              }}
              transition={{ duration: 0.6, delay: isOpened ? 0.75 : 0 }}
            >
              {babyPhoto ? (
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl">
                  <Image
                    src={babyPhoto}
                    alt="Matthew"
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                  {/* Brillo sobre la foto */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              ) : (
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-warm-ivory to-blush-pink/30 border-4 border-white/50 shadow-2xl flex items-center justify-center">
                  <span className="text-5xl">💌</span>
                </div>
              )}
            </motion.div>

            {/* Título del evento */}
            <motion.h2
              className="text-3xl md:text-4xl font-heading-bold text-pearl-white mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isOpened ? 1 : 0,
                y: isOpened ? 0 : 10,
              }}
              transition={{ duration: 0.5, delay: isOpened ? 0.9 : 0 }}
            >
              {event.title}
            </motion.h2>

            {/* Descripción */}
            {event.description && (
              <motion.p
                className="text-sm md:text-base text-white/90 mb-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] leading-relaxed max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isOpened ? 1 : 0,
                  y: isOpened ? 0 : 10,
                }}
                transition={{ duration: 0.5, delay: isOpened ? 1.0 : 0 }}
              >
                {event.description}
              </motion.p>
            )}

            {/* Detalles del evento */}
            <motion.div
              className="space-y-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpened ? 1 : 0 }}
              transition={{ duration: 0.5, delay: isOpened ? 1.1 : 0 }}
            >
              <motion.div
                className="flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 rounded-xl py-3 px-4 transition-all cursor-default"
                whileHover={{ scale: 1.03 }}
              >
                <Calendar size={18} className="text-amber-200" />
                <span className="text-sm">{formatDateES(event.date)}</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 rounded-xl py-3 px-4 transition-all cursor-default"
                whileHover={{ scale: 1.03 }}
              >
                <Clock size={18} className="text-amber-200" />
                <span className="text-sm">{event.time}</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 rounded-xl py-3 px-4 text-left cursor-default"
                whileHover={{ scale: 1.03 }}
              >
                <MapPin size={18} className="text-amber-200 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {event.location}
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">{event.address}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Mensaje de agradecimiento */}
            {event.thankYouMessage && (
              <motion.div
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isOpened ? 1 : 0,
                  y: isOpened ? 0 : 10,
                }}
                transition={{ duration: 0.5, delay: isOpened ? 1.25 : 0 }}
              >
                <p className="text-xs md:text-sm italic text-white/90 leading-relaxed">
                  "{event.thankYouMessage}"
                </p>
              </motion.div>
            )}

            {/* Botones de acción */}
            <motion.div
              className="flex gap-3 justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: isOpened ? 1 : 0,
                y: isOpened ? 0 : 15,
              }}
              transition={{ duration: 0.5, delay: isOpened ? 1.4 : 0 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="border border-white/30 text-white hover:bg-white/15 hover:scale-105 transition-all"
              >
                <Share2 size={14} className="mr-1" />
                Compartir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="border border-white/30 text-white hover:bg-white/15 hover:scale-105 transition-all"
              >
                <Download size={14} className="mr-1" />
                Imprimir
              </Button>
            </motion.div>

            {/* Firma con corazones */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-1 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpened ? 1 : 0 }}
              transition={{ duration: 0.5, delay: isOpened ? 1.55 : 0 }}
            >
              <Heart size={12} fill="currentColor" className="text-blush-pink animate-pulse" />
              <span className="text-xs">con amor de Matthew</span>
              <Heart size={12} fill="currentColor" className="text-blush-pink animate-pulse" style={{ animationDelay: "0.3s" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
