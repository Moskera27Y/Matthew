// src/components/ui/Badge.tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "mint" | "lavender" | "sky" | "peach" | "pink";
  category?: "health" | "milestone" | "travel" | "food" | "family";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

const categoryMap: Record<string, "mint" | "lavender" | "sky" | "peach" | "pink"> = {
  health: "mint",
  milestone: "pink",
  travel: "sky",
  food: "peach",
  family: "lavender",
};

const variants = {
  default: "bg-mist-gray/10 text-taupe",
  mint: "bg-mint-soft/20 text-green-700",
  lavender: "bg-lavender-soft/20 text-purple-700",
  sky: "bg-sky-soft/30 text-blue-700",
  peach: "bg-peach-soft/30 text-orange-700",
  pink: "bg-pink-soft/40 text-pink-700",
};

const sizes = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({
  children,
  variant,
  category,
  size = "md",
  className,
  onClick,
}: BadgeProps) {
  const resolvedVariant = variant || (category ? categoryMap[category] : "default");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-light",
        variants[resolvedVariant],
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
