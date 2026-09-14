// src/components/events/EventDetail.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import { EventDetails } from "@/types/event";
import { formatDateES } from "@/lib/utils";
import Container from "@/components/ui/Container";

interface EventDetailProps {
  event: EventDetails;
}

export default function EventDetail({ event }: EventDetailProps) {
  return (
    <motion.section
      id="event-detail"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-pearl-white"
    >
      <Container size="md">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading-bold text-center text-charcoal mb-12"
          >
            {event.title}
          </motion.h2>

          {/* Date/Time/Location cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.div
              className="text-center p-6 bg-warm-ivory/30 rounded-2xl border border-mist-gray/10"
              transition={{ delay: 0.1 }}
            >
              <Calendar size={24} className="text-dusty-rose mx-auto mb-2" />
              <p className="text-sm text-mist-gray">Fecha</p>
              <p className="font-medium text-charcoal mt-1">{formatDateES(event.date)}</p>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-warm-ivory/30 rounded-2xl border border-mist-gray/10"
              transition={{ delay: 0.2 }}
            >
              <Clock size={24} className="text-sky-soft mx-auto mb-2" />
              <p className="text-sm text-mist-gray">Hora</p>
              <p className="font-medium text-charcoal mt-1">{event.time}</p>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-warm-ivory/30 rounded-2xl border border-mist-gray/10"
              transition={{ delay: 0.3 }}
            >
              <MapPin size={24} className="text-lavender-soft mx-auto mb-2" />
              <p className="text-sm text-mist-gray">Lugar</p>
              <p className="font-medium text-charcoal mt-1">{event.location}</p>
            </motion.div>
          </motion.div>

          {/* Address */}
          <motion.p
            className="text-center text-taupe text-sm mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {event.address}
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg text-taupe/80 mx-auto text-center max-w-none"
          >
            {event.description}
          </motion.div>

          {/* Thank you message */}
          <motion.div
            className="mt-12 p-8 bg-gradient-to-r from-blush-pink/30 to-lavender-soft/30 rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.p
              className="text-2xl italic text-charcoal font-decorative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              "{event.thankYouMessage}"
            </motion.p>
            <motion.div
              className="flex items-center gap-1 justify-center mt-4 text-dusty-rose"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Heart size={16} fill="currentColor" />
              con todo el cariño de Matthew
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}
