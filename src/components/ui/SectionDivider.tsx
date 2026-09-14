// src/components/ui/SectionDivider.tsx
"use client";

import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "wave" | "dots" | "line";
}

export default function SectionDivider({
  className,
  variant = "wave",
}: SectionDividerProps) {
  if (variant === "dots") {
    return (
      <div
        className={cn("w-full flex justify-center py-12", className)}
        aria-hidden="true"
      >
        <div className="flex gap-1.5">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-blush-pink/30 animate-pulse",
                `animate-delay-[${i * 50}ms]`
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div
        className={cn(
          "w-full h-px bg-gradient-to-r from-transparent via-dusty-rose/30 to-transparent",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // Default: wave — gradient animated SVG
  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      aria-hidden="true"
      style={{ height: "70px" }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0E6" />
            <stop offset="100%" stopColor="#F8F6F3" />
          </linearGradient>
        </defs>
        <path
          d="M0,0V46.99C0,46.99,120,47,180,47C240,47,300,46.99,360,46.99C420,46.99,480,47,540,47C600,47,660,46.99,720,46.99C780,46.99,840,47,900,47C960,47,1020,46.99,1080,46.99C1140,46.99,1200,46.99,1200,46.99V0H0Z"
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  );
}
