// src/components/hero/AgeCounter.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { calculateAge } from "@/lib/utils";

function CountingNumber({ value, label }: { value: number; label: string }) {
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      transition: { duration: 1 },
    });
  }, [controls]);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end)) || 10;
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div animate={controls} className="flex flex-col items-center">
      <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading-bold text-dusty-rose">
        {displayValue}
      </span>
      <span className="text-xs sm:text-sm text-mist-gray mt-1">{label}</span>
    </motion.div>
  );
}

export default function AgeCounter() {
  const [age, setAge] = useState(() => calculateAge());

  useEffect(() => {
    const timer = setInterval(() => {
      setAge(calculateAge());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mt-12"
    >
      <p className="text-center text-sm sm:text-base text-mist-gray mb-8 font-light tracking-wide">
        Matthew tiene:
      </p>
      <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-16 lg:gap-20 flex-wrap">
        <CountingNumber value={age.years} label="Años" />
        <CountingNumber value={age.months % 12} label="Meses" />
        <CountingNumber value={age.weeks} label="Semanas" />
        <CountingNumber value={age.days} label="Días" />
      </div>
    </motion.div>
  );
}
