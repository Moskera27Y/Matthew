// src/components/share/ShareSection.tsx
// Franja final "Comparte esta historia": foto del bebé + compartir + ver evento.
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Share2, MessageCircle, MailOpen, Heart } from "lucide-react";
import { EventDetails } from "@/types/event";
import Button from "@/components/ui/Button";

interface Props {
  babyPhoto: string;
  event: EventDetails;
}

export default function ShareSection({ babyPhoto, event }: Props) {
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShare = async () => {
    const data = { title: "Matthew Journal", text: `Acompáñanos a celebrar: ${event.title}`, url: shareUrl };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(`${data.text} ${shareUrl}`);
        alert("¡Link copiado! Compártelo 💙");
      }
    } catch { /* cancelado por el usuario */ }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`Acompáñanos a celebrar: ${event.title} ${shareUrl}`)}`;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: "linear-gradient(135deg, #701A75 0%, #BE185D 35%, #D97706 70%, #0369A1 100%)" }}>
      {/* Shimmer ambiental */}
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-18deg] pointer-events-none"
        animate={{ x: ["-120%", "420%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
      />
      <div className="absolute -top-20 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl"
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

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-heading-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Comparte esta historia
        </motion.h2>
        <motion.p
          className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          Cada recuerdo de Matthew es más bonito cuando se comparte con quienes amamos.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleShare}
            className="bg-white text-fuchsia-700 hover:bg-fuchsia-50 font-bold w-full sm:w-auto shadow-xl"
          >
            <Share2 size={17} className="mr-2" /> Compartir
          </Button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/70 text-white hover:bg-white/15 font-bold w-full"
            >
              <MessageCircle size={17} className="mr-2" /> WhatsApp
            </Button>
          </a>
          <Link href={`/eventos/${event.id}`} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amber-300 text-amber-200 hover:bg-white/15 font-bold w-full"
            >
              <MailOpen size={17} className="mr-2" /> Ver evento
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
