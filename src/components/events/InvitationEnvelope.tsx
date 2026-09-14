// src/components/events/InvitationEnvelope.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useAdminData } from "@/hooks/useAdminData";
import { loadInvitationToken } from "@/services/invitationService";

interface InvitationEnvelopeProps {
  event: EventDetails;
  photo?: string;
  showDetail?: boolean;
  invitationLink?: string | null;
}

export default function InvitationEnvelope({
  event,
  photo,
  showDetail = false,
  invitationLink,
}: InvitationEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { babyPhoto } = useAdminData();
  const photoUrl = photo || babyPhoto;
  const storedToken = loadInvitationToken();
  // Construir href directo: /invite/[token] (navegación SPA, misma ventana)
  const inviteHref = invitationLink
    ? invitationLink.replace(/^https?:\/\/[^/]+/, "")
    : storedToken
    ? `/invite/${storedToken}`
    : null;

  const handleOpen = () => setIsOpen(true);

  return (
    <section className="relative py-24 bg-gradient-to-br from-soft-cream/30 via-pearl-white to-warm-ivory/30 overflow-hidden">
      {/* Background decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blush-pink/15 via-lavender-soft/10 to-transparent rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
            Evento Especial
          </h2>
          <p className="text-lg text-taupe/70 max-w-2xl mx-auto leading-relaxed">
            "Un momento inolvidable en la vida de nuestro pequeñín. Únete a celebrar la alegría y las bendiciones que trae cada etapa."
          </p>
        </motion.div>

        {/* Envelope */}
        <AnimatePresence>
          {!isOpen ? (
            <motion.div
              key="envelope-closed"
              className="relative cursor-pointer mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleOpen}
            >
              {/* Envelope shadow */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-charcoal/5 rounded-full blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />

              {/* Envelope body */}
              <motion.div
                className="relative w-80 h-44 bg-gradient-to-br from-blush-pink to-dusty-rose rounded-3xl shadow-strong flex items-center justify-center p-6 border-8 border-pearl-white"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Envelope flap */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1/2 bg-dusty-rose origin-bottom border-b-4 border-pearl-white rounded-t-3xl"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />

                {/* Baby photo inside envelope */}
                {photoUrl ? (
                  <motion.div
                    className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  >
                    <Image
                      src={photoUrl}
                      alt="Foto de Matthew"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-warm-ivory to-blush-pink/30 border-4 border-white/90 shadow-md flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  >
                    <span className="text-4xl">💌</span>
                  </motion.div>
                )}

                {/* Sparkle effects on flap */}
                <motion.div
                  className="absolute top-4 right-6 text-xs"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 0.8, duration: 0.5, repeat: 2 }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute top-6 left-4 text-xs"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 1.2, duration: 0.5, repeat: 2 }}
                >
                  ✨
                </motion.div>
              </motion.div>

              {/* Pull tab hint */}
              <motion.div
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-mist-gray"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Haz click para abrir →
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="envelope-open"
              className="relative mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Open envelope (envelope halves) */}
              <div className="relative w-80 mx-auto">
                {/* Left flap */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-10 bg-dusty-rose origin-right border-b-4 border-pearl-white"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -110 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Right flap */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-10 bg-dusty-rose origin-left border-b-4 border-pearl-white"
                  style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 110 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />

                {/* Envelope body */}
                <motion.div
                  className="relative w-full h-56 bg-gradient-to-br from-blush-pink via-dusty-rose to-blush-pink rounded-2xl shadow-strong flex flex-col items-center p-6 pt-16 border-8 border-pearl-white overflow-hidden"
                  initial={{ height: 176 }}
                  animate={{ height: "auto", paddingTop: 24 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {/* Event details */}
                  <motion.div
                    className="w-full text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-3xl font-heading-bold text-pearl-white mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                      {event.title}
                    </h3>
                    <p className="text-pearl-white/90 font-light mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                      {event.description}
                    </p>

                    {/* Event details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto mb-6">
                      <div className="flex items-center gap-2 text-pearl-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                        <Calendar size={16} />
                        <span className="text-sm">{formatDateES(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-pearl-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                        <Clock size={16} />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2 text-pearl-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                        <MapPin size={16} className="mt-0.5" />
                        <span className="text-sm text-right">
                          {event.location}
                          <br />
                          <span className="text-xs opacity-80">{event.address}</span>
                        </span>
                      </div>
                    </div>

                    {/* Thank you message */}
                    <motion.div
                      className="bg-white/20 rounded-xl p-4 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-sm text-pearl-white italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                        "{event.thankYouMessage}"
                      </p>
                    </motion.div>

                    {/* More info button — navegación SPA a página de invitación dedicada */}
                    {inviteHref && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <Link href={inviteHref}>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-dusty-rose font-medium shadow-lg hover:bg-pearl-white transition-all duration-300 cursor-pointer"
                          >
                            <span>Más información</span>
                            <ChevronRight size={16} className="ml-1" />
                          </motion.a>
                        </Link>
                      </motion.div>
                    )}

                    {/* Cerrar el preview del envelope */}
                    <motion.button
                      className="mt-4 text-pearl-white/70 hover:text-pearl-white text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Volver
                    </motion.button>
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    className="absolute top-3 right-3 text-pearl-white/70 hover:text-pearl-white"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
