import type { NextConfig } from "next";
import withPWA from "next-pwa";

// generateBuildId dinámico (timestamp) para forzar fresh build en Vercel CI:
// invalida el build cache agresivamente → el bundle prod SIEMPRE contiene
// los últimos fixes (evita que Vercel CI sirva un build cacheado con bugs #418).
const nextConfig: NextConfig = {
  generateBuildId: async () => `b${Date.now()}`,
  reactStrictMode: true,
  turbopack: {}, // Habilitar Turbopack (Next.js 16)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
      { protocol: "https", hostname: "blob.vercel-storage.com" },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Permitir incrustar el sitio en iframes de otras páginas:
          // SIN X-Frame-Options + CSP frame-ancestors * (cualquier origen padre).
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // CRITICAL: chunks + JS estáticos NUNCA cacheados → browser siempre
      // descarga el bundle nuevo del CDN, evitando el service-worker stale-bundle
      // bug que causaba "This page couldn't load" (bundle viejo con error #418).
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Vary", value: "Accept-Encoding, User-Agent" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        ],
      },
    ];
  },
};

// next-pwa: NUNCA cachear /_next/static/chunks ni /js (el bundle JS contiene el
// código del app). Solo cacheamos imágenes y fuentes. Al excluir los chunks del
// runtimeCaching, el SW no sirve bundles viejos → siempre fresh del CDN.
const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  exclude: [/^\/_next\/static\/chunks/, /^\/_next\/static\/js/],
  runtimeCaching: [
    {
      pattern: /^https:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|avif|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      pattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-stylesheet",
        expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
  ],
});

export default withPWAConfig(nextConfig);
