// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { authenticate, saveSession } from "@/services/auth";
import { DEMO_CREDENTIALS } from "@/lib/auth/config";

export default function AdminLogin() {
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Verificación en SERVIDOR (/api/admin/login). El token queda en sessionStorage.
    const user = await authenticate(email, password).catch(() => null);
    if (user) {
      saveSession(user);
      router.push("/admin/family");
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-dusty-rose to-blush-pink rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">MJ</span>
          </div>
          <h1 className="text-4xl font-heading-bold text-charcoal mb-2">
            Admin Panel
          </h1>
          <p className="text-sm text-mist-gray">
            Acceso a la bitácora de Matthew
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-light text-taupe mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setError(false)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-300 bg-pearl-white"
                placeholder="admin@matthew-journal.com"
                required
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-gray" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light text-taupe mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setError(false)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-300 bg-pearl-white"
                placeholder="Ingresa la contraseña"
                required
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-gray" />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1.5"
              >
                Credenciales incorrectas. Inténtalo de nuevo.
              </motion.p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-mist-gray"
        >
          <p>Acceso privado — solo el administrador</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
