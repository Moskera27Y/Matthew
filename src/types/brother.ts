// src/types/brother.ts
export type BrotherRole =
  | "primo"
  | "prima"
  | "hermano"
  | "hermana"
  | "amigo"
  | "amiga"
  | "otro";

export interface Brother {
  id: string;
  name: string;
  role: BrotherRole;
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
    age: "5 años",
    photoUrl: "/images/placeholder-brother-1.svg",
    message: "Siempre listita para compartir su primer juguete con Matthew, enseñándole que jugar en equipo es lo mejor.",
    order: 1,
  },
  {
    id: "b2",
    name: "Mateo",
    role: "primo",
    age: "3 años",
    photoUrl: "/images/placeholder-brother-2.svg",
    message: "Tu primo pequeñín, siempre rodeado de juguetes, te enseñó que descubrir el mundo juntos es la mejor aventura.",
    order: 2,
  },
];
