// src/types/event.ts
export interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  thankYouMessage: string;
  isPublic: boolean;
  isEnabled?: boolean; // soft toggle para mostrar/ocultar evento en homepage
}

export interface SavedEvent extends EventDetails {
  isApproved: boolean;
  isEnabled?: boolean;
}

export const DEFAULT_EVENT: EventDetails = {
  id: "matthew-baptism",
  title: "Bautizo de Matthew",
  date: "2026-10-15",
  time: "11:00",
  location: "Iglesia Sagrado Corazón",
  address: "Calle 12 #34-56, Cali, Valle del Cauca",
  description:
    "Celebraremos el bautizo de Matthew con la familia y amigos cercanos. Será un día lleno de bendiciones y alegría para compartir en este momento tan especial.",
  thankYouMessage:
    "Gracias por ser parte de esta bendición. Su presencia es el mejor regalo para nuestra familia.",
  isPublic: true,
  isEnabled: true,
};
