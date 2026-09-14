// src/app/admin/growth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { GrowthRecord } from "@/types/growth";
import { loadGrowth, saveGrowth } from "@/services/adminService";
import { ageString } from "@/data/milestones";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { formatDateES } from "@/lib/utils";

// Inline edit form component
function GrowthForm({
  record,
  onSave,
  onCancel,
}: {
  record: GrowthRecord;
  onSave: (updated: GrowthRecord) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(record.date);
  const [weight, setWeight] = useState(record.weight);
  const [height, setHeight] = useState(record.height);
  const [head, setHead] = useState<string>(String(record.headCircumference || ""));
  const [notes, setNotes] = useState(record.notes || "");

  const handleSubmit = () => {
    const days = Math.floor(
      (new Date(date).getTime() - new Date("2026-07-31").getTime()) /
        (1000 * 60 * 60 * 24)
    );
    onSave({
      ...record,
      date,
      weight,
      height,
      headCircumference: head ? parseFloat(head) : undefined,
      notes,
      babyAge: {
        days,
        weeks: Math.floor(days / 7),
        months: Math.floor(days / 30),
        years: Math.floor(days / 365),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 p-4 bg-warm-ivory/20 rounded-xl border border-mist-gray/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-mist-gray">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-mist-gray">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-mist-gray">Estatura (cm)</label>
          <input
            type="number"
            step="0.5"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-mist-gray">Cabeza (cm)</label>
          <input
            type="number"
            step="0.5"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="text-xs text-mist-gray">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
            placeholder="Notas del doctor, observaciones..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={14} className="mr-1" />
          Cancelar
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit}>
          <Save size={14} className="mr-1" />
          Guardar
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdminGrowth() {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadGrowth().then(setRecords).catch(() => setRecords([]));
  }, []);

  const handleSave = async (updated: GrowthRecord) => {
    const updatedList = records.map((r) =>
      r.id === updated.id ? updated : r
    );
    setRecords(updatedList);
    try {
      await saveGrowth(updatedList);
    } catch (err: any) {
      console.error("[AdminGrowth] saveGrowth falló:", err?.message || err);
      alert("Error guardando: " + (err?.message || "inténtalo"));
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Eliminar este registro?")) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      try {
        await saveGrowth(updated);
      } catch (err: any) {
        console.error("[AdminGrowth] delete saveGrowth falló:", err?.message || err);
      }
    }
  };

  const handleAddNew = async () => {
    const newRecord: GrowthRecord = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      babyAge: { days: 0, weeks: 0, months: 0, years: 0 },
      weight: 0,
      height: 0,
      notes: "",
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    try {
      await saveGrowth(updated);
    } catch (err: any) {
      console.error("[AdminGrowth] addNew saveGrowth falló:", err?.message || err);
    }
    setEditingId(newRecord.id);
  };

  const getEditingRecord = () => records.find((r) => r.id === editingId);

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading-bold text-charcoal">
            Gestión de Crecimiento
          </h1>
          <Button variant="primary" size="md" onClick={handleAddNew}>
            <Plus size={16} />
            <span className="ml-1">Nuevo registro</span>
          </Button>
        </div>

        <p className="text-sm text-mist-gray mb-6">
          {records.length} {records.length === 1 ? "registro" : "registros"}
        </p>

        {/* Formulario de edición */}
        <AnimatePresence>
          {editingId && getEditingRecord() && (
            <GrowthForm
              record={getEditingRecord()!}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          )}
        </AnimatePresence>

        {/* Tabla de registros */}
        <div className="overflow-x-auto bg-pearl-white rounded-xl shadow-subtle border border-mist-gray/10">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-warm-ivory/30 border-b border-mist-gray/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-mist-gray uppercase">Fecha</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase">Peso (kg)</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase">Estatura (cm)</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase">Cabeza</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-mist-gray uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {records
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <tr key={record.id} className="border-b border-mist-gray/5">
                    <td className="py-3 px-4">
                      <span className="text-sm text-taupe">
                        {formatDateES(record.date)}
                      </span>
                      <span className="text-xs text-mist-gray ml-1">
                        ({ageString(record.babyAge)})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-charcoal">
                      {record.weight.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-charcoal">
                      {record.height}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-taupe">
                      {record.headCircumference?.toFixed(1) ?? "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(record.id)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
