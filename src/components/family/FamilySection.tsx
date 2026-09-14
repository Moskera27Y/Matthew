// src/components/family/FamilySection.tsx
"use client";

import { motion } from "framer-motion";
import { FAMILY_MEMBERS } from "@/data/family";
import { FamilyMember } from "@/types/family";
import FamilyCard from "./FamilyCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Heart } from "lucide-react";

interface FamilySectionProps {
  members?: FamilyMember[];
}

export default function FamilySection({ members }: FamilySectionProps) {
  const data = members || FAMILY_MEMBERS;
  return (
    <Container id="family" size="lg" className="section-alt-1">
      <SectionHeading
        eyebrow="Raíces"
        title="Familia"
        description="Los que tejen esta historia a tu alrededor. Cada miembro aporta un hilo de amor a este hermoso tapiz familiar."
        icon={<Heart size={16} />}
      />

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
