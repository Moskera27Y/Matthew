// src/components/timeline/Timeline.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Milestone } from "@/types/milestone";
import MilestoneCard from "./MilestoneCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { SwatchBook } from "lucide-react";

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // La línea de tiempo crece a medida que haces scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 1], [0, 1, 1]);

  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <Container id="timeline" size="lg" className="section-alt-1">
      <SectionHeading
        eyebrow="Su historia"
        title="Línea de Tiempo de Matthew"
        description="Cada momento cuenta. Desde el primer suspiro hasta los primeros pasos, aquí vive su historia día a día."
        icon={<SwatchBook size={16} />}
      />

      {/* Timeline Desktop (vertical) */}
      <div
        ref={containerRef}
        className="relative hidden sm:block py-8"
      >
        {/* Línea central animada */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-mist-gray/20" />
        
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-dusty-rose"
          style={{ height: lineHeight, opacity: lineOpacity }}
        />

        {/* Hitos */}
        <div className="relative">
          {sortedMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`relative mb-12 ${
                index % 2 === 0 ? "ml-auto pr-[calc(50%+2rem)]" : "mr-auto pl-[calc(50%+2rem)]"
              } last:mb-0`}
            >
              <MilestoneCard milestone={milestone} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Mobile (horizontal scroll) */}
      <div className="sm:hidden -mx-4 px-4">
        <div className="flex gap-4 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-mist-gray/30">
          {sortedMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="min-w-[280px] snap-start first:ml-0"
            >
              <MilestoneCard milestone={milestone} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Empty state illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-mist-gray">
          <SwatchBook size={16} />
          <span>Hay {sortedMilestones.length} momentos registrados</span>
        </div>
      </motion.div>
    </Container>
  );
}
