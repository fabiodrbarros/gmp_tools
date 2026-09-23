import type { Metadata } from "next";
import Link from "next/link";
import { Languages } from "lucide-react";
import { db } from "@/lib/db";
import { deleteCategory } from "@/app/actions/admin-category";
import { DeleteButton } from "@/components/admin/delete-button";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = { title: "Categorias" };

async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: [{ kind: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

export default async function CategoriasPage() {
  const all = await getCategories();
  const products = all.filter((c) => c.kind !== "MACHINE");
  const machines = all.filter((c) => c.kind === "MACHINE");

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Categorias</h1>
      <p className="text-sm text-gray-500 mb-8">Crie as categorias antes de adicionar produtos ou máquinas.</p>

      <div className="mb-10">
        <CategoryForm />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CategoryList title="Produtos" items={products} showCount />
        <CategoryList title="Máquinas" items={machines} />
      </div>
    </div>
  );
}

function CategoryList({
  title,
  items,
  showCount,
}: {
  title: string;
  items: { id: string; name: string; slug: string; _count: { products: number } }[];
  showCount?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100">
      <div className="px-5 py-3 border-b border-gray-100 text-[11px] font-medium uppercase tracking-wider text-gray-400">{title}</div>
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-gray-400">Sem categorias.</div>
      ) : (
        <ul>
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
              <div>
                <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                <span className="ml-2 text-[11px] text-gray-400 font-mono">{c.slug}</span>
              </div>
              <div className="flex items-center gap-3">
                {showCount && <span className="text-[11px] text-gray-400">{c._count.products} produto{c._count.products !== 1 ? "s" : ""}</span>}
                <Link href={`/gmp-panel-admin/traducoes/category/${c.id}`} title="Traduções EN/FR" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                  <Languages className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteCategory} id={c.id} confirmLabel="Apagar esta categoria?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
