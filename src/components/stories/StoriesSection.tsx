// src/components/stories/StoriesSection.tsx
"use client";

import { motion } from "framer-motion";
import StoryCard from "./StoryCard";
import Container from "@/components/ui/Container";
import { Story } from "@/types/story";
import { BookOpen } from "lucide-react";

interface StoriesSectionProps {
  stories: Story[];
}

export default function StoriesSection({ stories }: StoriesSectionProps) {
  const sortedStories = [...stories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Container id="stories" size="md" className="section-alt-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
          Historias de Amor
        </h2>
        <p className="text-sm sm:text-base text-mist-gray max-w-2xl mx-auto">
          Notas de papás, fragmentos de esta hermosa historia de amor,
          contados en cada entrada del diario.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        {sortedStories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen size={48} className="mx-auto mb-4 text-mist-gray/30" />
            <p className="text-mist-gray">
              Aún no hay historias escritas. Vuelve pronto.
            </p>
          </motion.div>
        ) : (
          sortedStories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))
        )}
      </div>
    </Container>
  );
}
