// src/components/ui/Container.tsx
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
}

export default function Container({ children, className, id, size = "lg" }: ContainerProps) {
  const maxWidths = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
  };

  return (
    <section
      id={id}
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24",
        maxWidths[size],
        className
      )}
    >
      {children}
    </section>
  );
}
