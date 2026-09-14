// src/components/family/FamilySection.tsx
"use client";

import { motion } from "framer-motion";
import { FAMILY_MEMBERS } from "@/data/family";
import { FamilyMember } from "@/types/family";
import FamilyCard from "./FamilyCard";
import Container from "@/components/ui/Container";

interface FamilySectionProps {
  members?: FamilyMember[];
}

export default function FamilySection({ members }: FamilySectionProps) {
  const data = members || FAMILY_MEMBERS;
  return (
    <Container id="family" size="lg" className="section-alt-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-bold text-charcoal mb-4">
          Familia
        </h2>
        <p className="text-sm sm:text-base text-mist-gray max-w-2xl mx-auto">
          Los que tejen esta historia a tu alrededor. Cada miembro aporta un
          hilo de amor a este hermoso tapiz familiar.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {data.sort((a, b) => a.order - b.order).map((member, i) => (
          <FamilyCard key={member.id} member={member} index={i} />
        ))}
      </motion.div>

      {/* Decorative footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="mt-16 text-center"
      >
        <p className="text-sm font-decorative text-taupe/60">
          "Donde hay amor de familia, allí está la felicidad."
        </p>
      </motion.div>
    </Container>
  );
}
