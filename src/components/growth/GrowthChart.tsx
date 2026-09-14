// src/components/growth/GrowthChart.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { GrowthRecord } from "@/types/growth";
import { useEffect } from "react";
import { ageString } from "@/data/milestones";

interface GrowthChartProps {
  records: GrowthRecord[];
}

// WHO percentile references (simplified)
const WEIGHT_BY_AGE_MONTHS = [3.0, 4.2, 5.2, 6.0, 6.8, 7.5, 8.1, 8.6, 9.0, 9.4];
const HEIGHT_BY_AGE_MONTHS = [50.5, 57.0, 62.1, 66.0, 69.2, 71.4, 73.2, 74.6, 75.7, 76.5];

export default function GrowthChart({ records }: GrowthChartProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeOut" },
    });
  }, [controls]);

  // Convert records to chart points (using weeks as x-axis index)
  const weightData = records.map((r, i) => ({
    x: i,
    y: r.weight,
    label: ageString(r.babyAge),
  }));

  const heightData = records.map((r, i) => ({
    x: i,
    y: r.height,
    label: ageString(r.babyAge),
  }));

  // Chart dimensions
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = 760;
  const height = 320;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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

        {/* Weight line (animated) */}
        <motion.path
          d={pathW}
          fill="none"
          stroke="var(--color-dusty-rose)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={controls}
          style={{ zIndex: 5 }}
        />

        {/* Height line (animated) */}
        <motion.path
          d={pathH}
          fill="none"
          stroke="var(--color-sky-soft)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={controls}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          style={{ zIndex: 4 }}
        />

        {/* Weight points */}
        {weightData.map((d, i) => (
          <motion.circle
            key={`w-${i}`}
            cx={margin.left + xScale(i)}
            cy={margin.top + yScaleW(d.y)}
            r="3"
            fill="var(--color-dusty-rose)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          />
        ))}

        {/* Height points */}
        {heightData.map((d, i) => (
          <motion.circle
            key={`h-${i}`}
            cx={margin.left + xScale(i)}
            cy={margin.top + yScaleH(d.y)}
            r="3"
            fill="var(--color-sky-soft)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-mist-gray">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-dusty-rose rounded-full" />
          Peso (kg)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-sky-soft rounded-full" />
          Estatura (cm)
        </span>
      </div>
    </motion.div>
  );
}
