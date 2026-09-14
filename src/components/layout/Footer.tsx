// src/components/layout/Footer.tsx
"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-charcoal text-pearl-white py-12 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <span className="text-xl font-heading-bold text-dusty-rose">
              Matthew Journal
            </span>
            <p className="text-sm text-mist-gray mt-1">
              Bitácora de crecimiento desde el 31 de julio de 2026
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-mist-gray">
            Hecho con <Heart size={16} className="text-blush-pink fill-current" /> por Cristian
          </div>
        </div>
        <div className="border-t border-mist-gray/20 mt-8 pt-8 text-center text-xs text-mist-gray">
          © {new Date().getFullYear()} Matthew Journal — Todos los derechos reservados
        </div>
      </div>
    </motion.footer>
  );
}
