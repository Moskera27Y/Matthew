// src/components/ui/Card.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  variant?: "default" | "elevated" | "bordered" | "glass";
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  variant = "default",
  className,
  children,
}: CardProps) {
  const variants = {
    default: "bg-pearl-white border border-mist-gray/10 shadow-subtle",
    elevated:
      "bg-pearl-white border border-mist-gray/10 shadow-strong hover:shadow-md transition-shadow duration-300",
    bordered:
      "bg-transparent border-2 border-dashed border-mist-gray/20",
    glass:
      "bg-white/30 backdrop-blur-md border border-white/50 shadow-subtle",
  };

  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
