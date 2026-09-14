// src/components/admin/AdminLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Images,
  Weight,
  Users,
  Gift,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, clearSession } from "@/services/auth";
import { AuthUser, AUTH_CONFIG } from "@/lib/auth/config";
import Button from "@/components/ui/Button";
import { AdminSection } from "@/lib/types/admin";

const navItems: Array<{ id: AdminSection; label: string; icon: React.ReactNode }> =
  [
    { id: "milestones", label: "Hitos", icon: <Calendar size={20} /> },
    { id: "gallery", label: "Galería", icon: <Images size={20} /> },
    { id: "growth", label: "Crecimiento", icon: <Weight size={20} /> },
    { id: "brothers", label: "Hermanos y Primos", icon: <Users size={20} /> },
    { id: "family", label: "Familia", icon: <Users size={20} /> },
    { id: "event", label: "Evento", icon: <Gift size={20} /> },
    { id: "settings", label: "Configuración", icon: <Settings size={20} /> },
  ];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/admin/login");
    } else {
      setUser(session);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  const currentSection = pathname.replace("/admin/", "") as AdminSection;

  return (
    <div className="flex h-screen bg-pearl-white overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative z-50 h-full bg-pearl-white border-r border-mist-gray/20 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-mist-gray/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-dusty-rose to-blush-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">MJ</span>
              </div>
              <span className="text-lg font-heading-bold text-charcoal">
                Admin Panel
              </span>
            </div>
            {user && (
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-mist-gray/20 overflow-hidden">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-mist-gray">
                      {user.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-mist-gray">{user.name}</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <Link key={item.id} href={`/admin/${item.id}`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-dusty-rose/10 text-dusty-rose shadow-sm"
                        : "text-taupe hover:bg-mist-gray/5"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-mist-gray/10">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="ml-2 text-sm">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-soft-cream">
        <div className="p-6">
          {/* Mobile header */}
          <div className="md:hidden mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </Button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
