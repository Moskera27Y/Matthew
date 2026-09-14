// src/components/stories/StoryCard.tsx
"use client";

import { motion } from "framer-motion";
import { Story } from "@/types/story";
import { ageString } from "@/data/milestones";
import { formatDateES } from "@/lib/utils";
import { Heart, Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import clsx from "clsx";

interface StoryCardProps {
  story: Story;
  index: number;
  isFeatured?: boolean;
}

export default function StoryCard({ story, index, isFeatured = false }: StoryCardProps) {
  const ageStr = ageString(story.babyAge);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      className={clsx(
        "relative p-6 sm:p-8 mb-8 bg-pearl-white rounded-2xl border border-mist-gray/10 shadow-subtle",
        isFeatured && "border-dusty-rose/20 shadow-md ring-1 ring-dusty-rose/10",
        "group hover:shadow-strong transition-all duration-300"
      )}
    >
      {/* Decorative flourish */}
      <div className="absolute -top-2 left-6 w-12 h-px bg-gradient-to-r from-transparent to-dusty-rose/30" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            className={clsx(
              "text-xl sm:text-2xl font-heading-bold mb-2",
              isFeatured ? "text-dusty-rose" : "text-charcoal"
            )}
          >
            {story.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-mist-gray mb-3">
            <Calendar size={14} />
            <span>{formatDateES(story.date)}</span>
            <span className="w-1 h-1 bg-mist-gray rounded-full" />
            <span>{ageStr}</span>
            {story.author && (
              <>
                <span className="w-1 h-1 bg-mist-gray rounded-full" />
                <span className="font-decorative text-taupe/70">
                  — {story.author}
                </span>
              </>
            )}
          </div>
        </div>

        {isFeatured && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 ml-4"
          >
            <Badge variant="pink" size="sm">
              Destacada
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Content with typewriter-style fade-in */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        whileInView={{ opacity: 1, height: "auto" }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="text-sm sm:text-base text-taupe leading-relaxed font-decorative mb-4">
          "{story.content}"
        </p>
      </motion.div>

      {/* Decorative heart */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, type: "spring" }}
        className="absolute -bottom-3 right-6 text-dusty-rose/20"
      >
        <Heart size={12} fill="currentColor" />
      </motion.div>
    </motion.div>
  );
}
