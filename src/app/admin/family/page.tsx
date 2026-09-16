// src/app/admin/family/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, UserRound } from "lucide-react";
import { FamilyMember } from "@/types/family";
import { loadFamily, saveFamily, deleteItem } from "@/services/adminService";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { prepareUploadImage } from "@/lib/image";
import { authHeaders } from "@/services/auth";

function FamilyMemberForm({
  member,
  onSave,
  onCancel,
}: {
  member: FamilyMember;
  onSave: (updated: FamilyMember) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [relationship, setRelationship] = useState(member.relationship);
  const [role, setRole] = useState(member.role);
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl || "");
  const [quote, setQuote] = useState(member.quote || "");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }
    onSave({
      ...member,
      name: name.trim(),
      relationship: relationship.trim(),
      role,
      photoUrl: photoUrl.trim() || undefined,
      quote: quote.trim() || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-t border-mist-gray/10 pt-4">
      <div className="md:col-span-3 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs text-mist-gray">Foto (URL o subir)</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
              placeholder="https://... o /images/..."
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.onchange = async () => {
                  const file = fileInput.files?.[0];
                  if (!file) return;
                  try {
                    const form = new FormData();
                    // Comprimir en cliente: fotos de móvil de 3-12MB daban 413
                    const up = await prepareUploadImage(file);
                    form.append("file", up.blob, up.name);
                    form.append("alt", name || "Foto");
                    form.append("caption", relationship || "");
                    form.append("category", "family");
                    const res = await fetch("/api/upload", { method: "POST", headers: { ...authHeaders() }, body: form });
                    const text = await res.text();
                    let data: any = {};
                    if (text) try { data = JSON.parse(text); } catch { /* empty */ }
                    if (!res.ok) throw new Error(data?.error || `upload falló (${res.status})`);
                    const blobUrl = data.url || data.src;
                    if (!blobUrl) throw new Error("upload OK pero no se recibió URL de Blob");
                    setPhotoUrl(blobUrl);
                  } catch (err: any) {
                    console.error("upload familiar falló:", err?.message || err);
                    alert("Error subiendo foto: " + (err?.message || "inténtalo"));
                  }
                };
                fileInput.click();
              }}
              title="Subir foto"
            >
              <Upload size={14} />
            </Button>
          </div>
          {photoUrl && (
            <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border-2 border-mist-gray/20">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-mist-gray">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          placeholder="Nombre completo"
          required
        />
      </div>
      <div>
        <label className="text-xs text-mist-gray">Relación</label>
        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          placeholder="Papá, Mamá, Abuela..."
          required
        />
      </div>
      <div>
        <label className="text-xs text-mist-gray">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as FamilyMember["role"])}
          className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
        >
          <option value="dad">Papá</option>
          <option value="mom">Mamá</option>
          <option value="grandma">Abuela</option>
          <option value="grandpa">Abuelo</option>
          <option value="sibling">Hermano/Hermana</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="text-xs text-mist-gray">Quote / Nota</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-mist-gray/30 bg-pearl-white text-sm"
          placeholder="Una frase que represente a este miembro..."
          rows={2}
        />
      </div>

      <div className="md:col-span-3 flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={14} className="mr-1" />
          Cancelar
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit}>
          <Save size={14} className="mr-1" />
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}

export default function AdminFamily() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadFamily()
      .then((loaded) => {
        console.log("[AdminFamily] Loaded members:", loaded.length);
        setMembers(loaded);
      })
      .catch(() => setMembers([]));
  }, []);

  const handleSave = useCallback(
    async (updated: FamilyMember) => {
      const updatedList = members.map((m) =>
        m.id === updated.id ? updated : m
      );
      setMembers(updatedList);
      try {
        await saveFamily(updatedList);
      } catch (err: any) {
        console.error("[AdminFamily] saveFamily falló:", err?.message || err);
        alert("Error guardando: " + (err?.message || "inténtalo"));
      }
      setEditingId(null);
      console.log("[AdminFamily] Saved:", updated.name);
    },
    [members],
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar a este miembro?")) return;
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    try {
      await deleteItem("family", id); // DELETE explícito a Neon (el POST es upsert-only)
      try { localStorage.setItem("mj_admin_family", JSON.stringify(updated)); } catch {}
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      console.error("[AdminFamily] delete falló:", err?.message || err);
      alert("No se pudo borrar: " + (err?.message || "error"));
    }
  };

  const handleAddNew = () => {
    // Solo local: se persiste al Guardar. Antes se guardaba de inmediato un
    // miembro vacío (basura "Sin nombre" en Neon).
    const newMember: FamilyMember = {
      id: `temp-${Date.now()}`,
      name: "",
      relationship: "",
      role: "other",
      order: members.length + 1,
    };
    setMembers([newMember, ...members]);
    setEditingId(newMember.id);
    console.log("[AdminFamily] Added new member:", newMember.id);
  };

  const handleCancelEdit = () => {
    // Si era un miembro nuevo sin guardar, se descarta (no queda en Neon)
    if (editingId?.startsWith("temp-")) {
      setMembers(members.filter((m) => m.id !== editingId));
    }
    setEditingId(null);
  };

  const getEditingMember = () =>
    members.find((m) => m.id === editingId);

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading-bold text-charcoal">
            Gestión de Familia
          </h1>
          <Button variant="primary" size="md" onClick={handleAddNew}>
            <Plus size={16} />
            <span className="ml-1">Nuevo miembro</span>
          </Button>
        </div>

        <p className="text-sm text-mist-gray mb-6">
          {members.length} {members.length === 1 ? "miembro" : "miembros"}
        </p>

        <div className="space-y-4">
          {members
            .sort((a, b) => a.order - b.order)
            .map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl bg-pearl-white shadow-subtle border border-mist-gray/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={member.photoUrl}
                      alt={member.name}
                      fallback={
                        <UserRound size={24} className="text-mist-gray" />
                      }
                      size="md"
                    />
                    <div>
                      <h3 className="font-heading-bold text-charcoal">
                        {member.name || "Sin nombre"}
                      </h3>
                      <p className="text-sm text-mist-gray">
                        {member.relationship || "Sin relación"}
                      </p>
                      {member.role && (
                        <Badge variant="lavender" size="sm">
                          {member.role}
                        </Badge>
                      )}
                      {member.quote && (
                        <p className="text-xs text-taupe italic mt-1 max-w-md">
                          "{member.quote}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        console.log("[AdminFamily] Edit clicked for:", member.id);
                        setEditingId(member.id);
                      }}
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        console.log("[AdminFamily] Delete clicked for:", member.id);
                        handleDelete(member.id);
                      }}
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {editingId === member.id && (
                  <FamilyMemberForm
                    member={member}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
