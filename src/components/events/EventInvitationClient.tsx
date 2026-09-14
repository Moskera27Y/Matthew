// src/components/events/EventInvitationClient.tsx
// Sobre 3D multicolor + carta expandible con efectos premium.
// FIX layout: la carta vive en flujo normal (altura auto) debajo del sobre,
// el contenedor se expande al abrir → nada se recorta, texto 100% legible.
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
  Sparkles,
  MailOpen,
} from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  event: EventDetails;
  babyPhoto: string;
  autoOpen?: boolean;
}

// Confeti multicolor vibrante
const CONFETTI_COLORS = [
  "#FF3E96", "#00D1FF", "#7AFF64", "#FFD166",
  "#FF72D5", "#06FFA5", "#FF6B6B", "#7B61FF",
  "#FFB800", "#00FFC8",
];

const ENVELOPE_H = 400; // px del sobre cerrado

export default function EventInvitationClient({ event, babyPhoto, autoOpen = false }: Props) {
  const [isOpened, setIsOpened] = useState(false);

  // Partículas flotantes de fondo
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      })),
    []
  );

  // Estrellitas twinkle alrededor de la carta
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: 2 + Math.random() * 96,
        delay: Math.random() * 2,
        duration: 1.2 + Math.random() * 1.5,
        size: 12 + Math.random() * 10,
      })),
    []
  );

  // Confeti de apertura: explosión radial desde el centro
  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 70,
        drift: (Math.random() - 0.5) * 220,
        delay: Math.random() * 0.9,
        duration: 1.4 + Math.random() * 1.2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 5 + Math.random() * 8,
        round: Math.random() > 0.5,
      })),
    []
  );

  useEffect(() => {
    if (!autoOpen) return;
    const timer = setTimeout(() => setIsOpened(true), 300);
    return () => clearTimeout(timer);
  }, [autoOpen]);

  const titleWords = (event.title || "Invitación").split(" ");

  return (
    <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-200 via-pink-100 to-amber-100 px-4 py-10 sm:py-14">
      {/* Partículas flotantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: p.color }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Confeti al abrir */}
      <AnimatePresence>
        {isOpened &&
          confetti.map((c) => (
            <motion.div
              key={`confetti-${c.id}`}
              className={`absolute pointer-events-none z-30 ${c.round ? "rounded-full" : "rounded-[2px]"}`}
              style={{ left: `${c.x}%`, top: "32%", width: c.size, height: c.round ? c.size : c.size * 0.6, backgroundColor: c.color }}
              initial={{ opacity: 0, y: -30, scale: 0.4, rotate: 0, x: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: [0, 120, 420, 620], x: [0, c.drift * 0.4, c.drift], rotate: 720, scale: [0.4, 1, 1, 0.6] }}
              exit={{ opacity: 0 }}
              transition={{ duration: c.duration, delay: c.delay, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>

      {/* Glows difusos */}
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-gradient-to-r from-fuchsia-300/30 via-transparent to-sky-300/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-gradient-to-r from-amber-300/30 via-transparent to-emerald-300/30 rounded-full blur-[70px] pointer-events-none" />

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
        {/* Contenedor que SE EXPANDE al abrir: sobre fijo + carta en flujo normal */}
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] shadow-strong"
          initial={false}
          animate={{ height: isOpened ? "auto" : ENVELOPE_H }}
          transition={{ duration: 0.9, delay: isOpened ? 0.9 : 0, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* ===== SOBRE MULTICOLOR 3D ===== */}
          <div className="relative w-full overflow-hidden" style={{ height: ENVELOPE_H }}>
            {/* Aura dorada rotatoria */}
            <motion.div
              className="absolute -inset-6 rounded-[3rem] blur-xl"
              style={{ background: "conic-gradient(from 0deg, #FF3E96, #FFD166, #00D1FF, #7AFF64, #7B61FF, #FF3E96)" }}
              animate={{ rotate: 360, opacity: isOpened ? 0.55 : 0.35 }}
              transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, opacity: { duration: 1 } }}
            />
            {/* Cuerpo del sobre */}
            <motion.div
              className="absolute inset-3 rounded-[2.2rem] border-4 border-white/90 shadow-2xl overflow-hidden [perspective:1200px]"
              style={{ background: "linear-gradient(135deg, #C026D3 0%, #EC4899 30%, #F59E0B 65%, #0EA5E9 100%)" }}
              animate={{ rotateY: isOpened ? -5 : 0 }}
              transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1], delay: isOpened ? 0.15 : 0 }}
            >
              {/* Shimmer que cruza el sobre */}
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-18deg] pointer-events-none"
                animate={{ x: ["-120%", "420%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
              />
              {/* Textura de franjas diagonales */}
              <div
                className="absolute inset-0 opacity-20"
                style={{ background: "repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,.35) 14px 20px)" }}
              />
              {/* SOLAPA superior */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1/2 origin-top border-b-4 border-white/70"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(to bottom, #7E22CE, #DB2777 60%, #F59E0B)",
                  zIndex: 10,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{ rotateX: isOpened ? -180 : 0, zIndex: isOpened ? 0 : 10 }}
                transition={{ duration: 0.9, delay: isOpened ? 0.25 : 0.4, ease: [0.34, 1.4, 0.64, 1] }}
              />
              {/* Foto del bebé */}
              {!isOpened && babyPhoto && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={babyPhoto} alt="Matthew" className="object-cover w-full h-full" />
                  </div>
                  <p className="mt-2 text-white font-heading-bold text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                    Matthew
                  </p>
                </motion.div>
              )}
              {/* SELLO DE CERA — explota al abrir */}
              <AnimatePresence>
                {!isOpened && (
                  <motion.button
                    className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "radial-gradient(circle at 35% 30%, #FB7185, #BE123C 70%)", boxShadow: "0 4px 14px rgba(0,0,0,.4), inset 0 2px 4px rgba(255,255,255,.4)" }}
                    onClick={(e) => { e.stopPropagation(); setIsOpened(true); }}
                    exit={{ scale: 1.8, opacity: 0, rotate: 40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="flex"
                    >
                      <Heart size={26} className="text-white" fill="currentColor" />
                    </motion.span>
                  </motion.button>
                )}
              </AnimatePresence>
              {/* Hint */}
              {!isOpened && (
                <motion.div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-1.5 text-white text-sm font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <MailOpen size={15} /> Toca el sello para abrir
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ===== CARTA (flujo normal, altura auto — nada se recorta) ===== */}
          <AnimatePresence initial={false}>
            {isOpened && (
              <motion.div
                className="relative bg-gradient-to-b from-white via-amber-50/50 to-white px-6 sm:px-10 pt-8 pb-10 text-center text-charcoal"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {/* Estrellitas twinkle */}
                {sparkles.map((s) => (
                  <motion.span
                    key={s.id}
                    className="absolute text-amber-400 pointer-events-none"
                    style={{ left: `${s.x}%`, top: `${8 + (s.id % 5) * 16}%` }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7], rotate: [0, 180, 360] }}
                    transition={{ duration: s.duration, delay: 1.2 + s.delay, repeat: Infinity }}
                  >
                    <Sparkles size={s.size} />
                  </motion.span>
                ))}

                {/* Foto + título con stagger palabra por palabra */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.25, type: "spring", stiffness: 160 }}
                >
                  {babyPhoto && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-fuchsia-200 shadow-lg mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={babyPhoto} alt="Matthew" className="object-cover w-full h-full" />
                    </div>
                  )}
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-heading-bold mb-4 text-fuchsia-800 flex flex-wrap justify-center gap-x-3">
                  {titleWords.map((w, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 1.35 + i * 0.12, type: "spring", stiffness: 200, damping: 18 }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </h2>

                {/* Fecha destacada */}
                <motion.div
                  className="inline-flex items-center gap-2 mb-3 px-5 py-2 rounded-full bg-gradient-to-r from-amber-100 to-fuchsia-100 border border-amber-300/60 shadow-sm"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + titleWords.length * 0.12, type: "spring", stiffness: 200 }}
                >
                  <Calendar size={19} className="text-fuchsia-600" />
                  <span className="text-lg font-semibold">{formatDateES(event.date)}</span>
                </motion.div>

                {/* Hora */}
                <motion.p
                  className="text-lg text-sky-700 mb-5 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.65 + titleWords.length * 0.12 }}
                >
                  <Clock size={18} className="text-sky-600" />
                  <span>Hora: {event.time}</span>
                </motion.p>

                {/* Descripción */}
                {event.description && (
                  <motion.p
                    className="text-base sm:text-lg text-charcoal/85 mb-6 leading-relaxed max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.75 + titleWords.length * 0.12 }}
                  >
                    {event.description}
                  </motion.p>
                )}

                {/* Detalles */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.85 + titleWords.length * 0.12 }}
                >
                  <motion.div
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 + titleWords.length * 0.12 }}
                  >
                    <Calendar size={18} className="text-fuchsia-600 shrink-0" />
                    <div>
                      <span className="text-xs text-mist-gray">Fecha</span>
                      <p className="text-sm font-medium">{formatDateES(event.date)}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-200/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 + titleWords.length * 0.12 }}
                  >
                    <Clock size={18} className="text-sky-600 shrink-0" />
                    <div>
                      <span className="text-xs text-mist-gray">Hora</span>
                      <p className="text-sm font-medium">{event.time}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="sm:col-span-2 flex items-start gap-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/50"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + titleWords.length * 0.12 }}
                  >
                    <MapPin size={18} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-mist-gray">Lugar</span>
                      <p className="text-sm font-medium">{event.location}</p>
                      {event.address && <p className="text-sm text-charcoal/70">{event.address}</p>}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Agradecimiento */}
                {event.thankYouMessage && (
                  <motion.div
                    className="bg-gradient-to-br from-amber-100/70 via-white to-sky-100/70 rounded-2xl p-5 mb-6 border-2 border-dashed border-amber-300 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1 + titleWords.length * 0.12 }}
                  >
                    <p className="text-base italic text-charcoal/90 leading-relaxed">
                      &ldquo;{event.thankYouMessage}&rdquo;
                    </p>
                  </motion.div>
                )}

                {/* Botones */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + titleWords.length * 0.12 }}
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
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.35 + titleWords.length * 0.12 }}
                >
                  <Heart size={14} fill="currentColor" className="text-fuchsia-500 animate-pulse" />
                  <span className="text-sm font-medium">con amor de Matthew 💙</span>
                  <Heart size={14} fill="currentColor" className="text-sky-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle abrir/cerrar */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsOpened((prev) => !prev)}
            className="text-sm font-medium text-fuchsia-700 hover:text-fuchsia-900 bg-white/70 hover:bg-white px-5 py-2 rounded-full shadow transition-colors"
          >
            {isOpened ? "Cerrar invitación ✕" : "Abrir invitación 💌"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
