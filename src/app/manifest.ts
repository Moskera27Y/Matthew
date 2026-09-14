// src/app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Matthew Journal — Bitácora de Crecimiento",
    short_name: "Matthew Journal",
    description: "Una bitácora digital interactiva del crecimiento de Matthew, nacido el 31 de julio de 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#D4A59A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
