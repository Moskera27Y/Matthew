// src/app/admin/brothers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Upload,
  User,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Brother,
  BrotherRole,
  BrotherCategory,
  categoryLabels,
  DEFAULT_BROTHERS,
} from "@/types/brother";
import { loadBrothers, saveBrothers } from "@/services/adminService";

// Mapa de etiquetas legibles para el role
const roleLabels: Record<BrotherRole, string> = {
  primo: "Primo",
  prima: "Prima",
  hermano: "Hermano",
  hermana: "Hermana",
  amigo: "Amigo",
  amiga: "Amiga",
  otro: "Otro",
};

interface ModalProps {
  brother: Partial<Brother>;
  onClose: () => void;
  onSave: (b: Brother) => void;
  existing: Brother[];
}

function BrotherModal({ brother, onClose, onSave, existing }: ModalProps) {
  const [form, setForm] = useState<Partial<Brother>>({
    name: "",
    role: "primo",
    category: "primos",
    age: "",
    photoUrl: "",
    message: "",
    order: existing.length + 1,
    ...brother,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm({ ...form, photoUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.photoUrl || !form.message) {
      alert("Completa nombre, foto y mensaje, por favor.");
      return;
    }
    onSave({
      id: brother.id || `b${Date.now()}`,
      name: form.name!,
      role: form.role!,
      category: form.category!,
      age: form.age,
      photoUrl: form.photoUrl!,
      message: form.message!,
      order: form.order || existing.length + 1,
    } as Brother);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-pearl-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-heading-bold text-charcoal">
            {brother.id ? "Editar hermano" : "Nuevo hermano"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs text-mist-gray mb-1">Nombre</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 transition-all bg-pearl-white text-sm"
              placeholder="Ej: Sofía"
            />
          </div>

          {/* Rol + Edad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-mist-gray mb-1">Relación</label>
              <select
                value={form.role || "primo"}
                onChange={(e) => setForm({ ...form, role: e.target.value as BrotherRole })}
                className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 bg-pearl-white text-sm"
              >
                <option value="primo">Primo</option>
                <option value="prima">Prima</option>
                <option value="hermano">Hermano</option>
                <option value="hermana">Hermana</option>
                <option value="amigo">Amigo</option>
                <option value="amiga">Amiga</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Edad</label>
              <input
                type="text"
                value={form.age || ""}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 bg-pearl-white text-sm"
                placeholder="Ej: 5 años"
              />
            </div>
          </div>

          {/* Foto */}\n          <div>
            <label className="block text-xs text-mist-gray mb-1">Foto desde PC</label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-sm text-taupe file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-dusty-rose/10 file:text-dusty-rose hover:file:bg-dusty-rose/20 transition-all"
              />
              {form.photoUrl ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-mist-gray/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.photoUrl} alt="Preview" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-mist-gray/20 flex items-center justify-center text-mist-gray/40">
                  <Upload size={20} />
                </div>
              )}
            </div>
            <p className="text-xs text-mist-gray/60 mt-1">Sube archivo desde tu PC. Se guarda como base64.</p>
          </div>

          {/* Categoría en galería */}\n          <div>
            <label className="block text-xs text-mist-gray mb-1">Categoría en galería</label>
            <select
              value={form.category || "primos"}
              onChange={(e) => setForm({ ...form, category: e.target.value as BrotherCategory })}
              className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 bg-pearl-white text-sm"
            >
              <option value="hermanos">Hermanos</option>
              <option value="primos">Primos</option>
              <option value="amigos">Amigos</option>
              <option value="familia">Familia</option>
            </select>
            <p className="text-xs text-mist-gray/60 mt-1">Dónde aparecerá en la galería de la homepage.</p>
          </div>

          {/* Mensaje (alusión a la foto) */}\n          <div>
            <label className="block text-xs text-mist-gray mb-1">Mensaje (alusión a la foto)</label>
            <textarea
              value={form.message || ""}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-mist-gray/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/20 bg-pearl-white text-sm resize-y"
              rows={3}
              placeholder="Ej: Siempre listita para compartir su primer juguete..."
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            <Save size={16} className="mr-1" />
            {brother.id ? "Guardar cambios" : "Crear hermano"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminBrothers() {
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [editing, setEditing] = useState<Partial<Brother> | null>(null);

  useEffect(() => {
    loadBrothers().then(setBrothers).catch(() => setBrothers(DEFAULT_BROTHERS));
  }, []);

  const handleSave = async (b: Brother) => {
    let list = [...brothers];
    const idx = list.findIndex((x) => x.id === b.id);
    if (idx >= 0) list[idx] = b;
    else list = [...list, b];
    list.sort((a, b) => a.order - b.order);
    await saveBrothers(list);
    setBrothers(list);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este hermano?")) return;
    const list = brothers.filter((b) => b.id !== id);
    await saveBrothers(list);
    setBrothers(list);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading-bold text-charcoal mb-1">
              Hermanos y Primos
            </h1>
            <p className="text-sm text-mist-gray">
              Galería de fotos de los hermanos, primos y amigos de Matthew. Cada foto cuenta su historia.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setEditing({})}
          >
            <Plus size={16} className="mr-1" />
            Nuevo hermano
          </Button>
        </div>

        <div className="space-y-4">
          {brothers.map((b) => (
            <motion.div
              key={b.id}
              className="bg-pearl-white rounded-xl p-4 border border-mist-gray/10 flex items-center justify-between"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow flex items-center justify-center bg-mist-gray/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.photoUrl} alt={b.name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading-bold text-charcoal">{b.name}</h3>
                    <Badge category="family" size="sm">
                      {roleLabels[b.role] || b.role}
                    </Badge>
                    <Badge category="family" size="sm" variant="lavender">
                      {categoryLabels[b.category]}
                    </Badge>
                  </div>
                  <p className="text-xs text-mist-gray mt-1 max-w-md line-clamp-1">
                    "{b.message}"
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(b)}
                  title="Editar"
                >
                  <Edit3 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(b.id)}
                  title="Eliminar"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </motion.div>
          ))}

          {brothers.length === 0 && (
            <motion.div
              className="text-center py-16 text-charcoal/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Users size={48} className="mx-auto mb-4" />
              <p>No hay hermanos registrados aún.</p>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing !== null && (
          <BrotherModal
            brother={editing}
            existing={brothers}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
