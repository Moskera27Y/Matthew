// src/components/timeline/MilestoneCard.tsx
"use client";

import { motion } from "framer-motion";
import { Milestone } from "@/types/milestone";
import { calculateBabyAge, ageString } from "@/data/milestones";
import Badge from "@/components/ui/Badge";
import { formatDateES } from "@/lib/utils";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}

export default function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const ageStr = ageString(milestone.babyAge);
  const [imgLoaded, setImgLoaded] = useState(false);

  const categoryLabels: Record<string, string> = {
    health: "Salud",
    milestone: "Primer logro",
    travel: "Viaje",
    food: "Comida",
    family: "Familia",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="relative mb-8 sm:mb-0"
    >
      {/* Timeline connector dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.15, duration: 0.4 }}
        className="absolute left-1/2 -translate-x-1/2 -top-6 w-4 h-4 rounded-full bg-gradient-to-r from-blush-pink to-dusty-rose shadow-md z-10"
      />

      <div className="relative group">
        {/* Card */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-pearl-white border border-mist-gray/10 rounded-2xl p-6 shadow-subtle group-hover:shadow-strong transition-all duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-heading-bold text-charcoal mb-1">
                {milestone.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-mist-gray">
                <span>📅 {formatDateES(milestone.date)}</span>
                <span className="w-1 h-1 bg-mist-gray rounded-full" />
                <span className="font-medium text-dusty-rose">
                  {ageStr}
                </span>
              </div>
            </div>
            <Badge category={milestone.category} size="sm">
              {categoryLabels[milestone.category]}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-taupe mb-4 leading-relaxed">
            {milestone.description}
          </p>

          {/* Location */}
          {milestone.location && (
            <div className="flex items-center gap-1.5 text-xs text-mist-gray mb-3">
              <MapPin size={12} />
              <span>{milestone.location}</span>
            </div>
          )}

          {/* Parent note */}
          {milestone.parentNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-warm-ivory/50 rounded-xl border-l-2 border-dusty-rose/20"
            >
              <p className="text-xs sm:text-sm text-taupe italic">
                "{milestone.parentNote}"
              </p>
            </motion.div>
          )}

          {/* Images */}
          {milestone.images && milestone.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {milestone.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-mist-gray/10 group-hover:border-dusty-rose/20 transition-all duration-300"
                >
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/20 to-soft-cream animate-pulse rounded-lg" />
                  )}
                  <Image
                    src={img}
                    alt={`${milestone.title} - foto ${i + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    onLoadingComplete={() => setImgLoaded(true)}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Heart favorite indicator (decorative) */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.15 }}
          className="absolute -top-2 -right-2 text-dusty-rose/30"
        >
          <Heart size={16} fill="currentColor" />
        </motion.div>
      </div>
    </motion.div>
  );
}
