// src/data/stories.ts
import { Story } from "@/types/story";
import { BIRTH_DATE } from "@/lib/constants";
import { addDays } from "date-fns";
import { calculateAge } from "@/lib/utils";

function makeStory(
  id: string,
  title: string,
  content: string,
  date: number,
  author: string,
  isFeatured: boolean,
  images?: string[]
): Story {
  const d = addDays(BIRTH_DATE, date);
  return {
    id,
    title,
    content,
    date: d.toISOString().split("T")[0],
    babyAge: calculateAge(d),
    images,
    isFeatured,
    author,
    createdAt: d.toISOString(),
    updatedAt: d.toISOString(),
  };
}

export const STORIES: Story[] = [
  makeStory(
    "s1",
    "Tu primer suspiro",
    "Recuerdo el momento exacto. Estábamos en la habitación, el silencio se hizo profundo, y entonces escuché ese primer suspiro profundo. Como si el mundo le susurrara 'bienvenido'. Te vi dormir, y supe que ya eras parte de nosotros de una manera que jamás entendería antes.",
    0,
    "Mamá",
    true,
    [
      "/images/placeholder-story.svg",
    ]
  ),
  makeStory(
    "s2",
    "La primera sonrisa",
    "Era una mañana cualquiera. Te despertaste con esa sonrisa que no sabía para qué era, pero que iluminó toda la casa. Papá y yo estábamos tomando café cuando de repente nos miramos, y supimos. Esa sonrisa era solo para nosotros. Se convirtió en nuestro sol cada mañana.",
    8,
    "Papá",
    true
  ),
  makeStory(
    "s3",
    "Tu primer viaje al parque",
    "Te llevamos al parque de los girasoles. El sol dorado atravesaba las hojas y tú, en tu carrito, parecías absorber cada rayo de luz. Te quedaste dormido entre el olor a tierra mojada y las risas de los niños. Por un momento, el mundo se detuvo para admirar lo pequeño que eres.",
    52,
    "Mamá",
    false
  ),
  makeStory(
    "s4",
    "Primer diente y primer mordida",
    "Hoy mordiiste tu primer diente... y también mi dedo. No fue grave, pero te reíste como si fuera el mejor juego del mundo. Papá dijo que parecías un pequeño soldado. Yo solo vi a mi bebé, creciendo un día más.",
    75,
    "Papá",
    false
  ),
  makeStory(
    "s5",
    "Noche de tormenta",
    "Hoy hubo tormenta intensa. Mientras el cielo se enfurecía afuera, tú dormías en mis brazos, y el sonido de tu respiración era más fuerte que el trueno. En ese momento supe que no necesitábamos miedo. Solo necesitábamos este silencio compartido, este calor entre nosotros.",
    9,
    "Mamá",
    true
  ),
];

export const featuredStory = STORIES.find((s) => s.isFeatured) || STORIES[0];
