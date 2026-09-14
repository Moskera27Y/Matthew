// src/components/ui/OrganicShape.tsx
"use client";

import { motion } from "framer-motion";

interface OrganicShapeProps {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function OrganicShape({
  className,
  color = "bg-blush-pink/10",
  size = "md",
}: OrganicShapeProps) {
  const sizeClasses = {
    sm: "w-48 h-48",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  };

  const paths = [
    "M64,36a28,28,0,0,1,28,28V92a28,28,0,0,1-56,0V64A28,28,0,0,1,64,36Zm0,8a20,20,0,0,0-20,20v28a20,20,0,0,0,40,0V64A20,20,0,0,0,64,44Z",
    "M64,30A34,34,0,0,1,98,64v42a34,34,0,0,1-68,0V64A34,34,0,0,1,64,30Zm0,16a18,18,0,0,0-18,18v42a18,18,0,0,0,36,0V64A18,18,0,0,0,64,46Z",
  ];

  return (
    <motion.div
      className={`${sizeClasses[size]} ${color} rounded-full absolute opacity-30`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.3, scale: [0.8, 1.05, 0.8] }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 128 128"
        fill="currentColor"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <path d="M64,12A52,52,0,0,1,116,64a52,52,0,0,1-36,48.9L76,88a36,36,0,0,0-72,0L4,112.9A52,52,0,0,1,64,12Z" />
      </motion.svg>
    </motion.div>
  );
}
