import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MachineForm } from "@/components/admin/machine-form";

export const metadata: Metadata = { title: "Nova máquina" };

async function getCategories() {
  try {
    return await db.category.findMany({ where: { kind: "MACHINE" }, orderBy: { name: "asc" }, select: { slug: true, name: true } });
  } catch {
    return [];
  }
}

export default async function NovaMaquinaPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Nova máquina</h1>
      <p className="text-sm text-gray-500 mb-8">Adicione uma máquina ao catálogo.</p>
      <MachineForm categories={categories} />
    </div>
  );
}
