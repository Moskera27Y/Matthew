// src/components/gallery/GalleryFilters.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "lucide-react";
import { MONTHS, photoCategoryLabels } from "@/data/photos";

interface GalleryFiltersProps {
  activeCategory: string | null;
  activeMonth: string | null;
  onFilterCategory: (cat: string | null) => void;
  onFilterMonth: (month: string | null) => void;
}

export default function GalleryFilters({
  activeCategory,
  activeMonth,
  onFilterCategory,
  onFilterMonth,
}: GalleryFiltersProps) {
  const categories: Array<{ value: string; label: string; color: string }> = [
    { value: "daily", label: photoCategoryLabels.daily, color: "bg-taupe/20 text-taupe" },
    { value: "milestone", label: photoCategoryLabels.milestone, color: "bg-pink-soft/30 text-pink-700" },
    { value: "sleep", label: photoCategoryLabels.sleep, color: "bg-lavender-soft/20 text-purple-700" },
    { value: "play", label: photoCategoryLabels.play, color: "bg-sky-soft/20 text-blue-700" },
    { value: "food", label: photoCategoryLabels.food, color: "bg-peach-soft/30 text-orange-700" },
    { value: "family", label: photoCategoryLabels.family, color: "bg-mint-soft/20 text-green-700" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 mb-8"
    >
      {/* Category filter — pills premium */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onFilterCategory(null)}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
            activeCategory === null
              ? "text-white shadow-lg scale-105"
              : "bg-white/70 text-taupe hover:bg-white border border-mist-gray/20"
          }`}
          style={activeCategory === null ? { background: "linear-gradient(90deg, #D946EF, #F59E0B)" } : undefined}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onFilterCategory(activeCategory === cat.value ? null : cat.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeCategory === cat.value
                ? "text-white shadow-lg scale-105"
                : `${cat.color} hover:scale-105 border border-transparent`
            }`}
            style={activeCategory === cat.value ? { background: "linear-gradient(90deg, #D946EF, #F59E0B)" } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Month filter — pills premium */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onFilterMonth(null)}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
            activeMonth === null
              ? "text-white shadow-lg scale-105"
              : "bg-white/70 text-taupe hover:bg-white border border-mist-gray/20"
          }`}
          style={activeMonth === null ? { background: "linear-gradient(90deg, #0EA5E9, #7B61FF)" } : undefined}
        >
          Todos los meses
        </button>
        {MONTHS.map((month) => (
          <button
            key={month}
            onClick={() => onFilterMonth(activeMonth === month ? null : month)}
            className={`px-4 py-2 text-xs font-semibold capitalize rounded-full transition-all duration-200 ${
              activeMonth === month
                ? "text-white shadow-lg scale-105"
                : "bg-white/70 text-taupe hover:bg-white hover:scale-105 border border-mist-gray/20"
            }`}
            style={activeMonth === month ? { background: "linear-gradient(90deg, #0EA5E9, #7B61FF)" } : undefined}
          >
            {month}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
