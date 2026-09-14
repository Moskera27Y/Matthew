// src/components/hero/FloatingElements.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const icons = [
  { icon: "⭐", size: 24, delay: 0, x: 12, y: 18 },
  { icon: "🍼", size: 22, delay: 0.5, x: 88, y: 8 },
  { icon: "🧸", size: 36, delay: 1, x: 55, y: 88 },
  { icon: "🌈", size: 30, delay: 1.5, x: 22, y: 72 },
  { icon: "🎈", size: 28, delay: 0.3, x: 82, y: 80 },
  { icon: "📚", size: 20, delay: 0.8, x: 8, y: 58 },
  { icon: "🍼", size: 22, delay: 0.2, x: 3, y: 45 },
  { icon: "🎈", size: 28, delay: 1.2, x: 62, y: 3 },
  { icon: "🌼", size: 18, delay: 0.6, x: 42, y: 50 },
  { icon: "🌙", size: 16, delay: 1.8, x: 18, y: 35 },
];

export default function FloatingElements() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={targetRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((el, i) => {
        // Parallax offset per element for depth
        const parallaxX = useTransform(scrollYProgress, [0, 1], [0, (i % 3 - 1) * 15]);
        const parallaxY = useTransform(scrollYProgress, [0, 1], [0, (i % 2 - 0.5) * 20]);

        return (
          <motion.div
            key={i}
            className="absolute text-opacity-10 opacity-10"
            style={{ fontSize: `${el.size}px` }}
            initial={{
              x: `${el.x}vw`,
              y: `${el.y}vh`,
              scale: 0.8,
            }}
            animate={{
              y: [`${el.y}vh`, `${el.y - 12}vh`, `${el.y}vh`],
              x: [`${el.x}vw`, `${el.x + 4}vw`, `${el.x}vw`],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              y: { duration: 8 + Math.random() * 6, delay: el.delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              x: { duration: 6 + Math.random() * 4, delay: el.delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              scale: { duration: 4, delay: el.delay, repeat: Infinity, repeatType: "reverse" },
              opacity: { duration: 4, delay: el.delay, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            {el.icon}
          </motion.div>
        );
      })}
    </div>
  );
}
