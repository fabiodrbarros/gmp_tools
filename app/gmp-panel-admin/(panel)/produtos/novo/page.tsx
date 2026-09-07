import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Novo produto" };

async function getCategories() {
  try {
    return await db.category.findMany({ where: { kind: "PRODUCT" }, orderBy: { name: "asc" }, select: { name: true } });
  } catch {
    return [];
  }
}

export default async function NovoProdutoPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Novo produto</h1>
      <p className="text-sm text-gray-500 mb-8">Adicione um produto ao catálogo.</p>
      <ProductForm categories={categories} />
    </div>
  );
}
