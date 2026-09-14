// src/data/photos.ts
import { Photo, Album, PhotoCategory } from "@/types/photo";
import { BIRTH_DATE } from "@/lib/constants";
import { addDays, format, eachMonthOfInterval, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { calculateAge } from "@/lib/utils";

function ageFromBirth(daysAfterBirth: number): { days: number; weeks: number; months: number; years: number } {
  const target = addDays(BIRTH_DATE, daysAfterBirth);
  return calculateAge(target);
}

function fmtMonth(date: Date): string {
  return format(date, "MMMM yyyy", { locale: es });
}

// Imágenes placeholder locales (SVG) - una sola imagen reutilizable
export const PLACEHOLDER_URLS = [
  "/images/placeholder-gallery.svg",
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generamos 18 fotos distribuidas en 3 meses
export const PHOTOS: Photo[] = [
  // Mes 1 (Agosto 2026)
  {
    id: "p1",
    src: PLACEHOLDER_URLS[0],
    alt: "Matthew en su primer mes",
    caption: "Dormido como un angelcito",
    date: format(addDays(BIRTH_DATE, 5), "yyyy-MM-dd"),
    babyAge: ageFromBirth(5),
    category: "daily" as PhotoCategory,
    order: 1,
  },
  {
    id: "p2",
    src: PLACEHOLDER_URLS[1],
    alt: "Matthew con mamá",
    caption: "Momento de amamantamiento",
    date: format(addDays(BIRTH_DATE, 15), "yyyy-MM-dd"),
    babyAge: ageFromBirth(15),
    category: "family" as PhotoCategory,
    order: 2,
  },
  {
    id: "p3",
    src: PLACEHOLDER_URLS[2],
    alt: "Primer baño de Matthew",
    caption: "¡Agua fría!",
    date: format(addDays(BIRTH_DATE, 21), "yyyy-MM-dd"),
    babyAge: ageFromBirth(21),
    category: "milestone" as PhotoCategory,
    order: 3,
  },
  {
    id: "p4",
    src: PLACEHOLDER_URLS[3],
    alt: "Matthew durmiendo",
    caption: "Sueño profundo",
    date: format(addDays(BIRTH_DATE, 28), "yyyy-MM-dd"),
    babyAge: ageFromBirth(28),
    category: "sleep" as PhotoCategory,
    order: 4,
  },

  // Mes 2 (Septiembre 2026)
  {
    id: "p5",
    src: PLACEHOLDER_URLS[4],
    alt: "Primer sonrisa de Matthew",
    caption: "¡Mi primera sonrisa!",
    date: format(addDays(BIRTH_DATE, 35), "yyyy-MM-dd"),
    babyAge: ageFromBirth(35),
    category: "milestone" as PhotoCategory,
    order: 5,
  },
  {
    id: "p6",
    src: PLACEHOLDER_URLS[5],
    alt: "Matthew jugando",
    caption: "Hora de jugar",
    date: format(addDays(BIRTH_DATE, 38), "yyyy-MM-dd"),
    babyAge: ageFromBirth(38),
    category: "play" as PhotoCategory,
    order: 6,
  },
  {
    id: "p7",
    src: PLACEHOLDER_URLS[6],
    alt: "Alimentación con papá",
    caption: "Con papá",
    date: format(addDays(BIRTH_DATE, 42), "yyyy-MM-dd"),
    babyAge: ageFromBirth(42),
    category: "family" as PhotoCategory,
    order: 7,
  },
  {
    id: "p8",
    src: PLACEHOLDER_URLS[7],
    alt: "Matthew en el parque",
    caption: "Primer día al aire libre",
    date: format(addDays(BIRTH_DATE, 45), "yyyy-MM-dd"),
    babyAge: ageFromBirth(45),
    category: "milestone" as PhotoCategory,
    order: 8,
  },

  // Mes 3 (Octubre 2026)
  {
    id: "p9",
    src: PLACEHOLDER_URLS[8],
    alt: "Matthew posando",
    caption: "¡Fotos!",
    date: format(addDays(BIRTH_DATE, 60), "yyyy-MM-dd"),
    babyAge: ageFromBirth(60),
    category: "daily" as PhotoCategory,
    order: 9,
  },
  {
    id: "p10",
    src: PLACEHOLDER_URLS[9],
    alt: "Durmiendo después de comer",
    caption: "Sueño post-comida",
    date: format(addDays(BIRTH_DATE, 65), "yyyy-MM-dd"),
    babyAge: ageFromBirth(65),
    category: "food" as PhotoCategory,
    order: 10,
  },
  {
    id: "p11",
    src: PLACEHOLDER_URLS[0],
    alt: "Matthew con la abuela",
    caption: "Abrazos de abuela",
    date: format(addDays(BIRTH_DATE, 70), "yyyy-MM-dd"),
    babyAge: ageFromBirth(70),
    category: "family" as PhotoCategory,
    order: 11,
  },
  {
    id: "p12",
    src: PLACEHOLDER_URLS[1],
    alt: "Primer diente de leche",
    caption: "¡Primer diente!",
    date: format(addDays(BIRTH_DATE, 75), "yyyy-MM-dd"),
    babyAge: ageFromBirth(75),
    category: "milestone" as PhotoCategory,
    order: 12,
  },
  {
    id: "p13",
    src: PLACEHOLDER_URLS[2],
    alt: "Matthew en su cuna",
    caption: "Momento de descanso",
    date: format(addDays(BIRTH_DATE, 80), "yyyy-MM-dd"),
    babyAge: ageFromBirth(80),
    category: "sleep" as PhotoCategory,
    order: 13,
  },
  {
    id: "p14",
    src: PLACEHOLDER_URLS[3],
    alt: "Jugando con juguetes",
    caption: "Explorando",
    date: format(addDays(BIRTH_DATE, 85), "yyyy-MM-dd"),
    babyAge: ageFromBirth(85),
    category: "play" as PhotoCategory,
    order: 14,
  },
  {
    id: "p15",
    src: PLACEHOLDER_URLS[4],
    alt: "Matthew sonriendo",
    caption: "¡Sonrisa de oreja a oreja!",
    date: format(addDays(BIRTH_DATE, 90), "yyyy-MM-dd"),
    babyAge: ageFromBirth(90),
    category: "daily" as PhotoCategory,
    order: 15,
  },
  {
    id: "p16",
    src: PLACEHOLDER_URLS[5],
    alt: "Cena familiar",
    caption: "Tiempo en familia",
    date: format(addDays(BIRTH_DATE, 95), "yyyy-MM-dd"),
    babyAge: ageFromBirth(95),
    category: "food" as PhotoCategory,
    order: 16,
  },
  {
    id: "p17",
    src: PLACEHOLDER_URLS[6],
    alt: "Matthew sentado",
    caption: "¡Probando el posicionamiento!",
    date: format(addDays(BIRTH_DATE, 100), "yyyy-MM-dd"),
    babyAge: ageFromBirth(100),
    category: "milestone" as PhotoCategory,
    order: 17,
  },
  {
    id: "p18",
    src: PLACEHOLDER_URLS[7],
    alt: "Ultimas fotos del mes",
    caption: "Nuestro pequeñín crece",
    date: format(addDays(BIRTH_DATE, 105), "yyyy-MM-dd"),
    babyAge: ageFromBirth(105),
    category: "daily" as PhotoCategory,
    order: 18,
  },
];

// Álbumes generados automáticamente por mes
export const ALBUMS: Album[] = [
  {
    id: "a1",
    title: "Primer mes",
    description: "Los primeros días de Matthew",
    month: "agosto",
    year: 2026,
    order: 1,
  },
  {
    id: "a2",
    title: "Segundo mes",
    description: "Sonrisas y primeros baños",
    month: "septiembre",
    year: 2026,
    order: 2,
  },
  {
    id: "a3",
    title: "Tercer mes",
    description: "Explorando el mundo",
    month: "octubre",
    year: 2026,
    order: 3,
  },
];

export const photoCategoryLabels: Record<string, string> = {
  daily: "Día a día",
  milestone: "Hitos",
  sleep: "Sueño",
  play: "Juego",
  food: "Comida",
  family: "Familia",
};

export const MONTHS = ["agosto", "septiembre", "octubre"];
export const photoUrls = PLACEHOLDER_URLS;
