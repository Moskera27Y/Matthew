// src/components/ui/BabyPhotoPlaceholder.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Baby } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

interface BabyPhotoPlaceholderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BabyPhotoPlaceholder({
  className,
  size = "lg",
}: BabyPhotoPlaceholderProps) {
  const { babyPhoto } = useAdminData();
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-56",
    lg: "w-64 h-72 sm:w-72 sm:h-80",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} mx-auto relative`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blush-pink/20 via-transparent to-warm-ivory/30 rounded-full blur-2xl opacity-60 animate-pulse" />

      {/* Photo frame */}
      <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border-4 border-white shadow-strong">
        {babyPhoto ? (
          // Real photo of baby
          <Image
            src={babyPhoto}
            alt="Matthew"
            fill
            sizes="(max-width: 768px) 288px, 320px"
            className="object-cover"
            priority
          />
        ) : (
          // Placeholder gradient shimmer
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/10 via-soft-cream/30 to-warm-ivory/40" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 -left-1/2 w-1/2 h-full bg-white/30 rotate-12 animate-shimmer">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Baby size={48} className="text-mist-gray/40" />
            </div>
          </>
        )}

        {/* Soft overlay pattern (only when no photo) */}
        {!babyPhoto && (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 200 300"
            >
              <defs>
                <radialGradient
                  id="soft-glow"
                  cx="50%"
                  cy="30%"
                  r="70%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="200" height="300" fill="url(#soft-glow)" />
            </svg>
          </div>
        )}
      </div>

      {/* Subtle drop shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-charcoal/5 rounded-full blur-md" />
    </motion.div>
  );
}
