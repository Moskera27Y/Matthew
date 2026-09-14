// src/components/ui/Avatar.tsx
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  xs: { box: "w-6 h-6", img: 24 },
  sm: { box: "w-8 h-8", img: 32 },
  md: { box: "w-10 h-10", img: 40 },
  lg: { box: "w-12 h-12", img: 48 },
  xl: { box: "w-16 h-16", img: 64 },
};

export default function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className,
}: AvatarProps) {
  const { box, img } = sizeClasses[size];
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden border-2 border-white shadow-subtle flex-shrink-0 bg-blush-pink/30 flex items-center justify-center",
        box,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={img}
          height={img}
          className="object-cover"
        />
      ) : (
        fallback || (
          <span className="text-xs text-mist-gray font-light">
            {alt.substring(0, 2).toUpperCase()}
          </span>
        )
      )}
    </div>
  );
}
