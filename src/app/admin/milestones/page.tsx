// src/app/admin/milestones/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Upload, Star } from "lucide-react";
import { loadMilestones, saveMilestones, deleteItem } from "@/services/adminService";
import { MILESTONES } from "@/data/milestones";
import { Milestone } from "@/types/milestone";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDateES, babyAgeForDate } from "@/lib/utils";
import { prepareUploadImage } from "@/lib/image";
import { BIRTH_DATE } from "@/lib/constants";

export default function AdminMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadMilestones()
      .then((stored) => setMilestones(stored.length > 0 ? stored : MILESTONES))
      .catch(() => setMilestones(MILESTONES));
  }, []);

  const handleSave = async (updated: Milestone) => {
    const updatedList = milestones.map((m) =>
      m.id === updated.id ? updated : m
    );
    setMilestones(updatedList);
    try {
      await saveMilestones(updatedList);
      setEditingId(null);
    } catch (err: any) {
      alert("No se guardó el hito: " + (err?.message || "error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este hito?")) return;
    const updatedList = milestones.filter((m) => m.id !== id);
    setMilestones(updatedList);
    try {
      // DELETE siempre: es idempotente. El bug viejo de autoguardado pudo dejar
      // filas temp-* reales en Neon que reaparecerían al borrar.
      await deleteItem("milestones", id);
      await saveMilestones(updatedList);
    } catch (err: any) {
      alert("No se eliminó el hito: " + (err?.message || "error"));
    }
  };

  const handleAddNew = () => {
    const newMilestone: Milestone = {
      id: `temp-${Date.now()}`,
      title: "Nuevo hito",
      description: "",
      date: new Date().toISOString().split("T")[0],
      babyAge: { days: 0, weeks: 0, months: 0, years: 0 },
      category: "milestone",
      images: [],
      order: milestones.length + 1,
    };
    setMilestones([newMilestone, ...milestones]);
    setEditingId(newMilestone.id);
  };

  const MilestoneForm = ({ milestone }: { milestone: Milestone }) => {
    const [data, setData] = useState(milestone);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: keyof Milestone, value: string) => {
      setData({ ...data, [field]: value });
    };

    // Subir foto del recuerdo a Blob (comprimida) y agregarla a images[0..n].
    // La primera es la portada que se ve en la polaroid del muro.
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const up = await prepareUploadImage(file);
        const form = new FormData();
        form.append("file", up.blob, up.name);
        form.append("alt", data.title || "Recuerdo de Matthew");
        form.append("caption", data.title || "");
        form.append("category", "family");
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const text = await res.text();
        let payload: any = {};
        if (text) try { payload = JSON.parse(text); } catch { /* empty */ }
        if (!res.ok) throw new Error(payload?.error || `upload falló (${res.status})`);
        const url = payload.url || payload.src;
        if (!url) throw new Error("upload OK pero no se recibió URL");
        setData({ ...data, images: [...(data.images || []), url] });
      } catch (err: any) {
        alert("No se pudo subir la foto: " + (err?.message || "error"));
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    const removeImage = (url: string) => {
      setData({ ...data, images: (data.images || []).filter((u) => u !== url) });
    };

    const setCover = (url: string) => {
      setData({ ...data, images: [url, ...(data.images || []).filter((u) => u !== url)] });
    };

    const handleSave = async () => {
      // babyAge desde la fecha calendario del suceso (local, sin corrimiento UTC)
      if (saving || uploading) return;
      setSaving(true);
      try {
        const updated = { ...data, babyAge: babyAgeForDate(data.date) };
        const updatedList = milestones.map((m) =>
          m.id === updated.id ? updated : m
        );
        setMilestones(updatedList);
        await saveMilestones(updatedList);
        setEditingId(null);
      } catch (err: any) {
        alert("No se guardó el hito: " + (err?.message || "error"));
      } finally {
        setSaving(false);
      }
    };

    return (
      <motion.div
        layout
        className="border-2 border-dashed border-mist-gray/20 rounded-xl p-4 mb-4 bg-warm-ivory/20"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-mist-gray">Título</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-mist-gray">Descripción</label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-mist-gray">Fecha</label>
            <input
              type="date"
              value={(data.date || "").slice(0, 10)}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-mist-gray">Categoría</label>
            <select
              value={data.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value as Milestone["category"]
                )
              }
              className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
            >
              <option value="milestone">Primer logro</option>
              <option value="health">Salud</option>
              <option value="travel">Viaje</option>
              <option value="food">Comida</option>
              <option value="family">Familia</option>
            </select>
          </div>
          {/* Fotos del recuerdo: la primera es la portada de la polaroid */}
          <div>
            <label className="text-xs text-mist-gray">
              Fotos del recuerdo ({(data.images || []).length})
            </label>
            {(data.images || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
                {(data.images || []).map((url, i) => (
                  <div key={url + i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-mist-gray/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-0.5 left-0.5 flex items-center gap-0.5 bg-black/55 text-white text-[9px] px-1 py-px rounded">
                        <Star size={8} fill="currentColor" /> Portada
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity py-0.5">
                      {i !== 0 && (
                        <button
                          title="Poner como portada"
                          onClick={() => setCover(url)}
                          className="text-white hover:text-amber-300"
                        >
                          <Star size={11} />
                        </button>
                      )}
                      <button
                        title="Quitar foto"
                        onClick={() => removeImage(url)}
                        className="text-white hover:text-red-300"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={14} className="mr-1" />
              {uploading ? "Subiendo..." : "Agregar foto"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={uploading || saving}>
            <Save size={14} className="mr-1" />
            {uploading ? "Espera la foto..." : saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
            <X size={14} className="mr-1" />
            Cancelar
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading-bold text-charcoal">
            Gestión de Hitos
          </h1>
          <Button variant="primary" size="md" onClick={handleAddNew}>
            <Plus size={16} />
            <span className="ml-1">Nuevo hito</span>
          </Button>
        </div>

        <p className="text-sm text-mist-gray mb-6">
          {milestones.length} hitos registrados
        </p>

        <div className="space-y-4">
          <AnimatePresence>
            {milestones
              .sort((a, b) => a.order - b.order)
              .map((milestone) => (
                <motion.div
                  key={milestone.id}
                  layout
                  className="bg-pearl-white rounded-xl p-4 shadow-subtle border border-mist-gray/10"
                >
                  {editingId === milestone.id ? (
                    <MilestoneForm milestone={milestone} />
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-heading-bold text-charcoal">
                              {milestone.title}
                            </h3>
                            <Badge category={milestone.category} size="sm">
                              {milestone.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-taupe mb-2 line-clamp-1">
                            {milestone.description}
                          </p>
                          <p className="text-xs text-mist-gray">
                            📅 {formatDateES(milestone.date)} •👶{" "}
                            {milestone.babyAge?.days ?? "—"}d • 📷{" "}
                            {(milestone.images || []).length}{" "}
                            {(milestone.images || []).length === 1 ? "foto" : "fotos"}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(milestone.id)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(milestone.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
