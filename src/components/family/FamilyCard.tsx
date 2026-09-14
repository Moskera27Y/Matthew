// src/components/family/FamilyCard.tsx
"use client";

import { motion } from "framer-motion";
import { FamilyMember } from "@/types/family";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Heart } from "lucide-react";

interface FamilyCardProps {
  member: FamilyMember;
  index: number;
}

const roleLabels: Record<string, string> = {
  mom: "Mamá",
  dad: "Papá",
  grandma: "Abuela",
  grandpa: "Abuelo",
  sibling: "Hermano/Hermana",
  other: "Otro",
};

export default function FamilyCard({ member, index }: FamilyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="bg-pearl-white rounded-2xl p-6 shadow-subtle border border-mist-gray/10 hover:shadow-strong transition-all duration-300 group"
    >
      <motion.div
        whileHover={{ rotate: 2, scale: 1.1 }}
        className="flex justify-center mb-4"
      >
        <div className="relative">
          <Avatar
            src={member.photoUrl}
            alt={member.name}
            size="xl"
            className="border-4 border-white shadow-md"
          />
          <motion.div
            className="absolute -bottom-1 -right-1 bg-dusty-rose/10 rounded-full p-1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Heart size={12} className="text-dusty-rose" />
          </motion.div>
        </div>
      </motion.div>

      <div className="text-center">
        <h3 className="text-xl font-heading-bold text-charcoal mb-1">
          {member.name}
        </h3>
        <p className="text-sm text-mist-gray mb-3">{member.relationship}</p>

        <Badge
          category={
            member.role === "mom"
              ? "family"
              : member.role === "dad"
              ? "family"
              : member.role === "grandma"
              ? "family"
              : "family"
          }
          size="sm"
        >
          {roleLabels[member.role]}
        </Badge>

        {member.quote && (
          <motion.blockquote
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "auto" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm font-decorative text-taupe/70 italic"
          >
            "{member.quote}"
          </motion.blockquote>
        )}
      </div>
    </motion.div>
  );
}
