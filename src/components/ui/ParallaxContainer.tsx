// src/components/ui/ParallaxContainer.tsx
"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

interface ParallaxContainerProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export default function ParallaxContainer({
  children,
  offset = 50,
  className,
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
