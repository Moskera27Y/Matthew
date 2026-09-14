// src/components/background/AuroraGradient.tsx
"use client";

import { motion } from "framer-motion";

export default function AuroraGradient() {
  return (
    <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blush-pink/30 via-lavender-soft/25 to-mint-soft/30 blur-[80px] pointer-events-none" />
  );
}
