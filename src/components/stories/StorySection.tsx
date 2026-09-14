// src/components/stories/StorySection.tsx
"use client";

import { motion } from "framer-motion";
import { Story } from "@/types/story";
import StoryCard from "./StoryCard";
import Container from "@/components/ui/Container";
import SectionDivider from "@/components/ui/SectionDivider";
import { featuredStory, STORIES } from "@/data/stories";
import { Pen } from "lucide-react";

interface StorySectionProps {
  stories?: Story[];
}

export default function StorySection({ stories }: StorySectionProps) {
  const data = stories || STORIES;
  const featured = data.find((s) => s.isFeatured);
  const regular = data.filter((s) => !s.isFeatured);

  return (
    <Container id="stories" size="md" className="section-alt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
          Historias de Amor
        </h2>
        <p className="text-sm sm:text-base text-mist-gray max-w-2xl mx-auto">
          Fragmentos de esta hermosa historia de amor, contados por quienes
          tejen cada página a tu alrededor.
        </p>
      </motion.div>

      {/* Featured Story */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12"
        >
          <StoryCard story={featured} index={-1} isFeatured={true} />
        </motion.div>
      )}

      {/* Regular Stories */}
      <div className="space-y-6">
        {regular.map((story, i) => (
          <StoryCard key={story.id} story={story} index={i} isFeatured={false} />
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm text-mist-gray hover:text-dusty-rose transition-colors duration-300 cursor-pointer rounded-full border border-mist-gray/20 hover:border-dusty-rose/30"
        >
          <Pen size={16} />
          <span>Compartir una historia</span>
        </motion.div>
      </motion.div>
    </Container>
  );
}
