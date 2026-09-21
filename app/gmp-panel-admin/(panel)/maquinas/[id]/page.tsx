import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { MachineForm } from "@/components/admin/machine-form";

export const metadata: Metadata = { title: "Editar máquina" };

function parseSpecs(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  }
}

export default async function EditMaquinaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [m, categories] = await Promise.all([
    db.machine.findUnique({ where: { id }, include: { brand: true } }).catch(() => null),
    db.category.findMany({ where: { kind: "MACHINE" }, orderBy: { name: "asc" }, select: { slug: true, name: true } }).catch(() => []),
  ]);
  if (!m) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Editar máquina</h1>
      <p className="text-sm text-gray-500 mb-8">{m.name}</p>
      <MachineForm
        categories={categories}
        machine={{
          id: m.id,
          name: m.name,
          label: m.label,
          condition: m.condition,
          category: m.category,
          brand: m.brand?.name ?? null,
          year: m.year,
          price: m.price,
          shortDescription: m.shortDescription,
          description: m.description,
          specs: parseSpecs(m.specifications),
          images: parseImages(m.images),
          datasheet: m.datasheet,
          isActive: m.isActive,
          isFeatured: m.isFeatured,
        }}
      />
    </div>
  );
}
