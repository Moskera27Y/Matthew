// src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Globe, Users, Save, Upload, Calendar, Clock, MapPin, X, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import {
  getPrivacySettings,
  savePrivacySettings,
  getDefaultPrivacy,
} from "@/services/auth";
import { PrivacySettings, PrivacyMode } from "@/lib/auth/config";
import {
  loadSettings,
  saveSettings,
  loadEvent,
  saveEvent,
  } from "@/services/adminService";
import { generateInvitationToken, saveInvitationToken, loadInvitationToken, generateInvitationLink, validateInvitationToken } from "@/services/invitationService";
import { EventDetails } from "@/types/event";
import Badge from "@/components/ui/Badge";

export default function AdminSettings() {
  const [settings, setSettings] = useState<PrivacySettings>(getDefaultPrivacy());
  const [babyPhoto, setBabyPhoto] = useState("");
  const [event, setEvent] = useState<EventDetails>({
    id: "default",
    title: "",
    date: "",
    time: "",
    location: "",
    address: "",
    description: "",
    thankYouMessage: "",
    isPublic: true,
  });
  const [isSaved, setIsSaved] = useState(false);
  const [invitationToken, setInvitationToken] = useState("");

  useEffect(() => {
    const stored = getPrivacySettings();
    if (stored) setSettings(stored);
    const adminSettings = loadSettings();
    if (adminSettings?.babyPhoto) setBabyPhoto(adminSettings.babyPhoto);
    setEvent(loadEvent());
    // Cargar token existente
    const token = loadInvitationToken();
    if (token) setInvitationToken(token);
  }, []);

  const handleGenerateInvite = () => {
    const token = generateInvitationToken();
    setInvitationToken(token);
    saveInvitationToken(token);
  };

  const copyInviteLink = () => {
    const link = generateInvitationLink(invitationToken);
    navigator.clipboard.writeText(link);
    alert("¡Link copiado al portapapeles!");
  };

  const handleModeChange = (mode: PrivacyMode) => {
    setSettings({ ...settings, mode });
  };

  const handlePasswordChange = (password: string) => {
    setSettings({ ...settings, password });
  };

  const handleSave = () => {
    savePrivacySettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleEventSave = () => {
    saveEvent(event);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setBabyPhoto(base64);
      saveSettings({ ...loadSettings(), babyPhoto: base64 });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setBabyPhoto("");
    saveSettings({ ...loadSettings(), babyPhoto: "" });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading-bold text-charcoal mb-2">
          Configuración
        </h1>
        <p className="text-sm text-mist-gray mb-8">
          Controla la privacidad de la bitácora de Matthew
        </p>

        <div className="space-y-6">
          {/* Privacy Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
          >
            <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
              <Shield size={20} className="text-dusty-rose" />
              Modo de privacidad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleModeChange("public")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  settings.mode === "public"
                    ? "border-dusty-rose bg-blush-pink/10 shadow-md"
                    : "border-mist-gray/20 hover:border-mist-gray/40"
                }`}
              >
                <Globe size={24} className="text-lavender-soft mb-2 mx-auto" />
                <h3 className="font-medium text-center text-charcoal mb-1">
                  Público
                </h3>
                <p className="text-xs text-center text-mist-gray">
                  Visible para todos en internet
                </p>
                {settings.mode === "public" && (
                  <Badge category="family" size="sm" className="mt-2 block text-center">
                    Activo
                  </Badge>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleModeChange("protected")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  settings.mode === "protected"
                    ? "border-dusty-rose bg-blush-pink/10 shadow-md"
                    : "border-mist-gray/20 hover:border-mist-gray/40"
                }`}
              >
                <Lock size={24} className="text-dusty-rose mb-2 mx-auto" />
                <h3 className="font-medium text-center text-charcoal mb-1">
                  Protegido
                </h3>
                <p className="text-xs text-center text-mist-gray">
                  Requiere contraseña para acceder
                </p>
                {settings.mode === "protected" && (
                  <Badge category="family" size="sm" className="mt-2 block text-center">
                    Activo
                  </Badge>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleModeChange("private")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  settings.mode === "private"
                    ? "border-dusty-rose bg-blush-pink/10 shadow-md"
                    : "border-mist-gray/20 hover:border-mist-gray/40"
                }`}
              >
                <Users size={24} className="text-sky-soft mb-2 mx-auto" />
                <h3 className="font-medium text-center text-charcoal mb-1">
                  Privado
                </h3>
                <p className="text-xs text-center text-mist-gray">
                  Solo para usuarios autorizados
                </p>
                {settings.mode === "private" && (
                  <Badge category="family" size="sm" className="mt-2 block text-center">
                    Activo
                  </Badge>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Password for protected mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
          >
            <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
              <Lock size={20} className="text-dusty-rose" />
              Contraseña de acceso
            </h2>

            <p className="text-sm text-mist-gray mb-3">
              Usar cuando el modo es "Protegido". Los visitantes deben
              ingresar esta contraseña para ver la bitácora.
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                value={settings.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all duration-300 bg-pearl-white text-sm"
                placeholder="Contraseña de acceso"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
              >
                <Save size={16} />
                <span className="ml-1">Guardar</span>
              </Button>
            </div>

            {isSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-600 mt-2"
              >
                Configuración guardada correctamente
              </motion.p>
            )}
          </motion.div>

          {/* Foto de Matthew */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
          >
            <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
              <Upload size={20} className="text-dusty-rose" />
              Foto de Matthew
            </h2>

            <p className="text-sm text-mist-gray mb-4">
              Sube una foto profesional de Matthew para usar en la portada y sobre de invitación.
            </p>

            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm text-taupe file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-dusty-rose/10 file:text-dusty-rose hover:file:bg-dusty-rose/20 transition-all"
              />
              {babyPhoto ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-mist-gray/20">
                  <img src={babyPhoto} alt="Preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal/10 hover:bg-charcoal/20 rounded-full flex items-center justify-center text-charcoal/70 hover:text-charcoal transition-all"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-mist-gray/20 flex items-center justify-center text-mist-gray/40">
                  <Upload size={20} />
                </div>
              )}
            </div>

            {isSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-600 mt-2"
              >
                Foto guardada correctamente
              </motion.p>
            )}
          </motion.div>

          {/* Evento especial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
          >
            <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-lavender-soft" />
              Evento Especial
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-mist-gray mb-1">Título del evento</label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => setEvent({ ...event, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all duration-300 bg-pearl-white text-sm"
                  placeholder="Ej: Bautizo de Matthew"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-mist-gray mb-1">Fecha</label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-mist-gray mb-1">Hora</label>
                  <input
                    type="time"
                    value={event.time}
                    onChange={(e) => setEvent({ ...event, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-mist-gray mb-1">Lugar</label>
                <input
                  type="text"
                  value={event.location}
                  onChange={(e) => setEvent({ ...event, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm"
                  placeholder="Ej: Iglesia Sagrado Corazón"
                />
              </div>

              <div>
                <label className="block text-xs text-mist-gray mb-1">Dirección</label>
                <input
                  type="text"
                  value={event.address}
                  onChange={(e) => setEvent({ ...event, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm"
                  placeholder="Ej: Calle 12 #34-56, Cali"
                />
              </div>

              <div>
                <label className="block text-xs text-mist-gray mb-1">Descripción</label>
                <textarea
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm resize-y"
                  rows={3}
                  placeholder="Descripción del evento..."
                />
              </div>

              <div>
                <label className="block text-xs text-mist-gray mb-1">Mensaje de agradecimiento</label>
                <textarea
                  value={event.thankYouMessage}
                  onChange={(e) => setEvent({ ...event, thankYouMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-lavender-soft/20 transition-all bg-pearl-white text-sm resize-y"
                  rows={2}
                  placeholder="Gracias por..."
                />
              </div>

              <Button variant="primary" size="md" onClick={handleEventSave}>
                <Save size={16} />
                <span className="ml-1">Guardar evento</span>
              </Button>
            </div>
          </motion.div>

          {/* Invitación de Evento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
          >
            <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
              <Upload size={20} className="text-sky-soft" />
              Enlace de invitación
            </h2>

            <p className="text-sm text-mist-gray mb-4">
              Genera un enlace único para compartir la invitación del evento. 
              Cada link contiene un token seguro que da acceso a la página de invitación.
            </p>

            {!invitationToken ? (
              <Button variant="primary" size="md" onClick={handleGenerateInvite}>
                <Upload size={16} />
                <span className="ml-1">Generar enlace de invitación</span>
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-warm-ivory/30 rounded-xl">
                  <code className="text-sm font-mono text-charcoal break-all">
                    {generateInvitationLink(invitationToken)}
                  </code>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" size="md" onClick={copyInviteLink}>
                    Copiar link
                  </Button>
                  <Button variant="primary" size="md" onClick={handleGenerateInvite}>
                    Regenerar token
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        </div>
    </AdminLayout>
  );
}
