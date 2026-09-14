// src/data/family.ts
import { FamilyMember } from "@/types/family";

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "f1",
    name: "Cristian",
    relationship: "Papá",
    role: "dad",
    photoUrl: "/images/placeholder-gallery.svg",
    quote: "La paciencia es la clave. Cada día es una nueva historia de aprendizaje.",
    order: 1,
  },
  {
    id: "f2",
    name: "María",
    relationship: "Mamá",
    role: "mom",
    photoUrl: "/images/placeholder-gallery.svg",
    quote: "Amor incondicional, cada mañana te renueva.",
    order: 2,
  },
  {
    id: "f3",
    name: "Elena",
    relationship: "Abuela",
    role: "grandma",
    photoUrl: "/images/placeholder-gallery.svg",
    quote: "Los nietos son los árboles frutales del corazón.",
    order: 3,
  },
  {
    id: "f4",
    name: "Luis",
    relationship: "Abuelo",
    role: "grandpa",
    photoUrl: "/images/placeholder-gallery.svg",
    quote: "La sabiduría de los mayores guía a los pequeños.",
    order: 4,
  },
];
