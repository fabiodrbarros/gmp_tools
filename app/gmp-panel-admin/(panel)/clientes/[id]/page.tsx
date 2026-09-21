import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CustomerForm } from "@/components/admin/customer-form";

export const metadata: Metadata = { title: "Editar cliente" };

export default async function EditClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [c, categories] = await Promise.all([
    db.customer.findUnique({ where: { id }, include: { categoryDiscounts: true } }).catch(() => null),
    db.category.findMany({ where: { kind: "PRODUCT" }, orderBy: { name: "asc" }, select: { id: true, name: true } }).catch(() => []),
  ]);
  if (!c) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Editar cliente</h1>
      <p className="text-sm text-gray-500 mb-8">{c.email}</p>
      <CustomerForm
        categories={categories}
        customer={{
          id: c.id,
          email: c.email,
          name: c.name,
          company: c.company,
          phone: c.phone,
          discountPct: c.discountPct,
          isActive: c.isActive,
          categoryDiscounts: c.categoryDiscounts.map((d) => ({ categoryId: d.categoryId, discountPct: d.discountPct })),
        }}
      />
    </div>
  );
}
