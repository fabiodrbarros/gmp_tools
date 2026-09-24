import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Package, Pencil, Languages } from "lucide-react";
import { db } from "@/lib/db";
import { deleteProduct } from "@/app/actions/admin-product";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Produtos" };

async function getProducts() {
  try {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, brand: true },
    });
  } catch {
    return [];
  }
}

function fmt(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export default async function AdminProdutosPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} produto{products.length !== 1 ? "s" : ""} no catálogo</p>
        </div>
        <Link href="/gmp-panel-admin/produtos/novo" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <Package className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-6">Ainda não há produtos na base de dados.</p>
          <Link href="/gmp-panel-admin/produtos/novo" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
            <Plus className="h-4 w-4" /> Criar o primeiro produto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Produto</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Preço</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Acções</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {p.name}
                    {p.isFeatured && <span className="ml-2 text-[9px] font-medium uppercase tracking-wider text-red-600">Destaque</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">{p.quoteOnly ? "Sob consulta" : fmt(p.price)}</td>
                  <td className="px-5 py-3 text-gray-500">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${p.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/gmp-panel-admin/produtos/${p.id}`} title="Editar" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link href={`/gmp-panel-admin/traducoes/product/${p.id}`} title="Traduções EN/FR" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Languages className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteProduct} id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
