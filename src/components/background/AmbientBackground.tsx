// src/components/background/AmbientBackground.tsx
// Fondo ambiental fijo multicapa (p5js: motion variety — 3 velocidades):
// blobs lentos (0.1x) + partículas medias (0.3x) + destellos rápidos (1x).
"use client";

import { useMemo } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

const LAYER_COLORS = ["#F0ABFC", "#FCD34D", "#7DD3FC", "#FDA4AF", "#6EE7B7"];

export default function AmbientBackground() {
  // Partículas medias: deriva orgánica lenta
  const drifters = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: (i * 37 + 11) % 100,
        top: (i * 53 + 7) % 100,
        size: 5 + ((i * 7) % 8),
        duration: 9 + ((i * 3) % 8),
        delay: (i % 6) * 1.1,
        color: LAYER_COLORS[i % LAYER_COLORS.length],
      })),
    []
  );
  // Destellos rápidos con twinkle
  const twinkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: (i * 41 + 23) % 100,
        top: (i * 29 + 13) % 100,
        size: 10 + ((i * 5) % 8),
        delay: (i % 5) * 0.7,
        Icon: [Sparkles, Star, Heart][i % 3],
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Capa lenta: blobs de color */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-fuchsia-200/25 blur-[100px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-amber-200/25 blur-[100px] animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-sky-200/25 blur-[100px] animate-float-slow" style={{ animationDelay: "4s" }} />
      {/* Capa media: partículas a la deriva */}
      {drifters.map((p) => (
        <span
          key={`d-${p.id}`}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.45,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Capa rápida: destellos */}
      {twinkles.map((t) => (
        <span
          key={`t-${t.id}`}
          className="absolute text-fuchsia-300/60 animate-twinkle-soft"
          style={{ left: `${t.left}%`, top: `${t.top}%`, animationDelay: `${t.delay}s` }}
        >
          <t.Icon size={t.size} />
        </span>
      ))}
    </div>
  );
}
