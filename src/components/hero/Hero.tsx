// src/components/hero/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { BABY_NAME, BIRTH_DATE } from "@/lib/constants";
import { formatDateES } from "@/lib/utils";
import PoemCard from "./PoemCard";
import FloatingElements from "./FloatingElements";
import ParticleField from "@/components/background/ParticleField";
import AuroraGradient from "@/components/background/AuroraGradient";
import Button from "@/components/ui/Button";
import TextureOverlay from "@/components/ui/TextureOverlay";
import BabyPhotoPlaceholder from "@/components/ui/BabyPhotoPlaceholder";
import OrganicShape from "@/components/ui/OrganicShape";
import GlowEffect from "@/components/ui/GlowEffect";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient py-20 sm:py-0"
    >
      <AuroraGradient />
      <ParticleField />
      <TextureOverlay intensity="light" />

      {/* Elementos flotantes sutiles */}
      <FloatingElements />

      {/* Formas orgánicas decorativas */}
      <div className="absolute top-20 -left-20 opacity-40">
        <OrganicShape size="lg" color="bg-blush-pink/5" />
      </div>
      <div className="absolute bottom-10 -right-16 opacity-30">
        <OrganicShape size="md" color="bg-lavender-soft/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto principal */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-xs sm:text-sm font-light tracking-widest text-dusty-rose bg-blush-pink/30 px-4 py-1.5 rounded-full mb-8">
                Bienvenido al mundo, pequeñín
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 80 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading-bold bg-text-dusty mb-4 pb-2 leading-tight"
            >
              {BABY_NAME}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-decorative text-taupe/60 mb-2 italic"
            >
              Nacido el <strong className="text-charcoal not-italic">{formatDateES(BIRTH_DATE)}</strong> en Garzón, Huila
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm sm:text-base text-mist-gray mt-2 mb-8"
            >
              4.300 gramos • 48 cm • primera sonrisa a las 2 semanas
            </motion.p>

            {/* Poema de amor al bebé */}
            <PoemCard />

            {/* CTA: botón galería → lleva a la galería de fotos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <GlowEffect glowColor="gold" intensity="strong" className="shadow-card hover:shadow-[0_0_40px_rgba(212,165,154,0.5)]">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-card"
                  onClick={() => {
                    const g = document.getElementById("gallery");
                    if (g) g.scrollIntoView({ behavior: "smooth" });
                    else window.location.assign("/#gallery");
                  }}
                >
                  Ver galería de fotos
                </Button>
              </GlowEffect>
            </motion.div>

          </div>

          {/* Foto de Matthew */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <BabyPhotoPlaceholder size="lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
