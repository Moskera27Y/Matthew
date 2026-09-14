// src/components/growth/GrowthTable.tsx
"use client";

import { motion } from "framer-motion";
import { GrowthRecord } from "@/types/growth";
import { ageString } from "@/data/milestones";
import { formatDateES } from "@/lib/utils";
import { Baby, Ruler, Scale, Calendar, FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface GrowthTableProps {
  records: GrowthRecord[];
}

export default function GrowthTable({ records }: GrowthTableProps) {
  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="overflow-x-auto bg-pearl-white rounded-2xl shadow-subtle border border-mist-gray/10"
    >
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-warm-ivory/30 border-b border-mist-gray/10">
            <th className="text-left py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Edad
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Peso
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Estatura
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Cabeza
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-mist-gray uppercase tracking-wider">
              Notas
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((record, i) => (
            <motion.tr
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="border-b border-mist-gray/5 hover:bg-warm-ivory/20 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="text-sm text-taupe">
                  {formatDateES(record.date)}
                </span>
              </td>
              <td className="py-3 px-4">
                <Badge variant="lavender" size="sm">
                  {ageString(record.babyAge)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-sm font-medium text-charcoal">
                  {record.weight.toFixed(1)} kg
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-sm font-medium text-charcoal">
                  {record.height} cm
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                {record.headCircumference ? (
                  <span className="text-sm font-medium text-charcoal">
                    {record.headCircumference} cm
                  </span>
                ) : (
                  <span className="text-xs text-mist-gray">—</span>
                )}
              </td>
              <td className="py-3 px-4">
                {record.notes ? (
                  <span className="text-sm text-taupe line-clamp-1">
                    {record.notes}
                  </span>
                ) : (
                  <span className="text-xs text-mist-gray">Sin notas</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <div className="text-center py-8 text-mist-gray">
          <Baby size={32} className="mx-auto mb-2 opacity-50" />
          <p>No hay registros de crecimiento aún.</p>
        </div>
      )}
    </motion.div>
  );
}
