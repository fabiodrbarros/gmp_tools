import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Editar produto" };

// stored JSON array of {key,value} -> "Chave: Valor" lines for the textarea
function specsToText(raw: string | null): string {
  if (!raw) return "";
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map((s) => `${s.key}: ${s.value ?? ""}`).join("\n");
  } catch { /* not JSON */ }
  return "";
}

// stored JSON array (or delimited) -> comma-separated string
function listToText(raw: string | null): string {
  if (!raw) return "";
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map(String).join(", ");
  } catch { /* not JSON */ }
  return raw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).join(", ");
}

export default async function EditProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { category: true, brand: true } }).catch(() => null),
    db.category.findMany({ where: { kind: "PRODUCT" }, orderBy: { name: "asc" }, select: { name: true } }).catch(() => []),
  ]);
  if (!p) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Editar produto</h1>
      <p className="text-sm text-gray-500 mb-8">{p.sku}</p>
      <ProductForm
        categories={categories}
        product={{
          id: p.id,
          name: p.name,
          sku: p.sku,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice,
          stock: p.stock,
          category: p.category?.name ?? null,
          brand: p.brand?.name ?? null,
          materials: listToText(p.materials),
          specsText: specsToText(p.specifications),
          images: parseImages(p.images),
          datasheet: p.datasheet,
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          quoteOnly: p.quoteOnly,
        }}
      />
    </div>
  );
}
