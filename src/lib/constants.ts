// src/lib/constants.ts
export const BIRTH_DATE = new Date("2026-07-31T00:00:00");
export const BABY_NAME = "Matthew";
export const BABY_TAGLINE = ""; // reemplazado por poema en Hero

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "#hero" },
  { label: "Hitos", href: "#timeline" },
  { label: "Galería", href: "#gallery" },
  { label: "Crecimiento", href: "#growth" },
  { label: "Hermanos y Primos", href: "#siblings" },
  { label: "Familia", href: "#family" },
  { label: "Evento", href: "/eventos", external: true },
];

export const COLORS = {
  pearlWhite: "#FAFAF8",
  softCream: "#FFF7F0",
  warmIvory: "#FFF1E6",
  blushPink: "#FFE0D9",
  dustyRose: "#D4A59A",
  taupe: "#8A7F7A",
  mistGray: "#C2B8B0",
  charcoal: "#3A3534",
  mintSoft: "#B5D9B3",
  lavenderSoft: "#C9B6E4",
  skySoft: "#A8D5E2",
  peachSoft: "#F2C999",
  pinkSoft: "#F2B8C4",
};
