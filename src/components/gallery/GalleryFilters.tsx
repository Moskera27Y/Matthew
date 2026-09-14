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
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterCategory(null)}
          className={`px-3 py-1.5 text-xs font-light rounded-full transition-all duration-200 ${
            activeCategory === null
              ? "bg-dusty-rose text-white shadow-md"
              : "bg-mist-gray/10 text-taupe hover:bg-mist-gray/20"
          }`}
        >
          Todas las categorías
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onFilterCategory(cat.value)}
            className={`px-3 py-1.5 text-xs font-light rounded-full transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-dusty-rose text-white shadow-md"
                : `${cat.color} hover:opacity-80`
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Month filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterMonth(null)}
          className={`px-3 py-1.5 text-xs font-light rounded-full transition-all duration-200 ${
            activeMonth === null
              ? "bg-dusty-rose text-white shadow-md"
              : "bg-mist-gray/10 text-taupe hover:bg-mist-gray/20"
          }`}
        >
          Todos los meses
        </button>
        {MONTHS.map((month) => (
          <button
            key={month}
            onClick={() => onFilterMonth(month)}
            className={`px-3 py-1.5 text-xs font-light capitalize rounded-full transition-all duration-200 ${
              activeMonth === month
                ? "bg-dusty-rose text-white shadow-md"
                : "bg-mist-gray/10 text-taupe hover:bg-mist-gray/20"
            }`}
          >
            {month}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
