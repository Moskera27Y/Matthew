// src/components/growth/GrowthSection.tsx
"use client";

import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import GrowthChart from "./GrowthChart";
import GrowthTable from "./GrowthTable";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Plus, Weight, Ruler, TrendingUp } from "lucide-react";
import { GrowthRecord } from "@/types/growth";
import { useEffect, useRef } from "react";

interface GrowthSectionProps {
  records: GrowthRecord[];
}

// Número que cuenta hacia arriba al entrar en vista (peso/estatura actual)
function CountUp({ value, decimals = 1, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix]);
  return <span ref={ref}>{"0" + suffix}</span>;
}

export default function GrowthSection({ records }: GrowthSectionProps) {
  return (
    <Container id="growth" size="lg" className="section-alt-1">
      <SectionHeading
        eyebrow="Creciendo"
        title="Registro de Crecimiento"
        description="Cada medida es un hito más en su viaje de crecimiento. Registramos peso, estatura y el amor de sus papás."
        icon={<TrendingUp size={16} />}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >

        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.06, y: -2 }}
            className="flex items-center gap-2 px-4 py-2 bg-dusty-rose/10 rounded-full text-sm text-taupe cursor-default"
          >
            <Weight size={16} className="text-dusty-rose" />
            <span>{records.length > 0 ? <CountUp value={records[records.length - 1]?.weight ?? 0} decimals={1} suffix=" kg" /> : "—"}</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.06, y: -2 }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-soft/20 rounded-full text-sm text-taupe cursor-default"
          >
            <Ruler size={16} className="text-sky-soft" />
            <span>{records.length > 0 ? <CountUp value={records[records.length - 1]?.height ?? 0} decimals={0} suffix=" cm" /> : "—"}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        <GrowthChart records={records} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-heading-bold text-charcoal mb-4">
            Registros
          </h3>
          <GrowthTable records={records} />
        </motion.div>
      </motion.div>
    </Container>
  );
}
