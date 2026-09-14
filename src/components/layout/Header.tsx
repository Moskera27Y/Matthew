// src/components/layout/Header.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

const HEADER_OFFSET = 80;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleNavClick = useCallback((href: string, external?: boolean) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    setIsOpen(false);
    const target = href.substring(1);
    const element = document.getElementById(target);
    if (element) {
      const top = element.offsetTop - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(target);
    }
  }, []);

  // Scroll listener for active section detection + background change
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);

      const sections = NAV_LINKS.map((l) => l.href.substring(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= HEADER_OFFSET + 50 && rect.bottom >= 50) {
          current = id;
          break;
        }
      }
      if (!current) {
        // fallback: first section if near top
        if (window.scrollY < window.innerHeight / 2) current = "hero";
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-pearl-white/90 shadow-card border-b border-mist-gray/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo / Nombre */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <span className="text-xl sm:text-2xl font-heading-bold text-dusty-rose">
              Matthew Journal
            </span>
            <span className="block text-xs text-mist-gray font-light">
              Bitácora de crecimiento
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.external)}
                  className={`relative px-4 py-2 text-sm font-light rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-charcoal bg-warm-ivory/50"
                      : "text-taupe hover:text-dusty-rose hover:bg-warm-ivory/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blush-pink rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-pearl-white border-t border-mist-gray/20 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.external)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`block w-full text-left px-4 py-3 text-base font-light rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-charcoal bg-warm-ivory/50"
                        : "text-taupe hover:text-dusty-rose hover:bg-warm-ivory/30"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
