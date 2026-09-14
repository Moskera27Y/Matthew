// src/types/brother.ts
export type BrotherRole =
  | "primo"
  | "prima"
  | "hermano"
  | "hermana"
  | "amigo"
  | "amiga"
  | "otro";

// Categoría por la que se agrupa a los hermanos/primos/amigos en la galería
export type BrotherCategory =
  | "hermanos" // hermanos propios de Matthew
  | "primos" // primos
  | "amigos" // amigos cercanos
  | "familia"; // otros familiares

// Etiquetas legibles de categoría para mostrar en la UI
export const categoryLabels: Record<BrotherCategory, string> = {
  hermanos: "Hermanos",
  primos: "Primos",
  amigos: "Amigos",
  familia: "Familia",
};

// Color de acento por categoría (para badges/glows)
export const categoryColors: Record<BrotherCategory, string> = {
  hermanos: "text-rose-500",
  primos: "text-sky-500",
  amigos: "text-amber-500",
  familia: "text-mint-500",
};

export interface Brother {
  id: string;
  name: string;
  role: BrotherRole;
  category: BrotherCategory; // <-- agrupación en galería: hermanos / primos / amigos / familia
  age?: string; // ej: "5 años"
  photoUrl: string;
  message: string; // alusión a lo que se hacía en la foto
  order: number;
}

export const DEFAULT_BROTHERS: Brother[] = [
  {
    id: "b1",
    name: "Sofía",
    role: "prima",
    category: "primos",
    age: "5 años",
    photoUrl: "/images/placeholder-brother-1.svg",
    message: "Siempre listita para compartir su primer juguete con Matthew, enseñándole que jugar en equipo es lo mejor.",
    order: 1,
  },
  {
    id: "b2",
    name: "Mateo",
    role: "primo",
    category: "primos",
    age: "3 años",
    photoUrl: "/images/placeholder-brother-2.svg",
    message: "Tu primo pequeñín, siempre rodeado de juguetes, te enseñó que descubrir el mundo juntos es la mejor aventura.",
    order: 2,
  },
];
