// src/app/eventos/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Mail } from "lucide-react";
import { EventDetails } from "@/types/event";
import { loadEvents } from "@/services/adminService";
import { formatDateES } from "@/lib/utils";
import SectionDivider from "@/components/ui/SectionDivider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Mini preview del sobre — usado para el evento único y las cards
function EnvelopePreview({ event }: { event: EventDetails }) {
  return (
    <div className="relative w-56 h-36 [perspective:900px] [transform-style:preserve-3d] mx-auto">
      <div className="absolute inset-0 mx-auto w-full h-full bg-gradient-to-br from-blush-pink via-warm-gold to-dusty-rose rounded-[1.5rem] shadow-strong border-4 border-pearl-white [transform-style:preserve-3d]">
        {/* Solapa */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-dusty-rose via-blush-pink to-warm-gold origin-bottom border-b-3 border-pearl-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
        {/* Detalle dorado */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full shadow-glow" />
      </div>
    </div>
  );
}

export default function EventosPage() {
  const [events, setEvents] = useState<EventDetails[]>([]);

  useEffect(() => {
    const es = loadEvents().filter(
      (e) => e && (e.isEnabled !== false) && !!e.title && !!e.id
    );
    setEvents(es);

    // Sincronizar en tiempo real con cambios del admin
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mj_admin_events" || e.key === "mj_admin_event") {
        setEvents(
          loadEvents().filter(
            (ev) => ev && ev.isEnabled !== false && !!ev.title && !!ev.id
          )
        );
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const activeEvents = events;

  return (
    <>
      <Header />

      <section className="relative min-h-screen bg-gradient-to-br from-fuchsia-50 via-sky-100 to-amber-50 flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Partículas sutiles de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-amber-300/30 to-pink-300/20 animate-pulse"
              style={{
                width: `${5 + Math.random() * 4}px`,
                height: `${5 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Glows difusos */}
        <div className="absolute top-1/4 left-1/4 w-[360px] h-[360px] bg-gradient-to-r from-fuchsia-300/15 via-transparent to-sky-300/15 rounded-full blur-[70px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] bg-gradient-to-r from-amber-300/15 via-transparent to-emerald-300/15 rounded-full blur-[60px]" />

        <div className="relative z-10 w-full">
          {/* Header de sección */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 text-amber-600 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Star size={24} className="fill-current" />
              <span className="text-sm font-bold tracking-widest uppercase text-fuchsia-700">Eventos Especiales</span>
              <Star size={24} className="fill-current" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
              Celebraciones de Matthew
            </h2>
            <p className="text-lg text-charcoal/80 max-w-xl mx-auto">
              Descubre las invitaciones especiales y celebra con nosotros estos momentos únicos.
            </p>
          </motion.div>

          {/* Contenido: evento único (grande/centrado) o grid de múltiples */}
          {activeEvents.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Mail size={48} className="mx-auto text-charcoal/20 mb-4" />
              <h3 className="text-2xl font-heading-bold text-charcoal mb-2">
                No hay eventos programados
              </h3>
              <p className="text-charcoal/60">Pronto compartiremos nuevas fechas especiales.</p>
            </motion.div>
          ) : activeEvents.length === 1 ? (
            // EVENTO ÚNICO — sobre grande centrado + botón "Abrir invitación"
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <SingleEventCard event={activeEvents[0]} />
            </motion.div>
          ) : (
            // MÚLTIPLES EVENTOS — grid de cards interactivas
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {activeEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 * (activeEvents.indexOf(event) + 1) }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/eventos/${event.id}`} className="block">
                    <motion.div
                      className="bg-white/25 backdrop-blur-md rounded-3xl border border-white/40 shadow-strong overflow-hidden cursor-pointer h-full"
                      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                    >
                      <div className="p-6 text-center">
                        <EnvelopePreview event={event} />
                        <h3 className="text-xl font-heading-bold text-charcoal mt-4 mb-2 group-hover:text-fuchsia-700 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-charcoal/80 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="space-y-1 text-xs text-charcoal/70">
                          <div>📅 {formatDateES(event.date)}</div>
                          <div>🕐 {event.time}</div>
                          <div>📍 {event.location}</div>
                        </div>
                        <motion.div
                          className="mt-3 text-center text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-amber-400"
                          whileHover={{ scale: 1.05 }}
                        >
                          Abrir invitación →
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <SectionDivider variant="wave" />
      <ScrollToTop />
      <Footer />
    </>
  );
}

// Card para evento único — sobre grande centrado + botón animado
function SingleEventCard({ event }: { event: EventDetails }) {
  return (
    <motion.div
      className="bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/30 shadow-strong overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center p-8 lg:p-12">
        {/* Preview del sobre grande */}
        <div className="flex justify-center">
          <motion.div
            className="relative w-64 h-44 [perspective:1000px] [transform-style:preserve-3d]"
            whileHover={{ scale: 1.05, rotateY: 4 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 mx-auto w-full h-full bg-gradient-to-br from-blush-pink via-warm-gold to-dusty-rose rounded-[2rem] shadow-strong border-6 border-pearl-white [transform-style:preserve-3d]">
              {/* Solapa */}
              <div
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-dusty-rose via-blush-pink to-warm-gold origin-bottom border-b-4 border-pearl-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Detalle dorado */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full shadow-glow" />
            </div>
          </motion.div>
        </div>

        {/* Detalles del evento + botón CTA */}
        <div className="lg:pl-8 space-y-5">
          <motion.h3
            className="text-3xl font-heading-bold text-charcoal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {event.title}
          </motion.h3>

          <motion.p
            className="text-base text-charcoal/85 leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {event.description}
          </motion.p>

          <div className="space-y-2">
            <motion.div
              className="flex items-center gap-3 text-charcoal"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Calendar size={18} className="text-fuchsia-600" />
              <span className="font-medium">{formatDateES(event.date)}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 text-charcoal"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Clock size={18} className="text-sky-600" />
              <span className="font-medium">{event.time}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 text-charcoal"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <MapPin size={18} className="text-amber-600" />
              <span className="font-medium">
                {event.location}
                {event.address && <span className="block text-sm text-charcoal/60">{event.address}</span>}
              </span>
            </motion.div>
          </div>

          {/* CTA — abre /eventos/[id] con el sobre ANIMADO */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <Link href={`/eventos/${event.id}`} passHref>
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 text-white font-bold py-4 px-8 rounded-2xl shadow-glow hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Abrir invitación</span>
                <motion.span
                  className="relative z-10 text-xl"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  💌
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-pink-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.button>
            </Link>
          </motion.div>

          <motion.p
            className="text-xs text-charcoal/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
          >
            Al hacer clic, se abrirá el sobre con animación para disfrutar de la invitación completa.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
