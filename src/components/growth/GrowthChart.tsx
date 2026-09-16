// src/components/growth/GrowthChart.tsx
"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { GrowthRecord } from "@/types/growth";
import { useEffect, useState } from "react";
import { ageString } from "@/data/milestones";
import { formatDateES } from "@/lib/utils";

interface GrowthChartProps {
  records: GrowthRecord[];
}

// WHO percentile references (simplified)
const WEIGHT_BY_AGE_MONTHS = [3.0, 4.2, 5.2, 6.0, 6.8, 7.5, 8.1, 8.6, 9.0, 9.4];
const HEIGHT_BY_AGE_MONTHS = [50.5, 57.0, 62.1, 66.0, 69.2, 71.4, 73.2, 74.6, 75.7, 76.5];

export default function GrowthChart({ records }: GrowthChartProps) {
  const controls = useAnimation();
  // Punto bajo el cursor: { serie peso/estatura, índice } → tooltip + resaltado
  const [hover, setHover] = useState<{ s: "w" | "h"; i: number } | null>(null);
  // Leyenda interactiva: prender/apagar cada serie
  const [showW, setShowW] = useState(true);
  const [showH, setShowH] = useState(true);

  useEffect(() => {
    controls.start({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeOut" },
    });
  }, [controls, records.length]);

  if (records.length === 0) {
    return (
      <div className="w-full bg-pearl-white rounded-2xl p-8 shadow-subtle border border-mist-gray/10 text-center text-mist-gray">
        <p className="text-sm">Aún no hay medidas para graficar.</p>
      </div>
    );
  }

  // Convert records to chart points (using weeks as x-axis index)
  const weightData = records.map((r, i) => ({
    x: i,
    y: r.weight,
    label: ageString(r.babyAge),
    date: formatDateES(r.date),
  }));

  const heightData = records.map((r, i) => ({
    x: i,
    y: r.height,
    label: ageString(r.babyAge),
    date: formatDateES(r.date),
  }));

  // Chart dimensions
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = 760;
  const height = 320;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const bottomY = margin.top + innerHeight;

  // Scales
  const xScale = (i: number) =>
    (i / Math.max(weightData.length - 1, 1)) * innerWidth;

  const minW = Math.min(...weightData.map((d) => d.y)) - 0.3;
  const maxW = Math.max(...weightData.map((d) => d.y)) + 0.3;
  const yScaleW = (v: number) =>
    innerHeight - ((v - minW) / (maxW - minW)) * innerHeight;

  const minH = Math.min(...heightData.map((d) => d.y)) - 2;
  const maxH = Math.max(...heightData.map((d) => d.y)) + 2;
  const yScaleH = (v: number) =>
    innerHeight - ((v - minH) / (maxH - minH)) * innerHeight;

  const pathW =
    "M" +
    weightData
      .map((d, i) => `${margin.left + xScale(i)},${margin.top + yScaleW(d.y)}`)
      .join(" L");

  const pathH =
    "M" +
    heightData
      .map((d, i) => `${margin.left + xScale(i)},${margin.top + yScaleH(d.y)}`)
      .join(" L");

  // Áreas bajo cada línea ( degradado → eje )
  const lastX = margin.left + xScale(weightData.length - 1);
  const areaW = `${pathW} L${lastX},${bottomY} L${margin.left},${bottomY} Z`;
  const areaH = `${pathH} L${lastX},${bottomY} L${margin.left},${bottomY} Z`;

  // Tooltip del punto bajo el cursor (coordenadas SVG) — después de las escalas
  const hoverPoint = hover
    ? {
        cx: margin.left + xScale(hover.i),
        cy:
          margin.top +
          (hover.s === "w"
            ? yScaleW(weightData[hover.i]?.y ?? 0)
            : yScaleH(heightData[hover.i]?.y ?? 0)),
        text:
          hover.s === "w"
            ? `${(weightData[hover.i]?.y ?? 0).toFixed(1)} kg`
            : `${heightData[hover.i]?.y ?? 0} cm`,
        sub:
          hover.s === "w"
            ? weightData[hover.i]?.date ?? ""
            : heightData[hover.i]?.date ?? "",
        color: hover.s === "w" ? "var(--color-dusty-rose)" : "var(--color-sky-soft)",
      }
    : null;

  const lastW = weightData[weightData.length - 1];
  const lastH = heightData[heightData.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="w-full bg-pearl-white rounded-2xl p-4 sm:p-6 shadow-subtle border border-mist-gray/10 overflow-x-auto"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="areaW" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-dusty-rose)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--color-dusty-rose)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="areaH" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sky-soft)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--color-sky-soft)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = margin.top + (innerHeight / 5) * i;
          return (
            <line
              key={i}
              x1={margin.left}
              y1={y}
              x2={width - margin.right}
              y2={y}
              stroke="var(--color-mist-gray)"
              strokeWidth="0.5"
              opacity="0.15"
            />
          );
        })}

        {/* X-axis labels */}
        {weightData.map((d, i) => (
          <text
            key={i}
            x={margin.left + xScale(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-mist-gray)"
          >
            {d.label}
          </text>
        ))}

        {/* Y-axis labels (weight) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const val = minW + ((maxW - minW) / 5) * i;
          return (
            <text
              key={i}
              x={margin.left - 8}
              y={margin.top + innerHeight - (innerHeight / 5) * i}
              textAnchor="end"
              fontSize="10"
              fill="var(--color-taupe)"
              opacity="0.7"
            >
              {val.toFixed(1)}kg
            </text>
          );
        })}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + innerHeight}
          stroke="var(--color-mist-gray)"
          strokeWidth="1"
        />
        <line
          x1={margin.left}
          y1={margin.top + innerHeight}
          x2={width - margin.right}
          y2={margin.top + innerHeight}
          stroke="var(--color-mist-gray)"
          strokeWidth="1"
        />

        {/* Axis labels */}
        <text
          x={margin.left - 30}
          y={margin.top + innerHeight / 2}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-dusty-rose)"
          transform={`rotate(-90 ${margin.left - 30} ${margin.top + innerHeight / 2})`}
        >
          Peso (kg)
        </text>
        <text
          x={width - margin.right + 15}
          y={margin.top + innerHeight / 2}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-sky-soft)"
          transform={`rotate(90 ${width - margin.right + 15} ${margin.top + innerHeight / 2})`}
        >
          Estatura (cm)
        </text>

        {/* Áreas degradadas bajo las líneas */}
        <AnimatePresence>
          {showW && (
            <motion.path
              key="areaW"
              d={areaW}
              fill="url(#areaW)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {showH && (
            <motion.path
              key="areaH"
              d={areaH}
              fill="url(#areaH)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Weight line (animated) + halo */}
        {showW && (
          <>
            <motion.path
              d={pathW}
              fill="none"
              stroke="var(--color-dusty-rose)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
              initial={{ pathLength: 0 }}
              animate={controls}
            />
            <motion.path
              d={pathW}
              fill="none"
              stroke="var(--color-dusty-rose)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={controls}
              style={{ zIndex: 5 }}
            />
          </>
        )}

        {/* Height line (animated) + halo */}
        {showH && (
          <>
            <motion.path
              d={pathH}
              fill="none"
              stroke="var(--color-sky-soft)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
              initial={{ pathLength: 0 }}
              animate={controls}
              transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            />
            <motion.path
              d={pathH}
              fill="none"
              stroke="var(--color-sky-soft)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={controls}
              transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
              style={{ zIndex: 4 }}
            />
          </>
        )}

        {/* Weight points (interactivos: hover → tooltip) */}
        {showW &&
          weightData.map((d, i) => (
            <g key={`w-${i}`}>
              <circle
                cx={margin.left + xScale(i)}
                cy={margin.top + yScaleW(d.y)}
                r="12"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover({ s: "w", i })}
                onMouseLeave={() => setHover(null)}
              />
              <motion.circle
                cx={margin.left + xScale(i)}
                cy={margin.top + yScaleW(d.y)}
                r={hover?.s === "w" && hover?.i === i ? 5.5 : 3.5}
                fill="var(--color-dusty-rose)"
                stroke="#fff"
                strokeWidth={hover?.s === "w" && hover?.i === i ? 2 : 1}
                style={{ transition: "r 0.15s ease", pointerEvents: "none" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
              />
            </g>
          ))}

        {/* Height points (interactivos: hover → tooltip) */}
        {showH &&
          heightData.map((d, i) => (
            <g key={`h-${i}`}>
              <circle
                cx={margin.left + xScale(i)}
                cy={margin.top + yScaleH(d.y)}
                r="12"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover({ s: "h", i })}
                onMouseLeave={() => setHover(null)}
              />
              <motion.circle
                cx={margin.left + xScale(i)}
                cy={margin.top + yScaleH(d.y)}
                r={hover?.s === "h" && hover?.i === i ? 5.5 : 3.5}
                fill="var(--color-sky-soft)"
                stroke="#fff"
                strokeWidth={hover?.s === "h" && hover?.i === i ? 2 : 1}
                style={{ transition: "r 0.15s ease", pointerEvents: "none" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
              />
            </g>
          ))}

        {/* Pulso en el último control de cada serie visible */}
        {showW && lastW && (
          <circle
            cx={margin.left + xScale(weightData.length - 1)}
            cy={margin.top + yScaleW(lastW.y)}
            r="9"
            fill="none"
            stroke="var(--color-dusty-rose)"
            strokeWidth="1.5"
            style={{ pointerEvents: "none" }}
          >
            <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        {showH && lastH && (
          <circle
            cx={margin.left + xScale(heightData.length - 1)}
            cy={margin.top + yScaleH(lastH.y)}
            r="9"
            fill="none"
            stroke="var(--color-sky-soft)"
            strokeWidth="1.5"
            style={{ pointerEvents: "none" }}
          >
            <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Tooltip flotante del punto activo */}
        {hoverPoint && (
          <g style={{ pointerEvents: "none" }}>
            <line
              x1={hoverPoint.cx}
              y1={hoverPoint.cy}
              x2={hoverPoint.cx}
              y2={margin.top + innerHeight}
              stroke={hoverPoint.color}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <g
              transform={`translate(${Math.min(
                Math.max(hoverPoint.cx - 70, margin.left),
                width - margin.right - 140
              )},${Math.max(hoverPoint.cy - 56, 4)})`}
            >
              <rect
                width="140"
                height="44"
                rx="10"
                fill="rgba(255,255,255,0.96)"
                stroke={hoverPoint.color}
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="19"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="var(--color-charcoal)"
              >
                {hoverPoint.text}
              </text>
              <text
                x="70"
                y="34"
                textAnchor="middle"
                fontSize="10"
                fill="var(--color-taupe)"
              >
                {hoverPoint.sub}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Legend interactiva: clic para prender/apagar series */}
      <div className="mt-4 flex justify-center gap-3 text-xs">
        <button
          onClick={() => setShowW((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
            showW
              ? "border-dusty-rose/40 bg-dusty-rose/10 text-taupe"
              : "border-mist-gray/20 text-mist-gray opacity-60"
          }`}
        >
          <span className="w-3 h-3 bg-dusty-rose rounded-full" />
          Peso (kg)
        </button>
        <button
          onClick={() => setShowH((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
            showH
              ? "border-sky-soft/50 bg-sky-soft/10 text-taupe"
              : "border-mist-gray/20 text-mist-gray opacity-60"
          }`}
        >
          <span className="w-3 h-3 bg-sky-soft rounded-full" />
          Estatura (cm)
        </button>
      </div>
    </motion.div>
  );
}
