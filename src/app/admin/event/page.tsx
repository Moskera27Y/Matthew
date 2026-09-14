// src/app/admin/event/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Share2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import PhotoEditor from "@/components/admin/PhotoEditor";
import { loadEvent, saveEvent } from "@/services/adminService";
import {
  generateInvitationToken,
  saveInvitationToken,
  loadInvitationToken,
  generateInvitationLink,
} from "@/services/invitationService";
import { EventDetails } from "@/types/event";

export default function AdminEvent() {
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
    isEnabled: true,
  });
  const [invitationToken, setInvitationToken] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadEvent().then(setEvent).catch(() => setEvent({ id: "default", title: "", date: "", time: "", location: "", address: "", description: "", thankYouMessage: "", isPublic: true, isEnabled: true }));
    const token = loadInvitationToken();
    if (token) setInvitationToken(token);
  }, []);

  const handleGenerateInvite = () => {
    const token = generateInvitationToken();
    setInvitationToken(token);
    saveInvitationToken(token);
  };

  const handleSaveEvent = async () => {
    await saveEvent(event);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggleEnabled = async () => {
    const updated = { ...event, isEnabled: !event.isEnabled };
    setEvent(updated);
    await saveEvent(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyInviteLink = () => {
    const link = generateInvitationLink(invitationToken);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading-bold text-charcoal mb-2">
          Gestión de Eventos
        </h1>
        <p className="text-sm text-mist-gray mb-8">
          Configura el evento especial y genera enlaces de invitación
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Formulario del evento */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
            >
              <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-dusty-rose" />
                Detalles del evento
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-mist-gray mb-1">
                    Título del evento
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) =>
                      setEvent({ ...event, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
                    placeholder="Ej: Bautizo de Matthew"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-mist-gray mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) =>
                        setEvent({ ...event, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-mist-gray mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={event.time}
                      onChange={(e) =>
                        setEvent({ ...event, time: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-mist-gray mb-1">
                    Lugar
                  </label>
                  <input
                    type="text"
                    value={event.location}
                    onChange={(e) =>
                      setEvent({ ...event, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
                    placeholder="Ej: Iglesia Sagrado Corazón"
                  />
                </div>

                <div>
                  <label className="block text-xs text-mist-gray mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={event.address}
                    onChange={(e) =>
                      setEvent({ ...event, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
                    placeholder="Ej: Calle 12 #34-56, Cali"
                  />
                </div>

                <div>
                  <label className="block text-xs text-mist-gray mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={event.description}
                    onChange={(e) =>
                      setEvent({ ...event, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm resize-y"
                    rows={3}
                    placeholder="Descripción del evento..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-mist-gray mb-1">
                    Mensaje de agradecimiento
                  </label>
                  <textarea
                    value={event.thankYouMessage}
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        thankYouMessage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm resize-y"
                    rows={2}
                    placeholder="Gracias por..."
                  />
                </div>

                <Button variant="primary" size="md" onClick={handleSaveEvent}>
                  <Save size={16} />
                  <span className="ml-1">Guardar evento</span>
                </Button>

                {isSaved && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-green-600"
                  >
                    Evento guardado correctamente
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Foto de Matthew */}
            <PhotoEditor />
          </div>

          {/* Panel de invitación */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
            >
              <h2 className="text-lg font-heading-bold text-charcoal mb-4 flex items-center gap-2">
                <Share2 size={20} className="text-sky-soft" />
                Enlace de invitación
              </h2>

              <p className="text-sm text-mist-gray mb-4">
                Genera un enlace único para compartir la invitación del
                evento. Cada link contiene un token seguro que da acceso a la
                página de invitación con el sobre animado.
              </p>

              {!invitationToken ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateInvite}
                >
                  <Upload size={16} />
                  <span className="ml-1">Generar enlace de invitación</span>
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-warm-ivory/30 rounded-xl">
                    <code className="text-sm font-mono text-charcoal break-all">
                      {generateInvitationLink(invitationToken)}
                    </code>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="ghost" size="md" onClick={copyInviteLink}>
                      {copied ? (
                        <Check size={16} className="mr-1 text-green-500" />
                      ) : (
                        <Copy size={16} className="mr-1" />
                      )}
                      {copied ? "¡Copiado!" : "Copiar link"}
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleGenerateInvite}
                    >
                      Regenerar token
                    </Button>
                  </div>

                  {/* Preview del link */}
                  <div className="mt-4 p-3 bg-blush-pink/5 rounded-xl border border-blush-pink/20">
                    <p className="text-xs text-mist-gray mb-2">
                      Vista previa del enlace:
                    </p>
                    <div className="flex items-center gap-2 text-sm text-dusty-rose">
                      <span className="font-mono truncate">
                        /invite/{invitationToken.substring(0, 15)}...
                      </span>
                      <MapPin size={12} className="text-sky-soft" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Status del evento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-pearl-white rounded-xl p-6 shadow-subtle border border-mist-gray/10"
            >
              <h3 className="font-medium text-charcoal mb-3">
                Estado del evento
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist-gray">Título</span>
                  <span className="text-charcoal">
                    {event.title || "No configurado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Fecha</span>
                  <span className="text-charcoal">
                    {event.date || "No configurada"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Lugar</span>
                  <span className="text-charcoal">
                    {event.location || "No configurado"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mist-gray">Estado</span>
                  <button
                    type="button"
                    onClick={handleToggleEnabled}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      event.isEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.isEnabled ? (
                      <ToggleRight size={14} />
                    ) : (
                      <ToggleLeft size={14} />
                    )}
                    {event.isEnabled ? "Activo" : "Desactivado"}
                    <span className="text-mist-gray/60">
                      · Haz clic para {event.isEnabled ? "desactivar" : "activar"}
                    </span>
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Enlace</span>
                  <span
                    className={
                      invitationToken ? "text-green-600" : "text-mist-gray"
                    }
                  >
                    {invitationToken ? "Generado ✓" : "No generado"}
                  </span>
                </div>
                {!event.title && event.isEnabled && (
                  <div className="pt-2">
                    <span className="text-xs text-mist-gray/60">
                      El evento no aparecerá en la página principal hasta que
                      guardes un título.
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
