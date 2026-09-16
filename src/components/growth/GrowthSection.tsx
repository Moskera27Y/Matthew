// src/components/growth/GrowthSection.tsx
"use client";

import { motion, animate, useInView } from "framer-motion";
import GrowthChart from "./GrowthChart";
import GrowthTable from "./GrowthTable";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Weight, Ruler, ClipboardList, TrendingUp } from "lucide-react";
import { GrowthRecord } from "@/types/growth";
import { useEffect, useRef } from "react";

interface GrowthSectionProps {
  records: GrowthRecord[];
}

// Número que cuenta hacia arriba al entrar en vista
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
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];

  const cards = latest
    ? [
        {
          icon: <Weight size={22} />,
          label: "Peso actual",
          value: <CountUp value={latest.weight} decimals={1} suffix=" kg" />,
          delta:
            prev !== undefined
              ? { text: `${(latest.weight - prev.weight >= 0 ? "+" : "")}${(latest.weight - prev.weight).toFixed(1)} kg`, good: latest.weight - prev.weight >= 0 }
              : null,
          chip: "bg-dusty-rose/10 text-dusty-rose",
          iconBox: "bg-gradient-to-br from-dusty-rose to-blush-pink text-white",
          ring: "hover:border-dusty-rose/40",
        },
        {
          icon: <Ruler size={22} />,
          label: "Estatura actual",
          value: <CountUp value={latest.height} decimals={0} suffix=" cm" />,
          delta:
            prev !== undefined
              ? { text: `${(latest.height - prev.height >= 0 ? "+" : "")}${latest.height - prev.height} cm`, good: latest.height - prev.height >= 0 }
              : null,
          chip: "bg-sky-soft/15 text-sky-soft",
          iconBox: "bg-gradient-to-br from-sky-soft to-mint-soft text-white",
          ring: "hover:border-sky-soft/50",
        },
        {
          icon: <ClipboardList size={22} />,
          label: "Controles registrados",
          value: <CountUp value={sorted.length} decimals={0} suffix="" />,
          delta: null,
          chip: "bg-lavender-soft/20 text-taupe",
          iconBox: "bg-gradient-to-br from-lavender-soft to-blush-pink text-white",
          ring: "hover:border-lavender-soft/50",
        },
      ]
    : [];

  return (
    <Container id="growth" size="lg" className="section-alt-1">
      <SectionHeading
        eyebrow="Creciendo"
        title="Registro de Crecimiento"
        description="Cada medida es un hito más en su viaje de crecimiento. Registramos peso, estatura y el amor de sus papás."
        icon={<TrendingUp size={16} />}
      />

      {/* Tarjetas de stats con count-up + delta vs control anterior */}
      {latest ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 140, damping: 17 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative overflow-hidden bg-pearl-white rounded-3xl p-5 sm:p-6 shadow-subtle hover:shadow-strong border border-mist-gray/10 ${c.ring} transition-colors cursor-default`}
            >
              {/* brillo decorativo */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blush-pink/20 to-transparent blur-xl" />
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${c.iconBox}`}>
                  {c.icon}
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-mist-gray">
                  {c.label}
                </p>
              </div>
              <p className="text-3xl sm:text-4xl font-heading-bold text-charcoal mb-2">
                {c.value}
              </p>
              {c.delta ? (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${c.delta.good ? "bg-mint-soft/20 text-emerald-700" : "bg-dusty-rose/10 text-dusty-rose"}`}>
                  <TrendingUp size={12} />
                  {c.delta.text} vs anterior
                </span>
              ) : (
                <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${c.chip}`}>
                  desde el nacimiento
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        <GrowthChart records={sorted} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-heading-bold text-charcoal mb-4">
            Registros
          </h3>
          <GrowthTable records={sorted} />
        </motion.div>
      </motion.div>
    </Container>
  );
}
