// src/app/admin/milestones/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { loadMilestones, saveMilestones, deleteItem } from "@/services/adminService";
import { MILESTONES } from "@/data/milestones";
import { Milestone } from "@/types/milestone";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDateES, babyAgeForDate } from "@/lib/utils";
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

    const handleChange = (field: keyof Milestone, value: string) => {
      setData({ ...data, [field]: value });
    };

    const handleSave = () => {
      // babyAge desde la fecha calendario del suceso (local, sin corrimiento UTC)
      handleSaveFn({ ...data, babyAge: babyAgeForDate(data.date) });
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
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} className="mr-1" />
            Guardar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
            <X size={14} className="mr-1" />
            Cancelar
          </Button>
        </div>
      </motion.div>
    );

    const handleSaveFn = async (updated: Milestone) => {
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
                            {milestone.babyAge?.days ?? "—"}d
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
