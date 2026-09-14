// src/components/ui/GlowEffect.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GlowEffectProps {
  children: React.ReactNode;
  glowColor?: "gold" | "rose" | "mint" | "lavender";
  intensity?: "soft" | "medium" | "strong";
  className?: string;
}

const glowMap = {
  gold: "shadow-[0_0_0_rgba(212,165,154,0)] group-hover:shadow-[0_0_40px_rgba(212,165,154,0.4)]",
  rose: "shadow-[0_0_0_rgba(255,112,168,0)] group-hover:shadow-[0_0_45px_rgba(255,112,168,0.45)]",
  mint: "shadow-[0_0_0_rgba(175,210,197,0)] group-hover:shadow-[0_0_50px_rgba(175,210,197,0.5)]",
  lavender: "shadow-[0_0_0_rgba(186,163,233,0)] group-hover:shadow-[0_0_45px_rgba(186,163,233,0.45)]",
};

const transitionMap = {
  soft: { duration: 0.4, ease: "easeOut" as const },
  medium: { duration: 0.3, ease: "easeOut" as const },
  strong: { duration: 0.35, ease: "easeOut" as const },
};

export default function GlowEffect({
  children,
  glowColor = "gold",
  intensity = "medium",
  className,
}: GlowEffectProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`inline-block group transition-all duration-300 ${glowMap[glowColor]} ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
}
