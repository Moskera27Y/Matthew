// src/components/ui/LazyImage.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Hardenizar: si src es undefined/empty → usar placeholder (evita Next/Image error #418)
  const safeSrc = src && src.trim() !== ""
    ? src
    : "/images/placeholder-image.svg";
  const safeWidth = width || 500;
  const safeHeight = height || 500;

  return (
    <div className="relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/20 to-soft-cream animate-pulse rounded-xl" />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Image
          src={safeSrc}
          alt={alt || "Imagen"}
          width={safeWidth}
          height={safeHeight}
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadingComplete={() => setLoaded(true)}
          priority={priority}
          sizes={sizes}
        />
      </motion.div>
    </div>
  );
}
