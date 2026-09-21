import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CustomerForm } from "@/components/admin/customer-form";

export const metadata: Metadata = { title: "Novo cliente" };

async function getCategories() {
  try {
    return await db.category.findMany({ where: { kind: "PRODUCT" }, orderBy: { name: "asc" }, select: { id: true, name: true } });
  } catch {
    return [];
  }
}

export default async function NovoClientePage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Novo cliente</h1>
      <p className="text-sm text-gray-500 mb-8">Crie um login para o cliente ver preços e encomendar.</p>
      <CustomerForm categories={categories} />
    </div>
  );
}
